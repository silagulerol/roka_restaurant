const {HTTP_CODES} = require("../config/Enum");
const CustomError = require("./Error");

class Response {
    constructor() {

    }


    static successResponse(data, code=200) {
        return {
            code,
            data
        }
    }

    static errorResponse(error) {
        console.log(error);
        if (error instanceof CustomError){
            return {
                code: error.code,
                error: {
                    message: error.message,
                    description: error.description
                }
            }   
        }else if(error && error.message && error.message.includes("E11000")){
            return {
            code: HTTP_CODES.CONFLICT,
            error: {
               message: "Already Exists!" ,
              description: "Already Exists!"
            }
        }
        }
        return {
            code: HTTP_CODES.INT_SERVER_ERROR,
            error: {
               message: "unknown error",
               description: error.message
            }
        }
    }
}

module.exports = Response;