import { Spinner } from "@nextui-org/react";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import React from "react";

const PAGE_SIZE = 10;
const rows = [
  {
    key: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
];

const columns = Object.keys(rows[0])
  .filter((k) => k === "key")
  .map((key) => ({
    key,
    label: key.toUpperCase(),
  }));

export const BlockchainTable = () => {
  return (
    <section>
      <header>Displaying latest {}</header>
      <Table aria-label="Example static collection table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} allowsResizing allowsSorting>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows} loadingContent={<Spinner label="Loading..." />}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};
