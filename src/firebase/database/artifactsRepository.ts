import { database } from '../firebaseConnection';
import { AGGREGATE_ARTIFACTS } from '../../model/Aggregate';
import { Artifact, ContentType } from '../../model/Artifact';
import { ArtifactType } from '../../model/ArtifactType';

async function getArtifactByTitle(
  title: string,
  artifactType: ArtifactType,
  contentType: ContentType
): Promise<Artifact | null> {
  const result = await database
    .collection(AGGREGATE_ARTIFACTS)
    .where('type', '==', artifactType)
    .where('title', '==', title)
    .where('contentType', '==', contentType)
    .limit(1)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        } as Artifact;
      }
      return null;
    });
  return result;
}

async function getArtifactsByCategories(
  artifactType: ArtifactType[]
): Promise<Artifact[]> {
  const querySnapshot = await database
    .collection(AGGREGATE_ARTIFACTS)
    .orderBy('type', 'desc')
    .get();
  return querySnapshot.docs
    .map((doc) => {
      return { id: doc.id, ...doc.data() } as Artifact;
    })
    .filter((value) => artifactType.includes(value.type));
}

async function deleteArtifact(itemId: string): Promise<void> {
  await database.collection(AGGREGATE_ARTIFACTS).doc(itemId).delete();
}

async function getArtifactById(id: string): Promise<Artifact> {
  const documentSnapshot = await database
    .collection(AGGREGATE_ARTIFACTS)
    .doc(id.trim())
    .get();
  return {
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as Artifact;
}

async function updateArtifact(artifact: Artifact): Promise<void> {
  if (artifact.id) {
    await database.collection(AGGREGATE_ARTIFACTS).doc(artifact.id).set({
      content: artifact.content,
      contentType: artifact.contentType,
      type: artifact.type,
      title: artifact.title,
    });
    return;
  }
  await database.collection(AGGREGATE_ARTIFACTS).add({
    content: artifact.content,
    contentType: artifact.contentType,
    type: artifact.type,
    title: artifact.title,
  });
}

const artifactsRepository = {
  getArtifactsByCategories,
  getArtifactByTitle,
  deleteArtifact,
  getArtifactById,
  updateArtifact,
};

export default artifactsRepository;
