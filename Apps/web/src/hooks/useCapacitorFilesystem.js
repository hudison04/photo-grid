import { Filesystem, Directory } from '@capacitor/filesystem';

export function useCapacitorFilesystem() {
  const savePhoto = async (filename, base64Data) => {
    try {
      const savedFile = await Filesystem.writeFile({
        path: `photoguide/${filename}`,
        data: base64Data.split(',')[1], // Remove data URL prefix
        directory: Directory.Documents,
        recursive: true
      });
      return savedFile.uri;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  };

  const loadPhoto = async (filename) => {
    try {
      const contents = await Filesystem.readFile({
        path: `photoguide/${filename}`,
        directory: Directory.Documents,
      });
      return `data:image/jpeg;base64,${contents.data}`;
    } catch (error) {
      console.error('Error loading file:', error);
      throw error;
    }
  };

  const deletePhoto = async (filename) => {
    try {
      await Filesystem.deleteFile({
        path: `photoguide/${filename}`,
        directory: Directory.Documents,
      });
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  const listPhotos = async () => {
    try {
      const result = await Filesystem.readdir({
        path: 'photoguide',
        directory: Directory.Documents,
      });
      return result.files;
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  };

  return {
    savePhoto,
    loadPhoto,
    deletePhoto,
    listPhotos
  };
}