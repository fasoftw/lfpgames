module.exports = app => {

    function existsOrError( value, msg ){
        if(!value) throw msg  

        console.log(value.trim())

        if(Array.isArray(value) && value.length == 0) throw 'Array.isArray(value) && value.length == 0'
        if(typeof value === 'string' && !value.trim())  throw 'typeof value === string && !value.trim() '
    }

    function notExistsOrError( value, msg ){
        
    }

    function equalsOrError( valueA, valueB, msg ){
        
    }

    return {existsOrError, notExistsOrError, equalsOrError}
}