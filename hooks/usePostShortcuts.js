import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SHORTCUTS = {
  SAVE: ['Control', 's'],
  NEW_POST: ['Control', 'n'],
  TOGGLE_SIDEBAR: ['Control', 'b'],
  PREVIEW: ['Control', 'p'],
  PUBLISH: ['Control', 'Shift', 'p'],
};

export function usePostShortcuts({
  onSave,
  onToggleSidebar,
  onPreview,
  onPublish,
  isEditing = false,
}) {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (event) => {
      // Ignore shortcuts when typing in input fields
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      if (event.ctrlKey && event.key === 's' && onSave) {
        event.preventDefault();
        onSave();
      }

      if (event.ctrlKey && event.key === 'n' && !isEditing) {
        event.preventDefault();
        router.push('/dashboard/posts/new');
      }

      if (event.ctrlKey && event.key === 'b' && onToggleSidebar) {
        event.preventDefault();
        onToggleSidebar();
      }

      if (event.ctrlKey && event.key === 'p' && onPreview) {
        event.preventDefault();
        onPreview();
      }

      if (event.ctrlKey && event.shiftKey && event.key === 'P' && onPublish) {
        event.preventDefault();
        onPublish();
      }
    },
    [onSave, onToggleSidebar, onPreview, onPublish, isEditing, router]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return SHORTCUTS;
}