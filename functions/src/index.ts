import {listAllUsers} from './functions/listAllUsers';
import {createUser} from './functions/createUser';
import {deleteUser} from './functions/deleteUser';

exports.cms = {listAllUsers, createUser, deleteUser};
