import { ref, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../firebaseConnection';
import { ImageInfo } from '../../model/imageLibrary/ImageInfo';
import deleteImageCategory from '../functions/deleteImageCategory';

const deleteImageFromCategory = (imageInfo: ImageInfo) => {
  const categoryRef = ref(storage, `image-library/${imageInfo.category}/`);
  const fileRef = ref(
    storage,
    `image-library/${imageInfo.category}/${imageInfo.filename}`
  );

  return deleteObject(fileRef)
    .then(() => listAll(categoryRef))
    .then((items) => items.items.length === 0)
    .then((categoryIsEmpty) =>
      categoryIsEmpty
        ? deleteImageCategory(imageInfo.category)
        : Promise.resolve()
    );
};

export default deleteImageFromCategory;
