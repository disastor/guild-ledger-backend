const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/matches/character/:id
router.get("/character/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM matches WHERE character_id = $1 ORDER BY played_at DESC",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load matches" });
  }
});

// POST /api/matches
router.post("/", async (req, res) => {
  const { character_id, result: matchResult, notes } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO matches (character_id, result, notes) VALUES ($1,$2,$3) RETURNING *",
      [character_id, matchResult, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log match" });
  }
});

module.exports = router;
