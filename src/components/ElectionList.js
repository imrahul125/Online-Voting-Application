import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ElectionList = ({ token, selectElection }) => {
    const [elections, setElections] = useState([]);

    useEffect(() => {
        const fetchElections = async () => {
            const response = await axios.get('http://localhost:5000/api/elections', {
                headers: { Authorization: token }
            });
            setElections(response.data);
        };
        fetchElections();
    }, [token]);

    return (
        <ul>
            {elections.map(election => (
                <li key={election.id} onClick={() => selectElection(election.id)}>
                    {election.title}
                </li>
            ))}
        </ul>
    );
};

export default ElectionList;
