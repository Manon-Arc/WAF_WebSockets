import {InformationDisconnect, ServerPlayerType} from '../type';
import {sendAllPlayer} from "../../global";
import { PLAYERS, ROOMS, WSS_CONNECTION } from '..';

export function leaveRoom(token: String) {
    const player = PLAYERS.get(token);
    const ws = WSS_CONNECTION.get(token);

    if (!player || !ws) {
        console.warn('Pas de session utilisateur');
        return;
    }

    const room = ROOMS.roomList[player.roomCode];
    if (!room) {
        console.log('Room not found');
        return;
    }

    room.playerList = room.playerList.filter((p:ServerPlayerType)=> p.token != player.token);
    
    const information: InformationDisconnect = {
        type: 'information-leave',
        data: {
            player: {
                name: player.name,
                avatar: player.avatar,
                status: player.status
            }
        }
    }

    sendAllPlayer(ws, room.playerList, JSON.stringify(information));

    player.role = "";
    player.roomCode = "0000";
}