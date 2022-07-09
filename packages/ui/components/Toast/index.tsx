import { useContext, useEffect } from 'react';
import { a, useTransition } from 'react-spring';
import { match } from 'ts-pattern';

import styled, { x } from '@xstyled/styled-components';

import { ToastContext } from './ToastProvider';
import { useToasts } from './useToasts';

export type ToastAppearanceTypes = 'error' | 'info' | 'success' | 'warning';
export type ToastPlacement =
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'top-left'
  | 'top-center'
  | 'top-right';

export type ToastProps = {
  id: string;
  message: string;
  index?: number;
  // used in hook
  // eslint-disable-next-line react/no-unused-prop-types
  duration?: number;
  type?: ToastAppearanceTypes;
  placement?: ToastPlacement;
  onMouseEnter?: () => void | undefined;
  onMouseLeave?: () => void | undefined;
  onClose?: () => void | undefined;
};

type BaseToastProps = {
  placement: ToastPlacement;
};
const BaseToast = styled(a(x.div)).withConfig({
  shouldForwardProp: (propName) => propName !== 'placement' && propName !== 'index',
})<BaseToastProps>`
  z-index: ${(props) => props.theme.zIndices.toast};
  min-height: 5rem;
  width: 15rem;
  padding: 1rem;
  color: whiteText;
  word-break: break-word;

  border-radius: ${(props) => props.theme.radii.md};

  margin-bottom: 1rem;

  margin-left: ${(props) =>
    match(props.placement)
      .with('bottom-left', () => '1rem')
      .with('bottom-center', () => 'auto')
      .with('bottom-right', () => 'auto')
      .with('top-left', () => '1rem')
      .with('top-center', () => 'auto')
      .with('top-right', () => 'auto')
      .run()};
  margin-right: ${(props) =>
    match(props.placement)
      .with('bottom-left', () => 'auto')
      .with('bottom-center', () => '1rem')
      .with('bottom-right', () => '1rem')
      .with('top-left', () => 'auto')
      .with('top-center', () => '1rem')
      .with('top-right', () => '1rem')
      .run()};

  background-color: ${(props) =>
    match(props.type)
      .with('success', () => props.theme.colors.success)
      .with('error', () => props.theme.colors.error)
      .with('info', () => props.theme.colors.link)
      .with('warning', () => props.theme.colors.warning)
      .run()};
`;

export const Toast = (props: ToastProps & React.ComponentProps<typeof BaseToast>) => {
  const { defaultPlacement } = useContext(ToastContext);
  const {
    id,
    message,
    onClose = () => null,
    onMouseEnter = () => null,
    onMouseLeave = () => null,
    type = 'info',
    index,
    placement = defaultPlacement ?? 'top-right',
    ...rest
  } = props;

  useEffect(() => {
    return () => {
      onClose?.();
    };
  }, [onClose]);

  return (
    <BaseToast
      id={id}
      type={type}
      index={index}
      placement={placement}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      {message}
    </BaseToast>
  );
};

const BaseToastContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${(props) => `calc(100% - ${props.theme.sizes.navbar})`};
  margin-bottom: auto;
`;

export const ToastContainer = () => {
  const { toasts } = useToasts();

  const transitions = useTransition(toasts, {
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 'auto' },
    leave: { opacity: 0, height: 'auto' },
    config: { tension: 125, friction: 20, precision: 0.1, duration: 200 },
  });

  return (
    <BaseToastContainer>
      {transitions((styles, toast) => (
        <Toast key={toast.id} {...toast} style={styles} />
      ))}
    </BaseToastContainer>
  );
};

export { useToasts };
