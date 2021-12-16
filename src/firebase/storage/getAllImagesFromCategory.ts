import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConnection';
import { ImageInfo } from '../../model/imageLibrary/ImageInfo';

const getAllImagesFromCategory = async (
  category: string
): Promise<Awaited<ImageInfo>[]> => {
  const categoryRef = ref(storage, `image-library/${category}/`);
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
