const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./movies.db", (err) => {
    if (err) {
        console.error("Gagal membuka database:", err.message);
    } else {
        console.log("Database berhasil dibuka");
    }
});

// TABLE MOVIES
db.run(`
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER NOT NULL
)
`);

// TABLE DIRECTORS
db.run(`
CREATE TABLE IF NOT EXISTS directors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL
)
`);

// TABLE USERS dengan kolom ROLE yang benar
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
)
`);

module.exports = db;