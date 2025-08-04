interface Option<T = unknown> {
  value: string;
  label: string;
  icon?: string;
  data?: T;
}

interface EntityStore<T> {
  filters: T;
  setFilters: (filters: T) => void;
  id: string;
  setId: (id: string) => void;
}

interface FormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose?: ()=> void;
}
interface FormModalConfig {
  title: string;
  isLoading?: boolean;
  isSaving?: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  customCloseButton?: {
    content?: React.ReactNode | string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    show?: boolean;
    onClick?: () => void;
    className?: string;
  },
  customSaveButton?: {
    content?: React.ReactNode | string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    show?: boolean;
    color?: "success" | "default" | "primary" | "secondary" | "warning" | "danger" | undefined
  },
  onModalClose?: () => void;
  skeletonForm?: React.ReactNode;
  extraButtonFooter?: React.ReactNode;
  extraButtonFooterPosition?: "start" | "end" | "center";
  extraContentFooter?: React.ReactNode;
  extraContentTop?: React.ReactNode;
  classNameHeader?: string;
}

interface ActionOption {
  label: string;
  icon: React.ReactNode;
}
interface TableColumnDefinition<T> {
  key: Extract<keyof T, string> | "actions";
  label: string;
  width?: number;
  maxWidth?: number;
}
