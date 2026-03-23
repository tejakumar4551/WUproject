// src/client/ApiClient.js

const logger = require('../utils/Logger');

class ApiClient {

  constructor(request, headers = {}) {
    this.request        = request;
    this.defaultHeaders = headers;
  }

  _mergeHeaders(extra = {}) {
    return { ...this.defaultHeaders, ...extra };
  }

  async _send(method, endpoint, options = {}) {
    const { params, headers, data, timeout } = options;

    // build URL
    let url = endpoint;
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
        .join('&');
      url = `${endpoint}?${queryString}`;
    }

    const requestOptions = {
      headers: this._mergeHeaders(headers),
      ...(data    !== undefined && { data }),
      ...(timeout !== undefined && { timeout }),
    };

    // log the outgoing request
    logger.info(`--> ${method.toUpperCase()} ${url}`, {
      headers: requestOptions.headers,
      ...(data !== undefined && { body: data }),
    });

    let response;
    try {
      response = await this.request[method](url, requestOptions);
    } catch (err) {
      // log network-level errors (timeout, DNS failure etc.)
      logger.error(`Network error on ${method.toUpperCase()} ${url}`, {
        error: err.message,
      });
      throw err;
    }

    const status = response.status();

    // log the incoming response — warn on 4xx, error on 5xx
    if (status >= 500) {
      logger.error(`<-- ${status} ${method.toUpperCase()} ${url}`);
    } else if (status >= 400) {
      logger.warn(`<-- ${status} ${method.toUpperCase()} ${url}`);
    } else {
      logger.info(`<-- ${status} ${method.toUpperCase()} ${url}`);
    }

    // log response headers at debug level — only written when LOG_LEVEL=debug
    logger.debug(`Response headers for ${method.toUpperCase()} ${url}`, {
      headers: response.headers(),
    });

    return response;
  }

  async get(endpoint, options = {}) {
    return this._send('get', endpoint, options);
  }

  async post(endpoint, options = {}) {
    return this._send('post', endpoint, options);
  }

  async put(endpoint, options = {}) {
    return this._send('put', endpoint, options);
  }

  async patch(endpoint, options = {}) {
    return this._send('patch', endpoint, options);
  }

  async delete(endpoint, options = {}) {
    return this._send('delete', endpoint, options);
  }

}

module.exports = ApiClient;
