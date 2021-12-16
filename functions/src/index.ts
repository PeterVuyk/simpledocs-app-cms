import {listAllUsers} from './functions/listAllUsers';
import {createUser} from './functions/createUser';
import {deleteUser} from './functions/deleteUser';
import {updateUser} from './functions/updateUser';
import {deleteImageCategory} from './functions/deleteImageCategory';

exports.cms = {listAllUsers, createUser, deleteUser, updateUser, deleteImageCategory};
