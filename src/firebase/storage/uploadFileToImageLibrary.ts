import { ref, uploadString } from 'firebase/storage';
import { storage } from '../firebaseConnection';
import { ImageInfo } from '../../model/imageLibrary/ImageInfo';

const storageRef = (imageInfo: ImageInfo) =>
  ref(
    storage,
    `image-library/${imageInfo.category
      .trim()
      .toLowerCase()}/${imageInfo.filename.trim().toLowerCase()}`
  );

const uploadFileToImageLibrary = (imageInfo: ImageInfo): Promise<string> => {
  return uploadString(storageRef(imageInfo), imageInfo.image!, 'data_url').then(
    (snapshot) => snapshot.ref.fullPath
  );
};

export default uploadFileToImageLibrary;
