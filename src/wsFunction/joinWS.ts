import WebSocket from 'ws';
import {JoinRoomType, RoomListType, ServerPlayerType} from "../type";
import {catchError} from "../../global";

export function joinWS (ws: WebSocket, rooms: RoomListType, data: any){
    try {
        const dataPlayer: JoinRoomType = data;
        console.log(rooms.roomList);
        if (!Object.keys(rooms.roomList).includes(dataPlayer.roomCode.toString())) {
            ws.send(JSON.stringify({ error: "RoomType not found" }));
            return;
        }
        let playerServer: ServerPlayerType = {name: dataPlayer.player.name, role: 'player', avatar: dataPlayer.player.avatar, status: true};
        rooms.roomList[dataPlayer.roomCode].playerList.push(playerServer);
        ws.send(rooms.roomList[dataPlayer.roomCode].roomId);
        console.log(rooms.roomList[dataPlayer.roomCode].playerList);
        console.log('A person joined the room');
    }
    catch (e) {
        catchError(ws, e);
    }
}