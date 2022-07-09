import Link from 'next/link';

import { useTheme } from '@xstyled/styled-components';

import Button from '../Button';
import { BaseGradientButton, GradientButtonContent } from './style';

export type GradientButtonProps = {
  link?: string;
  colorA?: string;
  colorB?: string;
} & React.ComponentProps<typeof Button>;

const GradientButton = (props: GradientButtonProps) => {
  const theme = useTheme();
  const {
    colorA = theme.colors.primary,
    colorB = theme.colors.secondary,
    children,
    link,
    ...rest
  } = props;
  return (
    <BaseGradientButton colorA={colorA} colorB={colorB} {...rest}>
      <GradientButtonContent>
        {link ? <Link href={link}>{children}</Link> : children}
      </GradientButtonContent>
    </BaseGradientButton>
  );
};

export default GradientButton;
