import { useQuery } from "@tanstack/react-query";
import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import Fuse from "fuse.js";
import { useCallback, useState, useMemo, useEffect } from "react";
import { useInfiniteScroll } from "@heroui/use-infinite-scroll";

interface CustomAutocompleteProps<T>
  extends AutocompleteBaseProps<T>,
    SelectionCommonProps,
    AsyncSelectionProps<T> {
  infiniteScroll?: boolean;
  isVirtualized?: boolean;
  renderItem?: (item: Option<T>) => React.ReactNode;
  popoverContentClassName?: string;
}

export const CustomAutocomplete = <T,>({
  value,
  isDisabled = false,
  queryKey,
  queryFn,
  label,
  emptyContentMessage,
  size = "sm",
  infiniteScroll = false,
  onChange,
  setSelection,
  renderItem,
  popoverContentClassName,
  ...props
}: CustomAutocompleteProps<T>) => {
  const { data: items = [], isFetching } = useQuery<Option<T>[]>({
    queryKey: [queryKey],
    queryFn,
    refetchInterval: false,
    staleTime: Infinity
  });

  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(true);
  const [page, setPage] = useState(1);

  const [filteredItems, setFilteredItems] = useState<Option<T>[]>([]);

  const fuse = useMemo(() => new Fuse(items, { keys: ["label"], threshold: 0.3 }), [items]);

  const handleInputChange = useCallback(
    (value: string) => {
      if (infiniteScroll) {
        setIsSearching(!!value);
      }

      setFilteredItems(
        value.trim() ? fuse.search(value).map((results) => results.item) : items
      );
    },
    [fuse, items, infiniteScroll]
  );

  const onLoadMore = () => {
    setPage((prev) => prev + 1);
    const newCountries = items.slice(page * 10, (page + 1) * 10);

    if (newCountries.length === 0) {
      setHasMore(false);
    }
    setFilteredItems((prev) => [...prev, ...newCountries]);
  };

  const [, scrollRef] = useInfiniteScroll({
    hasMore,
    isEnabled: !isSearching,
    shouldUseLoader: false,
    onLoadMore
  });

  const autocompleteItems = useMemo(
    () =>
      infiniteScroll
        ? !value
          ? filteredItems
          : [items.find((item) => item.value === value)!]
        : filteredItems.length
          ? filteredItems
          : items,
    [value, filteredItems, items, infiniteScroll]
  );

  const handlrOnOpenChange = useCallback(
    (isOpen: boolean) => {
      if (infiniteScroll && isOpen) {
        setPage(1);
        setHasMore(true);
        if (value) {
          setIsSearching(true);
        } else {
          setFilteredItems(items.slice(0, 10));
          setIsSearching(false);
        }
      }
    },
    [infiniteScroll, value, items]
  );

  useEffect(() => {
    if (setSelection){
      const selectedItem = items.find((item) => item.value === value);
      setSelection(selectedItem);
    }
  }, [value, items]);

  return (
    <Autocomplete
      {...props}
      onSelectionChange={onChange}
      allowsCustomValue
      aria-label={label}
      label={label}
      items={autocompleteItems}
      isLoading={isFetching}
      isDisabled={isFetching || isDisabled}
      onOpenChange={handlrOnOpenChange}
      selectedKey={value}
      listboxProps={{ emptyContent: emptyContentMessage }}
      size={size}
      onInputChange={handleInputChange}
      inputProps={{
        classNames: {
          base: "h-[66px]",
          helperWrapper: "py-0",
          inputWrapper: "h-[48px]"
        }
      }}
      scrollRef={infiniteScroll ? scrollRef : undefined}
      classNames={{
        popoverContent: popoverContentClassName
      }}
      isVirtualized={false}
    >
      {(item) => (
        <AutocompleteItem
          key={item.value || ""}
          startContent={
            item?.icon ? (
              <Avatar alt={item.label} src={item.icon} className="w-6 h-6" />
            ) : undefined
          }
          textValue={item.label}
        >
          {renderItem ? renderItem(item) : item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};
