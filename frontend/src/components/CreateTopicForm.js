import React, { useState } from 'react';
import '../css/CreateTopicForm.css';

function CreateTopicForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('token');
        if (!token) {
            setMessageType('error');
            setMessage('You must be logged in to create a topic.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/topics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description })
            });
    
            const responseData = await response.json();
            console.log('API response:', responseData);
    
            if (response.ok) {
                setMessageType('success');
                setMessage('Topic created successfully!');
                setTitle('');
                setDescription('');
            } else {
                setMessageType('error');
                setMessage('Failed to create the topic.');
            }
        } catch (error) {
            setMessageType('error');
            setMessage('Failed to create the topic. Please check your connection.');
        }
    };
    

    return (
        <div>
            <form onSubmit={handleSubmit} className="create-topic-form">
                <input
                    type="text"
                    placeholder="Topic Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Topic Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit">Create Topic</button>
            </form>
            {message && (
                <p className={`message ${messageType}`}>{message}</p>
            )}
        </div>
    );
}

export default CreateTopicForm;
