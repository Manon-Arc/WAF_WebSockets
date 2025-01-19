import WebSocket from 'ws';
import {InformationDisconnect, RoomListType, RoomType, ServerPlayerType} from '../type';
import {sendAllPlayer} from "../../global";

export function quitRoom(ws: WebSocket, token: String, rooms: RoomListType, wssConnection: Map<String, WebSocket>) {
    try {

        let room = null;
        for (const r of Object.values(rooms.roomList)) {
            if( r.playerList.find((p:ServerPlayerType) => p.token === token)){
                room = r;
                break;
            }
        }

        if (!room) {
            console.log('Room not found');
            return;
        }

        const players = room.playerList.map((player: ServerPlayerType) => {
            if (player.token === token) {
                player.status = false;
            }
            return player;
        });

        rooms.roomList[room.roomId] = {...room, playerList: players};

        console.table(rooms.roomList[room.roomId].playerList);
        
        const information: InformationDisconnect = {
            type: 'information-disconnect',
            data: {
                player: players.find((p: ServerPlayerType) => p.token === token)!
            }
        }

        sendAllPlayer(ws, room.playerList, wssConnection, JSON.stringify(information));
        console.log('A person left the room');
    } catch (e) {
        console.error(e);
        ws.send(JSON.stringify({error: "Internal server error"}));
        return;
    }

}