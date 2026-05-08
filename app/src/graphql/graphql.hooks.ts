import { useCallback, useEffect, useState } from "react";

const backend = "http://localhost:3000/";

export function useGraphQLQuery<T>(
  query: { query: string },
  token?: string | null,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const runQuery = useCallback(() => {
    fetch(`${backend}graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(query),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setData(data as T);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query, token]);

  useEffect(() => {
    runQuery();
  }, [runQuery]);

  const refetch = useCallback(() => {
    setLoading(true);
    runQuery();
  }, [runQuery]);

  return { data, loading, error, refetch };
}

export const useGraphQLMutation = <T>(token?: string | null) => {
  const addEntity = async (query: { query: string }) => {
    const response = await fetch(backend + "graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(query),
    });
    if (!response.ok) {
      throw new Error(`Failed to add entity through graphql`);
    }
    return response.json() as T;
  };
  return { addEntity };
};
