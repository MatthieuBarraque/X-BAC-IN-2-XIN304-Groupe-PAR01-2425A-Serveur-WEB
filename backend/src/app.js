const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { sequelize, connectDB } = require('./config/db');
const models = require('./models');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

app.set('socketio', io);

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));

(async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error during database connection or sync:', error);
    }
})();

// Socket---------------------------------------------------------------------
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('newPost', (post) => {
        io.emit('newPost', post);
    });

    socket.on('newTopic', (topic) => {
        io.emit('newTopic', topic);
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
