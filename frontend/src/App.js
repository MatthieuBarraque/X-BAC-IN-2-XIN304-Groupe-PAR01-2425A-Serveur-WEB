import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ForumTopic from './pages/ForumTopic';
import './styles/styles.css';

function ProtectedRoute({ element: Component }) {
    const token = localStorage.getItem('token');
    return token ? Component : <Navigate to="/login" />;
}

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                        <Route path="/topic/:id" element={<ForumTopic />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
