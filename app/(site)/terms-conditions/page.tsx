import View from '../../../views/TermsConditions';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('terms-conditions');

export default function Page() {
  return <View />;
}
