import { postViewComponent } from '../util/postView';
import { postViewSSR } from '../util/postViewSSR';

export const getServerSideProps = postViewSSR('about');
const About = postViewComponent('about');

export default About;
