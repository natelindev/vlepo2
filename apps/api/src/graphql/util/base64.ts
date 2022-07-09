export const base64Encode = (i: string) => {
  return Buffer.from(i, 'utf8').toString('base64');
};

export const base64Decode = (i: string) => {
  return Buffer.from(i, 'base64').toString('utf8');
};
