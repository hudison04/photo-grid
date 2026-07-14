import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export function useCapacitorCamera() {
  const [error, setError] = useState(null);

  const takePicture = async () => {
    try {
      setError(null);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      return {
        webPath: `data:image/jpeg;base64,${image.base64String}`,
        base64Data: `data:image/jpeg;base64,${image.base64String}`,
        format: image.format,
        exif: image.exif
      };
    } catch (err) {
      console.error('Camera error:', err);
      setError('Não foi possível acessar a câmera.');
      return null;
    }
  };

  const pickFromGallery = async () => {
    try {
      setError(null);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      return {
        webPath: `data:image/jpeg;base64,${image.base64String}`,
        base64Data: `data:image/jpeg;base64,${image.base64String}`,
        format: image.format,
        exif: image.exif
      };
    } catch (err) {
      console.error('Gallery error:', err);
      setError('Não foi possível acessar a galeria.');
      return null;
    }
  };

  return {
    takePicture,
    pickFromGallery,
    error
  };
}