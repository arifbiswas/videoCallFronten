import Peer from "peerjs";
import { io } from "socket.io-client";

const PORT = 9090;
// Socket.io client setup 
export const socket = io(`http://localhost:${PORT}`,{
  extraHeaders : { 'Accept': 'application/json' }
});


export const peer  = new Peer({
  host: 'localhost',
  port: PORT + 1,
  path: '/'
});
