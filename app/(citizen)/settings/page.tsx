"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Display";
import { useSession } from "@/hooks/useSession";
import { authService } from "@/services";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useSession();
  const router = useRouter();

  async function signOut() {
    await authService.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-3xl font-extrabold text-navy">Profile</h1>
      <Card className="mt-6">
        <p className="text-sm text-demo">Signed in as</p>
        <p className="mt-1 text-lg font-bold text-navy">{user?.displayName}</p>
        <p className="text-sm text-demo">{user?.email}</p>
        <Button className="mt-6" variant="secondary" onClick={() => void signOut()}>
          Sign out
        </Button>
      </Card>
    </div>
  );
}
