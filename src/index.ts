import WebSocket from 'ws';
import * as dotenv from 'dotenv';
import {RoomListType, RoomType, ServerPlayerType} from './type';
import {catchError} from "../global";
import {joinWS} from "./wsFunction/joinWS";
import {createWS} from "./wsFunction/createWS";
import {dareWS} from "./wsFunction/dareWS";
import {quitRoom} from "./wsFunction/quitRoom";
import { TokenGenerator } from 'ts-token-generator';

export const WSS_CONNECTION = new Map<String, WebSocket>();
export const PLAYERS = new Map<String, ServerPlayerType>();
export const ROOMS: RoomListType = {roomList: {}};
const wss = new WebSocket.Server({port: 6001});

dotenv.config();

wss.on('connection', (ws: WebSocket) => {

    // ! Ici se sont des variables de session WS qui sont spécifique à notre connexion
    let token: string|null;

    ws.on('message', receiveData => {
        try {
            const {type, data}: { type: string, data: any } = JSON.parse(receiveData.toString());

            switch (type) {
                case 'connection':
                    token = connectWs(ws, data);
                    WSS_CONNECTION.set(token, ws);
                    break;
                case 'create':
                    createWS(ws, data);
                    break;
                case 'join':
                    joinWS(ws, data);
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
        if (!token) return;
        quitRoom(ws, token, ROOMS);
    });
});


/**
 * Renvoie le token envoyer par l'uilisateur et le reconnect s'il a déjà une session ouverte ou lui attribut un token.
 * 
 * @returns Le token de l'utilisateur.
 */
function connectWs(ws: WebSocket, data: any): string {

    console.group("Demande de connection")

    const tokenGen = new TokenGenerator();
    let token = tokenGen.generate();

    if (data.token) {
        token = data.token;

        console.log(`Session existante : true`)
        console.log(`Token : ${token}`)
        console.groupEnd()

        reconnectWs(ws, token);
        return token;
    }

    console.log(`Session existante : false`)
    console.log(`Token : ${token}`)
    console.groupEnd()
   
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

/**
 * Reconnect le joueur au compte lié au token reçu.
 * Si aucune session n'est trouvé, reprend la voie classique.
 * 
 * @returns Le token de l'utilisateur.
 */
function reconnectWs(ws: WebSocket, token: string) {
    const player = PLAYERS.get(token);

    if (!player) {
        console.warn(`Session de l'utilisateur ${token} non retrouvé.`)
        return;
    }
    player.status = true;
    
    const room = ROOMS.roomList[player.roomCode];

    if (!room) {
        console.warn(`Room de l'utilisateur ${token} non retrouvé.`)
        return;
    }

    joinWS(ws, {roomCode: room.roomId, player: {name: player.name, avatar: player.avatar, token: player.token, status: player.status}});
}