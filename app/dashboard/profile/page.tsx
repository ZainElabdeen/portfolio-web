import { getUserProfile } from "@/actions/profile.action";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your portfolio profile information displayed on the main page.
        </p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
