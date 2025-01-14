import WebSocket from 'ws';
import {TokenGenerator} from "ts-token-generator";
import {JoinRoomType, RoomListType, ServerPlayerType, CloseWSPlayerType} from "../type";
import {catchError} from "../../global";

export function joinWS (ws: WebSocket, rooms: RoomListType, data: any, wsPlayerMap: Map<WebSocket, ServerPlayerType>){
    try {
        const tokenGen = new TokenGenerator();
        const token = tokenGen.generate();
        const dataPlayer: JoinRoomType = data;
        const player = rooms.roomList[dataPlayer.roomCode].playerList.find((p => p.token === dataPlayer.player.token));
        console.log(rooms.roomList);
        if (!Object.keys(rooms.roomList).includes(dataPlayer.roomCode.toString())) {
            ws.send(JSON.stringify({ error: "Room not found" }));
            return;
        }
        if (rooms.roomList[dataPlayer.roomCode].playerList.length >= rooms.roomList[dataPlayer.roomCode].playerNumber) {
            if (player && !player.status) {
                reconnect(ws, rooms, dataPlayer, token, wsPlayerMap);
                return;
            }
            ws.send(JSON.stringify({ error: "Room is full" }));
            return;
        }
        if (player && player.status) {
            reconnect(ws, rooms, dataPlayer,token, wsPlayerMap);
        }
        let playerServer: ServerPlayerType = {name: dataPlayer.player.name, role: 'player', avatar: dataPlayer.player.avatar, status: true, token: token};
        rooms.roomList[dataPlayer.roomCode].playerList.push(playerServer);
        const closePlayer: CloseWSPlayerType = {...playerServer, roomCode: dataPlayer.roomCode};
        wsPlayerMap.set(ws, closePlayer);
            ws.send(JSON.stringify({token: token}));
        console.log(`Voici le token ${token}`)
        console.log({token: token});
        console.log('A person joined the room');
    }
    catch (e) {
        catchError(ws, e);
    }
}

function reconnect(ws: WebSocket, rooms: RoomListType, data: JoinRoomType, token: string, wsPlayerMap: Map<WebSocket, ServerPlayerType>) {
    try {
        const player = rooms.roomList[data.roomCode].playerList.find((p => p.token === data.player.token));
        player!.status = true;
        const closePlayer: CloseWSPlayerType = {...player!, roomCode: data.roomCode};
        wsPlayerMap.set(ws, closePlayer);
        ws.send(JSON.stringify({token: token}));
        console.log(`The player ${data.player.name} reconnected to the room`);
        console.log(rooms.roomList[data.roomCode].playerList);
        return;
    }
    catch (e) {
        catchError(ws, e);
    }
}