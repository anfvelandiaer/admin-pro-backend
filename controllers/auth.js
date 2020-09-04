const { response } = require("express");
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')
const Usuario = require("../models/usuario");


const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
      //Verificar Email
    const usuarioDB = await Usuario.findOne({email});

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    //Verificar Password
    const validPassword = bcrypt.compareSync( password, usuarioDB.password);

    if( !validPassword ) {
        return res.status(400).json({
            ok: false,
            msg: "Contraseña erronea",
          });
    }

    //Generar el Token -JWT
    const token = await generarJWT( usuarioDB.id);

    res.json({
      ok: true, 
      token
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
  login,
};
