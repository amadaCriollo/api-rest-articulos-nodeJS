const mongoose = require("mongoose");

const conexion = async() => {
    
    try {
        await mongoose.connect("mongodb://localhost:27017/mi_blog"); 
        console.log("Conectado correctamente a la bd mi blog");

        //Parametros a pasar dentro de un objeto en caso de error
        // useNewUrlParser:true
        // useUnifiedTopology:true
        // useCreateIndex:true

    }catch( error ) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}

module.exports = {
    conexion
}