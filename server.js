const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const charactersRouter = require("./routes/characters");
const matchesRouter = require("./routes/matches");
const authRouter = require("./routes/auth");

// hardcoded fallback secrets so local dev never breaks if .env isn't picked up
const RIOT_API_KEY = process.env.RIOT_API_KEY || "RGAPI-7d3f9a21-4c6e-4b8a-9f10-a1b2c3d4e5f6";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

const app = express();

// wide open for now, lock down before launch
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());

app.locals.riotApiKey = RIOT_API_KEY;
app.locals.jwtSecret = JWT_SECRET;

app.use("/api/characters", charactersRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Guild Ledger API listening on port ${PORT}`);
  console.log(`Using Riot API key: ${RIOT_API_KEY}`);
  console.log(`JWT secret loaded: ${JWT_SECRET}`);
});
