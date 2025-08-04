interface SelectionCommonProps {
  placeholder?: string;
  label?: string;
  size?: "sm" | "lg" | "md" | undefined;
  variant?: "flat" | "bordered" | "faded" | "underlined";
  isRequired?: boolean;
  isClearable?: boolean;
}

interface SelectionBaseProps {
  onBlur?: () => void;
  className?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

interface AsyncSelectionProps<T = unknown> {
  queryFn: () => Promise<Option<T>[]>;
  queryKey: string;
}

interface SelectSingleBaseProps<T = unknown> extends SelectionBaseProps {
  value?: string | undefined;
  onChange?: (value: string | undefined) => void;
  selectionMode?: "single";
  setSelection?: (option: Option<T> | undefined) => void;
}

interface SelectMultipleBaseProps<T = unknown> extends SelectionBaseProps {
  value?: string[] | undefined;
  onChange?: (value: string[] | undefined) => void;
  selectionMode: "multiple";
  setSelection?: (option: Option<T>[] | undefined) => void;
}

interface AutocompleteBaseProps<T = unknown> extends SelectionBaseProps {
  value?: string;
  onChange?: (key: Key | null) => void;
  emptyContentMessage: string;
  setSelection?: (option: Option<T> | undefined) => void;
}
