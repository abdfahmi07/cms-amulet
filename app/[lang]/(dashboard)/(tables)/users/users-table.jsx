"use client";
import * as React from "react";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { data } from "./data";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function UsersTable() {
  const [users, setUsers] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [columns, setColumns] = React.useState([
    {
      accessorKey: "avatar",
      header: () => {
        return <div className="ml-5">Avatar</div>;
      },
      cell: ({ row }) => (
        <Avatar className="rounded-lg m-auto">
          <AvatarImage src={row.original.avatar} />
          <AvatarFallback>{`Avatar ${row.original.fullname}`}</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "fullname",
      header: "Fullname",
      cell: ({ row }) => (
        <div className="capitalize whitespace-nowrap">
          {row.getValue("fullname") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{row.getValue("email") || "-"}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{row.getValue("phone") || "-"}</div>
      ),
    },
    {
      accessorKey: "emergency_contact",
      header: "Emergency Contact",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.getValue("emergency_contact") || "-"}
        </div>
      ),
    },
    // {
    //   accessorKey: "description",
    //   header: "Description",
    //   cell: ({ row }) => (
    //     <div className="capitalize whitespace-nowrap">
    //       {row.getValue("description")
    //         ? row.getValue("description").length > 40
    //           ? `${row.getValue("description").substring(0, 40)}...`
    //           : row.getValue("description")
    //         : "-"}
    //     </div>
    //   ),
    // },

    {
      id: "actions",
      header: ({ column }) => {
        return <div className="text-left">Actions</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="flex gap-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className=" h-7 w-7"
                  color="secondary"
                >
                  <Icon icon="heroicons:eye" className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent size="xl">
                <DialogHeader>
                  <DialogTitle className="text-base font-medium text-default-700 ">
                    Detail User
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-default-500 space-y-4">
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">Avatar</p>
                      <Avatar className="rounded-lg h-[56px] w-[56px]">
                        <AvatarImage src={row.original.avatar} />
                        <AvatarFallback>{`Avatar ${row.original.fullname}`}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">Fullname</p>
                      <p className="text-sm text-default-900">
                        {row.original.fullname}
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">Username</p>
                      <p className="text-sm text-default-900">
                        {row.original.username || "-"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">Address</p>
                      <p className="text-sm text-default-900">
                        {row.original.address || "-"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">Email</p>
                      <p className="text-sm text-default-900">
                        {row.original.email || "-"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">Phone</p>
                      <p className="text-sm text-default-900">
                        {row.original.phone || "-"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">NIK</p>
                      <p className="text-sm text-default-900">
                        {row.original.nik || "-"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">
                        Emergency Contact
                      </p>
                      <p className="text-sm text-default-900">
                        {row.original.emergency_contact || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-8">
                  <DialogClose asChild>
                    <Button variant="outline" color="warning">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ]);

  const getUsers = async () => {
    try {
      const { data } = await axios.get(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/admin/list/user`
      );

      setUsers(data.data);
    } catch (err) {
      toast.error("Something Went Wrong");
    }
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex items-center flex-wrap gap-2 px-4">
        {/* <Input
          placeholder="Filter Name..."
          value={table.getColumn("user.name")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("user.name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm min-w-[200px] h-10"
        /> */}
        {/* <DropdownMenu className="self-end">
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center flex-wrap gap-4 px-8 py-4">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-left"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>

          {table.getPageOptions().map((page, pageIdx) => (
            <Button
              key={`basic-data-table-${pageIdx}`}
              onClick={() => table.setPageIndex(pageIdx)}
              variant={`${
                pageIdx === table.getState().pagination.pageIndex
                  ? ""
                  : "outline"
              }`}
              className={cn("w-8 h-8")}
            >
              {page + 1}
            </Button>
          ))}

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-right"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>
        </div>
      </div>
    </>
  );
}

export default UsersTable;
