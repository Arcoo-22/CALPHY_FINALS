import { pool } from './connection.js';

export async function getAllUsers() {
    return pool.asyncQuery(
        'SELECT * FROM getAllUsers;', //Assuming view getAllUsers is initially created in the database, check documentation for more details
        (err, res) => {
        console.log(err, res);
        pool.end();
    });
};

export async function getUserById(id) {
    return pool.asyncQuery(
        'SELECT username, email FROM tbl_users WHERE id = ?;',
        [id],
        (err, res) => {
        console.log(err, res);
        pool.end();
    });
};

export async function getUserByUsername(username) {
    return pool.asyncQuery(
        'SELECT username, email FROM tbl_users WHERE username = ?;',
        [username],
        (err, res) => {
        console.log(err, res);
        pool.end();
    });
};

export async function login(username, password, email) {
    return pool.asyncQuery(
        'SELECT username, email, user_progress FROM tbl_users WHERE (username = ? OR email = ?) AND password = ?;',
        [username, email, password],
        (err, res) => {
        console.log(err, res);
        pool.end();
    });
};

export async function getUserProgress(id) {
    return pool.asyncQuery(
        'SELECT user_progress FROM tbl_users WHERE id = ?;',
        [id],
        (err, res) => {
        console.log(err, res);
        pool.end();
    });
};

export async function changeUsername(id, newUsername) {
    return pool.asyncQuery(
        'UPDATE tbl_users SET username = ? WHERE id = ?;',
        [newUsername, id],
        (err, res) => {
        console.log(err, res);
        pool.end();
    });
};

export async function changePassword(id, newPassword) {
    return pool.asyncQuery(
        'UPDATE tbl_users SET password = ? WHERE id = ?;',
        [newPassword, id],
        (err, res) => {
        console.log(err, res);
        pool.end();
    });
};

export async function changeEmail(id, newEmail) {
    return pool.asyncQuery(
        'UPDATE tbl_users SET email = ? WHERE id = ?;',
        [newEmail, id],
        (err, res) => {
        console.log(err, res);
        pool.end();
    });
};

export async function updateUserProgress(id, parentProgress, childProgress, newProgress) { // See documentation for this part
    return pool.asyncQuery(
        'UPDATE tbl_users SET user_progress[?][?] = ?::jsonb WHERE id = ?;',
        [parentProgress, childProgress, newProgress, id],
        (err, res) => {
        console.log(err, res);
        pool.end();
    });
};
