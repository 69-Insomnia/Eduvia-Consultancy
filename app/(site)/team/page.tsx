import View from '../../../views/Team';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('team');

export default function Page() {
  return <View />;
}
