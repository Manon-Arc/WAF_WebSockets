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

    if (!ROOMS.roomList[player.roomCode].playerList.find((p: ServerPlayerType)=> p.status)) {
        delete ROOMS.roomList[player.roomCode];
    }

    sendAllPlayer(ws, room.playerList, JSON.stringify(information));

    if (player.role == "host") {
        let newHost =  room.playerList.find((p)=>p.status);
        newHost!.role = "host";


        const information = {
            type: 'information-newhost',
            data: {
                player: {
                    name: newHost!.name,
                    avatar: newHost!.avatar,
                    status: newHost!.status
                }
            }
        }
        sendAllPlayer(null, room.playerList, JSON.stringify(information));
        console.warn("L'host c'est déconnecter");
    }

    player.role = "";
    player.roomCode = "0000";
}