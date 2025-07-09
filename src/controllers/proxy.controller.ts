import { FastifyRequest, FastifyReply } from 'fastify';
import { sendToService } from '../integration/api_calls';



async function proxyToUserService(req:FastifyRequest , res:FastifyReply)
{
    const data:any =  await sendToService(`http://user:4001${req.url}` , req.method , req.id , req.body)
    return res.send(data)
}




async function proxyToChatService(req:FastifyRequest , res:FastifyReply)
{
    const method = req.method;
    const url = req.url;

    const data:any =  await sendToService(`http://chat:4002${url}` , method , req.body)
    return res.send(data)
}



async function proxyToGameService(req:FastifyRequest , res:FastifyReply)
{
    const method = req.method;
    const url = req.url;

    const data:any =  await sendToService(`http://user:4001${url}` , method , req.body)
    return res.send(data)
}




async function proxyToNotifyService(req:FastifyRequest , res:FastifyReply)
{
    const method = req.method;
    const url = req.url;

    const data:any =  await sendToService(`http://notify:4004${url}` , method , req.body)
    return res.send(data)
}



export {proxyToNotifyService , proxyToChatService , proxyToGameService , proxyToUserService}