import View from '../../../views/StudyAbroad';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('study-abroad');

export default function Page() {
  return <View />;
}
