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
    bullyTime: boolean;
    roundTimeLimit: number;
    playerList: Array<ServerPlayerType>;
}

export type RoomTypeForClient = {
    host: ClientPlayerType;
    roomParams: RoomParams;
    playerList: Array<ClientPlayerType>;
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

export enum GameMode {
    "TruthOrDare",
    "WouldYouRather",
    "MostLikelyTo",
}