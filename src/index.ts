import WebSocket from 'ws';
import {RoomList, ClientRoom, ServerRoom, ClientPlayer, ServerPlayer, PlayerList} from '../type';
import { randomUUID } from 'crypto';


const rooms:RoomList = {roomList: []};
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);
    wss.clients.forEach((client) => {
      client.send(`Server received your message: ${message}`);
    });
  });

  ws.on('create', (roomParams: ClientRoom, player: ClientPlayer) => {
    console.log(`Create room receive: ${roomParams}`);
    const uuid = randomUUID().toString();
    let roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    rooms.roomList.forEach((room) => {
        while (room.roomCode === roomCode) {
            roomCode = Math.floor(1000 + Math.random() * 9000).toString();
        }
    });
    let playerServer: ServerPlayer = {name: player.name, role: 'host', avatar: player.avatar, status: true};
    let playerList: PlayerList = {playerList: []};
    playerList.playerList.push(playerServer);
    let room:ServerRoom = {
        roomId:uuid,
        roomCode: roomCode, 
        roundNumber: roomParams.roundNumber, 
        playerNumber: roomParams.playerNumber, 
        gameMode: roomParams.gameMode, 
        bullyTime: roomParams.bullyTime, 
        roundTimeLimit: roomParams.roundTimeLimit, 
        playerList: playerList
    };
    rooms.roomList.push(room); 
    ws.send(JSON.stringify({ roomCode: roomCode }));
  });

  ws.on('join', (player : ClientPlayer) => {
    console.log('Join room receive');
    let playerServer: ServerPlayer = {name: player.name, role: 'player', avatar: player.avatar, status: true};
    let playerList: PlayerList = {playerList: []};
    playerList.playerList.push(playerServer);

  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});