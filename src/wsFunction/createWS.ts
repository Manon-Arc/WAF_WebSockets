import WebSocket from "ws";
import {TokenGenerator} from "ts-token-generator";
import {RoomType, RoomListType, ServerPlayerType, RoomTypeForClient, CloseWSPlayerType} from "../type";
import {catchError} from "../../global";

export function createWS(ws: WebSocket, dataPlayer: any, rooms: RoomListType, wsPlayerMap: Map<WebSocket, ServerPlayerType>) {
    try {
        const tokenGen = new TokenGenerator();
        const token = tokenGen.generate();
        const createRoom: RoomTypeForClient = dataPlayer;
        let roomId = Math.floor(1000 + Math.random() * 9000)
        while (rooms.roomList.hasOwnProperty(roomId)) {
            roomId = Math.floor(1000 + Math.random() * 9000)
        }
        let playerServer: ServerPlayerType = {name: createRoom.player.name, role: 'host', avatar: createRoom.player.name, status: true, token: token};
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
        const closePlayer: CloseWSPlayerType = {...playerServer, roomCode: dataPlayer.roomCode};
        wsPlayerMap.set(ws, closePlayer);
        console.log(room)
        console.log(`Voici le token ${token}`)
        rooms.roomList[roomId] = { ...room};
        ws.send(JSON.stringify({ roomId: roomId }));
    }
    catch (e) {
        catchError(ws, e);
    }

}