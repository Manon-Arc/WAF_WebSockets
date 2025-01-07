import WebSocket from 'ws';
import * as dotenv from 'dotenv';
import {RoomListType} from './type';
import {catchError} from "../global";
import {joinWS} from "./wsFunction/joinWS";
import {createWS} from "./wsFunction/createWS";
import {dareWS} from "./wsFunction/dareWS";
const rooms:RoomListType = {roomList: {}};
const wss = new WebSocket.Server({ port: 8080 });
dotenv.config();

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', receiveData => {
        try {
            const { type, data }: { type: string, data: any } = JSON.parse(receiveData.toString());
            console.log(`Received data: ${type}`);
            switch (type) {
                case 'create':
                    createWS(ws, data, rooms);
                    break;
                case 'join':
                    joinWS(ws, rooms, data);
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
        console.log('Client disconnected');
    });
});