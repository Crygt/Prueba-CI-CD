const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3001; 


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


async function initDB() {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS applications (
            id SERIAL PRIMARY KEY,
            count INT DEFAULT 0
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS config (
            id SERIAL PRIMARY KEY,
            mode VARCHAR(10) DEFAULT 'develope'
        )`);

        const res = await pool.query('SELECT * FROM applications');
        if (res.rowCount === 0) {
            await pool.query("INSERT INTO applications (count) VALUES (0)");
        }
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}
initDB();


app.get('/mode', async (req, res) => {
    try {
        const result = await pool.query("SELECT mode FROM config LIMIT 1");
        res.json({ mode: result.rows[0]?.mode || 'develope' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/applications', async (req, res) => {
    try {
        const result = await pool.query("SELECT count FROM applications WHERE id = 1");
        if (result.rowCount > 0) {
            res.json({ count: result.rows[0].count });
        } else {
            res.json({ count: 0 });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Incrementar el contador de postulaciones
app.post('/applications/increment', async (req, res) => {
    try {
        await pool.query("UPDATE applications SET count = count + 1 WHERE id = 1");
        const result = await pool.query("SELECT count FROM applications WHERE id = 1");

        if (result.rowCount > 0) {
            res.json({ count: result.rows[0].count });
        } else {
            res.json({ count: 0 });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
