import styled, { x } from '@xstyled/styled-components';

type BadgeProp = {
  variant: 'primary' | 'secondary' | 'accent';
};

const Badge = styled(x.div)<BadgeProp>`
  display: inline-block;
  padding: 0.25em 0.4em;
  height: 1.2rem;
  font-size: 75%;
  font-weight: ${(props) => props.theme.fontWeights.bold};
  line-height: 1;
  color: ${(props) => props.theme.colors.whiteText};
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  z-index: ${(props) => props.theme.zIndices.badge};

  background-color: ${(props) => props.theme.colors[props.variant]};
`;

export default Badge;
