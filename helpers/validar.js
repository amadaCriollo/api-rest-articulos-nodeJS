const validator = require("validator");

const validarArticulo = ( parametros ) => {
 
    const validarTitulo = !validator.isEmpty( parametros.titulo ) && validator.isLength( parametros.titulo, {min: 5, max:30} );
    const validarContenido = !validator.isEmpty( parametros.contenido ) && validator.isLength( parametros.contenido, {min: 5, max:60} );

    if (!validarTitulo || !validarContenido) {
        throw new Error(" Datos inválidos");
    }
}

module.exports = {
    validarArticulo
}