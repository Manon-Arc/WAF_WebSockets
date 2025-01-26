import * as dotenv from 'dotenv';
import WebSocket from "ws";

dotenv.config();

export default {
    getDareFilter: process.env.GET_DARE_FILTER,
}

export type Message = {
    type: string;
}

export type ResponseCreate = Message & {
    data: RoomTypeForClient;
}

export type ResponseJoin = Message & {
    data: RoomTypeForClient;
}

export type InformationUpdate = Message & {
    data: RoomParams;
}

export type InformationNameChange = Message & {
    data: {
        name: string
    }
}

export type InformationQuestion = Message & {
    data: {
        question: QuestionType;
        target: ClientPlayerType[] | null;
        isLastQuestion: boolean;
        gameMode: GameMode;
    }
}

export type InformationJoin = Message & {
    data: {
        player: ClientPlayerType;
    }
}

export type InformationDisconnect = Message & {
    data: {
        player: ClientPlayerType;
    }
}

export type ResponseConnection = Message & {
    data: {
        token: string;
    }
}

export type RoomType = {
    roomId: string;
    roundNumber: number;
    playerNumber: number;
    gameMode: GameMode;
    difficulty: Difficulty;
    bullyTime: boolean;
    roundTimeLimit: number;
    playerList: Array<ServerPlayerType>;
    questionList: Array<QuestionType>;
    currentQuestion: QuestionType | null;
    playersChoice:Array<PlayerChoiceType> | null;
    questionTarget: Array<ClientPlayerType> | null;
}

export type PlayerChoiceType = {
    player: PlayerType;
    choice: number;
}

export type RoomTypeForClient = {
    host: ClientPlayerType;
    roomParams: RoomParams;
    playerList: Array<ClientPlayerType>;
}

export type QuestionType = {
    q_fr: string;
    q_en: string;
    cA_fr: string;
    cB_fr: string;
    cA_en: string;
    cB_en: string;
}

export type JoinRoomType = {
    player: PlayerType;
    roomCode: string;
};

export type RoomParams = {
    roomCode: string;
    roundNumber: number;
    playerNumber: number;
    gameMode: GameMode;
    difficulty: Difficulty;
    bullyTime: boolean;
    roundTimeLimit: number;
}

export interface RoomListType {
    roomList: Record<string, RoomType>;
}

export type ServerPlayerType = PlayerType & {
    role: string;
    roomCode: string;
};

export type PlayerType = ClientPlayerType & {
    token?: string;
};

export type ClientPlayerType = {
    name: string;
    avatar: string;
    status: boolean;
}


export type MostLikelyToType = {
    percentageProbabilityChaos: number;
}

export type WouldYouRatherType = {}

export type TruthOrDareType = {}

export type NeverHaveIType = {}

export enum GameMode {
    "TruthOrDare",
    "WouldYouRather",
    "MostLikelyTo",
    "NeverHaveI"
}

export enum Difficulty {
    "Hot",
    "Soft"
}

export enum ErrorType {
    roomFull = "Room is full",
    roomNotFound = "Room not found",
}