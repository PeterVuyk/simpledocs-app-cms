import React, { FC } from 'react';
import EditCalculation from './EditCalculation';
import { REACTION_PATH_DISTANCE } from '../../../model/CalculationType';

const EditReactionPathDistance: FC = () => {
  return <EditCalculation calculationType={REACTION_PATH_DISTANCE} />;
};

export default EditReactionPathDistance;
