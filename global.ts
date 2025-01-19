import WebSocket from "ws";
import {ServerPlayerType} from "./src/type";

export const catchError = (ws: WebSocket, err: unknown) => {
    console.error(err);
    ws.send(JSON.stringify({ error: "Internal server catchError" }));
    return;
}

export const sendAllPlayer = (wsCurrentPlayer: WebSocket, roomPlayerList: Array<ServerPlayerType>, wssConnection: Map<String, WebSocket>,content: string) => {
    roomPlayerList.forEach((player) => {

        if (!player.status || !player.token) return;
        const wss = wssConnection.get(player.token);

        if(!wss ||wsCurrentPlayer === wss) return;
        wss?.send(content);
    });
}