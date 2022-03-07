import { useCallback, useEffect, useReducer } from 'react';
import { format } from 'date-fns';

interface State<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

type Action<T> =
  | { type: 'reset' }
  | { type: 'loading' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error };

interface Options {
  date?: Date | null;
  dateFormat?: string;
  useParam?: boolean;
  delay?: number;
}

function useFilter<T>(
  url: string,
  { date, dateFormat, useParam = true, delay }: Options
) {
  const initialState: State<T> = {
    data: undefined,
    error: undefined,
    loading: false,
  };

  function reducer(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
      case 'reset':
        return initialState;
      case 'loading':
        return { ...initialState, loading: true };
      case 'fetched':
        return { ...initialState, data: action.payload };
      case 'error':
        return { ...initialState, error: action.payload };
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = useCallback(async () => {
    if (!delay) {
      dispatch({ type: 'loading' });
    }

    try {
      let response: Response;

      if (useParam) {
        if (!date) {
          dispatch({ type: 'reset' });
          return;
        }
        if (!dateFormat) {
          throw new Error('dateFormat is required when using parameter');
        }
        const param = format(date, dateFormat);
        response = await fetch(`${url}/${param}`);
      } else {
        response = await fetch(url);
      }

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = (await response.json()) as T;
      dispatch({ type: 'fetched', payload: data });
    } catch (error) {
      dispatch({ type: 'error', payload: error as Error });
    }
  }, [date, dateFormat, url, useParam, delay]);

  useEffect(() => {
    if (delay) {
      dispatch({ type: 'loading' });
    }
    fetchData();
  }, [fetchData, delay]);

  useEffect(() => {
    if (delay) {
      let id = setInterval(() => fetchData(), delay);
      return () => clearInterval(id);
    } else {
      fetchData();
    }
  }, [fetchData, delay]);

  return state;
}

export default useFilter;
