const bcrypt = require('bcryptjs');
const {
    generarJWT
} = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');
const {googleVerify} = require('../helpers/google-verify')


const login = async (req, res) => {

    const {
        correo,
        password
    } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({
            correo
        });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - usuario:null'
            })
        }

        //Si el usuarios esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estatus: false'
            })
        }
        //Verificar la contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - pws:no mach'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {

        console.log(error)
        res.status(500).json({
            msg: 'Ups, Algo salio mal , hable con el administrador'
        });

    }
}

const googleSingin = async (req, res) => {

    const {id_token} = req.body;

    try {

        const {
            correo,
            nombre,
            img
        } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario) {

            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google:true
            };

            usuario = new Usuario( data );

            await usuario.save();

        }

        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {

        res.status(400).json({
            msg: 'token de google no es valido'

        })
    }

}

const renovarToken =  async (req, res) => {

    const {usuario} = req;

    //Generar JWT
    const token = await generarJWT(usuario.id);

    res.status(200).json({
        usuario,
        token
    });

};

module.exports = {
    login,
    googleSingin,
    renovarToken
}