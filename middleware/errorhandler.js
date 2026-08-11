const {StatusCodes}=require('http-status-codes')
const CustomApiError=require('../errors/custom-api')


const ErrorHandler=(err,req,res,next)=>{
      console.log(err)  // ← add this to see full error in terminal!

    if(err instanceof CustomApiError)
    {
        return res.status(err.statusCode).json({msg:err.message})
    }
    else
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})

    }
}

module.exports = ErrorHandler  
