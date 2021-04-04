import React, { useState } from 'react';
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone';

// https://yuvaleros.github.io/material-ui-dropzone/

export default function FileDropZoneArea({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  allowedMimeTypes,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialFile,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dropzoneText,
}): JSX.Element {
  const [file, setFile] = useState<FileObject | null>(null);

  const handleAdd = (newFiles: FileObject[]) => {
    if (newFiles.length > 1) {
      console.log('to much');
      return;
    }
    setFile(newFiles[0]);
  };

  React.useEffect(() => {
    if (initialFile !== null) {
      setFile(initialFile);
    }
  }, [initialFile]);

  const handleDelete = () => {
    setFile(null);
  };

  const getFileObjects = (): FileObject[] => {
    return file === null ? [] : [file];
  };

  return (
    <DropzoneAreaBase
      dropzoneText={dropzoneText}
      fileObjects={getFileObjects()}
      acceptedFiles={allowedMimeTypes}
      filesLimit={1}
      onAdd={handleAdd}
      onDelete={handleDelete}
    />
  );
}
