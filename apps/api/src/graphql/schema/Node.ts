import { builder } from '../builder.js';
import { Visibility as DBVisibility, Language as DBLanguage } from '@prisma/client';

export const sortOrder = builder.enumType('sortOrder', {
  values: ['asc', 'desc'] as const,
});

export const OrderBy = builder.inputType('OrderBy', {
  fields: (t) => ({
    key: t.string({ required: true }),
    order: t.field({ type: sortOrder }),
  }),
});

export const Visibility = builder.enumType('Visibility', {
  values: Object.values(DBVisibility),
});

export const Language = builder.enumType('Language', {
  values: Object.values(DBLanguage),
});
