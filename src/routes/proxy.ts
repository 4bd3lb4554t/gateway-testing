import { RouteHandlerMethod , FastifySchema } from 'fastify';
import {proxyToNotifyService , proxyToChatService , proxyToGameService , proxyToUserService} from '../controllers/proxy.controller'




type Route = {
    url     : string;
    handler : RouteHandlerMethod;
};



const gatewayRoutes: Route[] = [

  {url: '/api/users/*', handler: proxyToUserService },
  {url: '/api/friends*', handler: proxyToUserService },
  {url: '/api/chat/*', handler: proxyToChatService },
  {url: '/api/game/*', handler: proxyToGameService },
  {url: '/api/notify/*', handler: proxyToNotifyService },
];



export { gatewayRoutes };
