import log from 'loglevel';
import { serialize } from 'next-mdx-remote/serialize.js';

export const renderMdx = async (content: string) => {
  try {
    return JSON.stringify(await serialize(content));
  } catch (error) {
    log.error(`render error: ${error}`);
  }
  return '{}';
};
