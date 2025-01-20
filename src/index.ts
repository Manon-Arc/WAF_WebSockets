import WebSocket from 'ws';
import * as dotenv from 'dotenv';
import {RoomListType, RoomType, ServerPlayerType} from './type';
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
    let token: string|null;
    let roomCode: string|null;
    let player: ServerPlayerType|null;
    let room: RoomType|null;


    console.info('WS : Nouvelle connexion');

    ws.on('message', receiveData => {
        try {
            const {type, data}: { type: string, data: any } = JSON.parse(receiveData.toString());

            console.group('Nouveau message');
            console.log(`Type : ${type}`);
            console.log(`Data : ${data}`);
            console.groupEnd();


            switch (type) {
                case 'connection':
                    token = connectWs(ws, data);
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

/**
 * Reconnect le joueur au compte lié au token reçu.
 * Si aucune session n'est trouvé, reprend la voie classique.
 * 
 * @returns Le token de l'utilisateur.
 */
function reconnectWs(ws: WebSocket, token: string) {
    console.group("ReconnectWS");
    console.log(`Token : ${token}`);

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
        console.warn(`Session de l'utilisateur ${token} non retrouvé.`)
        console.groupEnd()
        return;
    }

    console.log(`Room : ${room}`)
    console.log(`Player : ${player}`)

    joinWS(ws, rooms, {roomCode: room.roomId, player: player}, wssConnection);
}