import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import calculationsRepository from '../../firebase/database/calculationsRepository';
import CalculationTableView from './CalculationTableView';
import PageHeading from '../../layout/PageHeading';
import { CalculationInfo } from '../../model/CalculationInfo';
import {
  BRAKING_DISTANCE,
  OVERTAKING_DISTANCE,
  REACTION_PATH_DISTANCE,
  STOPPING_DISTANCE,
} from '../../model/CalculationType';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

const Calculations: FC = () => {
  const [stoppingDistanceInfo, setStoppingDistanceInfo] =
    useState<CalculationInfo | null>(null);
  const [overtakingDistanceInfo, setOvertakingDistanceInfo] =
    useState<CalculationInfo | null>(null);
  const [brakingDistanceInfo, setBrakingDistanceInfo] =
    useState<CalculationInfo | null>(null);
  const [reactionPathDistanceInfo, setReactionPathDistanceInfo] =
    useState<CalculationInfo | null>(null);
  const classes = useStyles();
  const history = useHistory();

  const reloadPublicationsHandle = (): void => {
    calculationsRepository.getCalculationsInfo().then((result) => {
      result.forEach((info) => {
        if (info.calculationType === STOPPING_DISTANCE) {
          setStoppingDistanceInfo(info);
        }
        if (info.calculationType === OVERTAKING_DISTANCE) {
          setOvertakingDistanceInfo(info);
        }
        if (info.calculationType === BRAKING_DISTANCE) {
          setBrakingDistanceInfo(info);
        }
        if (info.calculationType === REACTION_PATH_DISTANCE) {
          setReactionPathDistanceInfo(info);
        }
      });
    });
  };

  useEffect(() => {
    reloadPublicationsHandle();
  }, []);

  return (
    <>
      <PageHeading title="Stopafstand berekenen">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push('calculations/stopping-distance/edit')}
        >
          Stopafstand updaten
        </Button>
      </PageHeading>
      {stoppingDistanceInfo && (
        <CalculationTableView calculationInfo={stoppingDistanceInfo} />
      )}
      <PageHeading title="Inhaalafstand berekenen">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push('calculations/overtaking-distance/edit')}
        >
          Inhaalafstand updaten
        </Button>
      </PageHeading>
      {overtakingDistanceInfo && (
        <CalculationTableView calculationInfo={overtakingDistanceInfo} />
      )}
      <PageHeading title="Remweg berekenen">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push('calculations/braking-distance/edit')}
        >
          Remweg updaten
        </Button>
      </PageHeading>
      {brakingDistanceInfo && (
        <CalculationTableView calculationInfo={brakingDistanceInfo} />
      )}
      <PageHeading title="Reactieweg berekenen">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() =>
            history.push('calculations/reaction-path-distance/edit')
          }
        >
          Reactieweg updaten
        </Button>
      </PageHeading>
      {reactionPathDistanceInfo && (
        <CalculationTableView calculationInfo={reactionPathDistanceInfo} />
      )}
    </>
  );
};

export default Calculations;
