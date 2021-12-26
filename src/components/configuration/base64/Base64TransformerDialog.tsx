import React, { FC, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { ButtonGroup, Tooltip } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileSaver from 'file-saver';
import { DOCUMENTATION_TRANSFORM_BASE64 } from '../../../model/DocumentationType';
import HelpAction from '../../ItemAction/helpAction/HelpAction';
import CopyToClipboardAction from '../../CopyToClipboardAction';
import FileDropzoneArea from '../../form/FileDropzoneArea';
import AlertBox from '../../AlertBox';
import DialogTransition from '../../dialog/DialogTransition';

interface Props {
  openBase64TransformerDialog: boolean;
  setOpenBase64TransformerDialog: (toggle: boolean) => void;
}

const Base64TransformerDialog: FC<Props> = ({
  openBase64TransformerDialog,
  setOpenBase64TransformerDialog,
}) => {
  const [error, setError] = useState('');
  const [base64Input, setBase64Input] = useState<string>('');
  const base64Ref = useRef<TextFieldProps>();

  const onClose = () => {
    setOpenBase64TransformerDialog(false);
  };

  const handleDownloadFileFromBase64 = () => {
    if (!base64Input.split('data:image/svg+xml;base64,')[1]) {
      setError(
        'Het opgegeven base64 is onjuist, de data moet beginnen met data:image/svg+xml;base64,'
      );
      return;
    }
    FileSaver.saveAs(base64Input, 'icon.svg');
    setError('');
  };

  const setSVGUploadRef = (file: string) => {
    setBase64Input(file);
  };

  return (
    <Dialog
      open={openBase64TransformerDialog !== null}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={onClose}
    >
      <DialogTitle id="alert-dialog-slide-title">
        Transformeer SVG &gt; &lt; base64&ensp;
        <HelpAction documentationType={DOCUMENTATION_TRANSFORM_BASE64} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          Voer eenvoudig de Base64 data in of upload het gewenste bestand en
          druk op &apos;transform&apos; om het te en- of decoderen.
        </DialogContentText>
        {error && <AlertBox severity="error" message={error} />}
        <TextField
          inputRef={base64Ref}
          variant="outlined"
          margin="normal"
          fullWidth
          id="base64"
          label="Base64 data"
          name="Base64"
          onChange={(event) => setBase64Input(event.target.value)}
          value={base64Input}
          autoFocus
          InputProps={{
            endAdornment: (
              <ButtonGroup>
                <CopyToClipboardAction
                  textToCopy={base64Input}
                  disabled={base64Input === ''}
                />
                <Tooltip title="Download als bestand">
                  <Button
                    onClick={handleDownloadFileFromBase64}
                    variant="contained"
                    disabled={base64Input === ''}
                  >
                    <GetAppIcon />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            ),
          }}
        />
        <FileDropzoneArea
          allowedMimeTypes={['image/svg+xml']}
          allowedExtension="svg"
          onUpdateFile={setSVGUploadRef}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Terug
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Base64TransformerDialog;
