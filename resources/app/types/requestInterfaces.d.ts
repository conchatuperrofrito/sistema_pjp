import { SortDescriptor } from "@nextui-org/react";

export interface TableFiltersRequest {
  page: number;
  filterValue?: string;
  rowsPerPage: number;
  sortDescriptor: SortDescriptor;
}
