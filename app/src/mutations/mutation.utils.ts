const backend = "http://localhost:3000/api/";

export const usePost = <T>(endpoint: string) => {
  const addEntity = async (data: T) => {
    const response = await fetch(backend + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to add entity to ${endpoint}`);
    }
    return response.json();
  };
  return { addEntity };
};

export const usePatch = <T>(endpoint: string) => {
  const patchEntity = async (id: string, data: T) => {
    const response = await fetch(backend + endpoint + `/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to patch entity to ${endpoint}`);
    }
    return response.json();
  };
  return { patchEntity };
};

export const useDelete = (endpoint: string) => {
  const deleteEntity = async (id: string) => {
    const response = await fetch(backend + endpoint + `/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete entity from ${endpoint}`);
    }
    return response.json();
  };
  return { deleteEntity };
};
