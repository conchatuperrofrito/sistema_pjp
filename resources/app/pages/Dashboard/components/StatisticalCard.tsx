import {
  Card,
  CardBody,
  Skeleton,
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@heroui/react";

import { FC, ReactNode, useState, useEffect } from "react";

interface StatisticalCardProps {
    title: string;
    value: number | undefined;
    icon: ReactNode;
    withPopover?: boolean;
    popoverContent?: ReactNode;
    extraContent?: ReactNode;
}

const StatisticalCard: FC<StatisticalCardProps> = ({
  title,
  value,
  icon,
  withPopover,
  popoverContent,
  extraContent
}) => {
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    if (value === undefined) return;

    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      setDisplayedValue(Math.floor(progress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayedValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const content = (
    <div className={
      "h-full flex justify-between p-3 " +
      (withPopover ? "cursor-pointer" : "")
    }>
      <div className="flex flex-col gap-2 justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2 h-full">
          <span className="text-4xl font-bold">{displayedValue}</span>
          {extraContent}
        </div>
      </div>
      <div className="text-4xl flex items-center">{icon}</div>
    </div>
  );

  return (
    <Card
      classNames={{
        body: "p-0"
      }}
    >
      <CardBody>
        {value !== undefined ? (
          withPopover ? (
            <Popover
              backdrop="opaque"
              showArrow
              placement="bottom-start"
            >
              <PopoverTrigger>
                {content}
              </PopoverTrigger>
              <PopoverContent>{popoverContent}</PopoverContent>
            </Popover>
          ) : (
            <>{content}</>
          )
        ) : (
          <div className="flex flex-row justify-between  p-3">
            <div>
              <Skeleton className="w-[180px] h-[28px] rounded-sm my-1" />
              <Skeleton className="w-10 mt-2 h-[36px] rounded-md" />
            </div>
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default StatisticalCard;
