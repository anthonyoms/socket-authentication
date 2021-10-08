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
    io.emit('recibir-mensajes', chatmensajes.ultimos10)
    io.emit('usuarios-activos', chatmensajes.usuarioArr);

    //Conectarlo a una sala especial
    socket.join( usuario.id );// Salas: global, socket.id, usuario

    socket.on('disconnect', () => {
        chatmensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatmensajes.usuarioArr);
    });

    socket.on('enviar-mensaje', ({uid, mensaje}) => {

        if (uid) {

            // Mensaje privado
            socket.to( uid ).emit('mensaje-privado',{de:usuario.nombre, mensaje});

        } else {
            
            chatmensajes.enviarMensaje(usuario.id, usuario.nombre,mensaje);
            io.emit('recibir-mensajes', chatmensajes.ultimos10)
        }


    });


    
}

module.exports = {

    socketController

}