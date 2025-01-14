import WebSocket from "ws";
import {ServerPlayerType} from "./src/type";

export const catchError = (ws: WebSocket, err: unknown) => {
    console.error(err);
    ws.send(JSON.stringify({ error: "Internal server catchError" }));
    return;
}

export const sendAllPlayer = (wsCurrentPlayer: WebSocket, roomPlayerList: Array<ServerPlayerType>, content: string) => {
    roomPlayerList.forEach((player) => {
        if (player.webSocket !== wsCurrentPlayer && player.status) {
            player.webSocket.send(content);
        }
    });
}