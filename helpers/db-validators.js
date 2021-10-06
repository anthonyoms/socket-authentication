const {
    Categoria,
    Role,
    Usuario,
    Producto
} = require('../models');


const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({
        rol
    });

    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`)
    }
}

const emailExiste = async (correo = '') => {
    //Verificar si el correo existe 
    const existeEmail = await Usuario.findOne({
        correo
    });

    if (existeEmail) {
        throw new Error(`Este correo: ${correo} ya esta registrado para un usuario`);
    }
}

const existeUsuarioPorId = async (id) => {
    //Verificar si el usuario existe 
    const existeUsuario = await Usuario.findById(id);

    if (!existeUsuario) {
        throw new Error(`Este id: ${id} no existe`);
    }
}

const existeCategoriaId = async (id) => {

    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoria con el id ${ id } no existe`);
    }
};

const validaEstadoCategoria = async (id) => {

    const existeCategoria = await Categoria.findById(id);

    if (!existeCategoria.estado) {
        throw new Error(`La categoria  ${ id } esta desactivada por favor comunicarse con el admin`);
    }
}

const existeProductoPorId = async (id) => {

    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`el producto con el id ${ id } no existe`);
    }
};

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaId,
    validaEstadoCategoria,
    existeProductoPorId
}