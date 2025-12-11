module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js"); // Controller

    const router = require("express").Router();

    // GET /api/pollution → lister toutes les pollutions
    router.get("/", pollution.getAll);

    // GET /api/pollution/:id → détails d’une pollution
    router.get("/:id", pollution.getById);

    // POST /api/pollution → ajouter une nouvelle pollution
    router.post("/", pollution.create);

    // PUT /api/pollution/:id → modifier une pollution
    router.put("/:id", pollution.update);

    // DELETE /api/pollution/:id → supprimer une pollution
    router.delete("/:id", pollution.delete);

    // On monte le router sur /api/pollution
    app.use('/api/pollution', router);
};
