import WebSocket from 'ws';
import * as dotenv from 'dotenv';
import {RoomListType, CloseWSPlayerType} from './type';
import {catchError} from "../global";
import {joinWS} from "./wsFunction/joinWS";
import {createWS} from "./wsFunction/createWS";
import {dareWS} from "./wsFunction/dareWS";
import {quitRoom} from "./wsFunction/quitRoom";

const rooms:RoomListType = {roomList: {}};
const wss = new WebSocket.Server({ port: 6001 });
const wsPlayerMap = new Map<WebSocket, CloseWSPlayerType>();

dotenv.config();

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', receiveData => {
        try {
            const { type, data }: { type: string, data: any } = JSON.parse(receiveData.toString());
            console.log(`Received data: ${type}`);
            switch (type) {
                case 'create':
                    createWS(ws, data, rooms, wsPlayerMap);
                    break;
                case 'join':
                    joinWS(ws, rooms, data, wsPlayerMap);
                    break;
                case 'dare':
                    dareWS(ws, data);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
            catchError(ws, e);
        }
    });

    ws.on('close', () => {
        const player = wsPlayerMap.get(ws);
        quitRoom(ws, player, rooms, wsPlayerMap);
    });
});