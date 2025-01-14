import WebSocket from 'ws';
import {CloseWSPlayerType, RoomListType} from '../type';

export function quitRoom(ws: WebSocket, player: CloseWSPlayerType | undefined, rooms: RoomListType, wsPlayerMap: Map<WebSocket, any>) {
    try {
        if (!player) {
            ws.send(JSON.stringify({ information: "Player kill the connection" }));
            console.log('Player kill the connection');
            return;
        }
        const room = rooms.roomList[player.roomCode];
        if (!room) {
            ws.send(JSON.stringify({ error: "Room not found" }));
            console.log('Room not found');
            return;
        }
        const playerIndex = room.playerList.findIndex((p) => p.name === player.name);
        if (playerIndex === -1) {
            ws.send(JSON.stringify({ error: "Player not found" }));
            console.log('Player not found');
            return;
        }
        room.playerList[playerIndex].status = false;
        console.log(room.playerList);
        wsPlayerMap.delete(ws);
        console.log('A person left the room');
    }
    catch (e) {
        console.error(e);
        ws.send(JSON.stringify({ error: "Internal server error" }));
        return;
    }
    
}