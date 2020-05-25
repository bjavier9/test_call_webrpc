"use strict";

module.exports = function (app) {
  var usuarios = require("../controller/user_controller");
  app.route("/login").post(usuarios.login_usuario);
  app.route("/usuario").post(usuarios.crear_usuario);
  app.route("/usuario/:id").get(usuarios.perfil_usuario);
};
