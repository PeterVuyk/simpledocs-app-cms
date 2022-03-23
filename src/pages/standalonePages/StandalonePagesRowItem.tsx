import React, { FC } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { StandalonePage } from '../../model/standalonePages/StandalonePage';
import ViewContentAction from '../../components/ItemAction/ViewContentAction';
import EditItemAction from '../../components/ItemAction/EditItemAction';
import { AGGREGATE_STANDALONE_PAGES } from '../../model/Aggregate';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import DisablePageToggle from './DisablePageToggle';

interface Props {
  standalonePage: StandalonePage;
  onLoadPages: () => Promise<void>;
}

const StandalonePagesRowItem: FC<Props> = ({ standalonePage, onLoadPages }) => {
  const { configuration } = useCmsConfiguration();

  const getTextColor = standalonePage.isDisabled ? { color: '#ddd' } : {};

  return (
    <>
      <TableCell style={getTextColor}>{standalonePage.title}</TableCell>
      <TableCell style={getTextColor}>{standalonePage.contentType}</TableCell>
      <TableCell align="right">
        <DisablePageToggle
          standalonePage={standalonePage}
          onLoadPages={onLoadPages}
        />
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
