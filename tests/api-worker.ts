import * as state from '../app/api/state/route';
import * as account from '../app/api/account/route';
import * as orders from '../app/api/orders/route';
import * as bookings from '../app/api/bookings/route';
import * as addresses from '../app/api/addresses/route';
import * as operations from '../app/api/operations/route';
const routes:Record<string,any>={state,account,orders,bookings,addresses,operations};
export default {async fetch(req:Request){const route=routes[new URL(req.url).pathname.split('/').at(-1)!];const fn=route?.[req.method];return fn?fn(req):new Response('Not found',{status:404})}};
