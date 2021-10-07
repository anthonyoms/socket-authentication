
const dbValidator = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');

module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...googleVerify
}