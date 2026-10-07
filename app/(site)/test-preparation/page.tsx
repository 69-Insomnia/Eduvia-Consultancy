import View from '../../../views/TestPreparation';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('test-preparation');

export default function Page() {
  return <View />;
}
