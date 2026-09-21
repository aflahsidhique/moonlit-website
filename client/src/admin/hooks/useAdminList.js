import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "../lib/adminApi";

// Fetches `path`, unwraps the `key` field of the response ({volunteers:[]},
// {bloodRequests:[]}, ...), and exposes a `refresh()` for after mutations.
export function useAdminList(path, key) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    adminFetch(path)
      .then((body) => { setRows(body[key] || []); setLoading(false); })
      .catch((err) => { setError(err); setLoading(false); });
  }, [path, key]);

  useEffect(() => { refresh(); }, [refresh]);

  return { rows, setRows, loading, error, refresh };
}
