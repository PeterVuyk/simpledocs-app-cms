import React, { FC } from 'react';
import { styled } from '@mui/material/styles';

const ImgIcon = styled('img')(() => ({
  width: 45,
  display: 'inline',
  verticalAlign: 'middle',
}));

interface Props {
  conceptIconFile: string;
  publicationIconFile: string;
  altText: string;
}

const DiffIconFile: FC<Props> = ({
  conceptIconFile,
  publicationIconFile,
  altText,
}) => {
  return (
    <>
      <h3>Illustratie:</h3>
      <p>
        Gepubliceerd:&nbsp;
        <ImgIcon src={`${publicationIconFile}`} alt={altText} />
        &nbsp;&nbsp;Concept:&nbsp;
        <ImgIcon src={`${conceptIconFile}`} alt={altText} />
      </p>
    </>
  );
};

export default DiffIconFile;
