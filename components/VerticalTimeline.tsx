import { ReactNode } from "react";

interface VerticalTimelineElementProps {
  children: ReactNode;
  icon?: ReactNode | string;
  date: string;
}

const defaultIcon = (
  <svg
    className="fill-current"
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="10"
  >
    <path
      fillRule="nonzero"
      d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
    />
  </svg>
);

export const VerticalTimeline = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {children}
    </div>
  );
};

export const VerticalTimelineElement = ({
  children,
  icon = defaultIcon,
  date,
}: VerticalTimelineElementProps) => {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white dark:bg-gray-700 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
        <div className="text-2xl" aria-hidden="true">
          {icon}
        </div>
      </div>

      {/* Card */}
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-gray-200 shadow-md">
        {children}
        <time className="block md:hidden font-medium text-xs my-2">{date}</time>
      </div>

      {/* Date in md */}
      <div className="order-1 hidden md:block text-sm font-semibold px-8">
        <time>{date}</time>
      </div>
    </div>
  );
};
