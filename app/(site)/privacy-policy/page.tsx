import View from '../../../views/PrivacyPolicy';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('privacy-policy');

export default function Page() {
  return <View />;
}
