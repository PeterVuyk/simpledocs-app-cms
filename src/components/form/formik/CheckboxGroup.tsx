import React, { FC } from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from '@material-ui/core';
import { useFormikContext } from 'formik';

interface Props {
  name: string;
  label: string;
  items: { [x: string]: string };
}

const CheckboxGroup: FC<Props> = ({ name, label, items }) => {
  const formikProps = useFormikContext<any>();

  return (
    <FormGroup style={{ paddingBottom: 8 }}>
      <FormLabel component="legend">{label}</FormLabel>
      {Object.keys(items).map((key) => (
        <FormControlLabel
          control={<Checkbox />}
          label={items[key]}
          checked={formikProps.values[name].includes(key)}
          id={name}
          name={name}
          key={key}
          onChange={() => {
            let updatedItems = formikProps.values[name];
            if (formikProps.values[name].includes(key)) {
              // @ts-ignore
              updatedItems = updatedItems.filter((value) => value !== key);
              formikProps.setFieldValue(name, updatedItems);
            } else {
              formikProps.setFieldValue(name, [...updatedItems, key]);
            }
          }}
        />
      ))}
    </FormGroup>
  );
};

export default CheckboxGroup;
