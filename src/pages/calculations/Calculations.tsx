import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import calculationsRepository, {
  CalculationInfo,
} from '../../firebase/database/calculationsRepository';
import CalculationTableView from './CalculationTableView';
import PageHeading from '../../layout/PageHeading';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

const Calculations: React.FC = () => {
  const [breakingDistanceInfo, setBreakingDistanceInfo] =
    React.useState<CalculationInfo | null>(null);
  const [overtakingDistanceInfo, setOvertakingDistanceInfo] =
    React.useState<CalculationInfo | null>(null);
  const classes = useStyles();
  const history = useHistory();

  const reloadPublicationsHandle = (): void => {
    calculationsRepository.getCalculationsInfo().then((result) => {
      result.forEach((info) => {
        if (info.calculationType === 'breakingDistance') {
          setBreakingDistanceInfo(info);
        }
        if (info.calculationType === 'overtakingDistance') {
          setOvertakingDistanceInfo(info);
        }
      });
    });
  };

  React.useEffect(() => {
    reloadPublicationsHandle();
  }, []);

  return (
    <>
      <PageHeading title="Remafstand berekenen">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push('calculations/breaking-distance/edit')}
        >
          Remafstand updaten
        </Button>
      </PageHeading>
      {breakingDistanceInfo && (
        <CalculationTableView calculationInfo={breakingDistanceInfo} />
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
    </>
  );
};

export default Calculations;
