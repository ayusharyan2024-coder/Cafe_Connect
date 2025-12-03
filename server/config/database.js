const { Sequelize } = require('sequelize');
require('dotenv').config();

// Using SQLite for easy local development
// To switch to MySQL, update DB_DIALECT and provide DB credentials in .env
const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_DIALECT === 'sqlite' ? './database.sqlite' : undefined,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
    dialectOptions: process.env.DB_DIALECT === 'mysql' ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        connectTimeout: 60000 // 60 seconds timeout
    } : {},
    pool: {
        max: 5,
        min: 0,
        acquire: 60000, // 60 seconds to acquire connection
        idle: 10000
    }
});

module.exports = sequelize;
