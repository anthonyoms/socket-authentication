
let usuario = null;
let socket = null;

const url = (window.location.hostname.includes('localhost')) ?
    'http://localhost:8080/api/auth/' :
    'https://node-course-h.herokuapp.com/api/auth/';


const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch (url , {
        headers: {'x-token': token}
    });

    const {usuario : usuarioDB, token : tokenDB } = await resp.json();

    localStorage.setItem('token', tokenDB);
    const {nombre} = usuarioDB;
    document.title = nombre;

}


const main = async() => {

    await validarJWT();

}

main();

//const socket  = io();