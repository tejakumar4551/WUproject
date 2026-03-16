import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";

export async function getProducts(request, endpoint, token) {
  const url = `${ENV.BASE_URL}${endpoint}`;
  try {
    logger.info('API REQUEST: GET ${url}');
    const response = await request.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    logger.info(`API RESPONSE STATUS: ${response.status()}`);
    const body = await response.json();
    logger.info(`API RESPONSE BODY: ${JSON.stringify(body)}`);
    return response;
  } catch (error) {
    logger.error(`IN apiClient file Error in getProducts: ${error.message}`);
    throw error;
  }
}

export async function createProduct(request, endpoint, token, payload) {
  const url = `${ENV.BASE_URL}${endpoint}`;
  try{
    logger.info(
    `API REQUEST: POST ${url} with payload: ${JSON.stringify(payload)}`,
  );
  const response = await request.post(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  });
  logger.info(`API RESPONSE STATUS: ${response.status()}`);
  const responseBody = await response.json();
  logger.info(
    `New product created RESPONSE BODY: ${JSON.stringify(responseBody)}`,
  );
  logger.info(`Product created with ID: ${responseBody.id}`);

  return response;
  }
  catch(error){
    logger.error(`IN apiClient file Error in createProduct: ${error.message}`);
    throw error;
  }

  
}
