import UniversalToolbar from '../UniversalToolbar';

export function UniversalRichTextToolbar({ 
  editor, 
  onPublish, 
  publishDisabled, 
  isPublished, 
  t = (key, def) => def 
}) {
  const formatState = {
    isHeading: editor?.isActive('heading', { level: 2 }),
    isList: editor?.isActive('bulletList'),
    isBold: editor?.isActive('bold'),
    isItalic: editor?.isActive('italic'),
    isStrike: editor?.isActive('strike'),
  };

  const formatActions = editor ? {
    toggleHeading: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    toggleList: () => editor.chain().focus().toggleBulletList().run(),
    toggleBold: () => editor.chain().focus().toggleBold().run(),
    toggleItalic: () => editor.chain().focus().toggleItalic().run(),
    toggleStrike: () => editor.chain().focus().toggleStrike().run(),
  } : {};

  return (
    <UniversalToolbar 
      onPublish={onPublish}
      publishDisabled={publishDisabled}
      isPublished={isPublished}
      formatState={formatState}
      formatActions={formatActions}
      t={t}
    />
  );
}
