import View from '../../../views/StudentVisa';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('student-visa');

export default function Page() {
  return <View />;
}
