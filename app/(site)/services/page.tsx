import View from '../../../views/Services';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('services');

export default function Page() {
  return <View />;
}
