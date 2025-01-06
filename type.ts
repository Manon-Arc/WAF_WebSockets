export type ServerRoom = {
    roomId :string;
    roomCode :string;
    roundNumber :number;
    playerNumber :number;
    gameMode :GameMode;
    bullyTime: boolean;
    roundTimeLimit :number;
    playerList : PlayerList;
}

export type ClientRoom = {
    roundNumber :number;
    playerNumber :number;
    gameMode :GameMode;
    bullyTime: boolean;
    roundTimeLimit :number;
}

export type RoomList = {
    roomList : ServerRoom[];
}

export type ServerPlayer = {
  name :string;
  role :string;
  avatar :string;
  status :boolean;
};

export type ClientPlayer = {
    name :string;
    avatar :string;
  };

export type PlayerList = {
    playerList : ServerPlayer[];
}

export type MostLikelyTo = {
    percentageProbabilityChaos: number;
}

export type WouldYouRather = {

}

export type TruthOrDare = {

}

export enum GameMode {
    "TruthOrDare",
    "WouldYouRather",
    "MostLikelyTo",
}