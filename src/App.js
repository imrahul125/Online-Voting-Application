import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ElectionList from './components/ElectionList';
import Candidates from './components/Candidates';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';

const App = () => {
    const [token, setToken] = useState('');
    const [electionId, setElectionId] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={!token ? <Navigate to="/login" /> : <ElectionList token={token} selectElection={setElectionId} />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register />} />   
                <Route path="/elections" element={token ? <ElectionList token={token} selectElection={setElectionId} /> : <Navigate to="/login" />} />
                <Route path="/candidates" element={token && electionId ? <Candidates token={token} electionId={electionId} /> : <Navigate to="/login" />} />
                <Route path="/results" element={token && electionId ? <Results token={token} electionId={electionId} /> : <Navigate to="/login" />} />
                <Route path="/adminpanel" element={<AdminPanel />} />
            </Routes>
        </Router>
    );
};


export default App;
