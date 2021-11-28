import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import ConfirmationDialog from '../../../components/dialog/ConfirmationDialog';
import useHtmlModifier from '../../../components/hooks/useHtmlModifier';
import { CONTENT_TYPE_HTML } from '../../../model/artifacts/Artifact';
import bookRepository from '../../../firebase/database/bookRepository';
import logger from '../../../helper/logger';
import { useAppDispatch } from '../../../redux/hooks';
import { notify } from '../../../redux/slice/notificationSlice';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  bookType: string;
  onStylesheetUpdate: () => void;
}

const UpdateStylesheetButton: FC<Props> = ({
  bookType,
  onStylesheetUpdate,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { modifyHtmlForStorage, modifyHtmlAfterUpload } = useHtmlModifier();
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const updateStylesheetForAllPages = async () => {
    const pages = await bookRepository.getAllPages(bookType);
    const unchangedPages = pages.filter(
      (page) => page.contentType !== CONTENT_TYPE_HTML
    );
    const updatedPages = [...unchangedPages];
    const pagesToEdit = pages.filter(
      (page) => page.contentType === CONTENT_TYPE_HTML
    );
    for (const page of pagesToEdit) {
      if (page.isDraft) {
        page.content = modifyHtmlForStorage(
          modifyHtmlAfterUpload(page.content)
        );
        updatedPages.push(page);
        continue;
      }
      if (page.markedForDeletion) {
        updatedPages.push(page);
        continue;
      }
      const draftPage = { ...page };
      draftPage.isDraft = true;
      draftPage.id += '-draft';
      draftPage.content = modifyHtmlForStorage(
        modifyHtmlAfterUpload(draftPage.content)
      );
      page.markedForDeletion = true;
      updatedPages.push(page);
      updatedPages.push(draftPage);
    }
    return updatedPages;
  };

  const handleSubmit = async () => {
    // if marked for delete , then add it but don't change it.
    await bookRepository
      .updatePages(bookType, await updateStylesheetForAllPages())
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: `De stylesheet voor de html pagina's zijn bijgewerkt.`,
          })
        )
      )
      .then(() => onStylesheetUpdate())
      .catch((error) => {
        logger.errorWithReason(
          `Update pages with new stylesheet has failed for handleSubmit bookType ${bookType}`,
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het updaten van de html pagina's met de nieuwe stylesheet is mislukt, neem contact op met de beheerder.`,
          })
        );
      });
  };

  return (
    <>
      <Tooltip title="Batch stylesheet updaten">
        <Button
          className={classes.button}
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          <SystemUpdateAltIcon color="action" />
        </Button>
      </Tooltip>
      <ConfirmationDialog
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        dialogText={`Weet je zeker dat je de stylesheet wilt updaten bij alle html pagina's?\n\nLet op: Gedane wijzigingen in de CSS stylesheet kan gevolgen hebben hoe de pagina wordt weergegeven in de app. Bekijk het resultaat voordat je het publiceert\n\nDeze wijziging wordt doorgevoerd bij zowel de gepubliceerde als concept- artikelen. Dit wordt in de app daadwerkelijk uitgevoerd zodra het ook gepubliceerd wordt.`}
        dialogTitle="CSS Stylesheet updaten"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default UpdateStylesheetButton;
