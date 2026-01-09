const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app  = express ();

var corsOptions = {
  origin: "http://localhost:4200",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

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
const PORT =  3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

