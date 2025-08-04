import {
  useState,
  useMemo,
  useCallback,
  Key,
  Dispatch,
  SetStateAction,
  ReactNode
} from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  Spinner,
  Skeleton
} from "@heroui/react";

import { TableFiltersRequest } from "../types/requestInterfaces";
import { PaginationResponse } from "../types/responseInterfaces";

import { ChevronDownIcon, PlusIcon, SearchIcon, TableLayoutIcon } from "../assets/icons";
import { Column } from "../types/tableInterfaces";
import "@/css/components/TableCrud.css";
import { useMediaQuery } from "react-responsive";

interface TextTable {
  placeholderSearch: string;
  nameTable: string;
  textButtonCreate: string;
}

interface TableCrudProps<T> {
  data: T[];
  pagination: PaginationResponse;
  tableFilters: TableFiltersRequest;
  setTableFilters: Dispatch<SetStateAction<TableFiltersRequest>>;
  initialVisibleColumns: string[];
  isFetching: boolean;
  isLoading: boolean;
  columns: Column<T>[];
  extraTopContent?: ReactNode;
  renderCell: (item: T, columnKey: Key) => ReactNode;
  textTable?: TextTable;
  openModal?: () => void;
  buttonCreate?: boolean;
  columnDropdown?: boolean;
  removeWrapper?: boolean;
}

type Base = {
  id: string;
};

export const TableCrud = <T extends Base>({
  data,
  pagination,
  tableFilters,
  setTableFilters,
  initialVisibleColumns,
  isFetching,
  isLoading,
  columns,
  extraTopContent,
  renderCell,
  textTable = {
    placeholderSearch: "Buscar",
    nameTable: "resultados",
    textButtonCreate: "Crear"
  },
  openModal,
  buttonCreate = true,
  columnDropdown = true,
  removeWrapper
}: TableCrudProps<T>) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(initialVisibleColumns)
  );

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const onNextPage = useCallback(() => {
    if (tableFilters.page < pagination.totalPages) {
      setTableFilters((old) => ({ ...old, page: old.page + 1 }));
    }
  }, [tableFilters.page, pagination.totalPages]);

  const onPreviousPage = useCallback(() => {
    if (tableFilters.page > 1) {
      setTableFilters((old) => ({ ...old, page: old.page - 1 }));
    }
  }, [tableFilters.page]);

  const onRowsPerPageChange = useCallback((key: string) => {
    setTableFilters((old) => ({
      ...old,
      rowsPerPage: Number(key),
      page: 1
    }));
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setTableFilters((old) => ({ ...old, filterValue: value, page: 1 }));
    } else {
      setTableFilters((old) => ({ ...old, filterValue: "" }));
    }
  }, []);

  const onClear = useCallback(() => {
    setTableFilters((old) => ({ ...old, filterValue: "", page: 1 }));
  }, []);


  const ColumnDropdown = () => (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="h-[40px] btn-columns"
          endContent={!isMobile && <ChevronDownIcon />}
          radius="sm"
          isIconOnly={isMobile}
          isDisabled={isLoading}
        >
          {isMobile ? <TableLayoutIcon className="w-5 h-5" /> : "Columnas"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Tabla de columnas"
        closeOnSelect={false}
        selectedKeys={visibleColumns}
        selectionMode="multiple"
        onSelectionChange={setVisibleColumns}
      >
        {columns.map(({ uid, name }) => (
          <DropdownItem key={uid} className="capitalize">
            {name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div
          className={`flex justify-between flex-col md:flex-row gap-y-5 ${
            buttonCreate || extraTopContent || columnDropdown ? "gap-3" : "gap-0"
          }`}>
          <div className="flex gap-2 md:gap-3 w-full">
            <Input
              isClearable
              placeholder={textTable.placeholderSearch}
              startContent={<SearchIcon />}
              value={tableFilters.filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
              radius="sm"
              isDisabled={isLoading}
            />
            { columnDropdown && isMobile && <ColumnDropdown /> }
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-3 md:flex">
            {extraTopContent}
            { columnDropdown && !isMobile && <ColumnDropdown /> }
            {buttonCreate && (
              <Button
                color="primary"
                endContent={<PlusIcon />}
                onPress={openModal}
                className="h-[40px] order-last last:col-start-2"
                radius="sm"
                isDisabled={isLoading}
                style={{
                  minWidth: "130px"
                }}
              >
                {textTable.textButtonCreate}
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {
              isLoading ? "Cargando..." : `Total ${pagination.total} ${textTable.nameTable}`
            }
          </span>
          <Dropdown
            type="listbox"
            className="min-w-0 w-fit p-0"
            style={{
              transform: "translateY(-3px) translateX(50px)"
            }}
            radius="sm"
            isDisabled={isLoading}
          >
            <DropdownTrigger>
              <Button
                className="text-default-400 text-small bg-transparent border-none text-left h-[20px] p-0"
                style={{
                  transform: "scale(1)",
                  opacity: "1"
                }}
              >
                <div className="grid grid-cols-[auto_18px_14px] place-items-center">
                  <span className="text-small">Filas por página:</span>
                  <div className="text-small w-full pl-[2px]">{tableFilters.rowsPerPage}</div>
                  <ChevronDownIcon className="text-small" />
                </div>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              className="p-0 w-[34px]"
              aria-label="Filas por página"
              selectionMode="single"
              disallowEmptySelection
              hideSelectedIcon
              selectedKeys={new Set([tableFilters.rowsPerPage.toString()])}
              onSelectionChange={(keys) =>
                onRowsPerPageChange(Array.from(keys)[0] as string)
              }
            >
              <DropdownItem key="5">5</DropdownItem>
              <DropdownItem key="10">10</DropdownItem>
              <DropdownItem key="15">15</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    );
  }, [
    tableFilters.filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    data.length,
    pagination,
    isMobile
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-0 flex md:justify-between md:items-center flex-col md:flex-row gap-y-4 md:gap-y-0">
        {
          isLoading
            ? <Skeleton className="w-[108px] h-[36px] rounded-medium" />
            : <Pagination
              isDisabled={isLoading}
              isCompact
              showControls
              showShadow
              color="primary"
              page={tableFilters.page}
              total={pagination.totalPages}
              onChange={(page) => setTableFilters((old) => ({ ...old, page }))}
              className="p-0 m-0"
            />
        }

        <div className="flex w-[30%] justify-end gap-2 self-end md:self-center">
          <Button
            isDisabled={tableFilters.page === 1}
            onPress={onPreviousPage}
            className="h-[36px] w-[90px]"
          >
            Anterior
          </Button>
          <Button
            isDisabled={
              tableFilters.page === pagination.totalPages ||
              pagination.totalPages === 0
            }
            className="h-[36px] w-[90px]"
            onPress={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [tableFilters.page, pagination.totalPages]);

  return (
    <Table
      aria-label={"Tabla de " + textTable.nameTable}
      isHeaderSticky
      bottomContent={ bottomContent }
      bottomContentPlacement="outside"
      isCompact
      classNames={{
        wrapper: removeWrapper ? "p-0 rounded-none shadow-none" : ""
      }}
      sortDescriptor={tableFilters.sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={(sortDescriptor) =>
        setTableFilters((old) => ({ ...old, sortDescriptor }))
      }
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            maxWidth={column.maxWidth}
            minWidth={column.minWidth}
            className={column.className}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={"No se encontraron " + textTable.nameTable}
        items={data}
        loadingContent={<Spinner />}
        loadingState={isFetching ? "loading" : "idle"}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
