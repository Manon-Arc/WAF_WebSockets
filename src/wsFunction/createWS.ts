import WebSocket from "ws";
import {GameMode, PlayerType, QuestionType, ResponseCreate, RoomListType, RoomType, ServerPlayerType} from "../type";
import {catchError} from "../../global";
import { PLAYERS, ROOMS } from "..";
import {fetchQuestions, fetchQuestionsTruthOrDare} from "../apiFunction/request";

export async function createWS(ws: WebSocket, data: any) {
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
        

        let questions:Array<QuestionType> = [];
        if (roomParams.gameMode == GameMode[+GameMode.TruthOrDare]) {
            questions = await fetchQuestionsTruthOrDare(roomParams.difficulty, roomParams.roundNumber);
        } else {
            questions = await fetchQuestions(roomParams.gameMode, roomParams.difficulty, roomParams.roundNumber);
        }

        let room: RoomType = {
            roomId: roomId.toString(),
            roundNumber: roomParams.roundNumber,
            playerNumber: roomParams.playerNumber,
            gameMode: roomParams.gameMode,
            difficulty: roomParams.difficulty,
            bullyTime: roomParams.bullyTime,
            roundTimeLimit: roomParams.roundTimeLimit,
            playerList: playerList,
            questionList: questions,
            currentQuestion: null,
            playersChoice: null,
            questionTarget: null,
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

        console.log('Nouvelle room')
        console.table(room)

        PLAYERS.set(playerServer.token!, playerServer);
        ws.send(JSON.stringify(response));
    } catch (e) {
        catchError(ws, e);
    }

}