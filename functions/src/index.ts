import {listAllUsers} from './functions/listAllUsers';
import {createUser} from './functions/createUser';
import {getUserByEmail} from './functions/getUserByEmail';

exports.cms = {listAllUsers, createUser, getUserByEmail};
