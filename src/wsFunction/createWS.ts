import WebSocket from "ws";
import {RoomType, RoomListType, ServerPlayerType, RoomTypeForClient} from "../type";
import {catchError} from "../../global";

export function createWS(ws: WebSocket, dataPlayer: any, rooms: RoomListType) {
    try {
        const createRoom: RoomTypeForClient = dataPlayer;
        let roomId = Math.floor(1000 + Math.random() * 9000)
        while (rooms.roomList.hasOwnProperty(roomId)) {
            roomId = Math.floor(1000 + Math.random() * 9000)
        }
        let playerServer: ServerPlayerType = {name: createRoom.player.name, role: 'host', avatar: createRoom.player.name, status: true};
        let playerList: Array<ServerPlayerType> = [];
        playerList.push(playerServer);
        let room:RoomType = {
            roomId: roomId,
            roundNumber: createRoom.roomParams.roundNumber,
            playerNumber: createRoom.roomParams.playerNumber,
            gameMode: createRoom.roomParams.gameMode,
            bullyTime: createRoom.roomParams.bullyTime,
            roundTimeLimit: createRoom.roomParams.roundTimeLimit,
            playerList: playerList
        };
        console.log(room)
        rooms.roomList[roomId] = { ...room};
        ws.send(JSON.stringify({ roomId: roomId }));
    }
    catch (e) {
        catchError(ws, e);
    }

}