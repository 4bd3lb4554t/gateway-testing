import {fastify , FastifyInstance} from 'fastify';
import { authenticateUser } from './validators/middleware';
import {authRoutes } from './routes/auth';
import {gatewayRoutes} from './routes/proxy'
import { errorHandler } from './utils/errorHandler';
import registerPlugins from './plugins/plugins'



const app: FastifyInstance = fastify();
export default app;
registerPlugins(app);


// const routes = [...gatewayRoutes ,  ...authRoutes]

app.addHook('preHandler', authenticateUser);
app.addHook('onError', errorHandler);

authRoutes.forEach(route => {app.route(route)})
gatewayRoutes.forEach(route => {app.all(route.url , route.handler)})

