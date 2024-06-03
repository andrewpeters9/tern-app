import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@nextui-org/table';
import React from 'react';
import {useInfiniteReadContracts} from "wagmi";

const PAGE_SIZE = 10;

export const AddressDisplay = ({address}: { address: `0x${string}` }) => {
    const results = useInfiniteReadContracts({
        contracts(pageParam) {
            const args = [pageParam] as const;
            return [
                // {address, functionName: 'history'},
            ]
        },
        query: {
            initialPageParam: 0,
            getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
                return lastPageParam + 1
            }
        }
    })

    return (
        <section>
            <header>Displaying latest {}</header>
            <Table aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow key="1">
                        <TableCell>Tony Reichert</TableCell>
                        <TableCell>CEO</TableCell>
                        <TableCell>Active</TableCell>
                    </TableRow>
                    <TableRow key="2">
                        <TableCell>Zoey Lang</TableCell>
                        <TableCell>Technical Lead</TableCell>
                        <TableCell>Paused</TableCell>
                    </TableRow>
                    <TableRow key="3">
                        <TableCell>Jane Fisher</TableCell>
                        <TableCell>Senior Developer</TableCell>
                        <TableCell>Active</TableCell>
                    </TableRow>
                    <TableRow key="4">
                        <TableCell>William Howard</TableCell>
                        <TableCell>Community Manager</TableCell>
                        <TableCell>Vacation</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </section>
    );
};
