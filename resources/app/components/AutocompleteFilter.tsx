import { ReactNode } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

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

type AutocompleteFilterProps<T> = AsyncProps<T> | SyncProps<T>;

export const AutocompleteFilter = <T extends { value: string; label: string }>(
  props: AutocompleteFilterProps<T>
) => {
  const isAsync = "queryFn" in props;

  const queryResult: UseQueryResult<T[], unknown> = useQuery({
    queryKey: isAsync ? [props.queryKey] : [],
    queryFn: isAsync ? props.queryFn : () => Promise.resolve([]),
    enabled: isAsync,
    refetchInterval: isAsync ? props.refetchInterval ?? false : false
  });

  const items = isAsync ? queryResult.data ?? [] : (props as SyncProps<T>).items;
  const isLoading = isAsync ? queryResult.isFetching : (props as SyncProps<T>).isLoading ?? false;
  const isDisabled = isAsync ? queryResult.isFetching : props.isDisabled ?? false;

  const {
    className,
    placeholder,
    ariaLabel,
    emptyContent,
    onSelectionChange,
    selectedKey,
    renderStartContent
  } = props as BaseProps<T>;

  return (
    <Autocomplete
      className={className}
      aria-label={ariaLabel}
      label={placeholder}
      size="sm"
      items={items}
      isLoading={isLoading}
      isDisabled={isDisabled}
      selectedKey={selectedKey}
      onSelectionChange={(value) => onSelectionChange(value as string)}
      listboxProps={{ emptyContent }}
      clearButtonProps={{ style: { position: "absolute", right: "2rem", zIndex: 100 } }}
      inputProps={{
        classNames: {
          inputWrapper:
            "group-data-[focus-visible=true]:pb-[8px] group-data-[focus=true]:pb-[8px] group-data-[filled-within=true]:pb-[8px]",
          label:
            "group-data-[focus=true]:text-[11px] group-data-[filled-within=true]:text-[11px]"
        }
      }}
    >
      {(item) => (
        <AutocompleteItem
          key={item.value}
          startContent={renderStartContent?.(item) ?? null}
          textValue={item.label}
        >
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};
