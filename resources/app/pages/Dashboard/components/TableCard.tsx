import { PaginatedDataResponse } from "@/types/responseInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { Key, ReactNode, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableColumn,
  TableRow,
  Spinner,
  Skeleton,
  Pagination
} from "@heroui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface BaseItem {
  id: string | number;
}

interface TableCardProps<T extends BaseItem> {
  title: string;
  columns: {
    key: keyof T | string;
    label: string;
    size?: string;
  }[];
  renderCell?: (item: T, key: Key) => ReactNode;
  queryKey: string;
  queryFn: (filter: TableFiltersRequest) => Promise<PaginatedDataResponse<T>>;
}

const TableCard = <T extends BaseItem>({
  title,
  columns,
  renderCell = (item: T, columnKey: Key) => {
    const key = columnKey.toString();
    return <>{String(item[key as keyof T])}</>;
  },
  queryFn,
  queryKey
}: TableCardProps<T>) => {

  const [tableFilters, setTableFilters] = useState<TableFiltersRequest>({
    page: 1,
    rowsPerPage: 5,
    sortDescriptor: { column: "", direction: "ascending" }
  });

  const {
    isLoading,
    data: {
      data: items = [],
      pagination: {
        totalPages = 0
      } = {}
    } = {},
    isFetching
  } = useQuery<PaginatedDataResponse<T>>({
    queryKey: [queryKey, { ...tableFilters }],
    queryFn: () => queryFn({ ...tableFilters }),
    placeholderData: keepPreviousData
  });

  const bottomContent = useMemo(() =>
    <div className="py-2 px-0 flex justify-between items-center">
      {
        isLoading
          ? <Skeleton className="w-[108px] h-[36px] rounded-medium" />
          : <Pagination
            isDisabled={isLoading}
            isCompact
            showControls
            showShadow
            color="primary"
            total={totalPages}
            page={tableFilters.page}
            onChange={(page) => setTableFilters((old) => ({ ...old, page }))}
          />
      }
    </div>
  , [totalPages, tableFilters.page]);

  return (
    <Card>
      <CardBody>
        <h2 className="text-lg font-semibold">{title}</h2>
        <Table
          aria-label={title}
          removeWrapper
          bottomContent={bottomContent}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                style={{ width: column.size }}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={items}
            isLoading={isLoading}
            emptyContent="No hay registros"
            loadingContent={<Spinner />}
            loadingState={isFetching ? "loading" : "idle"}
            style={{ height: "280px" }}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell className="px-0 pl-[0.5rem]">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default TableCard;
