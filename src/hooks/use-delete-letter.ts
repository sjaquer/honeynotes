'use client';

import { useState } from 'react';
import { useFirebase, useUser } from '@/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';

export function useDeleteLetter() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteLetter = async (letterId: string): Promise<boolean> => {
    if (!user) {
      setError('No estás autenticado');
      return false;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const letterRef = doc(firestore, 'letters', letterId);
      const letterSnap = await getDoc(letterRef);

      if (!letterSnap.exists()) {
        setError('La carta no existe');
        return false;
      }

      const letterData = letterSnap.data();

      // Only sender can delete their letters
      if (letterData.senderId !== user.uid) {
        setError('No tienes permiso para eliminar esta carta');
        return false;
      }

      await deleteDoc(letterRef);
      return true;
    } catch (e) {
      console.error('Error deleting letter:', e);
      setError('No se pudo eliminar la carta');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteLetter,
    isDeleting,
    error,
  };
}
