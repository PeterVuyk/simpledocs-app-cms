import React, { FC } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { CalculationInfo } from '../../model/calculations/CalculationInfo';
import ViewContentAction from '../../components/ItemAction/ViewContentAction';
import DownloadContentAction from '../../components/ItemAction/DownloadContentAction';
import { OVERTAKING_DISTANCE } from '../../model/calculations/CalculationType';
import DiffCalculationAction from '../../components/ItemAction/diffAction/diffCalculationAction/DiffCalculationAction';

interface Props {
  calculationInfo: CalculationInfo;
}

const CalculationListItem: FC<Props> = ({ calculationInfo }) => {
  const getTranslatedCalculation = () => {
    return calculationInfo.calculationType === OVERTAKING_DISTANCE
      ? 'Inhaalafstand berekenen'
      : 'Stopafstand berekenen';
  };

  return (
    <>
      <TableCell>{getTranslatedCalculation()}</TableCell>
      <TableCell>{calculationInfo.listIndex}</TableCell>
      <TableCell>{calculationInfo.title}</TableCell>
      <TableCell>
        <img
          alt="illustratie"
          style={{ width: 35 }}
          src={`${calculationInfo.iconFile}`}
        />
      </TableCell>
      <TableCell>{calculationInfo.explanation}</TableCell>
      <TableCell>{calculationInfo.contentType}</TableCell>
      <TableCell>
        {calculationInfo.isDraft && (
          <DiffCalculationAction calculationInfo={calculationInfo} />
        )}
        <ViewContentAction
          content={calculationInfo.content}
          contentType={calculationInfo.contentType}
        />
        <DownloadContentAction
          content={calculationInfo.content}
          contentType={calculationInfo.contentType}
          fileName={calculationInfo.title.replace(' ', '-').toLowerCase()}
        />
      </TableCell>
    </>
  );
};

export default CalculationListItem;
