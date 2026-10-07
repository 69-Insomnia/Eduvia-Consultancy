import View from '../../../views/About';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('about');

export default function Page() {
  return <View />;
}
