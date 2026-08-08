// hooks/use-auto-file.ts
import { useEffect } from 'react';
import { getAndClearPendingFile } from '@/lib/file-store';

/**
 * Custom hook to automatically load files passed from the homepage dropzone
 */
export function useAutoFile(onFileFound: (file: File) => void) {
  useEffect(() => {
    let isMounted = true;
    getAndClearPendingFile().then((pendingFile) => {
      if (pendingFile && isMounted) {
        onFileFound(pendingFile);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [onFileFound]);
}