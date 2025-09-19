const express = require("express");
const router = express.Router();

//GET /users
router.get("/", (req, res) => {
    res.json([{id: 1, name: "Sema"}]);
});

// POST /users
router.post("/", (req, res) => {
    const newUser = req.body;
    res.status(201).json(newUser);
});

module.exports = router;