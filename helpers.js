//el objeto es el resultado de una consulta a una BD, segundo parametro es para reemplazar algo, no se va a
//reemplazar nada asi que se pone null, ultimo parametro es el espacio que tendra 
exports.vardump = (objeto) => JSON.stringify(objeto, null, 2);