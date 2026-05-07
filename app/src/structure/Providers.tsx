import AuthProvider from "../providers/Auth/auth.provider";
import Sidebar from "./Sidebar";
import SocketProvider from "../providers/socket/socket.provider";

export function Providers() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Sidebar />
      </SocketProvider>
    </AuthProvider>
  );
}
