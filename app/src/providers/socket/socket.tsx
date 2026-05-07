import { useContext } from "react";
import SocketContext from "./socket.context";

const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};

export default useSocket;
