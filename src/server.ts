import app from './app'
import path from 'path'
import { WebSocket } from "ws";
import dotenv from 'dotenv'
import { handleWsConnect  , handleHttpUpgrade} from './events/websocketEvents';
import { sendDataToQueue , receiveFromQueue , initRabbitMQ } from './integration/rabbitmqClient'


dotenv.config({path: path.resolve(__dirname, '../.env')})

const port = Number(process.env.PORT)
const host = process.env.HOST



async function StartServer() 
{
	try 
	{
		app.listen({port: port, host: host}, () => {
			console.log(`server listen on http://${host}:${port} ...`)
		})
	} 
	catch (error) 
	{
		console.log('error in server')
		process.exit(1)
	}
}


export const ws = new WebSocket.Server({noServer: true})


ws.on('connection', handleWsConnect);
app.server.on('upgrade',handleHttpUpgrade);



async function start() 
{
	StartServer()
	await initRabbitMQ()
	await receiveFromQueue('chatservice')
}

start()
