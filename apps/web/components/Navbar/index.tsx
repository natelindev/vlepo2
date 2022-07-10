import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { a, useSpring, useSprings } from 'react-spring';
import { Dropdown, Logo, NavLink, useOnClickOutside } from 'ui';
import { shapes } from 'ui/util/shapes';

import { Globals } from '@react-spring/shared';
import { useColorMode, useTheme } from '@xstyled/styled-components';

import LoginModal from '../Modals/LoginModal';
import UserSection from '../UserSection';
import {
  BaseNavbar,
  LeftNavCollapse,
  ModeSwitch,
  NavbarNav,
  NavbarToggler,
  NavBrand,
  NavSearchBar,
  RightNavCollapse,
  TogglerBar,
} from './style';

export const SearchBarContext = React.createContext<
  | { showSearch: boolean; setShowSearch: React.Dispatch<React.SetStateAction<boolean>> }
  | Record<string, never>
>({});

const Navbar: React.FC = () => {
  Globals.assign({
    frameLoop: 'always',
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const theme = useTheme();
  const [colorMode, setColorMode] = useColorMode();
  const [isToggled, setIsToggled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const togglerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { x } = useSpring({ config: { duration: 300 }, x: colorMode === 'default' ? 0 : 1 });

  const toggleToggler = () => setIsToggled(!isToggled);
  const closeToggler = () => setIsToggled(false);

  useOnClickOutside(togglerRef, closeToggler);

  const toggleSprings = useSprings(3, [
    {
      transformOrigin: '0% 0%',
      transform: isToggled ? 'rotate(45deg)' : 'rotate(0deg)',
    },
    {
      opacity: isToggled ? '0' : '1',
    },
    {
      transformOrigin: '0% 100%',
      transform: isToggled ? 'rotate(-45deg)' : 'rotate(0deg)',
    },
  ] as {
    opacity?: string;
    transformOrigin?: string;
    transform?: string;
  }[]);

  return (
    <SearchBarContext.Provider value={{ showSearch, setShowSearch }}>
      <BaseNavbar>
        <Dropdown mt="4px" show={isToggled}>
          <NavbarToggler
            ref={togglerRef}
            onClick={toggleToggler}
            display={{ xs: 'block', sm: 'none' }}
          >
            {toggleSprings.map((styles, key) => (
              // eslint-disable-next-line react/no-array-index-key
              <TogglerBar key={key} style={styles} />
            ))}
          </NavbarToggler>
          <NavLink href="/posts">Posts</NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/papers">Papers</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink target="_blank" href="/rss.xml">
            RSS
          </NavLink>
          {/* <NavLink href="/tags">Tags</NavLink> */}
          {/* <NavLink href="/thoughts">Thoughts</NavLink>
          <NavLink href="/friends">Friends</NavLink>
           */}
        </Dropdown>
        <Logo
          size="32px"
          onClick={() => router.push('/')}
          cursor="pointer"
          ml={{ xs: '0', sm: '0.5rem' }}
          mr="0.5rem"
          my="auto"
        />
        <Link href="/" passHref>
          <NavBrand
            display={{ xs: showSearch ? 'none' : 'inline-block', md: 'inline-block' }}
            href="/"
            mr="auto"
          >
            {process.env.NEXT_PUBLIC_DEFAULT_BLOG_NAME}
          </NavBrand>
        </Link>
        <LeftNavCollapse display={{ xs: 'none', sm: 'block' }}>
          <NavbarNav>
            <NavLink href="/posts">Posts</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/papers">Papers</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink target="_blank" href="/rss.xml">
              RSS
            </NavLink>
            {/* <NavLink href="/tags">Tags</NavLink> */}
            {/* <Dropdown mt="4px">
              <NavLink href="">More</NavLink>
              <NavLink href="/thoughts">
                <NavItem>Thoughts</NavItem>
              </NavLink>
              <NavLink href="/friends">
                <NavItem>Friends</NavItem>
              </NavLink>
            </Dropdown> */}
          </NavbarNav>
        </LeftNavCollapse>
        <RightNavCollapse>
          <NavbarNav>
            <NavSearchBar />
            <ModeSwitch
              w="1.5rem"
              h="100%"
              my="auto"
              mx="1.2rem"
              onClick={() => setColorMode(colorMode === 'default' ? 'dark' : 'default')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill={theme.colors.text}
              >
                <a.path
                  d={x.to({
                    range: [0, 1],
                    output: [shapes.lightMode, shapes.darkMode],
                  })}
                />
              </svg>
            </ModeSwitch>
            <UserSection setShowLoginModal={setShowLoginModal} />
          </NavbarNav>
        </RightNavCollapse>
        <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </BaseNavbar>
    </SearchBarContext.Provider>
  );
};

export default Navbar;
