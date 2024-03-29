import styled, { x } from '@xstyled/styled-components';

export const Input = styled(x.input)`
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props) => props.theme.colors.muted};
  background-color: ${(props) => props.theme.colors.bgMuted};
  background-clip: padding-box;
  border: 1px solid ${(props) => props.theme.colors.muted};
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  padding: 1rem;

  transition: all 0.3s ease-in-out;

  &:focus {
    box-shadow: ${(props) => props.theme.shadows.input};
  }
`;

export const Form = styled(x.form)`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const InputGroup = styled(x.div)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
`;

export const Label = styled(x.label)`
  font-size: 1.25rem;
  margin-left: 0.2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.text};
`;

export const ErrorText = styled(x.span)`
  margin-left: 1rem;
  color: ${(props) => props.theme.colors.error};
`;
