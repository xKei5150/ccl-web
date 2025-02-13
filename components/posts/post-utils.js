export function validatePostData(data) {
  if (!data.title?.trim()) {
    throw new Error('Title is required');
  }

  if (!Array.isArray(data.content) || data.content.length === 0) {
    throw new Error('Content is required');
  }

  // Check if content is just empty paragraphs
  const hasContent = data.content.some(node => {
    if (node.type === 'paragraph') {
      return node.content?.some(child => child.text?.trim());
    }
    return true;
  });

  if (!hasContent) {
    throw new Error('Content cannot be empty');
  }

  return true;
}

export const initialContent = [
  {
    type: 'paragraph',
    content: [{ type: 'text', text: '' }],
  },
];