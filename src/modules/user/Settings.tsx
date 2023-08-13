import { Typography } from '../ui';

export function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <Typography.H1 className="mb-2">Settings</Typography.H1>
        <Typography.Subtle>
          Manage your account settings here.
        </Typography.Subtle>
      </div>
    </div>
  );
}
