/**
 * Ruta: ./routes/medicos
 */

const { Router } = require('express');
 //Middlewares
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
//Controllers
const { validarJWT } = require('../middlewares/validar-jwt');

const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');


const router = Router();

router.get("/", getMedicos);

router.post(
    "/",
    [
        validarJWT,
        check('nombre', 'el nombre del medico es necesario').not().isEmpty(),
        check('hospital', 'el id del hospital debe ser válido').isMongoId(),
        validarCampos
    ],
    crearMedico
);

router.put(
    "/:id",
    [],
    actualizarMedico,
);

router.delete( "/:id", borrarMedico);




module.exports = router;