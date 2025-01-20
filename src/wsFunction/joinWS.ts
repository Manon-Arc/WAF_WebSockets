import WebSocket from 'ws';
import {InformationJoin, JoinRoomType, ResponseJoin, RoomListType, ServerPlayerType} from "../type";
import {catchError, sendAllPlayer} from "../../global";

export function joinWS(ws: WebSocket, rooms: RoomListType, data: any, wssConnection: Map<String, WebSocket>) {
    try {
        console.info('Connexion à une room');
        let wasConnect = true;

        const dataPlayer: JoinRoomType = {...data};

        if (!Object.keys(rooms.roomList).includes(dataPlayer.roomCode)) {
            ws.send(JSON.stringify({error: "Room not found"}));
            return;
        }

        const room = rooms.roomList[dataPlayer.roomCode];

        let player = room.playerList.find((p) => p.token === dataPlayer.player.token);
        if (!player) { 
            wasConnect = false;
            player = {...dataPlayer.player, role: 'player'};
        }


        if (room.playerList.filter((player)=>player.status).length >= room.playerNumber) {
            // ! La room est pleine
            ws.send(JSON.stringify({error: "Room is full"}));
            return;
        }

        player.status = true;

        if (!wasConnect) {
            rooms.roomList[dataPlayer.roomCode].playerList.push(player);
        } else {
            rooms.roomList[dataPlayer.roomCode].playerList = room.playerList.map((p) => {
                if (p.token === dataPlayer.player.token) {
                    return player;
                }
                return p;
            });
        }


        const response: ResponseJoin = {
            type: 'join',
            data: {
                room: rooms.roomList[dataPlayer.roomCode]
            }
        } 
 
        ws.send(JSON.stringify(response));

        const information: InformationJoin = {
            type: 'information-join',
            data: {
                player: player
            }
        }
        sendAllPlayer(ws, rooms.roomList[dataPlayer.roomCode].playerList, wssConnection, JSON.stringify(information));
        
        console.log('A person joined the room');
    } catch (e) {
        catchError(ws, e);
    }
}

// function reconnect(ws: WebSocket, rooms: RoomListType, data: JoinRoomType, token: string,/* wsPlayerMap: Map<WebSocket, ServerPlayerType>*/) {
//     try {
//         const player = rooms.roomList[data.roomCode].playerList.find((p => p.token === data.player.token));
//         player!.status = true;
//         // const closePlayer: CloseWSPlayerType = {...player!, roomCode: data.roomCode};
//         // wsPlayerMap.set(ws, closePlayer);
//         ws.send(JSON.stringify({token: token}));
//         console.log(`The player ${data.player.name} reconnected to the room`);
//         console.log(rooms.roomList[data.roomCode].playerList);
//         return;
//     } catch (e) {
//         catchError(ws, e);
//     }
// }