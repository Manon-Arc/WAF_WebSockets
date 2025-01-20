import WebSocket from "ws";
import {PlayerType, ResponseCreate, RoomListType, RoomType, ServerPlayerType} from "../type";
import {catchError} from "../../global";

export function createWS(ws: WebSocket, data: any, rooms: RoomListType, wssConnection: Map<String, WebSocket>) {
    try {

        console.log("Creation d'une room")

        const player: PlayerType = data.player;
        const roomParams = data.roomParams;

        console.table(player)
        console.table(roomParams)


        let roomId = Math.floor(1000 + Math.random() * 9000)
        while (rooms.roomList.hasOwnProperty(roomId.toString())) {
            roomId = Math.floor(1000 + Math.random() * 9000)
        }

        const playerServer: ServerPlayerType = { ...player,
            role: 'host',
            status: true
        }

        console.table(playerServer)


        let playerList: Array<ServerPlayerType> = [];
        playerList.push(playerServer);

        let room: RoomType = {
            roomId: roomId.toString(),
            roundNumber: roomParams.roundNumber,
            playerNumber: roomParams.playerNumber,
            gameMode: roomParams.gameMode,
            bullyTime: roomParams.bullyTime,
            roundTimeLimit: roomParams.roundTimeLimit,
            playerList: playerList
        };

        console.table(room)
        rooms.roomList[roomId] = {...room};

        const response: ResponseCreate = {
            type: 'create',
            data: {
                room: room,
            }
        }

        ws.send(JSON.stringify(response));
    } catch (e) {
        catchError(ws, e);
    }

}