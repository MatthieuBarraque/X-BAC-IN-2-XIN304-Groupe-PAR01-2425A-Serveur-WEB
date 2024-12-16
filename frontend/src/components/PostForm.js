import React, { useState } from 'react';

function PostForm({ topicId, onPostAdded }) {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`/api/topics/${topicId}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            const newPost = await response.json();
            setContent('');
            onPostAdded(newPost);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your comment..."
            ></textarea>
            <button type="submit">Post</button>
        </form>
    );
}

export default PostForm;
