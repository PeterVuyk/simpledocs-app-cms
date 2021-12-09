import {listAllUsers} from './functions/listAllUsers';
import {createUser} from './functions/createUser';
import {getUserByEmail} from './functions/getUserByEmail';
import {deleteUser} from './functions/deleteUser';

exports.cms = {listAllUsers, createUser, getUserByEmail, deleteUser};
