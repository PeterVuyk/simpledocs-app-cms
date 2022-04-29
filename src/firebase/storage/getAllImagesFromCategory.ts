import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConnection';
import { ImageInfo } from '../../model/imageLibrary/ImageInfo';
import {
  IMAGE_LIBRARY_IMAGES,
  ImageLibraryType,
} from '../../model/imageLibrary/ImageLibraryType';

const getAllImagesFromCategory = async (
  category: string,
  imageLibraryType: ImageLibraryType
): Promise<Awaited<ImageInfo>[]> => {
  const categoryRef =
    imageLibraryType === IMAGE_LIBRARY_IMAGES
      ? ref(storage, `image-library/${category}/`)
      : ref(storage, `icon-library/${category}/`);

  return listAll(categoryRef).then(({ items }) =>
    Promise.all(
      items.map((item) =>
        getDownloadURL(item).then((downloadUrl) => ({
          filename: item.name,
          category,
          downloadUrl,
        }))
      )
    )
  );
};

export default getAllImagesFromCategory;
