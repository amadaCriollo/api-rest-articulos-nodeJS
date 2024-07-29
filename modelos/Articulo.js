const { Schema, model, default: mongoose } = require( "mongoose" );

const ArticuloSchema = Schema({
    titulo: {
        type: String,
        required: true,
    },
    contenido: {
        type: String,
        required: true,
    },
    fecha: {
        type: String,
        default: Date.now
    },
    imagen: {
        type: String,
        default: "default.png"
    } 

    
});


module.exports = model( "Articulo" , ArticuloSchema, "articulos" );
