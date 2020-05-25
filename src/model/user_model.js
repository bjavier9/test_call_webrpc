"user strict";
var sql = require("../config/db");

var Usuario = function (usuario) {
  this.id_user = usuario.id_user;
  this.name = usuario.name;
  this.imagen = usuario.imagen;
  this.email = usuario.email;
  this.password = usuario.password;
};
Usuario.Verifica_correo = function (correo, result) {
  console.log(correo);
  sql.each("SELECT email FROM user where email =?", [correo], function (
    err,
    row
  ) {
    console.log(row);
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, row);
    }
  });
  //   sql.run("select email FROM user WHERE email = ? ", [correo], function (
  //     err,
  //     res
  //   ) {
  //     if (err) {
  //       console.log("error: ", err);
  //       result(err, null);
  //     } else {
  //       console.log(res);
  //       result(null, res);
  //     }
  //   });
};
Usuario.login_usuario = function (correo, password, result) {
  sql.run(
    "select * FROM user WHERE email= ? and password = ?",
    [correo, password],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};
Usuario.crearUsuario = function (nuevoUsuario, result) {
  sql.run("INSERT INTO user set ?", nuevoUsuario, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      result(null, res.insertId);
    }
  });
};

Usuario.perfil = function (id_user, result) {
  sql.run("select * FROM user WHERE id_user = ? ", [id_user], function (
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};
module.exports = Usuario;
