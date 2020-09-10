/**
 * Ruta: ./routes/uploads
 */

const { Router } = require('express');
const expressFileUpload = require('express-fileupload')
//Controllers
const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploads');


const router = Router();

//Middleware para tener acceso a los archivos
router.use(expressFileUpload() )

router.put("/:tipo/:id", validarJWT, fileUpload);

router.get("/:tipo/:foto", retornaImagen);


module.exports = router;