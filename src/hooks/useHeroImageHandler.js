import { useState, useRef } from 'react';

import { compressImage } from '../utils/imageUtils.js';

export default function useHeroImageHandler({ 
  onSaveField, 
  fieldName = 'heroImage', 
  maxSizeBytes = 5 * 1024 * 1024, // Accept up to 5MB, then compress
  onError = (msg) => console.error(msg),
  onConfirmDelete = () => true
}) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onError('Només imatges, de moment.');
      return;
    }
    if (file.size > maxSizeBytes) {
      onError(`La imatge passa de ${Math.round(maxSizeBytes / (1024 * 1024))} MB. És massa pesada per processar-la.`);
      return;
    }

    try {
      const maxSize = fieldName.toLowerCase().includes('logo') || fieldName.toLowerCase().includes('avatar') ? 600 : 1200;
      const dataUrl = await compressImage(file, { maxSize, format: 'image/webp', quality: 0.8 });
      onSaveField?.(fieldName, dataUrl);
      setIsEditing(false);
    } catch (err) {
      onError("No s'ha pogut processar la imatge.");
    }
  };

  const handleDelete = async () => {
    const confirmed = await onConfirmDelete();
    if (!confirmed) return;
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
