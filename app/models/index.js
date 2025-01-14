const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  port: config.PORT,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.post = require("../models/post.model.js")(sequelize, Sequelize);
db.invite = require("../models/invite.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(
  sequelize,
  Sequelize
);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});

db.post.belongsTo(db.user, {
  foreignKey: "userId",
});

db.user.hasOne(db.refreshToken, {
  foreignKey: "userId",
  targetKey: "id",
});

db.ROLES = ["user", "admin"];

module.exports = db;