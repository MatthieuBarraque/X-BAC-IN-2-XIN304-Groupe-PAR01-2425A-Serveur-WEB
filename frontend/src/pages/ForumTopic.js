import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../css/ForumTopic.css';

const socket = io('http://localhost:5000');

function ForumTopic() {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [replyPost, setReplyPost] = useState(null);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopicData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/topics/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch topic data');
                }
                const data = await response.json();
                setTopic(data);
                setPosts(data.Posts || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching topic:', error);
                setLoading(false);
            }
        };
    
        fetchTopicData();
    
        socket.on('newPost', (post) => {
            if (post.topicId === parseInt(id, 10)) {
                if (post.parentId) {
                    setPosts((prevPosts) =>
                        prevPosts.map((p) =>
                            p.id === post.parentId
                                ? {
                                      ...p,
                                      Replies: p.Replies
                                          ? [...p.Replies, post]
                                          : [post],
                                  }
                                : p
                        )
                    );
                } else {
                    setPosts((prevPosts) => [post, ...prevPosts]);
                }
            }
        });
    
        return () => {
            socket.off('newPost');
        };
    }, [id]);
    
    const handleSubmitPost = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to post.');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5000/api/topics/${id}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newPost })
            });
    
            const responseData = await response.json();
            console.log('API response for new post:', responseData);
    
            if (response.ok) {
                setNewPost('');
            } else {
                alert('Error submitting post.');
            }
        } catch (error) {
            console.error('Error posting:', error);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to reply.');
            return;
        }

        const response = await fetch(`http://localhost:5000/api/topics/${id}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: newReply, parentId: replyPost })
        });

        if (response.ok) {
            setReplyPost(null);
            setNewReply('');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="forum-topic">
            {topic && (
                <>
                    <div className="topic-header">
                        <h2>{topic.title}</h2>
                        <p>{topic.description}</p>
                    </div>
    
                    <ul className="posts-list">
                        {posts.map((post) => (
                            <li key={post.id} className="post-item">
                                <p>{post.content}</p>
                                <small>
                                    Posted by: {post.User ? post.User.username : 'Anonymous'} at {new Date(post.createdAt).toLocaleString()}
                                    <button className="reply-button" onClick={() => setReplyPost(post.id)}>
                                        Reply
                                    </button>
                                </small>
    
                                {post.Replies && post.Replies.length > 0 && (
                                    <ul className="replies-list">
                                        {post.Replies.map((reply) => (
                                            <li key={reply.id} className="reply-item">
                                                <p>{reply.content}</p>
                                                <small>
                                                    Replied by: {reply.User ? reply.User.username : 'Anonymous'} at {new Date(reply.createdAt).toLocaleString()}
                                                </small>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
    
                    {replyPost && (
                        <div className="reply-header">
                            <h4>Reply to Post</h4>
                            <button className="close-reply" onClick={() => setReplyPost(null)}>X</button>
                        </div>
                    )}
    
                    {replyPost ? (
                        <form onSubmit={handleReplySubmit} className="new-reply-form">
                            <textarea
                                placeholder="Write your reply..."
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                required
                            />
                            <button type="submit">Reply</button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmitPost} className="new-post-form">
                            <textarea
                                placeholder="Write your post..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                required
                            />
                            <button type="submit">Post</button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
    
}

export default ForumTopic;
