import { postViewComponent } from '../util/postView';
import { postViewSSR } from '../util/postViewSSR';

export const getServerSideProps = postViewSSR('friends');
const Friends = postViewComponent('friends');

export default Friends;
