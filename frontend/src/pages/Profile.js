import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch('http://localhost:5000/api/users/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setUser(data.user);
                setPosts(data.posts);
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="profile-page">
            {user && (
                <>
                    <h2>{user.username}'s Profile</h2>
                    <p>Email: {user.email}</p>
                    <h3>Your Comments:</h3>
                    <ul>
                        {posts.map(post => (
                            <li key={post.id}>
                                <p>Topic: {post.Topic.title}</p>
                                <p>{post.content}</p>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </div>
    );
}

export default Profile;
