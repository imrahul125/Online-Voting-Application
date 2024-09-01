import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = ({ token }) => {
    const [electionData, setElectionData] = useState({ title: '', description: '', start_date: '', end_date: '' });
    const [candidateData, setCandidateData] = useState({ name: '', age: '', class: '', election_id: '' });

    const handleChange = (e, setData) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const createElection = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/elections', electionData, {
                headers: { Authorization: token }
            });
            alert('Election created successfully');
        } catch (error) {
            alert('Failed to create election');
        }
    };

    const addCandidate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/candidates', candidateData, {
                headers: { Authorization: token }
            });
            alert('Candidate added successfully');
        } catch (error) {
            alert('Failed to add candidate');
        }
    };

    return (
        <div>
            <h2>Create Election</h2>
            <form onSubmit={createElection}>
                <input type="text" name="title" placeholder="Title" value={electionData.title} onChange={(e) => handleChange(e, setElectionData)} />
                <textarea name="description" placeholder="Description" value={electionData.description} onChange={(e) => handleChange(e, setElectionData)} />
                <input type="date" name="start_date" value={electionData.start_date} onChange={(e) => handleChange(e, setElectionData)} />
                <input type="date" name="end_date" value={electionData.end_date} onChange={(e) => handleChange(e, setElectionData)} />
                <button type="submit">Create Election</button>
            </form>

            <h1> This is admin Panel</h1>

            <h2>Add Candidate</h2>
            <form onSubmit={addCandidate}>
                <input type="text" name="name" placeholder="Name" value={candidateData.name} onChange={(e) => handleChange(e, setCandidateData)} />
                <input type="number" name="age" placeholder="Age" value={candidateData.age} onChange={(e) => handleChange(e, setCandidateData)} />
                <input type="text" name="class" placeholder="Class" value={candidateData.class} onChange={(e) => handleChange(e, setCandidateData)} />
                <input type="text" name="election_id" placeholder="Election ID" value={candidateData.election_id} onChange={(e) => handleChange(e, setCandidateData)} />
                <button type="submit">Add Candidate</button>
            </form>
        </div>
    );
};

export default AdminPanel;
