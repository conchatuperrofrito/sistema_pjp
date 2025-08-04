import { ColumnStaticSize } from "@react-types/table";

export interface Column<T> {
  uid: Extract<keyof T, string> | "createdAt" | "updatedAt" | "actions";
  name: string;
  sortable?: boolean;
  maxWidth?: ColumnStaticSize;
  minWidth?: ColumnStaticSize;
  className?: string;
}

export type InitialVisibleColumns<T> = (
  | keyof T
  | "createdAt"
  | "updatedAt"
  | "actions"
)[];

export interface TableProps {
  openModal: () => void;
};
