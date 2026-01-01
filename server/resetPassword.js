const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://roastingwzain11_db_user:zm555786@cluster0.7c2xqg9.mongodb.net/smart-library';

async function resetPassword() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            theme: String,
            createdAt: Date
        }));

        const email = 'zainmalik55786@gmail.com';
        const newPassword = 'zm555786';

        // Hash the new password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user
        const result = await User.updateOne(
            { email: email.toLowerCase() },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount > 0) {
            console.log('✅ Password updated successfully!');
            console.log('Email:', email);
            console.log('New Password:', newPassword);
        } else {
            console.log('❌ User not found or password already set');
        }

        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

resetPassword();
