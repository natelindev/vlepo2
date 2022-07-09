import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import { Loading, useProgressBar } from 'ui';
import { Footer, Header, Main } from 'ui/components/Layout';

const Footbar = dynamic(() => import('ui/components/Footbar'), {
  loading: Loading,
});
const ProgressBar = dynamic(() => import('ui/components/ProgressBar'), {
  loading: Loading,
});
const Navbar = dynamic(() => import('./Navbar'), {
  loading: Loading,
});
const ScrollToTop = dynamic(() => import('ui/components/ScrollToTop'), {
  loading: Loading,
});

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  const { children } = props;
  const widthLoading = useProgressBar({ loading: true });
  // const widthScrolling = useProgressBar({ scrolling: true });

  return (
    <>
      <Head>
        <title key="title">{process.env.NEXT_PUBLIC_DEFAULT_BLOG_NAME}</title>
      </Head>
      <Header>
        <Navbar />
        {widthLoading !== 101 && <ProgressBar width={widthLoading} />}
        {/* <ProgressBar width={widthScrolling} top="3.5rem" /> */}
      </Header>
      <Main>
        {children}
        <ScrollToTop />
      </Main>
      <Footer>
        <Footbar />
      </Footer>
    </>
  );
};

export default Layout;
