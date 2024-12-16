import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TrendingTopics() {
    const [trendingTopics, setTrendingTopics] = useState([]);

    useEffect(() => {
        const fetchTrendingTopics = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/topics/trending');
                setTrendingTopics(response.data);
            } catch (error) {
                console.error('Error fetching trending topics:', error);
            }
        };

        fetchTrendingTopics();
    }, []);

    if (trendingTopics.length === 0) {
        return <p>No trending topics available</p>;
    }

    return (
        <div className="trending-topics">
            <h3>Tendances</h3>
            <ul>
                {trendingTopics.map((topic) => (
                    <li key={topic.id}>
                        <a href={`/topic/${topic.id}`}>
                            {topic.title} (Posts: {topic.postCount})
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TrendingTopics;
