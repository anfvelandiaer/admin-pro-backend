/**
 * Ruta: /api/usuarios
 */

const { Router } = require('express');
 //Middlewares
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
//Controllers
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.get("/", validarJWT, getUsuarios);

router.post(
    "/",
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', ' El password es obligatorio').not().isEmpty(),
        check('email', ' El email es obligatorio').isEmail(),
        validarCampos
    ],
    crearUsuario
);

router.put(
    "/:id",
    [   
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', ' El email es obligatorio').isEmail(),
        validarCampos
    ],
    actualizarUsuario,
);

router.delete( "/:id", validarJWT, borrarUsuario);




module.exports = router;