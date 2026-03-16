import { ENV } from "../config/env";
import { logger } from "../utils/logger";

export async function generateToken(request){

    try{
        const response = await request.post(`${ENV.BASE_URL}${ENV.LOGIN_ENDPOINT}`,{
        data:{
                "username" : ENV.USERNAME,
                "password" : ENV.PASSWORD
        }
    })

    const body = await response.json();
    return body.token;

    }
    catch(error){
        logger.error(`Error in generateToken: ${error.message}`);
        throw error;

    }


  
}