import React, { FC, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, InputLabel } from '@mui/material';
import { Page } from '../../../../model/Page';
import SvgIllustrationSelectorToolbox from './SvgIllustrationSelectorToolbox';
import ErrorTextTypography from '../../../text/ErrorTextTypography';

const ImgIcon = styled('img')(() => ({
  marginTop: 4,
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
  const [icon, setIcon] = useState<string | null>(page?.iconFile ?? null);

  const handleIconChange = (file: string | null) => {
    formik.current?.setFieldValue('iconFile', file);
    setIcon(file);
  };

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
        {icon && <ImgIcon src={icon} alt="bla" />}
        <SvgIllustrationSelectorToolbox
          onIconChange={handleIconChange}
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
