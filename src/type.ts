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
    data: {
        room: RoomType;
    }
}

export type ResponseJoin = Message & {
    data: {
        room: RoomType
    }
}

export type InformationJoin = Message & {
    data: {
        player: ServerPlayerType;
    }
}

export type InformationDisconnect = Message & {
    data: {
        player: ServerPlayerType;
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
    bullyTime: boolean;
    roundTimeLimit: number;
    playerList: Array<ServerPlayerType>;
}

export type JoinRoomType = {
    player: PlayerType;
    roomCode: string;
};

export type RoomParams = {
    roundNumber: number;
    playerNumber: number;
    gameMode: GameMode;
    bullyTime: boolean;
    roundTimeLimit: number;
}

export interface RoomListType {
    roomList: Record<string, RoomType>;
}

export type ServerPlayerType = PlayerType & {
    role: string;
};

export type PlayerType = {
    name: string;
    avatar: string;
    token?: string;
    status: boolean;
};






export type MostLikelyToType = {
    percentageProbabilityChaos: number;
}

export type WouldYouRatherType = {}

export type TruthOrDareType = {}

export enum GameMode {
    "TruthOrDare",
    "WouldYouRather",
    "MostLikelyTo",
}