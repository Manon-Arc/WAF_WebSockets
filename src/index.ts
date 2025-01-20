import WebSocket from 'ws';
import * as dotenv from 'dotenv';
import {RoomListType, ServerPlayerType} from './type';
import {catchError} from "../global";
import {joinWS} from "./wsFunction/joinWS";
import {createWS} from "./wsFunction/createWS";
import {dareWS} from "./wsFunction/dareWS";
import {quitRoom} from "./wsFunction/quitRoom";
import { TokenGenerator } from 'ts-token-generator';

const rooms: RoomListType = {roomList: {}};
const wss = new WebSocket.Server({port: 6001});


const wssConnection = new Map<String, WebSocket>();


dotenv.config();

wss.on('connection', (ws: WebSocket) => {

    // ! Ici se sont des variables de session WS qui sont spécifique à notre connexion


    console.log('New client connected');

    ws.on('message', receiveData => {
        try {
            const {type, data}: { type: string, data: any } = JSON.parse(receiveData.toString());
            console.info(`Received message of type : ${type}`);


            switch (type) {
                case 'connection':
                    connectWs(ws, data);
                    break;
                case 'create':
                    createWS(ws, data, rooms, wssConnection);
                    break;
                case 'join':
                    joinWS(ws, rooms, data, wssConnection);
                    break;
                case 'dare':
                    dareWS(ws, data);
                    break;
                default:
                    break;
            }
        } catch (e) {
            catchError(ws, e);
        }
    });

    ws.on('close', () => {
        let token = null;
        for (const [key, value] of wssConnection.entries()) {
            if (value === ws) {
                token = key;
                break;
            }
        }

        if (!token) return;

        wssConnection.delete(token);
        quitRoom(ws, token, rooms, wssConnection);
    });
});


function connectWs(ws: WebSocket, data: any): string {

    const tokenGen = new TokenGenerator();
    let token = tokenGen.generate();

    if (data.token) {
        token = data.token;
        reconnectWs(ws, token);
        return token;
    }

    wssConnection.set(token, ws);
   
    
    const messageConnection = {
        type: 'connection',
        data: {
            token: token
        }
    }

    ws.send(JSON.stringify(messageConnection));
    console.info(`Player connected with token : ${token}`);
    return token;
}

function reconnectWs(ws: WebSocket, token: string) {
    wssConnection.set(token, ws);
    let room = null;
    let player = null;

    for (const r of Object.values(rooms.roomList)) {
        if( r.playerList.find((p:ServerPlayerType) => p.token === token)){
            room = r;
            player = room.playerList.find((p:ServerPlayerType) => p.token === token);
            break;
        }
    }

    if (!room || !player) {
        return;
    }

    joinWS(ws, rooms, {roomCode: room.roomId, player: player}, wssConnection);
}