const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
});


//Renombrar el _id a uid y quitar los atributos que no se quieren mostrar
UsuarioSchema.method('toJSON', function() {
    const{ __v, _id, pasword, ...object} = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model ( 'Usuario' , UsuarioSchema );