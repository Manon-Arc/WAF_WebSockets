import WebSocket from 'ws';
import {InformationDisconnect, RoomListType, RoomType, ServerPlayerType} from '../type';
import {sendAllPlayer} from "../../global";
import { PLAYERS, WSS_CONNECTION } from '..';

export function quitRoom(ws: WebSocket, token: String, rooms: RoomListType) {
    try {
        WSS_CONNECTION.delete(token);
        const player = PLAYERS.get(token);

        if (!player) {
            ws.send(JSON.stringify({information: "Player kill the connection"}));
            console.warn('Player kill the connection');
            return;
        }

        const room = rooms.roomList[player.roomCode];
        if (!room) {
            ws.send(JSON.stringify({error: "Room not found"}));
            console.log('Room not found');
            return;
        }

        const playerIndex = room.playerList.findIndex((p) => p.token === token);
        if (playerIndex === -1) {
            ws.send(JSON.stringify({error: "Player not found"}));
            console.log('Player not found');
            return;
        }
        room.playerList[playerIndex].status = false;
        
        const information: InformationDisconnect = {
            type: 'information-disconnect',
            data: {
                player: room.playerList[playerIndex]
            }
        }

        sendAllPlayer(ws, room.playerList, JSON.stringify(information));
        console.log('A person left the room');
    } catch (e) {
        console.error(e);
        ws.send(JSON.stringify({error: "Internal server error"}));
        return;
    }

}