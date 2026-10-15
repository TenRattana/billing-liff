import type { ComponentProps, ReactNode } from "react";
import { UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

type ProfileCardProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

function ProfileCard({
  title,
  description,
  icon = <UserRound />,
  className,
  ...props
}: ProfileCardProps) {
  return (
    <div
      data-slot="profile-card"
      className={cn(
        "flex items-center gap-3 rounded-xl bg-green-50 px-3 py-2.5",
        className
      )}
      {...props}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-line text-white [&_svg]:size-5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold">{title}</p>
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}

export { ProfileCard };
