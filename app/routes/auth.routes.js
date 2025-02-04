const { verifySignUp } = require("../middleware");
const authController = require("../controllers/auth.controller");
const inviteController = require("../controllers/invite.controllers");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/refreshtoken", authController.refreshToken)

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    authController.signup
  );

  app.post("/api/auth/signin", authController.signin);

  app.post("/api/auth/inviteUser", [authJwt.verifyToken, authJwt.isAdmin], inviteController.inviteUser)

  app.post("/api/createUserWithPassword", authController.createUserWithPassword);

  app.delete(
    "/api/removeInvitedUser",
    [authJwt.verifyToken, authJwt.isAdmin],
    inviteController.removeInvitedUser
  );

};