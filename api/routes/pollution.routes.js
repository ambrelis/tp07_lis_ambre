module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js"); // Controller
    const { authenticateToken } = require("../middleware/auth.middleware"); // Middleware JWT

    const router = require("express").Router();

    // GET /api/pollution → lister toutes les pollutions
    router.get("/", pollution.getAll);

    // GET /api/pollution/:id → détails d’une pollution
    router.get("/:id", pollution.getById);

    // POST /api/pollution → ajouter une nouvelle pollution (protégée)
    router.post("/", authenticateToken, pollution.create);

    // PUT /api/pollution/:id → modifier une pollution (protégée)
    router.put("/:id", authenticateToken, pollution.update);

    // DELETE /api/pollution/:id → supprimer une pollution (protégée)
    router.delete("/:id", authenticateToken, pollution.delete);

    // On monte le router sur /api/pollution
    app.use('/api/pollution', router);
};
