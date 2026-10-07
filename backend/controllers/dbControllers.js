import user from '../models/dbModels.js';

const dbController = {
    // Controller function to handle user registration
    registerUser: async (req, res) => {
        try {
            const { uuid, username, email, password } = req.body;

            if (!uuid || !username || !email || !password) {
                return res.status(400).json({ 
                    success: false,
                    message: 'All fields are required' 
                });
            }

            const newUser = await user.createNew({ 
                uuid,
                username, 
                email, 
                password 
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: newUser
            });

        }
        catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error' 
            });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await user.getByUsername(username);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: user
            });

        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    setToken: async (req, res) => {
        try {
            const { id, uuid } = req.body;
            await user.setUUID(id, uuid);

            res.status(200).json({
                success: true,
                message: 'Token set successfully'
            });
        } catch (error) {
            console.error('Error setting token:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    verifyToken: async (req, res) => {
        try {
            const { uuid } = req.body;
            const user = await user.getUUID(uuid);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Token is valid',
                data: user
            });
        } catch (error) {
            console.error('Error verifying token:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    getUserByName: async (req, res) => {
        try {
            const { username } = req.params;
            const userData = await user.getByUsername(username);
            
            res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                data: userData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await user.getAllUsers();

            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to get users"
            });
        }
    },

    getUserProgress: async (req, res) => {
        try {
            const userProgress = await user.getUserProgress(req.params.id);

            res.status(200).json(userProgress);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to get user progress"
            });
        }
    },

    updateUserProgress: async (req, res) => {
        try {
            const { id } = req.params;
            const { progressData } = req.body;

            const updatedProgress = await user.updateUserProgress(id, progressData);

            if (!updatedProgress) {
                return res.status(404).json({
                    success: false,
                    message: 'User progress not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User progress updated successfully',
                data: updatedProgress
            });
        } catch (error) {
            console.error('Error updating user progress:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
};

export default dbController;