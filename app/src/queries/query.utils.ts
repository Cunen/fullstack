import { useCallback, useEffect, useRef, useState } from "react";
import { MOCK_API } from "../msw/handlers";

const backend = "http://localhost:3000/api";

export function useQuery<T>(
  key: string,
  token?: string | null,
  params?: { [key: string]: string },
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const urlParams = new URLSearchParams(params).toString();

  const runQuery = useCallback(() => {
    fetch(`${backend}/${key}?${urlParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
  }, [key, urlParams, token]);

  useEffect(() => {
    runQuery();
  }, [urlParams, runQuery]);

  const refetch = useCallback(() => {
    setLoading(true);
    runQuery();
  }, [runQuery]);

  return { data, loading, error, refetch };
}

export function useMockQuery<T>(key: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const runQuery = useCallback(() => {
    fetch(`${MOCK_API}${key}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setData(data as T);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [key]);

  const runRef = useRef<boolean>(false);
  useEffect(() => {
    if (runRef.current) return;
    runRef.current = true;
    runQuery();
  }, [runQuery]);

  const refetch = useCallback(() => {
    setLoading(true);
    runQuery();
  }, [runQuery]);

  return { data, loading, error, refetch };
}
