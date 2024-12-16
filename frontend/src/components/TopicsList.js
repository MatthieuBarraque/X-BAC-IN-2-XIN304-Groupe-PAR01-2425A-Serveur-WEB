import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import '../css/TopicsList.css';

const socket = io('http://localhost:5000');

function TopicsList() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/topics');
                if (!response.ok) {
                    throw new Error('Failed to fetch topics');
                }
                const data = await response.json();
                setTopics(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchTopics();
        socket.on('newTopic', (topic) => {
            setTopics((prevTopics) => [topic, ...prevTopics]);
        });
        return () => {
            socket.off('newTopic');
        };
    }, []);
    if (loading) {
        return <div className="loading">Loading topics...</div>;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="topics-list">
            <h2>Forum Topics</h2>
            <ul>
                {topics.map((topic) => (
                    <li key={topic.id} className="topic-item">
                        <Link to={`/topic/${topic.id}`}>
                            <h3>{topic.title}</h3>
                            <p>{topic.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopicsList;
