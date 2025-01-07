import WebSocket from "ws";
import type from "../type";
import {catchError} from "../../global";

export function dareWS(ws: WebSocket, dataPlayer: any) {
    try {
        console.log(`Dare received: ${dataPlayer}`);
        fetch(type.getDareFilter + `?number=${dataPlayer}`).then(r =>
            r.json().then(data => {
                ws.send(data);
            }));
    }
    catch (e) {
        catchError(ws, e);
    }
}