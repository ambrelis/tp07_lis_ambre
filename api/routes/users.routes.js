module.exports = app => {
    const users = require("../controllers/users.controllers.js");
  
    var router = require("express").Router();

      //GET	/api/users	Liste des utilisateurs
    router.get("/", users.getAll);
    //POST /api/users Créer un utilisateur : POST
    router.post("/", users.create);

    app.use('/api/users/', router);

    
    
   
  };
