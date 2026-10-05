import mysql from 'mysql2/promise';

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'your_password', // Replace with your actual password
            database: 'your_database'  // Replace with your actual database name
        });
        console.log('Connected to the MySQL database.');
        return connection;
    } catch (error) {
        console.error('Error connecting to the MySQL database:', error);
        throw error;
    }
}

export { connectToDatabase };