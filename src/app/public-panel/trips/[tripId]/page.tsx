
"use client";
import TripDetails from '@/components/public-panel/trips/TripDetails';
import { motion } from 'framer-motion';

export default function TripDetailsPage({ params }: { params: { tripId: string } }) {
  const { tripId } = params;

  if (!tripId) {
    return <div>لم يتم العثور على الرحلة.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8"
    >
      <TripDetails tripId={tripId} />
    </motion.div>
  );
}
