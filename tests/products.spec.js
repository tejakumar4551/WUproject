
import {getProducts,createProduct} from '../client/apiClient.js';
import {test} from '../fixtures/apiFixture.js';
import {API_ROUTES} from '../routes/apiRoutes.js';
import { productSchema } from '../schemas/productSchema.js';
import { schemaValidator } from '../utils/schemaValidator.js';
import {newProductPayload} from '../data/productPayload.js';
import { logger } from '../utils/logger.js';
import {expect} from '@playwright/test';


test('Check products lists @smoke', async ({ request, token }) => {
     
     const response=await getProducts(request,API_ROUTES.products,token);
     logger.info(`Response from getProducts API: ${response.status()}`);
     expect(response.status()).toBe(200);
      const body = await response.json();
      await schemaValidator(productSchema, body);
        const result =await schemaValidator(productSchema, body);
         expect(result.valid).toBe(true);
}
)

test('create new product', async({ request, token })=>{

     const response= await createProduct(request, API_ROUTES.products, token, newProductPayload);
                
})

               


