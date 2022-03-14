import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '../form/formik/Select';
import calculationsRepository from '../../firebase/database/calculationsRepository';
import { CalculationInfo } from '../../model/calculations/CalculationInfo';

const useStyles = makeStyles((theme) => ({
  textFieldStyle: {
    marginTop: theme.spacing(2),
  },
}));

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
  const classes = useStyles();

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
      className={classes.textFieldStyle}
      name="calculationsContent"
      label="Berekening"
      showError={showError}
      options={getCalculationOptions()}
    />
  );
};

export default CalculationsSelector;
