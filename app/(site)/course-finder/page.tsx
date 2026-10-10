import { Suspense } from 'react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import View from '../../../views/CourseFinder';
import { getPageMetadata } from '../../../server/services/pageMetadata';

// Safety-net freshness: admin saves purge this path; 60s covers the rest.
export const revalidate = 60;

export const generateMetadata = () => getPageMetadata('course-finder');

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <View />
    </Suspense>
  );
}
