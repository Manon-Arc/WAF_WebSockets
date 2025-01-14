import * as dotenv from 'dotenv';

dotenv.config();

export default {
    getDareFilter: process.env.GET_DARE_FILTER,
}

export type RoomType = {
    roomId :number;
    roundNumber :number;
    playerNumber :number;
    gameMode :GameMode;
    bullyTime: boolean;
    roundTimeLimit :number;
    playerList : Array<ServerPlayerType>;
}

export type RoomTypeForClient = {
    player: PlayerHostType;
    roomParams: RoomParams;
}

export type JoinRoomType = {
    player :ClientPlayerType;
    roomCode :number;
};

export type RoomParams = {
    roundNumber :number;
    playerNumber :number;
    gameMode :GameMode;
    bullyTime: boolean;
    roundTimeLimit :number;
}

type PlayerHostType = {
    name :string;
    avatar :string;
};

export interface RoomListType {
    roomList: Record<number, RoomType>;
}

export type ServerPlayerType = {
  name :string;
  role :string;
  avatar :string;
  status :boolean;
  token: string;
};

export type ClientPlayerType = {
    name :string;
    avatar :string;
    token?: string;
};

export type CloseWSPlayerType = {
    name :string;
    role :string;
    avatar :string;
    status :boolean;
    roomCode :number;
    token: string;
};

export type MostLikelyToType = {
    percentageProbabilityChaos: number;
}

export type WouldYouRatherType = {

}

export type TruthOrDareType = {

}

export enum GameMode {
    "TruthOrDare",
    "WouldYouRather",
    "MostLikelyTo",
}