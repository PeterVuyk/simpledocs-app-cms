import Bugsnag from '@bugsnag/js';

const isDevelopmentEnv = (): boolean => process.env.NODE_ENV === 'development';

const errorWithReason = (errorMessage: string, reason: string): void => {
  if (isDevelopmentEnv()) {
    console.error('errorMessage', errorMessage, 'reason', reason);
    return;
  }
  Bugsnag.notify(
    new Error(`errorMessage: ${errorMessage} error reason: ${reason}`)
  );
};

const error = (errorMessage: string): void => {
  if (isDevelopmentEnv()) {
    console.error('errorMessage', errorMessage);
    return;
  }
  Bugsnag.notify(new Error(`errorMessage: ${errorMessage}`));
};

const logger = {
  errorWithReason,
  error,
};

export default logger;
