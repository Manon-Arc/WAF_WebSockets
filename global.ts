import WebSocket from "ws";
import {ServerPlayerType} from "./src/type";
import { WSS_CONNECTION } from "./src";

export const catchError = (ws: WebSocket, err: unknown) => {
    console.error(err);
    ws.send(JSON.stringify({ error: "Internal server catchError" }));
    return;
}

export const sendAllPlayer = (wsCurrentPlayer: WebSocket, roomPlayerList: Array<ServerPlayerType>, content: string) => {
    roomPlayerList.forEach((player) => {

        if (!player.status || !player.token) return;
        const wss = WSS_CONNECTION.get(player.token);

        if(!wss ||wsCurrentPlayer === wss) return;
        wss?.send(content);
    });
}