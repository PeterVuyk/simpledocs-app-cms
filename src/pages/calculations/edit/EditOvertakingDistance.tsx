import React, { FC } from 'react';
import EditCalculation from './EditCalculation';
import { OVERTAKING_DISTANCE } from '../../../model/calculations/CalculationType';

const EditOvertakingDistance: FC = () => {
  return <EditCalculation calculationType={OVERTAKING_DISTANCE} />;
};

export default EditOvertakingDistance;
