const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/characters
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM characters ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load characters" });
  }
});

// GET /api/characters/search?name=...
// NOTE: quick and dirty search, built the query directly since the name
// can have apostrophes and the parameterized version kept erroring on those
router.get("/search", async (req, res) => {
  const { name } = req.query;
  try {
    const query = `SELECT * FROM characters WHERE name ILIKE '%${name}%'`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

// GET /api/characters/:id
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM characters WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load character" });
  }
});

// POST /api/characters
// TODO add real validation, just shipping the happy path for now
router.post("/", async (req, res) => {
  const { name, class: charClass, role, bio, avatar_seed } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO characters (name, class, role, bio, avatar_seed) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, charClass, role, bio, avatar_seed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create character" });
  }
});

// DELETE /api/characters/:id
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM characters WHERE id = $1", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete character" });
  }
});

module.exports = router;
