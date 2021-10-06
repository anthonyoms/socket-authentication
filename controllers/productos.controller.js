const {
    Producto
} = require('../models');

const obtenerProductos = async (req, res) => {

    const {
        desde = 0, hasta = 5
    } = req.query;

    const query = {
        estado: true
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .skip(Number(desde))
        .limit(Number(hasta))
        .populate('usuario categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    })
};

const obtenerProductoById = async (req, res) => {
    const {
        id
    } = req.params

    const producto = await Producto.findById(id).populate('usuario categoria', 'nombre');

    res.json(producto);
};

const crearProducto = async (req, res) => {
    //Verifica si el producto existe.
    const nombre = req.body.nombre.toUpperCase();
    const {
        precio,
        categoria,
        descripcion
    } = req.body;

    const productoDb = await Producto.findOne({
        nombre
    });

    if (productoDb) {
        return res.status(400).json({
            msg: `El producto ${productoDb.nombre} ya existe.`
        });
    }

    //Genera la data y la guarda

    const data = {
        nombre,
        usuario: req.usuario._id,
        precio,
        categoria,
        descripcion
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto);

}
const actualizarProducto = async (req, res) => {
    const {
        id
    } = req.params;

    const {
        usuario,
        estado,
        ...data
    } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id
    const producto = await Producto.findByIdAndUpdate(id, data, {
        new: true
    })

    res.json(producto);
}


const actualizarProductoEstado = async (req, res) => {
    const {
        id
    } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {
        estado: false
    });


    res.json(producto);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    actualizarProductoEstado
}