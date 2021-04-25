import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const ErrorTextTypography = withStyles({
  root: {
    color: '#f44336',
    fontSize: '0.8rem',
    fontFamily: 'arial',
    fontWeight: 400,
  },
})(Typography);

export default ErrorTextTypography;
