const { Sequelize } = require ("sequelize");
const { BDD }  = require ('../config');
const sequelize = new Sequelize(`postgres://${BDD.user}:${BDD.password}@${BDD.host}/${BDD.bdname}`
,{
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: true,
      native:true
    },
    define:  {
    	timestamps:false
    }
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.pollution = require("./pollution.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);

db.users.hasMany(db.pollution, { foreignKey: "user_id", onDelete: "CASCADE" });
db.pollution.belongsTo(db.users, { foreignKey: "user_id" });

module.exports = db;
