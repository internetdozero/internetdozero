import { restrictCors } from '../../_lib/cors.js';

export const onRequest = [restrictCors];
