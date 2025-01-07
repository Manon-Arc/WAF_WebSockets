import WebSocket from "ws";

export const catchError = (ws: WebSocket, err: unknown) => {
    console.error(err);
    ws.send(JSON.stringify({ error: "Internal server catchError" }));
    return;
}