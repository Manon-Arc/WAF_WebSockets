import { PLAYERS, ROOMS, WSS_CONNECTION } from "..";
import { InformationQuestion } from "../type";

export function nextQuestion(token: string) {

    const player = PLAYERS.get(token)!;
    const room = ROOMS.roomList[player.roomCode];
    const question = room.questionList.pop();
    const target = room.playerList[Math.floor(Math.random() * room.playerList.length)];

    if (!question) {
        console.error(`No more question in room ${room.roomId}`);
        return;
    }

    for (const player of room.playerList) {
        if (!player.status) continue;

        const ws = WSS_CONNECTION.get(player.token!);

        if (!ws) continue;

        const message:InformationQuestion = {
            type: 'information-question',
            data: {
                question: question,
                target: target
            }
        }

        ws.send(JSON.stringify(message));
    }
}