import { useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { CONTENT_TYPE_HTML } from '../../model/artifacts/Artifact';

function useContentTypeToggle(initialValue: any) {
  const [contentType, setContentType] = useLocalStorage(
    'contentType',
    () => initialValue ?? CONTENT_TYPE_HTML
  );

  useEffect(() => {
    if (initialValue) {
      setContentType(initialValue);
    }
  }, [initialValue, setContentType]);

  return [contentType, setContentType];
}

export default useContentTypeToggle;
