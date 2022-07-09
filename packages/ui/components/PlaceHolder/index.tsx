import styled, { x } from '@xstyled/styled-components';

type PlaceHolderProps = { variant?: 'fixed' | 'inline' };
const PlaceHolder = styled(x.div)<PlaceHolderProps>`
  width: 100%;
  height: 100%;
  @keyframes placeHolderShimmer {
    0% {
      background-position: 0 0;
    }
    to {
      background-position: -200% 0;
    }
  }

  animation: placeHolderShimmer 1.5s ease infinite;
  background: ${(props) =>
    `linear-gradient(90deg, ${props.theme.colors.bgMuted}, ${props.theme.colors.bgDarker}, ${props.theme.colors.bgMuted})`};
  background-size: 200%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: ${(props) => props.theme.zIndices.placeHolder};
`;

export const Loading = () => <PlaceHolder />;

export default PlaceHolder;
