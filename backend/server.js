const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const cors = require("cors");

const app = express();
app.use(cors());

const cache = new NodeCache({ stdTTL: 600, maxKeys: 50 }); 
// ttl = 600 sec = 10 min

app.get("/pokemon/:name", async (req, res) => {
    const name = req.params.name.toLowerCase();

    // Check cache first
    const cachedData = cache.get(name);
    if (cachedData) {
        return res.json({ source: "cache", data: cachedData });
    }

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);

        // Store in cache
        cache.set(name, response.data);

        return res.json({ source: "api", data: response.data });
    } catch (err) {
        return res.status(404).json({ error: "Pokemon not found" });
    }
});

// Start server
app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
