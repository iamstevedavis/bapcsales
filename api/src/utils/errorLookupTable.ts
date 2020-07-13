const table = {
  internalServerError: {
    status: 500,
    message: 'Unknown error occurred.',
  },
  userNotFound: {
    status: 404,
    message: 'Could not find the specified user.',
  },
  submissionNotFound: {
    status: 404,
    message: 'Could not find the specified submission.',
  },
  invalidParameters: {
    status: 400,
    message: 'Invalid parameters.',
  },
};

const lookupTable = (code) => table[code];
export { lookupTable as default };
