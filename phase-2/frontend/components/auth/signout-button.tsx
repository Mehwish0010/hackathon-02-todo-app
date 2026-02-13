"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

interface SignoutButtonProps {
  className?: string;
}

export function SignoutButton({ className }: SignoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);

    try {
      await signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
      // Still redirect even on error to clear client state
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
      loading={loading}
      className={className}
    >
      Sign Out
    </Button>
  );
}
