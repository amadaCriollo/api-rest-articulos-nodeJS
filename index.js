const  { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

//Conectar a la bd
conexion();

//Crear servidore node
const app = express();
const puerto = 3900;

//Configurar CORS
app.use( cors() );

//Leer y convertir el body a un objeto js
app.use( express.json() ); // recibir datos con content-type app/json
app.use( express.urlencoded({ extended:true }) ); //recibiendo datos por form-urlencoded

//Rutas
const ruta_articulo = require("./rutas/articulo");

//Cargar las rutas
app.use("/api", ruta_articulo);

//Crear rutas
app.get("/probando", ( req, res ) => {
    console.log("Se ha ejecutado el endpoint /probado");
    return res.status( 200 ).json({
        curso:"Master en react",
        autor: "Victor",
        url: "victor//"
    }
        
    );
} );

app.get("/", ( req, res ) => {
    console.log("Se ha ejecutado el endpoint /probado");
    return res.status(200).send("Probando");
} );
//Crear servidor y escuchar peticiones
app.listen( puerto, () => {
    console.log(`Escuchanod en el puerto ${ puerto }` )
} );