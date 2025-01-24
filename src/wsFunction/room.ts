import { PLAYERS, ROOMS } from "..";
import { sendAllPlayer } from "../../global";
import { InformationUpdate } from "../type";

export function updateRoom(token: string, data: any) {
        const roomParams = data.roomParams;
        const player = PLAYERS.get(token);

        if (!player) {
            console.error('Pas de session utilisateur trouvé');
            return;
        }

        let room = ROOMS.roomList[player.roomCode];

        if (!room){
            console.error('Pas de room trouvé');
            return
        }


        // ! Get les questions
        const questions = Array.from({ length: roomParams.roundNumber }, (_, i) => ({
            q_fr: `${roomParams.gameMode} Question ${i + 1}`,
            q_en: `${roomParams.gameMode} Question ${i + 1}`,
            cA_fr: `Réponse A Question ${i + 1}`,
            cB_fr: `Réponse B Question ${i + 1}`,
            cA_en: `Answer A Question ${i + 1}`,
            cB_en: `Answer B Question ${i + 1}`
        }));

        room = {...room, ...roomParams, questionList: questions, currentQuestion: null, playersChoice: null, questionTarget: null}
        

        const response: InformationUpdate = {
            type: 'information-update',
            data: roomParams
        }

        sendAllPlayer(null ,room.playerList, JSON.stringify(response));
}