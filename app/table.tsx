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
import { nanoid } from "nanoid";

const PAGE_SIZE = 10;

export const BlockchainTable = ({
  data,
}: {
  data: Array<Record<string, unknown>>;
}) => {
  const columns = Object.keys(data[0] ?? {})
    .filter((k) => k !== "key")
    .map((key) => ({
      key,
      label: key.toUpperCase(),
    }));

  return (
    <section>
      <Table aria-label="Example static collection table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} allowsResizing allowsSorting>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data} loadingContent={<Spinner label="Loading..." />}>
          {(item) => (
            <TableRow key={nanoid()}>
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
