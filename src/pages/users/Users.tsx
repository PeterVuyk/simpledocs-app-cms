import React, { FC, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import { functions } from '../../firebase/firebaseConnection';
import PageHeading from '../../layout/PageHeading';
import { User } from '../../model/User';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  title: string;
}

const Users: FC<Props> = ({ title }) => {
  const [users, setUsers] = useState<User[]>([]);
  const classes = useStyles();

  // TODO: Move function call to another client function
  useEffect(() => {
    functions
      .httpsCallable('cms-listAllUsers')()
      .then((value) => {
        if (value.data.success) {
          setUsers(value.data.result);
        }
        // TODO: Add proper error handling
      })
      .catch(console.log);
  }, []);

  return (
    <>
      <PageHeading title={title} />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Actief</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length !== 0 &&
              users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.disabled ? 'Inactief' : 'Actief'}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Users;
