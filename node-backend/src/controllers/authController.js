const pool = require('../config/db');
const transporter = require('../config/email');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expireDate = new Date(Date.now() + 3600000); // 1 hour

        await pool.execute(
            'INSERT INTO password_reset_tokens (email, token, expiration) VALUES (?, ?, ?)',
            [email, token, expireDate]
        );

        const resetLink = `http://localhost:5173/reset-password/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        res.json({ message: "Reset link sent to email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const [tokens] = await pool.execute(
            'SELECT * FROM password_reset_tokens WHERE token = ? AND expiration > NOW()', 
            [token]
        );

        if (tokens.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const email = tokens[0].email;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
        await pool.execute('DELETE FROM password_reset_tokens WHERE email = ?', [email]);

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};