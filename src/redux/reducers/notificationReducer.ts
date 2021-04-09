import reduxTypes from '../actions/reduxTypes';

const initialState = {
  notificationOptions: {
    notificationOpen: false,
    notificationType: 'success',
    notificationMessage: '',
  },
};

interface Action {
  type: string;
  data: string;
}

const notificationReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case reduxTypes.SET_NOTIFICATION:
      return {
        ...state,
        notificationOptions: action.data,
      };
    default:
      return state;
  }
};

export default notificationReducer;
