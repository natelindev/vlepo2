import { useRouter } from 'next/router';
import React from 'react';
import { deleteCookie, Dropdown, NavLink } from 'ui';

import { Dashboard, Logout, Settings } from '@styled-icons/material-outlined';

import { useCurrentUser } from '../../hooks/useCurrentUser';
import { NavItem } from '../Navbar/style';
import { GreyText, LoginButton, NavbarAvatar } from './style';

type UserSectionProps = {
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserSection = (props: UserSectionProps) => {
  const currentUser = useCurrentUser();
  const { setShowLoginModal } = props;
  const router = useRouter();

  return currentUser ? (
    <Dropdown variant="right" mt="12px">
      <NavbarAvatar size={32} src={currentUser.profileImageUrl} />
      <NavLink
        active={router.pathname.split('/').slice(-1)[0] === 'profile'}
        href={`/user/${currentUser.id}/profile`}
      >
        <NavItem>
          {currentUser.name}
          <GreyText>
            {currentUser.rolesConnection.edges.map((r) => r.node.value).join(',')}
          </GreyText>
        </NavItem>
      </NavLink>
      <NavLink
        active={router.pathname.split('/').slice(-1)[0] === 'settings'}
        href={`/user/${currentUser.id}/settings`}
      >
        <NavItem>
          <Settings size={24} /> Settings
        </NavItem>
      </NavLink>
      {currentUser.rolesConnection.edges.map((r) => r.node.value).includes('admin') && (
        <NavLink active={router.pathname.split('/')[1] === 'dashboard'} href="/dashboard/blog">
          <NavItem>
            <Dashboard size={24} /> Dashboard
          </NavItem>
        </NavLink>
      )}
      <NavLink
        onClick={() => {
          deleteCookie('accessToken');
          deleteCookie('accessToken.sig');
          setTimeout(() => router.reload(), 1000);
        }}
      >
        <NavItem>
          <Logout size={24} /> Logout
        </NavItem>
      </NavLink>
    </Dropdown>
  ) : (
    <LoginButton onClick={() => setShowLoginModal(true)} size={28} />
  );
};

export default UserSection;
