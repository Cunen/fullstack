import { createContext } from "react";
import type { Socket } from "socket.io-client";

export interface SocketContextType {
  socket: Socket;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export default SocketContext;
