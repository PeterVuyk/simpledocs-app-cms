import Bugsnag from '@bugsnag/js';

const errorWithReason = (errorMessage: string, reason: string) => {
  Bugsnag.notify(
    new Error(`errorMessage: ${errorMessage} error reason: ${reason}`)
  );
};

const error = (errorMessage: string) => {
  Bugsnag.notify(new Error(`errorMessage: ${errorMessage}`));
};

const logger = {
  errorWithReason,
  error,
};

export default logger;
