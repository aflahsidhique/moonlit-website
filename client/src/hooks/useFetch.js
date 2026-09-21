import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";

// Minimal { data, loading, error } fetch hook. Set `path` to null/undefined
// to skip fetching (e.g. while waiting on another value).
export function useFetch(path) {
  const [state, setState] = useState({ data: null, loading: !!path, error: null });

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    apiGet(path)
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (!cancelled) setState({ data: null, loading: false, error }); });
    return () => { cancelled = true; };
  }, [path]);

  return state;
}
