const { response } = require("express");
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require("../models/usuario");
const { db } = require("../models/usuario");


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

const googleSignIn = async(req, res=response) => {

  const googleToken = req.body.token;
  

  try {
    const { name, email, picture } = await googleVerify(googleToken)

    //Verificar email
    const usuarioDB = await Usuario.findOne({email});
    let usuario;
    if ( !usuarioDB ) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true
      })
    } else {
      // Existe usuario
      usuario = usuarioDB;
      usuario.google = true;
    }

    //guardar en DB

    await usuario.save();

    //Generar el Token -JWT
    const token = await generarJWT( usuario.id);


    res.json({
      ok:true,
      token
    })
  } catch (error) {

    res.status(401).json({
      ok:false,
      msg: 'El token no es correcto'
    })
  }

}

const renewToken = async(req, res=response)  => {
  const uid = req.uid
  const usuario = await Usuario.findById(uid);
  const token = await generarJWT(uid);

  res.json({
    ok:true,
    usuario,
    token
  });
}

module.exports = {
  login,
  googleSignIn,
  renewToken
};
