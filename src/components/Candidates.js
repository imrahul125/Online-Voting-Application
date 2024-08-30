import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Candidates = ({ token, electionId }) => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const fetchCandidates = async () => {
            const response = await axios.get(`http://localhost:5000/api/elections/${electionId}/candidates`, {
                headers: { Authorization: token }
            });
            setCandidates(response.data);
        };
        fetchCandidates();
    }, [token, electionId]);

    const vote = async (candidateId) => {
        try {
            await axios.post('http://localhost:5000/api/vote', { candidate_id: candidateId, election_id: electionId }, {
                headers: { Authorization: token }
            });
            alert('Vote cast successfully');
        } catch (error) {
            alert('Voting failed or you have already voted');
        }
    };

    return (
        <ul>
            {candidates.map(candidate => (
                <li key={candidate.id}>
                    {candidate.name} - {candidate.class} <button onClick={() => vote(candidate.id)}>Vote</button>
                </li>
            ))}
        </ul>
    );
};

export default Candidates;
