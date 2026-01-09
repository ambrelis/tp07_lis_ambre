const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app  = express ();

// Configuration selon l'environnement
const isProduction = process.env.NODE_ENV === 'production';

var corsOptions = {
  origin: isProduction 
    ? process.env.FRONTEND_URL || 'https://tp07-lis-ambre.onrender.com'
    : 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

console.log('🌍 CORS Origin:', corsOptions.origin);
console.log('🔧 Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');

app.use(cors(corsOptions));
app.use(cookieParser());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CNAM application." });
});

const db = require("./models");

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Base de données synchronisée (alter mode)");
  })
  .catch((err) => {
    console.log("❌ Failed to sync db: " + err.message);
  });

require("./routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}.`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

