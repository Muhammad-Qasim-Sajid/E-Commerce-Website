import { Suspense } from 'react';
import OrderTracking from '../../../components/store/Order-Tracking';
import Loading from './loading';

export default function TrackOrder() {
  return (
    <Suspense fallback={<Loading />}>
      <OrderTracking />
    </Suspense>
  );
}