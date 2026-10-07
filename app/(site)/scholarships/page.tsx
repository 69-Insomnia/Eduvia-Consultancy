import { Suspense } from 'react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import View from '../../../views/Scholarships';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('scholarships');

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <View />
    </Suspense>
  );
}
