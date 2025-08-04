import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, Key } from "react";
import { useAsyncList } from "@react-stately/data";
import { GenericAbortSignal } from "axios";
import { SIZES } from "@/constants/sizes";


type FetchOptionsFn<T> = (
    search: string,
    signal: GenericAbortSignal,
    withData?: boolean
) => Promise<Option<T>[]>;

interface AutocompleteAsyncProps<T>
    extends AutocompleteBaseProps<T>,
    SelectionCommonProps {
        fetchOptions: FetchOptionsFn<T>;
        cacheOptions?: Option<T>[];
        setCacheOptions?: (options: Option<T>[]) => void;
        renderItem?: (item: Option<T>) => React.ReactNode;
        initialSearch?: string;
        isCustom?: boolean;
        disabledKeys?: string[]
        startContent?: React.ReactNode;
        endContent?: React.ReactNode;
        withData?: boolean;
        popoverContentClassName?: string;
    }

export const AutocompleteAsync = <T,>({
  fetchOptions,
  setSelection,
  value,
  onChange,
  emptyContentMessage,
  cacheOptions,
  setCacheOptions,
  renderItem,
  initialSearch,
  isCustom = true,
  disabledKeys,
  size = "sm",
  className = "",
  withData,
  popoverContentClassName,
  ...props
}: AutocompleteAsyncProps<T>) => {

  const list = useAsyncList<Option<T>>({
    initialFilterText: initialSearch || "",

    async load ({ signal, filterText }) {

      if (cacheOptions?.length){
        return {
          items: cacheOptions
        };
      }

      const response = await fetchOptions(filterText || "", signal, withData);

      if (initialSearch && response.length > 0){
        setCacheOptions?.(response);
      }

      return {
        items: response || []
      };
    }
  });

  useEffect(() => {
    if (initialSearch) {
      list.setFilterText(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    if (setSelection){
      const selectedItem = list.items.find((item) => item.value === value);
      setSelection(selectedItem);
    }

    if (!value && setCacheOptions) {
      setCacheOptions([]);
    }

  }, [value, list.items]);

  const handleInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const nativeEvent = event.nativeEvent as InputEvent;

    if (!nativeEvent.data && nativeEvent.inputType === "deleteContentBackward") {
      if (value) {
        event.currentTarget.value = "";
      }
    }

    const newValue = event.currentTarget.value;

    if (setCacheOptions && !newValue){
      setCacheOptions([]);
    }

    if (!list.items.find((item) => item.label === newValue) && newValue) {
      list.setFilterText(newValue);
    }
  };

  const handleSelectionChange = (selectedKey: Key | null) => {
    onChange?.(selectedKey);

    if (setCacheOptions && selectedKey){
      setCacheOptions(list.items);
    }
  };

  return (
    <div
      className={`${className} w-full`}
      style={{ height: SIZES.input[size].containerHeight }}
    >
      <Autocomplete
        onSelectionChange={handleSelectionChange}
        isLoading={list.isLoading}
        items={cacheOptions?.length ? cacheOptions : list.items}
        onInput={handleInputChange}
        selectedKey={value}
        listboxProps={{ emptyContent: emptyContentMessage }}
        disabledKeys={disabledKeys}
        size={size}
        aria-label={props.label}
        inputProps={ isCustom ? {
          classNames: {
            helperWrapper: "py-0"
          }
        }: {}}
        popoverProps={{
          placement: "bottom"
        }}
        classNames={{
          popoverContent: popoverContentClassName
        }}
        // isVirtualized={true}
        {...props}
      >
        {(item) => (
          <AutocompleteItem key={item.value} textValue={item.label}>
            {renderItem ? renderItem(item) : item.label}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};
