import { useEffect } from 'react';
import { useQuery } from 'relay-hooks';
import { OperationType } from 'relay-runtime';

export const useQueryFixed = <T extends OperationType = OperationType>(
  ...param: Parameters<typeof useQuery>
) => {
  const result = useQuery<T>(...param);
  const retryFunction = result?.retry;
  useEffect(() => {
    retryFunction?.();
  }, [retryFunction]);
  return result;
};
