import React, { useMemo } from "react";
import type { ReactNode } from "react";
import openSocket from "socket.io-client";
import SocketContext from "./socket.context";

interface Props {
  children: ReactNode;
}

const SocketProvider: React.FC<Props> = ({ children }) => {
  const socket = useMemo(() => {
    return openSocket("http://localhost:3000");
  }, []);

  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
