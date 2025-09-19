const express = require("express");
const router = express.Router();
const User = require("../models/User");

//GET /users
router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

//GET tek kullanıcı
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı "});
        res.json(user);
        } catch (err) {
        res.status(400).json({ message: "Geçersiz ID"});
        }
});

// POST yeni kullanıcı ekleme
router.post("/", async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);} catch (err) {
        res.status(400).json({ message: err.message});}
});

//PUT kullanıcı güncelleme
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, email: req.body.email },
            { new: true } //güncellenmiş veriyi döndürür
        );
        if (!updatedUser) return res.status(404).json({ message: "Kullanıcı bulunamadı"});
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: "Geçersiz ID "});
    }
});

//DELETE kullanıcı silme
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "Kullanıcı bulunamadı"});
        res.json({ message: "Kullanıcı silindi" });
    } catch (err) {
        res.status(400).json({ message: "Geçersiz ID "});
    }
});

module.exports = router;