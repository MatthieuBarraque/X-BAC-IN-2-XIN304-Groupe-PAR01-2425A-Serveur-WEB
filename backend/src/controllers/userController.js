const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Post } = require('../models');

exports.signupUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
    {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try
    {
        const userExists = await User.findOne({ where: { email } });
        if (userExists)
        {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        console.log('New user created:', newUser);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error)
    {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Debug logic---------------------------------------------------------------------
    console.log("Email received:", email);
    console.log("Password received:", password);
    // Debug logic---------------------------------------------------------------------

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        //email
        const user = await User.findOne({ where: { email } });

        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });






        // Debug pour JWT
        console.log("Generated token:", token);







        return res.json({ token });
    } catch (error) {
        // Debug logic---------------------------------------------------------------------
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Server error' });
        // Debug logic---------------------------------------------------------------------
    }
};



// Get user profile
exports.getProfile = async (req, res) => {
    try {

        const user = await User.findByPk(req.user.id, 
        
        {
            attributes: ['id', 'username', 'email'],
            include: [{ model: Post, include: 'Topic' }] 
        });


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user, posts: user.Posts || [] });
    } catch (error) 
    
    
    {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }


};
