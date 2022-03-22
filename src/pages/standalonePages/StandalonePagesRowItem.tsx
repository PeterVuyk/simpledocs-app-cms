import React, { FC } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { StandalonePage } from '../../model/standalonePages/StandalonePage';
import ViewContentAction from '../../components/ItemAction/ViewContentAction';
import EditItemAction from '../../components/ItemAction/EditItemAction';
import { AGGREGATE_STANDALONE_PAGES } from '../../model/Aggregate';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';

interface Props {
  standalonePage: StandalonePage;
}

const StandalonePagesRowItem: FC<Props> = ({ standalonePage }) => {
  const { configuration } = useCmsConfiguration();

  return (
    <>
      <TableCell>{standalonePage.title}</TableCell>
      <TableCell align="right">
        <EditItemAction
          urlSlug={`/${configuration.menu.menuItems[AGGREGATE_STANDALONE_PAGES].urlSlug}/${standalonePage.id}`}
        />
        <ViewContentAction
          content={standalonePage.content}
          contentType={standalonePage.contentType}
        />
      </TableCell>
    </>
  );
};

export default StandalonePagesRowItem;
