import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Results = ({ token, electionId }) => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const response = await axios.get(`http://localhost:5000/api/elections/${electionId}/results`, {
                headers: { Authorization: token }
            });
            setResults(response.data);
        };
        fetchResults();
    }, [token, electionId]);

    return (
        <ul>
            {results.map(result => (
                <li key={result.name}>
                    {result.name}: {result.vote_count} votes
                </li>
            ))}
        </ul>
    );
};

export default Results;
