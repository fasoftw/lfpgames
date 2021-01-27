var passwordValidator = require('password-validator');
var schema = new passwordValidator();


module.exports = app => {

    function existsOrError( value, msg ){
        if(!value) throw msg  
        if(Array.isArray(value) && value.length == 0) throw msg
        if(typeof value === 'string' && !value.trim())  throw msg
    }

    function notExistsOrError( value, msg ){
        try{
            existsOrError(value, msg)
        }catch(msg){  
            return
        }
        throw msg 
    }

    function equalsOrError( valueA, valueB, msg ){
        if( valueA !== valueB) throw msg
    }


    function passwordVal(valueA){
    

        schema
            .is().min(6)                                    // Minimum length 6
            .is().max(20)                                  // Maximum length 20
            .has().uppercase()                            // Must have uppercase letters
 //           .has().lowercase()                             // Must have lowercase letters
            .has().not().spaces()                           // Should not have spaces
        
        let passwordVal = schema.validate(valueA) 

        if(passwordVal === false){
            let list = schema.validate(valueA, { list: true })


            list.forEach( (fail) => {
                if(fail === 'min'){
                    throw 'Passwords must be at least 6 characters'
                }else if( fail === 'max'){
                    throw 'Password must not have contain more than 20 characters'
                }else if( fail === 'uppercase'){
                    throw 'Password must have at least 1 uppercase letter(s)'
                }else if( fail === 'spaces'){
                    throw 'Password must not contain spaces'
                }
            })
        }else{
            return
        }
    }




    return {existsOrError, notExistsOrError, equalsOrError, passwordVal}
}