const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El contraseña es obligatorio'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default:'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']

    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

UsuarioSchema.methods.toJSON = function () {

    const {password, _id:uid,...usuario} = this.toObject();
    usuario.uid = uid;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);