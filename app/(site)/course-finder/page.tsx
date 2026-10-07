import { Suspense } from 'react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import View from '../../../views/CourseFinder';
import { getPageMetadata } from '../../../server/services/pageMetadata';

export const generateMetadata = () => getPageMetadata('course-finder');

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <View />
    </Suspense>
  );
}
