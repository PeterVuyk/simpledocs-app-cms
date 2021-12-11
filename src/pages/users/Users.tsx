import React, { FC, useCallback, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import PageHeading from '../../layout/PageHeading';
import { UserInfo } from '../../model/users/UserInfo';
import LoadingSpinner from '../../components/LoadingSpinner';
import dateTimeHelper from '../../helper/dateTimeHelper';
import listAllUsers from '../../firebase/functions/listAllUsers';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import { CALCULATIONS_PAGE } from '../../navigation/UrlSlugs';
import CreateUserFormDialog from './CreateUserFormDialog';
import DeleteUser from './DeleteUser';
import { useAuth } from '../../authentication/AuthProvider';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
  button: {
    marginLeft: 8,
  },
});

interface Props {
  title: string;
}

const Users: FC<Props> = ({ title }) => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [showCreateUserDialog, setShowCreateUserDialog] =
    useState<boolean>(false);
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { currentUser } = useAuth();

  const loadUsers = useCallback(() => {
    setUsers([]);
    listAllUsers()
      .then(setUsers)
      .catch((reason) => {
        logger.errorWithReason('Failed to list all users to UI', reason);
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage:
              'Het openen van de gebruikers pagina is mislukt',
          })
        );
        history.push(CALCULATIONS_PAGE);
      });
  }, [dispatch, history]);

  useEffect(() => {
    loadUsers();
  }, [dispatch, history, loadUsers]);

  return (
    <>
      <PageHeading title={title}>
        <>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => setShowCreateUserDialog(true)}
          >
            Gebruiker toevoegen
          </Button>
          {showCreateUserDialog && (
            <CreateUserFormDialog
              oncloseDialog={() => setShowCreateUserDialog(false)}
              openCreateUserDialog={showCreateUserDialog}
              onSubmit={loadUsers}
            />
          )}
        </>
      </PageHeading>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Laatste keer ingelogd</strong>
              </TableCell>
              <TableCell>
                <strong>Actief</strong>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length !== 0 &&
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.lastSignInTime
                      ? dateTimeHelper.dateString(
                          dateTimeHelper.convertTimezone(user.lastSignInTime)
                        )
                      : 'Nog niet eerder ingelogd'}
                  </TableCell>
                  <TableCell>{user.disabled ? 'Inactief' : 'Actief'}</TableCell>
                  <TableCell>
                    {user.userId !== currentUser?.uid && (
                      <DeleteUser userInfo={user} onSubmit={loadUsers} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {users.length === 0 && <LoadingSpinner />}
    </>
  );
};

export default Users;
