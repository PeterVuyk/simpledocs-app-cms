import React, { FC, useCallback, useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
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
import useNavigate from '../../navigation/useNavigate';

interface Props {
  title: string;
}

const Users: FC<Props> = ({ title }) => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [showCreateUserDialog, setShowCreateUserDialog] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { history } = useNavigate();
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
        <ButtonGroup>
          <Button
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
        </ButtonGroup>
      </PageHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#ddd' }}>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Laatste keer ingelogd</strong>
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
