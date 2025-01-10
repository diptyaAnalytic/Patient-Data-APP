require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const apiRoutes = require('./routes/router');
const{User} = require('./models')
const { createAdmin } = require("./seeders/AdminSeeders.js");
const app = express();
app.use(express.json());

// Koneksi MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

async function checkAndCreateAdmin() {
    try {
        const users = await User.find();
        if (users.length === 0) {
            await createAdmin();
        }
    } catch (error) {
        console.error('Error seed admin:', error);
    }
}
checkAndCreateAdmin();

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://34.135.114.112:3000",
    ],
    exposedHeaders: "Authorization",
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
app.get("/", (req, res) => { res.send("API Running")});
app.use(apiRoutes);
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }))


setInterval(() => {
  AuthController.refreshToken();
}, 300000); //300000

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
