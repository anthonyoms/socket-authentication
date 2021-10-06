const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');


const usuariosGet = async (req, res) => {

    const {
        limite = 5, desde = 0
    } = req.query;

    const query = {
        estado: true
    };

    const [total, usuarios] = await Promise.all([

        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res) => {

    const {
        nombre,
        correo,
        password,
        rol
    } = req.body;

    const usuario = new Usuario({
        nombre,
        correo,
        password,
        rol
    });

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar en DB
    await usuario.save();

    res.json({
        usuario
    })
};

const usuariosPut = async (req, res) => {

    const {
        id
    } = req.params;
    const {
        password,
        google,
        _id,
        ...data
    } = req.body;

    if (password) {

        const salt = bcrypt.genSaltSync();
        data.password = bcrypt.hashSync(password, salt);

    }

    const usuario = await Usuario.findByIdAndUpdate(id, data,{new: true});

    res.json(usuario);
}

const usuariosDelete = async (req, res) => {

    const {id} = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    const usuarioAuth = req.usuario;

    res.json({
        usuario,
        usuarioAuth
    })
}
const usuariosPath = (req, res) => {
    res.json({
        msg: 'patch API'
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPath
}