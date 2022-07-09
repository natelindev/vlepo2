import Link from 'next/link';
import { useRouter } from 'next/router';

import styled, { x } from '@xstyled/styled-components';

type SidebarProps = {
  expand?: boolean;
  width?: string;
  className?: string;
};

const BaseSidebar = styled(x.div)<SidebarProps>`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 11.5rem);

  overflow: scroll;
  width: ${(props) => (props.expand ? props.width : '1rem')};
  min-width: ${(props) => (props.expand ? props.width : '1rem')};
  z-index: ${(props) => props.theme.zIndices.sidebar};
`;

const SidebarGroup = styled(x.div)`
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled(x.h2)`
  display: flex;
  padding: 0;
  margin: 0;
`;

const SidebarItem = styled(x.div)<{ active?: boolean }>`
  display: flex;
  border-radius: 0.4rem;
  margin-left: 0.4rem;
  padding-left: 0.75rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-right: 0.75rem;
  color: ${(props) => (props.active ? props.theme.colors.link : props.theme.colors.muted)};
  transition: 0.1s background-color ease-in;
  cursor: ${(props) => (props.active ? 'default' : 'pointer')};
  ${(props) =>
    props.active
      ? ''
      : `&:hover {
    background-color: ${props.theme.colors.bgMuted};
  }`}
`;

const Sidebar = (props: SidebarProps): React.ReactElement => {
  const { width = '14rem', expand = true, className } = props;
  const router = useRouter();
  return (
    <BaseSidebar width={width} expand={expand} className={className}>
      <SidebarItem mt="0.5rem">
        <SidebarHeader>Dashboard</SidebarHeader>
      </SidebarItem>

      <SidebarGroup>
        {['blog', 'post'].map((e) => (
          <Link key={e} href={`/dashboard/${e}`} passHref>
            <SidebarItem active={router.pathname === `/dashboard/${e}`}>
              {e.charAt(0).toUpperCase()}
              {e.slice(1)}
            </SidebarItem>
          </Link>
        ))}
      </SidebarGroup>
    </BaseSidebar>
  );
};

export default Sidebar;
