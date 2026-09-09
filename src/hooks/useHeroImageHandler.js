import { useState, useRef } from 'react';

export default function useHeroImageHandler({ onSaveField, fieldName = 'heroImage', maxSizeBytes = 512 * 1024 }) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Només imatges, de moment.');
      return;
    }
    if (file.size > maxSizeBytes) {
      alert(`La imatge passa de ${Math.round(maxSizeBytes / 1024)} KB. Redueix-la abans.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onSaveField?.(fieldName, String(reader.result));
      setIsEditing(false);
    };
    reader.onerror = () => alert("No s'ha pogut llegir el fitxer.");
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    if (!window.confirm('Esborrar definitivament la imatge?')) return;
    onSaveField?.(fieldName, '');
    setIsEditing(false);
  };

  const cancelEdit = () => setIsEditing(false);
  const startEdit = () => setIsEditing(true);

  return {
    isEditing,
    startEdit,
    cancelEdit,
    fileInputRef,
    handleFileChange,
    handleDelete
  };
}
