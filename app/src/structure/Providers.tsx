import AuthProvider from "../providers/Auth/auth.provider";
import Sidebar from "./Sidebar";

export function Providers() {
  return (
    <AuthProvider>
      <Sidebar />
    </AuthProvider>
  );
}
