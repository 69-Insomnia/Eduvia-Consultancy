import { Suspense } from 'react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import View from '../../../views/Blogs';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('blogs');

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <View />
    </Suspense>
  );
}
