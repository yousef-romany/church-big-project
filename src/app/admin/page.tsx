import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminPage() {
  const session = await auth();

  // This page is protected by middleware, so we can assume session exists
  // and the user role is ADMIN.

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a protected admin-only page.</p>
          <p>You are logged in as {session?.user?.name}.</p>
        </CardContent>
      </Card>
    </div>
  );
}
