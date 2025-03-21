import mysql from 'mysql2/promise';

const connect = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'estacionaki',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default connect;