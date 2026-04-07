import { useCallback, useEffect, useRef, useState } from "react";

export function useQuery<T>(key: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const runQuery = useCallback(() => {
    fetch(`/api/${key}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((json) => {
        const data = json.data as T;
        setData(data);
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
