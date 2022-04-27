import React, { FC } from 'react';
import { styled } from '@mui/material/styles';
import { Box, InputLabel } from '@mui/material';
import { Page } from '../../../../model/Page';
import SvgIllustrationSelectorToolbox from './SvgIllustrationSelectorToolbox';
import ErrorTextTypography from '../../../text/ErrorTextTypography';

const ImgIcon = styled('img')(() => ({
  width: 90,
  display: 'inline',
  verticalAlign: 'middle',
}));

interface Props {
  page: Page | undefined;
  isSubmitting: boolean;
  showError: boolean;
  meta: any;
  formik: React.MutableRefObject<any>;
}

const SvgIllustrationSelector: FC<Props> = ({
  meta,
  formik,
  page,
  isSubmitting,
  showError,
}) => {
  const getErrorMessage = (): string => {
    if (showError && meta.error) {
      return meta.error;
    }
    return '';
  };

  return (
    <>
      <Box
        sx={{
          borderRadius: 1.4,
          border: '1px solid',
          borderColor: getErrorMessage() ? '#d32f2f' : '#ddd',
          position: 'relative',
          padding: 1,
          minHeight: 110,
        }}
      >
        <InputLabel
          style={{
            color: getErrorMessage() ? '#d32f2f' : undefined,
            fontSize: 'small',
            position: 'absolute',
            top: -10,
            left: 10,
            backgroundColor: '#fff',
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          Illustratie
        </InputLabel>
        {page?.iconFile && <ImgIcon src={page?.iconFile} alt="bla" />}
        <SvgIllustrationSelectorToolbox
          page={page}
          isSubmitting={isSubmitting}
        />
      </Box>
      {getErrorMessage() && (
        <div style={{ marginLeft: 10 }}>
          <ErrorTextTypography>{meta.error}</ErrorTextTypography>
        </div>
      )}
    </>
  );
};

export default SvgIllustrationSelector;
