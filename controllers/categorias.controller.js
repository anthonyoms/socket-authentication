const {
    Categoria
} = require('../models');

//obtenerCategorias - paginado - total - populate.
const obtenerCategorias = async (req, res) => {

    const {
        desde = 0, hasta = 5
    } = req.query;

    const query = {
        estado: true
    };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(hasta))
    ])

    res.json({
        total,
        categorias
    });
}
//obtenerCategoria - populate {}.

const obtenerCategoriaById = async (req, res) => {

    const {
        id
    } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    if (!categoria.estado) {
        return res.status(400).json({
            msg: `Favor Comunicarse con el administrador la categoria ${categoria._id} esta desactivada`
        })
    }

    res.json({
        categoria
    })
}


const crearCategoria = async (req, res) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({
        nombre
    });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB?.nombre} ya existe`
        })
    }

    //Generar la data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    };

    console.log(req.usuario);
    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);
}

//actualizar categorias
const actualizarCategoria = async (req, res) => {
    const {
        id
    } = req.params;

    const {
        usuario,
        estado,
        ...data
    } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario_id
    const categoria = await Categoria.findByIdAndUpdate(id, data, {
        new: true
    })

    res.json(categoria);
}

//borrarCategoria


const actualizarCategoriaEstado = async (req, res) => {
    const {
        id
    } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {
        estado: false
    });

    res.json(
        categoria
    );
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaById,
    actualizarCategoria,
    actualizarCategoriaEstado
}