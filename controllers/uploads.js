const path = require("path");
const fs = require("fs");

const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  const tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: "El tipo no es valido, no es hospitales, medicos o usuarios",
    });
  }

  // Validar que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay imagen",
    });
  }

  const file = req.files.imagen;

  const nombreCortado = file.name.split(".");
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //Validar Extensión
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];

  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es una extensión permitida",
    });
  }

  //Generar el nombre del archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
  //Path para guardar la imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  actualizarImagen(tipo, id, nombreArchivo);

  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Error al mover la imagen",
      });
    }
    res.json({
      ok: true,
      msg: "archivo subido",
      nombreArchivo,
    });
  });
};

const retornaImagen = (req, res = respone) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  // Imagen por defecto
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
    res.sendFile(pathImg);
  }
};

module.exports = {
  fileUpload,
  retornaImagen,
};
