import React, { FC, useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import Select from '../form/formik/Select';
import calculationsRepository from '../../firebase/database/calculationsRepository';
import { CalculationInfo } from '../../model/calculations/CalculationInfo';

interface Props {
  showError: boolean;
  formik: React.MutableRefObject<any>;
  initialValue: string | null;
}

const CalculationsSelector: FC<Props> = ({
  initialValue,
  showError,
  formik,
}) => {
  const [calculationInfos, setCalculationInfos] = useState<CalculationInfo[]>(
    []
  );

  useEffect(() => {
    if (!initialValue) {
      return;
    }
    const calculationInfo = JSON.parse(initialValue) as CalculationInfo;
    if (calculationInfo) {
      formik.current?.setFieldValue(
        'calculationsContent',
        calculationInfo.calculationType
      );
    }
  }, [formik, initialValue]);

  useEffect(() => {
    calculationsRepository.getCalculationsInfo(false).then(setCalculationInfos);
  }, []);

  const getCalculationOptions = () => {
    return calculationInfos
      .map((value) => ({ id: value.calculationType, title: value.title }))
      .reduce((obj, item) => Object.assign(obj, { [item.id]: item.title }), {});
  };

  if (!calculationInfos) {
    return null;
  }

  return (
    <Select
      required
      sx={{ marginTop: (theme: Theme) => theme.spacing(2) }}
      name="calculationsContent"
      label="Berekening"
      showError={showError}
      options={getCalculationOptions()}
    />
  );
};

export default CalculationsSelector;
