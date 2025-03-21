import WebSocket from 'ws';
import * as dotenv from 'dotenv';
import {ClientPlayerType, PlayerChoiceType, RoomListType, RoomType, ServerPlayerType} from './type';
import {catchError, sendAllPlayer} from "../global";
import {joinWS} from "./wsFunction/joinWS";
import {createWS} from "./wsFunction/createWS";
import {quitRoom} from "./wsFunction/quitRoom";
import { TokenGenerator } from 'ts-token-generator';
import { nextQuestion } from './wsFunction/nextQuestion';
import { restartRoom, updateRoom } from './wsFunction/room';
import { leaveRoom } from './wsFunction/leaveWS';

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

            console.warn("Requête de type " + type + " reçu")

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
                case 'leave':
                    leaveRoom(token!);
                    break;
                case 'next':
                    nextQuestion(token!);
                    break;
                case 'time-end':
                    const playert = PLAYERS.get(token!);
                    if (!playert) {
                        console.error('Player non reconnu');
                        break;
                    }
                    const roomt = ROOMS.roomList[playert!.roomCode];
                    if (!roomt) {
                        console.error('Aucune room associé au player');
                        break;
                    }
                    sendAllPlayer(null, roomt.playerList,JSON.stringify({
                        type: 'result',
                        data: {
                            choice: roomt.playersChoice,
                        }
                    }) );
                    
                    break;
                case 'update':
                    updateRoom(token!, data);
                    break;
                case 'restart':
                    restartRoom(token!);
                    break;
                case 'choice':
                    // Ajout du choix 
                    const player = PLAYERS.get(token!);
                    if (!player) {
                        console.error('Player non reconnu');
                        break;
                    }
                    const room = ROOMS.roomList[player!.roomCode];
                    if (!room) {
                        console.error('Aucune room associé au player');
                        break;
                    }
                    room.playersChoice?.push({
                        player: {
                            name: data.player.name,
                            avatar: data.player.avatar,
                            status: data.player.status
                        },
                        choice: data.choice
                    })

                    if (room.questionTarget?.every((p: ClientPlayerType)=> !p.status || room.playersChoice?.find((c: PlayerChoiceType)=>c.player.name == p.name))) {
                        // envoie un message pour indiqué que tous le monde a fait son choix
                        sendAllPlayer(null, room.playerList,JSON.stringify({
                            type: 'result',
                            data: {
                                choice: room.playersChoice,
                            }
                        }) );
                    }
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.error(e);
            catchError(ws, e);
        }
    });

    ws.on('close', () => {
        if (!token) return;
        quitRoom(ws, token);
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

    ws.send(JSON.stringify({type: 'identity', data: {name: player.name, avatar: player.avatar, token: player.token}}));

    
    const room = ROOMS.roomList[player.roomCode];

    if (!room) {
        console.warn(`Room de l'utilisateur ${token} non retrouvé.`)
        return;
    }

    console.warn("Reconnection à la room")

    joinWS(ws, {roomCode: room.roomId, player: {name: player.name, avatar: player.avatar, token: player.token, status: player.status}});
}