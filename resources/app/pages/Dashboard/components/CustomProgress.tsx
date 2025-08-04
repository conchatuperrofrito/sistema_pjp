import { FC, useEffect, useState } from "react";
import { Progress } from "@heroui/react";

interface CustomProgressProps {
    value: number;
    specialty: string;
    color: "success" | "warning" | "secondary";
}

const CustomProgress: FC<CustomProgressProps> = ({ value, specialty, color }) => {

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


  return (
    <>
      <span className="text-xs font-semibold">{specialty}</span>
      <Progress
        aria-label={specialty + " progress"}
        size="md"
        value={displayedValue}
        showValueLabel
        color={color}
        classNames={{
          base: "flex-row-reverse",
          value: "text-xs",
          track: "w-full"
        }}
      />
    </>
  );
};

export default CustomProgress;
