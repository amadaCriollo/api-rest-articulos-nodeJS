const fs = require("fs");
const path = require("path");
const Articulo = require("../modelos/Articulo");
const { validarArticulo } = require("../helpers/validar");



const prueba = ( req, res ) => {
    
    return res.status(200).json({
        mensaje: "Porbando controlador articulo"
    });
}

const curso = ( req, res ) => {
    
    return res.status(200).json(
        [{
            curso: "Master en react",
            autor: "Victor",
            url: "url_master"
        },
        {
            curso: "Master en react",
            autor: "Victor",
            url: "url_master"
        },  
        ]
    );
}

const crear = (req, res) => {
    //Recoger los parametros por post a guardar
    let parametros = req.body;

    //Validar datos
    try {
        validarArticulo( req.body );
    } catch ( error ) {
        return res.status(400).json({
            status:"Failed",
            mensaje:"Error faltan datos"
        })
    }

    //Crear el objeto a guardar
    const articulo = new Articulo( parametros );

    //Asignar valores a objeto basado en el modelo (manual o automático)

    //Guardar el articulo en la base de datos
   articulo.save()
   .then( articuloGuardado => {
        return res.status( 200 ).json({
                status:"success",
                mensaje: "Artículo guardado con éxito !!",
                articulo: articuloGuardado
            })
   } )
   .catch( error => {
        if ( error || !articuloGuardado ) {
            return res.status(400).json({
                status:"Error",
                mensaje: "No se ha guardado el artículo"
            });
        }
   }) 
}

const articulos = ( req, res ) => {
    let consulta = Articulo.find({});

    if (req.params.ultimos) {
        consulta.limit( 3 );
    }
   // consulta.limit( 3 );
    consulta
            .sort({ fecha: -1 })
            .exec()
                .then( articulos => {
                    return res.status( 200 ).send({
                        status:"success",
                        contador: articulos.length,
                        articulos
                    });
                } )
                .catch( error => {
                    return res.status(400).json({
                        status:"Error",
                        mensaje: "No se han encontrado artículos"
                    });  
                });
}

const articulo = (req, res) => {

    let id = req.params.id;
    console.log(id);

    if( !id ) {
        return res.status(400).json({
            status:"Error",
            mensaje: "Ingresar criterio de búsqueda",
        });  
    }
    
    Articulo.findById(id)
            .exec()
            .then( ( articulo ) => {
                if ( articulo ) {
                    return res.status( 200 ).json({
                        status:"success",
                        articulo
                    });
                } else {
                    throw new Error("No se encuentra articulo");
                }
                
            }) 
            .catch(( err ) => {
                return res.status(404).json({
                    status:"Error",
                    mensaje: `No se ha encontrado artículos con el criterio de búsqueda ${ id }`,
                });  
            }) 
}

const borrar = (req, res) => {

    let articuloId = req.params.id;
    if( !articuloId ) {
        return res.status(400).json({
            status:"Error",
            mensaje: "Ingresar ID",
        });  
    }

    Articulo.findOneAndDelete({ _id: articuloId })
            .exec()
            .then(( articuloBorrado ) => {
               
                if( articuloBorrado ) {
                    return res.status(200).json({
                        status:"SUCCESS",
                        mensaje: "Artículo eliminado correctamente",
                        articuloBorrado
                    });
                } else {
                    throw new Error("No se encontró artículo para eliminar");
                }
            })
            .catch( ( error ) => {
                return res.status(400).json({
                    status:"Error",
                    mensaje: `${ error } ${ articuloId }`,
                });  
            });
}

const editar = ( req, res ) => {

    const articuloId = req.params.id;

    if( !articuloId ) {
        return res.status(400).json({
            status:"Error",
            mensaje: "Ingresar ID",
        });  
    }

    Articulo.findByIdAndUpdate(  articuloId, req.body, { new: true } )
            .exec()
            .then( ( articuloActualizado ) => {

                if ( articuloActualizado ) {
                    return res.status( 200 ).json({
                        status: "SUCCESS",  
                        mensaje: "Actualizado correctamente",
                        articuloActualizado
                    }) 
                }else {
                   throw new Error( "No se pudo actualizar " ); 
                }
            })
            .catch( ( err ) => {
                return res.status( 400 ).json({
                    status: "ERROR",  
                    mensaje: ` ${ err } el artículo con ID ${ articuloId } `
                }) 
            })
}

const subir = ( req, res ) => {

    //Configurar multer

    //recoger el fichero de imagen 
    if( !req.file && !req.files ) {
        return res.status(404).json({
            status: "error",
            mensaje: "Petición inválida"
        })
    }
    console.log(req.file)

    //Conseguir nombre del archivo
    const nombreArchivo = req.file.originalname;
    
    //Conseguir extensión
    const archivo_split = nombreArchivo.split("\.");
    const extensionArchivo = archivo_split[1];

    //Comprobar extension correcta
    const extensionesImagenes = ['png','jpg','png','gif'];
    if( !extensionesImagenes.includes( extensionArchivo ) ) {
        //Borrar archivo
        fs.unlink(req.file.path, ( error ) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Imágen inválida"
            })
        });
    } else {

        const articuloId = req.params.id;

        if( !articuloId ) {
            return res.status(400).json({
                status:"Error",
                mensaje: "Ingresar ID",
            });  
        }

        //Guardar imagen
        Articulo.findByIdAndUpdate(  articuloId, { imagen:req.file.filename }, { new: true } )
                .exec()
                .then( ( articuloActualizado ) => {

                    if ( articuloActualizado ) {
                        return res.status( 200 ).json({
                            status: "SUCCESS",  
                            mensaje: "Fichero subido",
                            articuloActualizado,
                            fichero: req.file
                        }) 
                    }else {
                    throw new Error( "No se pudo actualizar " ); 
                    }
                })
                .catch( ( err ) => {
                    return res.status( 400 ).json({
                        status: "error",  
                        mensaje: ` ${ err } el artículo con ID ${ articuloId } `
                    }) 
                })
    }
}

const imagen = ( req, res ) => {
    const fichero = req.params.fichero;

    const ruta_fisica =`./imagenes/articulos/${fichero}`;

    fs.stat( ruta_fisica, ( error, existe ) => {
        if( existe ) {
            console.log(existe)
             return  res.sendFile( path.resolve( ruta_fisica ) );
        } else {
            return res.status( 400 ).json({
                status: "error",  
                mensaje:  "Imágen no existe",
                existe,
                fichero,
                ruta_fisica
            });
        }
    });
}

const buscador = ( req, res ) => {
    
    //Sacar el string de busqueda
    const criterioBusqueda = req.params.busqueda;

    //Find OR
    Articulo.find({ "$or": [
                { "titulo": {"$regex": criterioBusqueda, "$options": "i"}},
                { "contenido": {"$regex": criterioBusqueda, "$options": "i"}}
            ]})
            .sort({ fecha: -1 })
            .exec()
            .then( ( articulosEncontrados ) => {
                console.log(!articulosEncontrados)

                if( articulosEncontrados && articulosEncontrados.length > 0 ) {
                    return res.status(200).json({
                        status: "SUCCESS",
                        contador : articulosEncontrados.length,
                        articulos: articulosEncontrados
                    })
                }else {
                    throw new Error( "No se encontraron artículos" );
                }
            })
            .catch( ( err ) => {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se encontraron artículos"
                })
            });
}


module.exports = {
    prueba,
    curso,
    crear,
    articulos,
    articulo,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}
