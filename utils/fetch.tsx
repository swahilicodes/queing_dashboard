// hooks/useFetch.ts
import { useEffect, useState } from 'react';

type Params = Record<string, string | number | boolean | undefined>;
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

function buildUrl(baseUrl: string, params?: Params, method?: Method): string {
  const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
}

function useFetch<T = unknown>(baseUrl: string, params?: Params) {
  //const [data, setData] = useState<T | null>(null);
  const [data, setData] = useState<T | any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fullUrl = buildUrl(baseUrl, params);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(fullUrl);
        //console.log(res)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();
        console.log(result)
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl, JSON.stringify(params)]); // dependency must track params changes

  return { data, loading, error };
}

export default useFetch;
