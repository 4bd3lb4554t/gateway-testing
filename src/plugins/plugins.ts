import { FastifyInstance } from 'fastify';
import authplugin from './authPlugin'

export default async function registerPlugins(app:FastifyInstance) 
{
    await authplugin(app);
}