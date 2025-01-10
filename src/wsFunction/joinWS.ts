import WebSocket from 'ws';
import {JoinRoomType, RoomListType, ServerPlayerType, CloseWSPlayerType} from "../type";
import {catchError} from "../../global";

export function joinWS (ws: WebSocket, rooms: RoomListType, data: any, wsPlayerMap: Map<WebSocket, ServerPlayerType>){
    try {
        const dataPlayer: JoinRoomType = data;
        const player = rooms.roomList[dataPlayer.roomCode].playerList.find((p => p.name === dataPlayer.player.name));
        console.log(rooms.roomList);
        if (!Object.keys(rooms.roomList).includes(dataPlayer.roomCode.toString())) {
            ws.send(JSON.stringify({ error: "Room not found" }));
            return;
        }
        if (rooms.roomList[dataPlayer.roomCode].playerList.length >= rooms.roomList[dataPlayer.roomCode].playerNumber) {
            if (player && !player.status) {
                reconnect(ws, rooms, dataPlayer, wsPlayerMap);
                return;
            }
            ws.send(JSON.stringify({ error: "Room is full" }));
        }
        if (player && player.status) {
            reconnect(ws, rooms, dataPlayer, wsPlayerMap);
        }
        let playerServer: ServerPlayerType = {name: dataPlayer.player.name, role: 'player', avatar: dataPlayer.player.avatar, status: true};
        rooms.roomList[dataPlayer.roomCode].playerList.push(playerServer);
        const closePlayer: CloseWSPlayerType = {...playerServer, roomCode: dataPlayer.roomCode};
        wsPlayerMap.set(ws, closePlayer);
        ws.send(rooms.roomList[dataPlayer.roomCode].roomId);
        console.log(rooms.roomList[dataPlayer.roomCode].playerList);
        console.log('A person joined the room');
    }
    catch (e) {
        catchError(ws, e);
    }
}

function reconnect(ws: WebSocket, rooms: RoomListType, data: JoinRoomType, wsPlayerMap: Map<WebSocket, ServerPlayerType>) {
    try {
        const player = rooms.roomList[data.roomCode].playerList.find((p => p.name === data.player.name));
            player!.status = true;
            const closePlayer: CloseWSPlayerType = {...player!, roomCode: data.roomCode};
            wsPlayerMap.set(ws, closePlayer);
            ws.send(rooms.roomList[data.roomCode].roomId);
            console.log(`The player ${data.player.name} reconnected to the room`);
            console.log(rooms.roomList[data.roomCode].playerList);
            return;
    }
    catch (e) {
        catchError(ws, e);
    }
}