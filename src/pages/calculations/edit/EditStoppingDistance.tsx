import React, { FC } from 'react';
import EditCalculation from './EditCalculation';
import { STOPPING_DISTANCE } from '../../../model/calculations/CalculationType';

const EditStoppingDistance: FC = () => {
  return <EditCalculation calculationType={STOPPING_DISTANCE} />;
};

export default EditStoppingDistance;
