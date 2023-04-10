export const response = (status: string, message: string, token: string) => {
  return {
    status,
    data: {
      message,
      token,
    },
  };
};
