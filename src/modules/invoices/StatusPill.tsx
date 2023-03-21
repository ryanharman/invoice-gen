import { useMemo } from 'react';
import { cn } from '~/lib';

type Props = {
  status: string;
};

export function StatusPill({ status }: Props) {
  const color = useMemo(() => {
    switch (status.toLowerCase()) {
      case "paid":
        return "green";
      case "unpaid":
        return "orange";
      case "draft":
        return "gray";
      default:
        return "gray";
    }
  }, [status]);

  return (
    <div
      className={cn(
        `w-full rounded-full px-3 py-1 text-center text-xs font-medium uppercase`,
        {
          "bg-green-300 text-green-800": color === "green",
          "bg-orange-300 text-orange-800": color === "orange",
          "bg-gray-300 text-gray-800": color === "gray",
        }
      )}
    >
      {status}
    </div>
  );
}
