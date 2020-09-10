const {Schema, model} = require('mongoose');

const MedicoSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        //Indica que hay una relación
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    hospital: {
        //Indica que hay una relación
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
});


//Renombrar el _id a uid y quitar los atributos que no se quieren mostrar
MedicoSchema.method('toJSON', function() {
    const{ __v, ...object} = this.toObject();
    return object;
})

module.exports = model ( 'Medico' , MedicoSchema );