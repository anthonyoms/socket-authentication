const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const {ChatMensajes} = require('../models');

const chatmensajes = new ChatMensajes();

const socketController = async ( socket = new Socket(), io ) => {

    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if (!usuario) {

        return socket.disconnect();

    }

    chatmensajes.conectarUsuario(usuario);

    io.emit('usuarios-activos', chatmensajes.usuarioArr);

    socket.on('disconnect', () => {
        chatmensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatmensajes.usuarioArr);
    });


    
}

module.exports = {

    socketController

}