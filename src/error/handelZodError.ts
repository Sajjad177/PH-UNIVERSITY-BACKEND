import { ZodError, ZodIssue } from 'zod';

// handling zod error ->
const handleZodError = (error: ZodError) => {
  const errorSource = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSource,
  };
};

export default handleZodError;
