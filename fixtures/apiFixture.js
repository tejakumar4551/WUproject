import {test as base} from '@playwright/test';
import {generateToken} from '../auth/authHelper.js';


export const test= base.extend({

   token: async ({request},use) => {
        
          const token= await generateToken(request)
            await use(token);
    }
})

