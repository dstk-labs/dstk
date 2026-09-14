import { useEffect, useState } from "react";

export function useContinuationTokens(continuationToken: null | string | undefined) {
  const [continuationTokens, setContinuationTokens] = useState<(null | string)[]>([null]);

  useEffect(() => {
    if (continuationToken && !continuationTokens.includes(continuationToken)) {
      setContinuationTokens(prev => [...prev, continuationToken]);
    }
  }, [continuationToken, continuationTokens]);

  return continuationTokens;
}
