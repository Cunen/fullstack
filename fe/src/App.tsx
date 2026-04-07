import { useState } from "react";
import { useUsers } from "./queries/queries";
import { useAddUser } from "./mutations/mutations";

function App() {
  const { loading, data, refetch } = useUsers();
  const { addUser } = useAddUser();

  const [username, setUsername] = useState("");

  const handleAddUser = async () => {
    setUsername("");
    await addUser(username);
    refetch();
  };

  return (
    <>
      {loading ? "loading" : data}
      <input
        type="text"
        id="username"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleAddUser}>Add User</button>
      <button onClick={() => refetch()}>Refetch</button>
    </>
  );
}

export default App;
