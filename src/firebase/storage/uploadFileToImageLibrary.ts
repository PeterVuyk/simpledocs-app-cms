import { ref, uploadString } from 'firebase/storage';
import { storage } from '../firebaseConnection';
import { ImageInfo } from '../../model/imageLibrary/ImageInfo';
import {
  IMAGE_LIBRARY_IMAGES,
  ImageLibraryType,
} from '../../model/imageLibrary/ImageLibraryType';

const storageRef = (slug: string, imageInfo: ImageInfo) =>
  ref(
    storage,
    `${slug}/${imageInfo.category.trim().toLowerCase()}/${imageInfo.filename
      .trim()
      .toLowerCase()}`
  );

const uploadFileToImageLibrary = (
  imageInfo: ImageInfo,
  imageLibraryType: ImageLibraryType
): Promise<string> => {
  const slug =
    imageLibraryType === IMAGE_LIBRARY_IMAGES
      ? 'image-library'
      : 'icon-library';

  return uploadString(
    storageRef(slug, imageInfo),
    imageInfo.image!,
    'data_url'
  ).then((snapshot) => snapshot.ref.fullPath);
};

export default uploadFileToImageLibrary;
