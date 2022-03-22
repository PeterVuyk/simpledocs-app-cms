import React, { FC } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { StandalonePage } from '../../model/standalonePages/StandalonePage';

interface Props {
  standalonePage: StandalonePage;
}

const StandalonePagesRowItem: FC<Props> = ({ standalonePage }) => {
  return (
    <>
      <TableCell>{standalonePage.title}</TableCell>
      <TableCell>opties</TableCell>
    </>
  );
};

export default StandalonePagesRowItem;
