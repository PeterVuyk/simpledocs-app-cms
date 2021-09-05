import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useRef,
  useState,
} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { Tooltip } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import Alert from '@material-ui/lab/Alert';
import FileSaver from 'file-saver';
import FileDropzoneArea from '../../../components/form/FileDropzoneArea';
import CopyToClipboardAction from '../../../components/CopyToClipboardAction';

const Transition = forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Transformeer SVG &gt; &lt; base64
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          Voer eenvoudig de Base64 data in of upload het gewenste bestand en
          druk op &apos;transform&apos; om het te en- of decoderen.
        </DialogContentText>
        {error && (
          <Alert severity="error" style={{ marginBottom: 16 }}>
            {error}
          </Alert>
        )}
        <CopyToClipboardAction
          textToCopy={(base64Ref.current?.value as string) ?? ''}
          disabled={base64Input === ''}
        />
        <div
          style={{
            float: 'right',
            marginLeft: 8,
          }}
        >
          <Tooltip title="Download als bestand">
            <div>
              <Button
                onClick={handleDownloadFileFromBase64}
                variant="contained"
                disabled={base64Input === ''}
              >
                <GetAppIcon />
              </Button>
            </div>
          </Tooltip>
        </div>
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
