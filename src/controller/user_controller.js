var Usuario = require("../model/user_model");
const { v4: uuidv4 } = require("uuid");

exports.login_usuario = function (req, res) {
  const { correo, password } = req.body;
  Usuario.login_usuario(correo, password, function (err, resp) {
    if (err) res.send(err);
    if (resp.length == 0) {
      res
        .status(401)
        .send({ error: true, message: "Usuario o Correo incorrectos." });
    } else {
      let user;
      let rol;
      let id_usuario;
      let correo;
      let cedula;
      user = resp[0];
      console.log(user);
      id_usuario = user.usuario_id;
      correo = user.usuario_correo;
      cedula = user.usuario_cedula;
      rol = user.usuario_rol;
      let payload = { id_usuario, correo, cedula, rol };
      let token = jwt.sign(payload, CONFIG.jwt_encryption, { expiresIn: "1h" });
      var decoded = jwt.verify(token, CONFIG.jwt_encryption);

      console.log(decoded);
      res.json({ msg: "ok", token: token, rol: decoded.rol });
    }
  });
};

exports.perfil_usuario = function (req, res) {
  jwt.verify(req.params.token, CONFIG.jwt_encryption, function (err, decoded) {
    if (err) {
      res.status(400).send({ error: true, message: "Error de token" });
    } else {
      Usuario.perfil(decoded.id_usuario, function (err, resp) {
        if (err) res.send(err);
        // verificamo el correo papu
        if (resp.length == 0)
          res.status(400).send({ error: true, message: "Error de token" });
        res.json(resp[0]);
      });
    }
  });
};

exports.crear_usuario = function (req, res) {
  if (Object.entries(req.body).length === 0) {
    return res.status(401).send({ error: "error" });
  }
  var Nuevo_usuario = new Usuario(req.body);

  //   if (req.body)
  Usuario.Verifica_correo(Nuevo_usuario.email, function (err, resp) {
    if (err) res.send(err);
    console.log(resp == null);
    // verificamo el correo papu
    if (resp.length == 0) {
      if (
        !Nuevo_usuario.email ||
        !Nuevo_usuario.imagen ||
        !Nuevo_usuario.name ||
        !Nuevo_usuario.password
      ) {
        res.status(400).send({ error: Nuevo_usuario, message: "Faltan datos" });
      } else {
        console.log("hola");
        Nuevo_usuario.id_user = uuidv4();
        Usuario.crearUsuario(Nuevo_usuario, function (err, usuario) {
          if (err) res.send(err);
          res.json(usuario);
        });
      }
    } else {
      // retornomos el mensaje de que ya existe este correo
      res.status(401).send({ error: true, message: "Este correo ya existe." });
    }
  });
};
