import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import logger from '../../../../helper/logger';
import { useAppDispatch } from '../../../../redux/hooks';
import { notify } from '../../../../redux/slice/notificationSlice';
import LoadingSpinner from '../../../LoadingSpinner';
import { DOCUMENTATION_DIFF_CHANGES } from '../../../../model/DocumentationType';
import HelpAction from '../../helpAction/HelpAction';
import { AppConfigurations } from '../../../../model/configurations/AppConfigurations';
import { CmsConfigurations } from '../../../../model/configurations/CmsConfigurations';
import configurationRepository from '../../../../firebase/database/configurationRepository';
import {
  APP_CONFIGURATIONS,
  APP_CONFIGURATIONS_DRAFT,
  CMS_CONFIGURATIONS_DRAFT,
  ConfigurationType,
} from '../../../../model/configurations/ConfigurationType';
import DiffDialogContent from './DiffDialogContent';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  configurationType: ConfigurationType;
  setShowDiffDialog: (showDialogPage: boolean) => void;
}

const ShowDiffConfigurationDialog: FC<Props> = ({
  configurationType,
  setShowDiffDialog,
}) => {
  const [conceptConfiguration, setConceptConfiguration] = useState<
    AppConfigurations | CmsConfigurations | null
  >(null);
  const [publishedConfiguration, setPublishedConfiguration] = useState<
    AppConfigurations | CmsConfigurations | null
  >(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([
      configurationRepository.getConfigurations(
        configurationType === APP_CONFIGURATIONS
          ? APP_CONFIGURATIONS_DRAFT
          : CMS_CONFIGURATIONS_DRAFT
      ),
      configurationRepository.getConfigurations(configurationType),
    ])
      .then((value) => {
        setConceptConfiguration(value[0] ?? null);
        setPublishedConfiguration(value[1] ?? null);
      })
      .catch((reason) => {
        logger.errorWithReason(
          `Failed to get ${configurationType} configuration info in ShowDiffDialog`,
          reason
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het tonen van het verschil van de configuratie is mislukt.`,
          })
        );
      });
  }, [dispatch, configurationType]);

  const handleClose = () => {
    setShowDiffDialog(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Bekijk de wijzigingen&ensp;
        <HelpAction documentationType={DOCUMENTATION_DIFF_CHANGES} />
      </DialogTitle>
      {publishedConfiguration !== null && conceptConfiguration !== null ? (
        <DiffDialogContent
          conceptConfiguration={conceptConfiguration}
          publishedConfiguration={publishedConfiguration}
        />
      ) : (
        <DialogContent style={{ minHeight: 600 }}>
          <LoadingSpinner />
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Terug
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowDiffConfigurationDialog;
