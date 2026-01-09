module.exports = app => {
    const users = require("../controllers/users.controllers.js");
    const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
  
    var router = require("express").Router();

    //GET /api/users Liste des utilisateurs (protégée - admin uniquement)
    router.get("/", authenticateToken, authorizeRoles('admin'), users.getAll);
    
    //POST /api/users Créer un utilisateur (public pour inscription)
    router.post("/", users.create);

    app.use('/api/users/', router);
};
