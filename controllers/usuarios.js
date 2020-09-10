const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const Usuario = require("../models/usuario");

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  //Desestructuración de arreglos
  const [ usuarios, total ] = await Promise.all([
    Usuario.find({}, "nombre email role google img")
    .skip(desde)
    .limit(5),
    // Total de registros
    Usuario.countDocuments()
  ])
  res.json({
    ok: true,
    usuarios,
    total
  });
};

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya está registrado",
      });
    }
    const usuario = new Usuario(req.body);

    // Encriptar Contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guarda en la base de datos, es una promesa por lo que se necesita esperar a que termine
    await usuario.save();

    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado ... revisar logs",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    //Actualización
    const { password, google, email, ...campos } = req.body;

    // Si el email es el mismo eliminarlo para que no se actualice
    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }

    campos.email = email;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado ... revisar logs",
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Usuario Eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado ... revisar logs",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
};
