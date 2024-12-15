"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let sockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (e) => {
        const parsedMessage = JSON.parse(e);
        if (parsedMessage.type === "join") {
            sockets.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
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
    });
});
