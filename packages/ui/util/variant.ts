import { assign, getThemeValue, is, merge, Path, warn } from '@xstyled/util';

export const variant: ({
  key,
  defaultValue,
  variants,
  prop,
}: {
  key?: null | undefined;
  defaultValue: Path;
  variants?: Record<string, unknown> | undefined;
  prop?: string | undefined;
}) => (props: Record<string, Path>) => unknown =
  ({ key = null, defaultValue, variants = {}, prop = 'variant' }) =>
  (props) => {
    const themeVariants = is(key) ? getThemeValue(props, key) : null;
    const computedVariants = merge(assign({}, variants), themeVariants);
    const value = props[prop] !== undefined ? props[prop] : defaultValue;
    const result = getThemeValue(props, value, computedVariants);
    warn(is(result), `variant "${value}" not found`);
    return result;
  };
