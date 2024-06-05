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
              {(columnKey) => {
                const value = getKeyValue(item, columnKey);
                const formatter = new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                });
                const numberFormatter = new Intl.NumberFormat("en-US", {
                  useGrouping: true,
                });

                let formattedValue = value;

                if (columnKey.toString().toLowerCase() === "timestamp") {
                  formattedValue = formatter.format(Number(value) * 1000);
                }

                if (
                  typeof formattedValue === "number" ||
                  String(Number(formattedValue)) === formattedValue
                ) {
                  formattedValue = numberFormatter.format(value);
                }

                if (value.startsWith("0x")) {
                  formattedValue = (
                    <a
                      className={"text-blue-500"}
                      href={`https://etherscan.io/address/${value}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {formattedValue.substring(0, 6)}...
                      {formattedValue.substring(formattedValue.length - 4)}
                    </a>
                  );
                }

                return <TableCell>{formattedValue}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};
