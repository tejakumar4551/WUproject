import Ajv from "ajv";
import { logger } from "../utils/logger.js";

export  async function schemaValidator(productSchema,body) {
         const ajv = new Ajv();
         logger.info(`product schema: ${JSON.stringify(productSchema)}`);
         logger.info(`response body: ${JSON.stringify(body)}`);
          const validate = ajv.compile(productSchema);
          
          const valid = validate(body);
           return {
    valid,
    errors: validate.errors
  }
    
}