'use client';
import { useSession, signOut } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

type UserRole = 'USER' | 'ADMIN' | 'PRIEST' | 'SERVANT' | 'PARENT' | 'CHILD';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <p>Access Denied. Please log in.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard!</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Session Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p>
              <strong>Name:</strong> {session?.user?.name}
            </p>
            <p>
              <strong>Email:</strong> {session?.user?.email}
            </p>
            <p>
              <strong>Role:</strong> {session?.user?.role}
            </p>
          </div>

          {session?.user?.role === 'ADMIN' && (
            <div className="p-4 bg-primary/10 rounded-md">
              <h3 className="font-bold text-lg text-primary">Admin Access</h3>
              <p>You have access to the admin area.</p>
              <Button asChild className="mt-2">
                <Link href="/admin">Go to Admin Panel</Link>
              </Button>
            </div>
          )}

          <Button onClick={() => signOut()}>Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
