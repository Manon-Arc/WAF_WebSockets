import WebSocket from 'ws';
import {JoinRoomType, RoomListType, ServerPlayerType, CloseWSPlayerType} from "../type";
import {catchError} from "../../global";

export function joinWS (ws: WebSocket, rooms: RoomListType, data: any, wsPlayerMap: Map<WebSocket, ServerPlayerType>){
    try {
        const dataPlayer: JoinRoomType = data;
        console.log(rooms.roomList);
        if (!Object.keys(rooms.roomList).includes(dataPlayer.roomCode.toString())) {
            ws.send(JSON.stringify({ error: "Room not found" }));
            return;
        }
        if (rooms.roomList[dataPlayer.roomCode].playerList.length >= rooms.roomList[dataPlayer.roomCode].playerNumber) {
            ws.send(JSON.stringify({ error: "Room is full" }));
            return;
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