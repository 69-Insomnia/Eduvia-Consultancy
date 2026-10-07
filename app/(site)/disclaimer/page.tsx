import View from '../../../views/Disclaimer';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('disclaimer');

export default function Page() {
  return <View />;
}
