type Room = {
    roomId :string;
    roundNumber :number;
    playerNumber :number;
    gameMode :GameMode;
    bullyTime: boolean;
    roundTimeLimit :number;
    playerList : PlayerList;
}

type RoomList = {
    roomList : Room[];
}

type Player = {
  name :string;
  role :string;
  avatar :string;
  status :boolean;
};

type PlayerList = {
    playerList : Player[];
}

type MostLikelyTo = {
    percentageProbabilityChaos: number;
}

type WouldYouRather = {

}

type TruthOrDare = {

}

enum GameMode {
    "TruthOrDare",
    "WouldYouRather",
    "MostLikelyTo",
}