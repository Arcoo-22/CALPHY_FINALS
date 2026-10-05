import db from '../database.js';

const dbModel = {
    getAll: async () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM tbl_users', (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    },
}