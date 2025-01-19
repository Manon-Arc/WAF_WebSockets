import WebSocket from "ws";
import {PlayerType, ResponseCreate, RoomListType, RoomType, ServerPlayerType} from "../type";
import {catchError} from "../../global";

export function createWS(ws: WebSocket, data: any, rooms: RoomListType, wssConnection: Map<String, WebSocket>) {
    try {

        console.info('Creating room');

        const player: PlayerType = data.player;
        const roomParams = data.roomParams;


        let roomId = Math.floor(1000 + Math.random() * 9000)
        while (rooms.roomList.hasOwnProperty(roomId.toString())) {
            roomId = Math.floor(1000 + Math.random() * 9000)
        }

        const playerServer: ServerPlayerType = { ...player,
            role: 'host',
            status: true
        }


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

        console.log(room)
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