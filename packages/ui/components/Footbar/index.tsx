import Logo from '../Logo';
import Social from '../Social';
import { BaseFootbar, BottomText, CenteredText, LoveIcon } from './style';

const Footbar = () => {
  return (
    <BaseFootbar flexDirection={{ sm: 'column', md: 'row' }}>
      <Logo display={{ sm: 'none', md: 'flex' }} size="42px" />
      <BottomText>
        <CenteredText mx="auto">
          © 2016-
          {new Date().getFullYear()}
          {'  '}
          {process.env.NEXT_PUBLIC_DEFAULT_BLOG_NAME}. CC-BY 4.0
        </CenteredText>
        <CenteredText>
          Made by Nathaniel with
          <LoveIcon size={18} />
          and effort
        </CenteredText>
      </BottomText>

      <Social mt={{ sm: '1rem', md: '0' }} mx={{ sm: 'auto', md: '0' }} />
    </BaseFootbar>
  );
};

export default Footbar;
