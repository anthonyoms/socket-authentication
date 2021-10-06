const {
    Router
} = require('express');

const {
    check
} = require('express-validator');

const {
    validarJWT, validarCampos,esAdminRole
} = require('../middlewares');

const {
    existeCategoriaId
} = require('../helpers/db-validators');

const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaById,
    actualizarCategoria,
    actualizarCategoriaEstado
} = require('../controllers/categorias.controller');

const router = Router();

//Obtener todas las categorias - publico
router.get('/',obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaId ),
    validarCampos
], obtenerCategoriaById);

//Crear una nueva categoria - privado, cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').notEmpty(),
    validarCampos
],crearCategoria );

//Actualizar registro por id - privado, cualquier persona con un token valido
router.put('/:id',[
        validarJWT,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom( existeCategoriaId ),
        check('nombre','El nombre es obligatorio').notEmpty(),
        validarCampos,
],actualizarCategoria);

//Borrar registro por id - solos los Admin
router.delete('/:id',[
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaId ),
    esAdminRole,
    validarCampos
], actualizarCategoriaEstado);



module.exports = router;