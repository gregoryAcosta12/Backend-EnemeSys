require("dotenv").config({ path: './config/.env' });
const { Pool } = require('pg');

const db = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432
});

db.connect()
    .then(() => console.log('✅ Conectado a PostgreSQL'))
    .catch(err => console.error('❌ Error conectando a PostgreSQL:', err));

module.exports = db;
