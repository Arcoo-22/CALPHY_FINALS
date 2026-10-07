import db from '../database.js';

const dbModel = {
    
    createNew: async (userData) => {
        try {
            const { uuid, username, email, password } = userData;
            const [result] = await db.query(
                "INSERT INTO tbl_users (uuid, username, email, password) VALUES (?, ?, ?, ?)",
                [uuid, username, email, password]
            );
            return { id: result.insertId, uuid, username, email };
        } catch (error) {
            throw error;
        }
    },

    getByUsername: async (username) => {
        try {
            const [rows] = await db.query("SELECT username, email FROM tbl_users WHERE username = ?", [username]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    getAllUsers: async () => {
        try {
            const [rows] = await db.query("SELECT username, email FROM tbl_users");
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getUUID: async (uuid) => {
        try {
            const [rows] = await db.query("SELECT * FROM tbl_users WHERE uuid = ?", [uuid]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    setUUID: async (id, uuid) => {
        try {
            await db.query('UPDATE tbl_users SET uuid = ? WHERE id = ?', [uuid, id]);
        } catch (error) {
            throw error;
        }
    },

    getUserProgress: async (id) => {
        try {
            const [rows] = await db.query("SELECT * FROM tbl_user_progress WHERE user_id = ?", [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    updateUserProgress: async (id, progressData) => {
        try {
            const { progress, scores } = progressData;
            const [result] = await db.query(
                "UPDATE tbl_user_progress SET progress_json = ?, scores_json = ? WHERE user_id = ?",
                [progress, scores, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
};

export default dbModel;