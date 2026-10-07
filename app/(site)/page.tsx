import View from '../../views/Home';
import { getPageMetadata } from '../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('home');

export default function Page() {
  return <View />;
}
