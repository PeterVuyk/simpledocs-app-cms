import React, { FC } from 'react';
import DeleteItemAction from '../../components/ItemAction/DeleteItemAction';
import { UserInfo } from '../../model/users/UserInfo';
import deleteUser from '../../firebase/functions/deleteUser';
import { notify } from '../../redux/slice/notificationSlice';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';

interface Props {
  userInfo: UserInfo;
  onSubmit: () => void;
}

const DeleteUser: FC<Props> = ({ userInfo, onSubmit }) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    return deleteUser(userInfo)
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De gebruiker is verwijderd.',
          })
        )
      )
      .then(onSubmit)
      .catch((error) => {
        logger.errorWithReason(
          `Failed deleting userId ${userInfo.userId} with email ${userInfo.email} in DeleteUser.handleDelete`,
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het verwijderen van de gebruiker met het emailadres ${userInfo.email} is mislukt.`,
          })
        );
      });
  };

  return (
    <DeleteItemAction
      itemId={userInfo.userId}
      dialogText={`Email: ${userInfo.email}`}
      title="Weet je zeker dat je deze gebruiker wilt verwijderen?"
      onSubmit={handleDelete}
    />
  );
};

export default DeleteUser;
