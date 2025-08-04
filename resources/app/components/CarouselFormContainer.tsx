import { FC, useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface CarouselItem {
  key: string;
  content: JSX.Element;
}

interface CarouselFormContainerProps {
  selectedForm: string;
  forms: CarouselItem[];
  gap?: number;
  isFullScreen: boolean;
}

const CarouselFormContainer: FC<CarouselFormContainerProps> = ({
  selectedForm,
  forms,
  gap = 20,
  isFullScreen = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [minHeight, setMinHeight] = useState<number>();
  const [delay, setDelay] = useState("");

  const currentIndex = useMemo(() => {
    return forms.findIndex(item => item.key === selectedForm);
  }, [selectedForm, forms]);

  const currentItem = useMemo(() => {
    return forms.find(item => item.key === selectedForm) || forms[0];
  }, [selectedForm, forms]);

  const prevIndexRef = useRef(currentIndex);
  const direction = useMemo(() => {
    if (currentIndex === -1) return 1;
    return currentIndex >= prevIndexRef.current ? 1 : -1;
  }, [currentIndex]);

  const getParentContainer = () => {
    const node = childRef.current;
    if (!node) return null;
    return node.parentElement?.parentElement?.parentElement?.parentElement;
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setDelay("delay-[0.3s]");
    const node = childRef.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        setMinHeight(newHeight);
      }
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [selectedForm]);

  const variants = useMemo(
    () => ({
      initial: (custom: number) => ({
        x: custom > 0 ? containerWidth + gap : -(containerWidth + gap)
      }),
      animate: { x: 0 },
      exit: (custom: number) => ({
        x: custom > 0 ? -(containerWidth + gap) : containerWidth + gap
      })
    }),
    [containerWidth, gap]
  );

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", minHeight }}
      className={!isFullScreen ? "transition-[min-height] duration-300 ease-in-out " + delay : ""}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          ref={childRef}
          key={currentItem.key}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationStart={() => {
            const parentContainer = getParentContainer();
            if (parentContainer) {
              parentContainer.scrollTop = 0;
            }
            parentContainer?.classList.remove("overflow-y-auto");
            parentContainer?.classList.add("hidden-scrollbar");
          }}
          onAnimationComplete={() => {
            setDelay("delay-[0.1s]");
            prevIndexRef.current = currentIndex;

            const parentContainer = getParentContainer();
            setTimeout(() => {
              parentContainer?.classList.remove("hidden-scrollbar");
              parentContainer?.classList.add("overflow-y-auto");
            }, isFullScreen ? 10 : 400);
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: "100%",
            position: "absolute"
          }}
        >
          {currentItem.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CarouselFormContainer;
