const http = require('http');
const express = require('express');
const cors = require('cors');
const routerUser = require('../routes/user.routes');
const routerAuth = require('../routes/auth.routes');
const routerCategorias = require('../routes/categorias.routes');
const routerProductos = require('../routes/productos.routes')
const { dbConnection } = require('../database/config.db');
const { socketController } = require('../sockets/socket.controller');

class Server {

    constructor() {
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = http.createServer(this.app);
        this.io     = require('socket.io')(this.server);

        this.paths = {
            auth : '/api/auth',
            categorias : '/api/categorias',   
            productos : '/api/productos',   
            usuarios : '/api/usuarios'
        }

        //conectar a base de datos.
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();

        //Sockets
        this.sockets();
    }

    async conectarDB() {

        await dbConnection();

    }

    middlewares() {
        //CORS 
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() )

        //Directorio publico
        this.app.use( express.static('public') );


    }

    routes() {
        //Rutas
        this.app.use( this.paths.auth, routerAuth );
        this.app.use( this.paths.categorias, routerCategorias );
        this.app.use( this.paths.productos, routerProductos );
        this.app.use( this.paths.usuarios, routerUser  );
    }

    sockets() {

        this.io.on('connection', socketController);
    }

    listen() {

        this.server.listen( this.port, () => {
            console.log( 'Servidor corriendo en puerto', this.port )
        })
    }

}

module.exports = Server;