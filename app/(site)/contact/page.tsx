import View from '../../../views/Contact';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('contact');

export default function Page() {
  return <View />;
}
