const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app  = express ();

// Configuration selon l'environnement
const isProduction = process.env.NODE_ENV === 'production';

// Liste des origines autorisées
const allowedOrigins = [
  'http://localhost:4200', // Développement local
  'https://tp07-lis-ambre.onrender.com', // Frontend production (à modifier)
  process.env.FRONTEND_URL // URL configurée via variable d'environnement
].filter(Boolean); // Enlever les valeurs undefined

var corsOptions = {
  origin: function (origin, callback) {
    console.log('🌍 Origin de la requête:', origin);
    // Autoriser les requêtes sans origin (ex: Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ Origin autorisée:', origin);
      callback(null, true);
    } else {
      console.error('❌ Origin BLOQUÉE:', origin);
      console.log('📋 Origins autorisées:', allowedOrigins);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

console.log('🔧 Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('📋 CORS - Origins autorisées:', allowedOrigins);

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

