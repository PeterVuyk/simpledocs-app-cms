import { ref, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../firebaseConnection';
import { ImageInfo } from '../../model/imageLibrary/ImageInfo';
import deleteImageCategory from '../functions/deleteImageCategory';
import {
  IMAGE_LIBRARY_IMAGES,
  ImageLibraryType,
} from '../../model/imageLibrary/ImageLibraryType';

const deleteImageFromCategory = (
  imageInfo: ImageInfo,
  imageLibraryType: ImageLibraryType
) => {
  const categoryRef =
    imageLibraryType === IMAGE_LIBRARY_IMAGES
      ? ref(storage, `image-library/${imageInfo.category}/`)
      : ref(storage, `icon-library/${imageInfo.category}/`);
  const fileRef =
    imageLibraryType === IMAGE_LIBRARY_IMAGES
      ? ref(
          storage,
          `image-library/${imageInfo.category}/${imageInfo.filename}`
        )
      : ref(
          storage,
          `icon-library/${imageInfo.category}/${imageInfo.filename}`
        );

  return deleteObject(fileRef)
    .then(() => listAll(categoryRef))
    .then((items) => items.items.length === 0)
    .then((categoryIsEmpty) =>
      categoryIsEmpty
        ? deleteImageCategory(imageInfo.category, imageLibraryType)
        : Promise.resolve()
    );
};

export default deleteImageFromCategory;
