import View from '../../../views/SuccessStories';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('success-stories');

export default function Page() {
  return <View />;
}
