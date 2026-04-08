import { useMemo, useState } from "react";
import { useLocations, useUsers } from "./queries/queries";
import { useAddUser } from "./mutations/mutations";

import { Button } from "webcomponents";

function App() {
  const { loading, data, refetch } = useUsers();

  const { data: locationsData } = useLocations();
  const locations = useMemo(() => locationsData || [], [locationsData]);

  console.log(locations, locationsData);

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
      <Button text="Add User" click={handleAddUser} />
      <Button text="Refetch" click={refetch} />
    </>
  );
}

export default App;
