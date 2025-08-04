import { forwardRef, useEffect, useRef } from "react";
import { Button, Select, SelectItem, SharedSelection } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { SIZES } from "@/constants/sizes";

interface SyncSelectProps<T> extends SelectionCommonProps {
  data: Option<T>[];
  isAsync?: false;
}

interface AsyncSelectProps<T> extends SelectionCommonProps, AsyncSelectionProps<T> {
  isAsync: true;
}

type CustomSelectProps<T> =
  | (SyncSelectProps<T> & SelectSingleBaseProps<T>)
  | (SyncSelectProps<T> & SelectMultipleBaseProps<T>)
  | (AsyncSelectProps<T> & SelectSingleBaseProps<T>)
  | (AsyncSelectProps<T> & SelectMultipleBaseProps<T>);

export const CustomSelectComponent = <T,>(
  {
    value,
    size = "sm",
    isRequired,
    className = "",
    isClearable = false,
    isDisabled = false,
    ...props
  }: CustomSelectProps<T>,
  ref: React.Ref<HTMLSelectElement>
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { setSelection, selectionMode, onChange, isAsync, ...rest } = props;

  const { data: items = [], isFetching } = useQuery({
    queryKey: isAsync ? [props.queryKey] : [],
    queryFn: isAsync ? props.queryFn : async () => props.data,
    refetchInterval: false,
    staleTime: Infinity,
    enabled: isAsync
  });

  const allItems = isAsync ? items : props.data;

  useEffect(() => {
    if (!setSelection || !value) return;

    if (selectionMode === "multiple") {
      const selectedItems = allItems.filter((item) => value.includes(item.value));
      setSelection(selectedItems);
    } else {
      const selectedItem = allItems.find((item) => item.value === value);
      setSelection(selectedItem);
    }

  }, [value, allItems, selectionMode]);

  const handleSelectionChange = (keys: SharedSelection) => {
    if (selectionMode === "multiple") {
      onChange?.(Array.from(keys, String));
    } else {
      onChange?.(Array.from(keys)[0]?.toString());
    }
  };

  return (
    <div
      style={{ height: SIZES.input[size].containerHeight }}
      className={className + " relative"}
      ref={containerRef}
    >
      <Select
        {...rest}
        selectionMode={selectionMode}
        size={size}
        isLoading={isFetching}
        isDisabled={isFetching || isDisabled}
        items={allItems}
        selectedKeys={typeof value === "string" ? [value] : value}
        onSelectionChange={handleSelectionChange}
        classNames={{
          helperWrapper: "py-0",
          label:
            isRequired && "after:content-['*'] after:text-danger after:ml-0.5"
        }}
        popoverProps={{
          placement: "bottom",
          portalContainer: containerRef.current ?? undefined
        }}
        ref={ref}
      >
        {(item) => (
          <SelectItem key={item.value}>
            {item.label}
          </SelectItem>
        )}
      </Select>

      {(isClearable && value) && (
        <div>
          <Button
            style={{
              padding: "8px",
              transform: "scale(0.8)",
              border: "none",
              fontSize: "16px",
              position: "absolute",
              top: 5,
              right: 25,
              zIndex: 1000
            }}
            variant="light"
            onPress={() => {
              if (selectionMode === "multiple") {
                onChange?.([""]);
              } else {
                onChange?.("");
              }
              setSelection?.(undefined);
            }}
            isIconOnly
            radius="full"
          >
            <svg aria-hidden="true" fill="none" focusable="false"
              height="1em" role="presentation" stroke="currentColor"
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              viewBox="0 0 24 24" width="1em">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
};

export const CustomSelect = forwardRef(CustomSelectComponent) as <T>(
  props: CustomSelectProps<T> & { ref?: React.Ref<HTMLSelectElement> }
) => ReturnType<typeof CustomSelectComponent>;
