const {
    Router
} = require('express');

const {
    check
} = require('express-validator');

const {
    validarJWT,
    validarCampos,
    esAdminRole
} = require('../middlewares');

const {
    validaEstadoCategoria,
    existeProductoPorId,
    existeCategoriaId
} = require('../helpers/db-validators');

const {
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    actualizarProductoEstado
} = require('../controllers/productos.controller');

const router = Router();

//Obtener todos las productos - publico
router.get('/', obtenerProductos);


//Obtener una Producto por id - publico

router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProductoById);


//Crear una nuevo Producto - privado, cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'La categoria es obligatorio').notEmpty(),
    check('categoria').custom(existeCategoriaId),
    check('categoria').custom(validaEstadoCategoria),
    check('precio', 'El precio debe ser un dato numerico').isNumeric(),
    validarCampos
], crearProducto);

//Actualizar registro por id - privado, cualquier persona con un token valido
router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('categoria', 'La categoria es obligatorio').notEmpty(),
    check('categoria', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
],actualizarProducto);

//Borrar registro por id - solos los Admin
router.delete('/:id',[
validarJWT,
check('id', 'No es un ID valido').isMongoId(),
check('id').custom( existeProductoPorId ),
esAdminRole,
validarCampos
], actualizarProductoEstado);

module.exports = router;