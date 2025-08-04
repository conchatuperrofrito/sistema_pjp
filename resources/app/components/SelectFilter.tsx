import { ReactNode } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Select, SelectItem } from "@heroui/react";

interface BaseProps<T> {
  className?: string;
  placeholder: string;
  ariaLabel: string;
  emptyContent: string;
  onSelectionChange: (value: string) => void;
  selectedKey: string;
  renderStartContent?: (item: T) => ReactNode;
  isDisabled?: boolean;
}

interface AsyncProps<T> extends BaseProps<T> {
  queryKey: string;
  queryFn: () => Promise<T[]>;
  refetchInterval?: number | false;
}

interface SyncProps<T> extends BaseProps<T> {
  items: T[];
  isLoading?: boolean;
}

type SelectFilterProps<T> = AsyncProps<T> | SyncProps<T>;

export const SelectFilter = <T extends { value: string; label: string }>(
  props: SelectFilterProps<T>
) => {
  const isAsync = "queryFn" in props;

  const queryResult: UseQueryResult<T[], unknown> = useQuery({
    queryKey: isAsync ? [props.queryKey] : [],
    queryFn: isAsync ? props.queryFn : () => Promise.resolve([]),
    enabled: isAsync,
    refetchInterval: isAsync ? (props as AsyncProps<T>).refetchInterval ?? false : false
  });

  const items = isAsync
    ? queryResult.data ?? []
    : (props as SyncProps<T>).items;

  const isLoading = isAsync
    ? queryResult.isFetching
    : props.isLoading ?? false;

  const {
    placeholder,
    ariaLabel,
    emptyContent,
    onSelectionChange,
    selectedKey,
    renderStartContent,
    isDisabled,
    className
  } = props as BaseProps<T> & Partial<SyncProps<T>> & Partial<AsyncProps<T>>;

  return (
    <div className={`relative group ${className ?? ""}`}>
      <Select
        items={items}
        isLoading={isLoading}
        isDisabled={isDisabled || isLoading}
        selectedKeys={[selectedKey]}
        aria-label={ariaLabel}
        label={placeholder}
        size="sm"
        labelPlacement="outside"
        classNames={{
          base: "!m-0",
          label: "absolute !left-1",
          trigger: "group !h-[40px]"
        }}
        onSelectionChange={(val) =>
          val.currentKey && onSelectionChange(val.currentKey as string)
        }
        listboxProps={{ emptyContent }}
      >
        {(item) => (
          <SelectItem key={item.value} startContent={renderStartContent?.(item)}>
            {item.label}
          </SelectItem>
        )}
      </Select>

      <button
        type="button"
        className={`
          absolute right-7 top-1
          h-8 w-8 min-w-8 max-h-[32px] max-w-[32px]
          translate-x-1 flex items-center justify-center
          tap-highlight-transparent outline-none rounded-full
          transition-transform-colors-opacity motion-reduce:transition-none
          text-medium text-default-500 md:opacity-0 md:hover:bg-default/40
          cursor-pointer
          ${selectedKey === "" ? "opacity-0 pointer-events-none" : "group-hover:opacity-100"}
        `}
        onClick={() => onSelectionChange("")}
      >
        <svg
          aria-hidden="true"
          className="fill-current"
          fill="none"
          focusable="false"
          height="1em"
          role="presentation"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="1em"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
