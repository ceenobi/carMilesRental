import { clearUserSession } from "@/api/queries/auth";
import { useEffect } from "react";
import { useActionData, useNavigate } from "react-router";
import { toast } from "sonner";

export default function Logout() {
  const actionData = useActionData<{ success: boolean }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.success) {
      toast.success(`Successfully logged out`, {
        id: "logout",
      });
      clearUserSession();
      navigate("/login");
    }
  }, [actionData, navigate]);
  return null;
}
