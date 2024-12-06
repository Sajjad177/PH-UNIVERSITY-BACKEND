//TODO : this is duplicate error handling another way for handling duplicate name. When we depend on mongoose validation error.[unique name]
// TODO : this is 2nd layer of duplicate name error handling ->
import {
  TErrorSource,
  TGenericErrorResponse,
} from '../modules/interface/globalInterface';

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const match = error?.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSource: TErrorSource = [
    {
      path: '',
      message: `${extractedMessage} is already exist`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate name error',
    errorSource,
  };
};

export default handleDuplicateError;
