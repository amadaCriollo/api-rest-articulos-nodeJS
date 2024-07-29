const express = require("express");
const multer = require("multer");
const articuloControlador = require("../controladores/articulo");
const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: ( req, file, cb ) => {
        cb( null, './imagenes/articulos/' );
    },

    filename: ( req, file, cb ) => {
        cb(  null, "articulo" + Date.now() + file.originalname );
    }
});

const subidas = multer({ storage: almacenamiento });


router.get("/ruta-de-prueba", articuloControlador.prueba);
router.get("/curso", articuloControlador.curso);

//Rutas articulo
router.post("/crear", articuloControlador.crear);
router.get("/articulos/:ultimos?", articuloControlador.articulos); // con ? es para indicar que el parametro es opcional
router.get("/articulo/:id", articuloControlador.articulo);
router.delete("/articulo/:id", articuloControlador.borrar);
router.put("/articulo/:id", articuloControlador.editar);
router.post("/subir-imagen/:id",[ subidas.single( "file0" ) ], articuloControlador.subir);
router.get("/imagen/:fichero", articuloControlador.imagen);
router.get("/buscar/:busqueda", articuloControlador.buscador);


module.exports = router;


