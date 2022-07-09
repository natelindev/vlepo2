import { ExtendedContext } from '../../server';

export const getImageCDNUrl = async (
  id: string | null | undefined,
  ctx: ExtendedContext,
  path = '/user-images/',
) => {
  if (id) {
    const image = await ctx.prisma.image.findFirst({
      where: {
        id,
      },
    });
    if (image) {
      return new URL(`${path}${image.id}.${image.extension}`, process.env.CDN_ENDPOINT).href;
    }
  }
  return null;
};
