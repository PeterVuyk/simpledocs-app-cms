import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Layout from '../layout/Layout';
import FileDropZoneArea from '../component/FileDropzoneArea';

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    minWidth: '100%',
  },
}));

function Dashboard(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Layout>
      <CssBaseline />
      <div style={{ overflow: 'hidden', marginTop: 10, marginBottom: 10 }}>
        <div style={{ float: 'left' }}>
          <Typography variant="h5">Pagina toevoegen</Typography>
        </div>
        <div style={{ float: 'right' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => history.push('/')}
          >
            Terug
          </Button>
        </div>
      </div>

      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              name="Hoofdstuk"
              variant="outlined"
              required
              fullWidth
              id="chapter"
              label="Hoofdstuk"
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="title"
              label="Titel"
              name="title"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="subTitle"
              label="Ondertitel"
              name="Ondertitel"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="pageIndex"
              label="pagina index"
              name="pagina index"
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            {/* https://material-ui.com/components/selects/ */}
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Age
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={10}
                onChange={() => console.log('changed')}
                label="Age"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FileDropZoneArea
              dropzoneText="Klik hier of sleep het html template bestand hierheen"
              allowedMimeTypes={['text/html']}
              initialFile={null}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FileDropZoneArea
              dropzoneText="Klik hier of sleep het png illustratie bestand hierheen"
              allowedMimeTypes={['text/png']}
              initialFile={null}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Toevoegen
        </Button>
      </form>
    </Layout>
  );
}

export default Dashboard;
