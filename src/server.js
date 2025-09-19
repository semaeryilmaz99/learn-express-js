//Gizli bilgileri .env içinde saklayıp değişkenleri servera çekiyoruz
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();

// JSON parsing için - ROUTE'LARDAN ÖNCE OLMALI!
app.use(express.json());

//jwt için secret key tanımlama (normalde env içinde durur)
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

//Fake veritabanı - Test için hazır kullanıcılar
const users = [
    {
        username: "admin",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // password: "password"
    },
    {
        username: "testuser",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // password: "password"
    },
    {
        username: "demo",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // password: "password"
    }
];

//signup
app.post("/signup", async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request headers:", req.headers);
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: "Kullanıcı adı ve şifre gerekli" });
        }

        // Kullanıcı zaten var mı kontrol et
        const existingUser = users.find((u) => u.username === username);
        if (existingUser) {
            return res.status(400).json({ message: "Kullanıcı zaten mevcut" });
        }

        //şifreyi hashleme
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword});

        res.json({ message: "Kullanıcı kaydı başarılı"});
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
});

//login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: "Kullanıcı adı ve şifre gerekli" });
        }

        const user = users.find((u) => u.username === username);
        if (!user)
            return res.status(400).json({ message: "Kullanıcı bulunamadı"});

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Hatalı şifre!"});

        //JWT oluşturma
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h"});

        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
});

//middleware - token kontrolü
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token gerekli" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Geçersiz token" }); 
        req.user = user;
        next();   
    });
}

//protected route (sadece login olan kullanıcıya serverdan gönderilmiş token ile açılan profil bilgileri)
app.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Profil bilgileri", user: req.user});
});


//Routes dahil edildi
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

//Basic route
app.get("/", (req, res) => {
    res.send("Express APİ çalışıyor!");
});

//Middleware - (auth, error handling, validation veya loglama yaparken kullanılabilir)
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
app.use(logger);

app.listen(PORT, () => {
    console.log(`Server http.//localhost:${PORT} üzerinde çalışıyor!`);
});