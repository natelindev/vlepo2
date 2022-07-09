import { postViewComponent } from '../../util/postView';
import { postViewSSR } from '../../util/postViewSSR';

export const getServerSideProps = postViewSSR();
const Post = postViewComponent();

export default Post;
