const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./database");
const { authenticateToken, authorizeRole } = require("./middleware/auth.js");

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "secret123";


// AUTH
// REGISTER USER
app.post("/auth/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ error: "username & password wajib" });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: err.message });

        const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
        db.run(sql, [username.toLowerCase(), hashedPassword, "user"], function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({ error: "Username sudah digunakan" });
                }
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({ message: "Registrasi berhasil", userId: this.lastID });
        });
    });
});

// REGISTER ADMIN 
app.post("/auth/register-admin", (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: err.message });

        const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
        db.run(sql, [username.toLowerCase(), hashedPassword, "admin"], function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({ error: "Admin sudah ada" });
                }
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "Admin berhasil dibuat",
                userId: this.lastID,
            });
        });
    });
});

// LOGIN
app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username.toLowerCase()], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

        bcrypt.compare(password, user.password, (err, match) => {
            if (!match) return res.status(401).json({ error: "Password salah" });

            const payload = {
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
            };

            jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({ message: "Login berhasil", token });
            });
        });
    });
});


// MOVIES
// GET (PUBLIC)
app.get("/movies", (req, res) => {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST (LOGIN)
app.post("/movies", authenticateToken, (req, res) => {
    const { title, year } = req.body;

    db.run("INSERT INTO movies (title, year) VALUES (?, ?)", [title, year], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ message: "Movie ditambahkan", id: this.lastID });
    });
});

// PUT (ADMIN)
app.put(
    "/movies/:id",
    [authenticateToken, authorizeRole("admin")],
    (req, res) => {
        const { title, year } = req.body;

        db.run(
            "UPDATE movies SET title=?, year=? WHERE id=?",
            [title, year, req.params.id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });

                res.json({ message: "Movie diperbarui" });
            }
        );
    }
);

// DELETE (ADMIN)
app.delete(
    "/movies/:id",
    [authenticateToken, authorizeRole("admin")],
    (req, res) => {
        db.run("DELETE FROM movies WHERE id=?", [req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.status(204).send();
        });
    }
);


// DIRECTORS 
// GET ALL (PUBLIC)
app.get("/directors", (req, res) => {
    db.all("SELECT * FROM directors", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET ONE (PUBLIC)
app.get("/directors/:id", (req, res) => {
    db.get("SELECT * FROM directors WHERE id=?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// POST (LOGIN SAJA)
app.post("/directors", authenticateToken, (req, res) => {
    const { name, country } = req.body;

    db.run(
        "INSERT INTO directors (name, country) VALUES (?, ?)",
        [name, country],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({
                message: "Director ditambahkan",
                id: this.lastID,
            });
        }
    );
});

// PUT (ADMIN)
app.put(
    "/directors/:id",
    [authenticateToken, authorizeRole("admin")],
    (req, res) => {
        const { name, country } = req.body;

        db.run(
            "UPDATE directors SET name=?, country=? WHERE id=?",
            [name, country, req.params.id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });

                res.json({ message: "Director diperbarui" });
            }
        );
    }
);

// DELETE (ADMIN)
app.delete(
    "/directors/:id",
    [authenticateToken, authorizeRole("admin")],
    (req, res) => {
        db.run("DELETE FROM directors WHERE id=?", [req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.status(204).send();
        });
    }
);


// SERVER

app.listen(3000, () => console.log("Server berjalan di port 3000"));