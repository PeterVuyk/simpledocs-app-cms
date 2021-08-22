import useLocalStorage from './useLocalStorage';
import { EDIT_STATUS_DRAFT } from '../../model/EditStatus';

function useStatusToggle() {
  const [editStatus, setEditStatus] = useLocalStorage(
    'editStatus',
    () => EDIT_STATUS_DRAFT
  );
  return [editStatus, setEditStatus];
}

export default useStatusToggle;
