import WebSocket from 'ws';
import {InformationJoin, JoinRoomType, ResponseJoin} from "../type";
import {catchError, sendAllPlayer} from "../../global";
import { PLAYERS, ROOMS } from '..';

export function joinWS(ws: WebSocket, data: any) {
    try {
        const dataPlayer: JoinRoomType = {...data};

        if (!Object.keys(ROOMS.roomList).includes(dataPlayer.roomCode)) {
            ws.send(JSON.stringify({error: "Room not found"}));
            return;
        }

        const room = ROOMS.roomList[dataPlayer.roomCode];

        let player = room.playerList.find((p) => p.token === dataPlayer.player.token);

        const isReconnecting = player ? true : false;

        if (!player) { 
            player = {...dataPlayer.player, role: 'player', roomCode: dataPlayer.roomCode};
        } else {
            player.status = true;
        }


        if (room.playerList.filter((player)=>player.status).length >= room.playerNumber) {
            // ! La room est pleine
            ws.send(JSON.stringify({error: "Room is full"}));
            return;
        }

        player.status = true;

        if (!isReconnecting) {
            ROOMS.roomList[dataPlayer.roomCode].playerList.push(player);
        } else {
            ROOMS.roomList[dataPlayer.roomCode].playerList = room.playerList.map((p) => {
                if (p.token === dataPlayer.player.token) {
                    return player;
                }
                return p;
            });
        }


        const response: ResponseJoin = {
            type: 'join',
            data: {
                host: room.playerList.find((p) => p.role === 'host')!,
                roomParams: {roundNumber: room.roundNumber, roomCode: room.roomId, playerNumber: room.playerNumber, gameMode: room.gameMode, bullyTime: room.bullyTime, roundTimeLimit: room.roundTimeLimit},
                playerList: room.playerList
            }
        } 
 
        PLAYERS.set(player.token!, player);

        ws.send(JSON.stringify(response));

        const information: InformationJoin = {
            type: isReconnecting ? 'information-reconnect' : 'information-join',
            data: {
                player: {name: player.name, avatar: player.avatar, status: player.status}
            }
        }
        sendAllPlayer(ws, ROOMS.roomList[dataPlayer.roomCode].playerList, JSON.stringify(information));
        
        console.log('A person joined the room');
    } catch (e) {
        catchError(ws, e);
    }
}