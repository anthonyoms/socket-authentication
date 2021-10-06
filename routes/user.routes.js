const {
    Router
} = require('express');
const {
    check
} = require('express-validator');

const {
    esAdminRole,
    tieneRole,
    validarCampos,
    validarJWT,} = require('../middlewares/index');

const {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
} = require('../helpers/db-validators');

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPath
} = require('../controllers/user.controller');



const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos,
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password obligatorio y debe contener mas de 6 letras').isLength({
        min: 6
    }).not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('rol').custom(esRolValido),
    check('correo').custom(emailExiste),
    validarCampos,
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos,
], usuariosDelete);

router.patch('/', usuariosPath);

module.exports = router;