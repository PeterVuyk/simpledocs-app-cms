import useLocalStorage from './useLocalStorage';
import { EDIT_STATUS_PUBLISHED } from '../../model/EditStatus';

function useStatusToggle() {
  const [editStatus, setEditStatus] = useLocalStorage(
    'editStatus',
    () => EDIT_STATUS_PUBLISHED
  );
  return { editStatus, setEditStatus };
}

export default useStatusToggle;
