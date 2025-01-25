import { PLAYERS, ROOMS, WSS_CONNECTION } from "..";
import { ClientPlayerType, GameMode, InformationQuestion, PlayerType, QuestionType, RoomType, ServerPlayerType } from "../type";

export function nextQuestion(token: string) {

    const player = PLAYERS.get(token)!;
    const room = ROOMS.roomList[player.roomCode];
    const question = getQuestion(room);
    const target = getTarget(room);

    if (!target) return

    if (!question) {
        // ! Partie fini pas de question disponible (normalement on a coupé avant)
        console.error(`No more question in room ${room.roomId}`);
        return;
    }

    room.currentQuestion = question;
    room.playersChoice = [];
    room.questionTarget = target;

    console.log(target)


    for (const player of room.playerList) {
        if (!player.status) continue;

        const ws = WSS_CONNECTION.get(player.token!);

        if (!ws) continue;

        const message:InformationQuestion = {
            type: 'information-question',
            data: {
                question: question,
                target: target,
                isLastQuestion: room.questionList.length == 0,
            }
        }

        ws.send(JSON.stringify(message));
    }
}


/**
 * 
 * En fonction du mode de jeu
 * 
 * @case GameMode.TruthOrDare (Action ou Vérité)
 * Récupère une personne au hasard (une seule personne répond)
 * 
 * @case GameMode.MostLikelyTo (Qui pourrait)
 * Tout le monde donne son avis
 * 
 * @case GameMode.NeverHaveI (Je n'ai jamais)
 * Tout le monde donne son avis
 * 
 * @case GameMode.WouldYouRather (Tu préfères)
 * Récupère une personne au hasard (une seule personne répond)
 * 
 * @returns Les personnes devant répondre dans une liste.
 */
function getTarget(room: RoomType):ClientPlayerType[] | undefined {
    let returnValue;

    switch (room.gameMode.toString()) {
        case GameMode[+GameMode.MostLikelyTo]:
            returnValue = room.playerList.filter((selectedPlayer: ServerPlayerType)=>selectedPlayer.status)
                .map((serverPlayer: ServerPlayerType): ClientPlayerType => (
                    {
                        name: serverPlayer.name, 
                        avatar: serverPlayer.avatar, 
                        status: serverPlayer.status
                    }
                )
            );
            break;
        case GameMode[+GameMode.NeverHaveI]:
            returnValue = room.playerList.filter((selectedPlayer: ServerPlayerType)=>selectedPlayer.status)
                                .map((serverPlayer: ServerPlayerType): ClientPlayerType => (
                                {
                                    name: serverPlayer.name, 
                                    avatar: serverPlayer.avatar, 
                                    status: serverPlayer.status
                                }
                            )
                        );
                        break;

        case GameMode[+GameMode.TruthOrDare]:
            const tod = room.playerList[Math.floor(Math.random() * room.playerList.length)];
            returnValue = [{
                name: tod.name,
                avatar: tod.avatar,
                status: tod.status
            }];
            break;

        case GameMode[+GameMode.WouldYouRather]:
            const wyr = room.playerList[Math.floor(Math.random() * room.playerList.length)];
            returnValue = [{
                name: wyr.name,
                avatar: wyr.avatar,
                status: wyr.status
            }];
            break;
    }

    return returnValue;
}

function getQuestion(room: RoomType): QuestionType | undefined {
    const question = room.questionList.pop();

    if (!question) return;

    if (room.gameMode.toString() == GameMode[+GameMode.MostLikelyTo]) {
        const c_1 = room.playerList[Math.floor(Math.random() * room.playerList.length)].name;
        let c_2 = room.playerList[Math.floor(Math.random() * room.playerList.length)].name;
        while (c_1 == c_2) {
            c_2 = room.playerList[Math.floor(Math.random() * room.playerList.length)].name;
        }

        question!.cA_en = question!.cA_fr = c_1;
        question!.cB_en = question!.cB_fr = c_2;
    }


    return question;
}