const CustomApiError=require('./custom-api')

const {StatusCodes}=require('http-status-codes')

class Unauthenticated extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode=StatusCodes.UNAUTHORIZED
    }
}

module.exports=Unauthenticated