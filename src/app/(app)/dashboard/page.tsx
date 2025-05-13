import PriestOverview from '@/components/dashboard/priest-overview';
import FamilyManagement from '@/components/dashboard/family-management';
import AnnouncementSystem from '@/components/dashboard/announcement-system';
import ChurchInformation from '@/components/dashboard/church-information';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-0 md:px-4 space-y-12">
      <PriestOverview />
      <Separator className="my-8" />
      <FamilyManagement />
      <Separator className="my-8" />
      <AnnouncementSystem />
      <Separator className="my-8" />
      <ChurchInformation />
    </div>
  );
}