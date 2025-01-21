import WebSocket from "ws";
import {PlayerType, ResponseCreate, RoomListType, RoomType, ServerPlayerType} from "../type";
import {catchError} from "../../global";
import { PLAYERS, ROOMS } from "..";

export function createWS(ws: WebSocket, data: any) {
    try {
        const player: PlayerType = data.player;
        const roomParams = data.roomParams;

        let roomId = Math.floor(1000 + Math.random() * 9000)
        while (ROOMS.roomList.hasOwnProperty(roomId.toString())) {
            roomId = Math.floor(1000 + Math.random() * 9000)
        }

        const playerServer: ServerPlayerType = { ...player,
            role: 'host',
            status: true,
            roomCode: roomId.toString(),
        }


        let playerList: Array<ServerPlayerType> = [];
        playerList.push(playerServer);
        

        // ! Get les questions
        const questions = Array.from({ length: roomParams.roundNumber }, (_, i) => ({
            q_fr: `${roomParams.gameMode} Question ${i + 1}`,
            q_en: `${roomParams.gameMode} Question ${i + 1}`,
            cA_fr: `Réponse A Question ${i + 1}`,
            cB_fr: `Réponse B Question ${i + 1}`,
            cA_en: `Answer A Question ${i + 1}`,
            cB_en: `Answer B Question ${i + 1}`
        }));

        console.log(questions)
        

        let room: RoomType = {
            roomId: roomId.toString(),
            roundNumber: roomParams.roundNumber,
            playerNumber: roomParams.playerNumber,
            gameMode: roomParams.gameMode,
            bullyTime: roomParams.bullyTime,
            roundTimeLimit: roomParams.roundTimeLimit,
            playerList: playerList,
            questionList: questions
        };

        ROOMS.roomList[roomId] = {...room};

        const response: ResponseCreate = {
            type: 'create',
            data: {
                host: {name: player.name, avatar: player.avatar, status: true},
                roomParams: {...roomParams, roomCode: room.roomId},
                playerList: playerList
            }
        }

        PLAYERS.set(playerServer.token!, playerServer);
        ws.send(JSON.stringify(response));
    } catch (e) {
        catchError(ws, e);
    }

}