import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  icon: {
    width: 35,
  },
});

function createData(
  chapter: string,
  title: string,
  level: string,
  index: number,
  icon: string
) {
  return { chapter, title, level, index, icon };
}

const rows = [
  createData(
    '1.1',
    'Frozen yoghurt',
    'section',
    24,
    'iVBORw0KGgoAAAANSUhEUgAAAEoAAABJCAYAAACaRLDfAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAHTSURBVHic7du/SwJxGMfx5+4yErKM6wcGCS2tBUkNba1NFTU39R809sOW9ra29qjGqD8h+wFBY+VSQ0lCGhand23CyVkfTvNR+LzGB+X78Oa+IoKG53me0J9M7QU6BUOBGArEUCCGAjEUiKFADAViKBBDgRgKxFAghgIxFIihQAwFYigQQ4EYCsRQIIYCMRSIoUAMBWIoEEOBGArUFfaNzvWTvKW2oNcOXe1KZHo87FEq59XiEwViKBBDgUJ/RpmjAxLbWfLN3PeifO5fNLxUO5xXK3QoKxGX2Paib1Z+eP23xVt9Xi1ePRBDgRgKxFAghgIxFIihQAwFYihQ6G/mTVVxpXR0Kc5tVqwxW6Krs2IO92lv5aMeyit+SW5+T5zMY3VWSJ+KfbYhkVRzf1NqhPrV+9g89kUSEXFzBcmvHShtFEw91Pf5XeC8fP8slZd8i7epTz3UrwxDe4Mq9VA9C1OB88hkUqxEvMXb1KceKpZelu65Cd/MHOmX+OG60kbBjLb4B6jrSekkI85NVqzkoERXZsS0e7W38mmPUB1A/ep1CoYCMRSIoUAMBWIoEEOBGArEUCCGAjEUiKFADAViKBBDgRgKxFAghgIxFIihQAwF+gFZs2Ect4RE/wAAAABJRU5ErkJggg=='
  ),
  createData(
    '2.37',
    'Ice cream sandwich',
    'subsubsection',
    37,
    'iVBORw0KGgoAAAANSUhEUgAAAEoAAABJCAYAAACaRLDfAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAHTSURBVHic7du/SwJxGMfx5+4yErKM6wcGCS2tBUkNba1NFTU39R809sOW9ra29qjGqD8h+wFBY+VSQ0lCGhand23CyVkfTvNR+LzGB+X78Oa+IoKG53me0J9M7QU6BUOBGArEUCCGAjEUiKFADAViKBBDgRgKxFAghgIxFIihQAwFYigQQ4EYCsRQIIYCMRSIoUAMBWIoEEOBGArUFfaNzvWTvKW2oNcOXe1KZHo87FEq59XiEwViKBBDgUJ/RpmjAxLbWfLN3PeifO5fNLxUO5xXK3QoKxGX2Paib1Z+eP23xVt9Xi1ePRBDgRgKxFAghgIxFIihQAwFYihQ6G/mTVVxpXR0Kc5tVqwxW6Krs2IO92lv5aMeyit+SW5+T5zMY3VWSJ+KfbYhkVRzf1NqhPrV+9g89kUSEXFzBcmvHShtFEw91Pf5XeC8fP8slZd8i7epTz3UrwxDe4Mq9VA9C1OB88hkUqxEvMXb1KceKpZelu65Cd/MHOmX+OG60kbBjLb4B6jrSekkI85NVqzkoERXZsS0e7W38mmPUB1A/ep1CoYCMRSIoUAMBWIoEEOBGArEUCCGAjEUiKFADAViKBBDgRgKxFAghgIxFIihQAwF+gFZs2Ect4RE/wAAAABJRU5ErkJggg=='
  ),
  createData(
    '2.62',
    'Eclair',
    'subsection',
    24,
    'iVBORw0KGgoAAAANSUhEUgAAAEoAAABJCAYAAACaRLDfAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAHTSURBVHic7du/SwJxGMfx5+4yErKM6wcGCS2tBUkNba1NFTU39R809sOW9ra29qjGqD8h+wFBY+VSQ0lCGhand23CyVkfTvNR+LzGB+X78Oa+IoKG53me0J9M7QU6BUOBGArEUCCGAjEUiKFADAViKBBDgRgKxFAghgIxFIihQAwFYigQQ4EYCsRQIIYCMRSIoUAMBWIoEEOBGArUFfaNzvWTvKW2oNcOXe1KZHo87FEq59XiEwViKBBDgUJ/RpmjAxLbWfLN3PeifO5fNLxUO5xXK3QoKxGX2Paib1Z+eP23xVt9Xi1ePRBDgRgKxFAghgIxFIihQAwFYihQ6G/mTVVxpXR0Kc5tVqwxW6Krs2IO92lv5aMeyit+SW5+T5zMY3VWSJ+KfbYhkVRzf1NqhPrV+9g89kUSEXFzBcmvHShtFEw91Pf5XeC8fP8slZd8i7epTz3UrwxDe4Mq9VA9C1OB88hkUqxEvMXb1KceKpZelu65Cd/MHOmX+OG60kbBjLb4B6jrSekkI85NVqzkoERXZsS0e7W38mmPUB1A/ep1CoYCMRSIoUAMBWIoEEOBGArEUCCGAjEUiKFADAViKBBDgRgKxFAghgIxFIihQAwF+gFZs2Ect4RE/wAAAABJRU5ErkJggg=='
  ),
  createData(
    '3.05',
    'Cupcake',
    'section',
    67,
    'iVBORw0KGgoAAAANSUhEUgAAAEoAAABJCAYAAACaRLDfAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAHTSURBVHic7du/SwJxGMfx5+4yErKM6wcGCS2tBUkNba1NFTU39R809sOW9ra29qjGqD8h+wFBY+VSQ0lCGhand23CyVkfTvNR+LzGB+X78Oa+IoKG53me0J9M7QU6BUOBGArEUCCGAjEUiKFADAViKBBDgRgKxFAghgIxFIihQAwFYigQQ4EYCsRQIIYCMRSIoUAMBWIoEEOBGArUFfaNzvWTvKW2oNcOXe1KZHo87FEq59XiEwViKBBDgUJ/RpmjAxLbWfLN3PeifO5fNLxUO5xXK3QoKxGX2Paib1Z+eP23xVt9Xi1ePRBDgRgKxFAghgIxFIihQAwFYihQ6G/mTVVxpXR0Kc5tVqwxW6Krs2IO92lv5aMeyit+SW5+T5zMY3VWSJ+KfbYhkVRzf1NqhPrV+9g89kUSEXFzBcmvHShtFEw91Pf5XeC8fP8slZd8i7epTz3UrwxDe4Mq9VA9C1OB88hkUqxEvMXb1KceKpZelu65Cd/MHOmX+OG60kbBjLb4B6jrSekkI85NVqzkoERXZsS0e7W38mmPUB1A/ep1CoYCMRSIoUAMBWIoEEOBGArEUCCGAjEUiKFADAViKBBDgRgKxFAghgIxFIihQAwF+gFZs2Ect4RE/wAAAABJRU5ErkJggg=='
  ),
  createData(
    '3.56',
    'Gingerbread',
    'subsection',
    49,
    'iVBORw0KGgoAAAANSUhEUgAAAEoAAABJCAYAAACaRLDfAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAHTSURBVHic7du/SwJxGMfx5+4yErKM6wcGCS2tBUkNba1NFTU39R809sOW9ra29qjGqD8h+wFBY+VSQ0lCGhand23CyVkfTvNR+LzGB+X78Oa+IoKG53me0J9M7QU6BUOBGArEUCCGAjEUiKFADAViKBBDgRgKxFAghgIxFIihQAwFYigQQ4EYCsRQIIYCMRSIoUAMBWIoEEOBGArUFfaNzvWTvKW2oNcOXe1KZHo87FEq59XiEwViKBBDgUJ/RpmjAxLbWfLN3PeifO5fNLxUO5xXK3QoKxGX2Paib1Z+eP23xVt9Xi1ePRBDgRgKxFAghgIxFIihQAwFYihQ6G/mTVVxpXR0Kc5tVqwxW6Krs2IO92lv5aMeyit+SW5+T5zMY3VWSJ+KfbYhkVRzf1NqhPrV+9g89kUSEXFzBcmvHShtFEw91Pf5XeC8fP8slZd8i7epTz3UrwxDe4Mq9VA9C1OB88hkUqxEvMXb1KceKpZelu65Cd/MHOmX+OG60kbBjLb4B6jrSekkI85NVqzkoERXZsS0e7W38mmPUB1A/ep1CoYCMRSIoUAMBWIoEEOBGArEUCCGAjEUiKFADAViKBBDgRgKxFAghgIxFIihQAwF+gFZs2Ect4RE/wAAAABJRU5ErkJggg=='
  ),
];

export default function RegulationsTable(): JSX.Element {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Hoofdstuk</TableCell>
            <TableCell>Titel</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Index</TableCell>
            <TableCell>Icoon</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.title}>
              <TableCell component="th" scope="row">
                {row.chapter}
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.level}</TableCell>
              <TableCell>{row.index}</TableCell>
              <TableCell>
                <Icon>
                  <img
                    className={classes.icon}
                    src={`data:image/png;base64,${row.icon}`}
                  />
                </Icon>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
