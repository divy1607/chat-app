import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let sockets: User[] = [];

wss.on("connection", (socket) => {
    socket.on("message", (e) => {
        const parsedMessage = JSON.parse(e as unknown as string);
        if (parsedMessage.type === "join") {
            sockets.push({
                socket,
                room: parsedMessage.payload.roomId,
            })
        }

        if (parsedMessage.type === "chat") {

            let currentUserRoom = null;
            for (let i = 0; i < sockets.length; i++) {
                if (sockets[i].socket == socket) {
                    currentUserRoom = sockets[i].room;
                }
            }

            for (let i = 0; i < sockets.length; i++) {
                if (sockets[i].room == currentUserRoom) {
                    sockets[i].socket.send(parsedMessage.payload.message);
                }
            }

        }
    })

})