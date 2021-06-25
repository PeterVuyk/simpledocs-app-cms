import React, { FC } from 'react';
import EditCalculation from './EditCalculation';
import { BRAKING_DISTANCE } from '../../../model/CalculationType';

const EditBrakingDistance: FC = () => {
  return <EditCalculation calculationType={BRAKING_DISTANCE} />;
};

export default EditBrakingDistance;
