import Image from 'next/image';

import styled, { x } from '@xstyled/styled-components';

type BaseAvatarProps = {
  size?: number;
  variant?: 'default' | 'round';
};

const BaseAvatar = styled(x.div)<BaseAvatarProps>`
  display: flex;
  height: ${(props) => `${props.size}px`};
  width: ${(props) => `${props.size}px`};

  > div {
    border-radius: ${(props) =>
      props.variant === 'default' ? `${props.theme.radii.default}` : '50%'};
  }
`;

type AvatarProps = React.ComponentProps<typeof BaseAvatar> & {
  src?: string | null;
  size?: number;
  variant?: 'default' | 'round';
};

const Avatar = (props: AvatarProps) => {
  const { src, size = 24, ...rest } = props;

  return (
    <BaseAvatar size={size} {...rest}>
      <Image src={src ?? '/images/avatar/bot.svg'} layout="fixed" height={size} width={size} />
    </BaseAvatar>
  );
};

export default Avatar;
