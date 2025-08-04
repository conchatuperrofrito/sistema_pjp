import { ReactNode, FC, useRef, useEffect, useState } from "react";

interface SlideDownProps {
  isOpen: boolean;
  children: ReactNode;
}

const SlideDown: FC<SlideDownProps> = ({ isOpen, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight;
      setHeight(contentHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        height: height !== undefined ? `${height}px` : undefined,
        visibility: height === 0 ? "hidden" : "visible",
        transition: "height 0.3s ease-out, visibility 0.3s ease-out",
        opacity: isOpen ? 1 : 0
      }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default SlideDown;
