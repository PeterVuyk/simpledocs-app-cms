import {listAllUsers} from './functions/listAllUsers';
import {createUser} from './functions/createUser';
import {deleteUser} from './functions/deleteUser';
import {updateUser} from './functions/updateUser';
import {deleteImageCategory} from './functions/deleteImageCategory';
import {getTextFromHtml} from './functions/getTextFromHtml';
import {sendNotification} from './functions/sendNotification';
import {getNotificationStatusInformationCron} from './functions/getNotificationStatusInformationCron';

exports.cms = {
  listAllUsers,
  createUser,
  deleteUser,
  updateUser,
  deleteImageCategory,
  getTextFromHtml,
  sendNotification,
  getNotificationStatusInformationCron,
};
