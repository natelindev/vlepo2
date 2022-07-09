import styled, { x } from '@xstyled/styled-components';

type BaseLogoProps = { src?: string; href?: string; size?: string };

export const BaseLogo = styled(x.img)<BaseLogoProps>`
  fill: ${(props) => props.theme.colors.text};
  max-width: ${(props) => props.size};
  max-height: ${(props) => props.size};
  min-width: ${(props) => props.size};
  min-height: ${(props) => props.size};
  flex-grow: 0;
`;

type LogoProps = React.ComponentProps<typeof BaseLogo>;
const Logo = (props: LogoProps) => {
  const { size = '32px', src = '/images/logo.svg', ...rest } = props;
  return <BaseLogo src={src} alt="logo" size={size} {...rest} />;
};

export default Logo;
