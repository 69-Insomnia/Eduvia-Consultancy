import View from '../../../views/PrivacyPolicy';
import { getPageMetadata } from '../../../server/services/pageMetadata';

// Safety-net freshness: admin saves purge this path; 60s covers the rest.
export const revalidate = 60;

export const generateMetadata = () => getPageMetadata('privacy-policy');

export default function Page() {
  return <View />;
}
