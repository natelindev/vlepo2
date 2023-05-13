import TextareaAutosize from 'react-textarea-autosize';

import styled, { HeightProps, MarginProps, WidthProps } from '@xstyled/styled-components';

type TextAreaProps = WidthProps &
  MarginProps &
  HeightProps &
  React.ComponentProps<typeof BaseTextArea> & {
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  };
export const TextArea = (props: TextAreaProps) => {
  const { children, h, height, w, width, margin, m, ml, mr, mt, mb, ...rest } = props;
  return (
    <BaseTextArea
      style={{
        height: h || height,
        width: w || width,
        margin: m,
        marginLeft: ml || margin,
        marginRight: mr || margin,
        marginTop: mt || margin,
        marginBottom: mb || margin,
      }}
      {...rest}
    >
      {children}
    </BaseTextArea>
  );
};

const BaseTextArea = styled(TextareaAutosize)`
  display: block;
  width: 100%;
  min-height: 5rem;
  height: auto;
  overflow: auto;
  resize: vertical;
  padding-right: calc(1.5em + 0.75rem);
  font-weight: 400;
  line-height: 1.5;
  color: ${(props) => props.theme.colors.text};
  font-family: ${(props) => props.theme.fonts.content};
  padding: 0.5rem;
  font-size: ${(props) => props.theme.fontSizes.sm};
  background-color: ${(props) => props.theme.colors.bgMuted};
  background-clip: padding-box;
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.muted};
  }
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);
`;
