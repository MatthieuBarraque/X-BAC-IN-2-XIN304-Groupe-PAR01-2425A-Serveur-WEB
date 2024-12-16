import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';  // Import CSS

import CreateTopicForm from '../components/CreateTopicForm';
import TopicsList from '../components/TopicsList';
import TrendingTopics from '../components/TrendingTopics';

function Home() {
    return (
        <div className="home-page">
            <h2>Bienvenue sur l'exercice du server Web</h2>
            <p>Vous pouvez discuter avec des gens de la classe sur le même réseau.</p>

            <div className="create-topic-section">
                <h3>Créer un nouveau topic</h3>
                <CreateTopicForm />
            </div>

            <div className="dashboard">
                <div className="topics-section">
                    <h3>Derniers Topics</h3>
                    <TopicsList />
                </div>
                <div className="trending-section">
                    <TrendingTopics />
                </div>
            </div>
        </div>
    );
}

export default Home;
