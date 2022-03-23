import React, { FC } from 'react';
import { Icon, Tooltip } from '@material-ui/core';
import { StandalonePage } from '../../model/standalonePages/StandalonePage';
import standalonePagesRepository from '../../firebase/database/standalonePagesRepository';
import logger from '../../helper/logger';
import { notify } from '../../redux/slice/notificationSlice';
import { useAppDispatch } from '../../redux/hooks';

interface Props {
  standalonePage: StandalonePage;
  onLoadPages: () => Promise<void>;
}

const DisablePageToggle: FC<Props> = ({ standalonePage, onLoadPages }) => {
  const dispatch = useAppDispatch();

  const handlePageToggle = () => {
    standalonePagesRepository
      .updateStandalonePage({
        ...standalonePage,
        isDisabled: !standalonePage.isDisabled,
        isDraft: true,
        id: `${standalonePage.id?.replaceAll('-draft', '')}-draft`,
      })
      .then(onLoadPages)
      .catch((reason) => {
        logger.errorWithReason(
          `Failed to toggle standalone page ${standalonePage.title}`,
          reason
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het disablen/enablen van de pagina is mislukt.`,
          })
        );
      });
  };

  return (
    <>
      <Tooltip title="Weergeven / verbergen pagina">
        <Icon
          color="primary"
          style={{ cursor: 'pointer' }}
          onClick={handlePageToggle}
        >
          {standalonePage.isDisabled ? 'visibility_icon' : 'visibility_off'}
        </Icon>
      </Tooltip>
    </>
  );
};

export default DisablePageToggle;
