const backend = "http://localhost:3000/api/";

export const usePost = <T>(endpoint: string, token?: string | null) => {
  const addEntity = async (data: T) => {
    const response = await fetch(backend + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

export const useFormDataPost = (endpoint: string, token?: string | null) => {
  const addEntity = async (formData: FormData) => {
    const response = await fetch(backend + endpoint, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to add entity to ${endpoint}`);
    }
    return response.json();
  };
  return { addEntity };
};

export const usePatch = <T>(endpoint: string, token?: string | null) => {
  const patchEntity = async (id: string, data: T) => {
    const response = await fetch(backend + endpoint + `/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

export const useDelete = (endpoint: string, token?: string | null) => {
  const deleteEntity = async (id: string) => {
    const response = await fetch(backend + endpoint + `/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete entity from ${endpoint}`);
    }
    return response.json();
  };
  return { deleteEntity };
};
