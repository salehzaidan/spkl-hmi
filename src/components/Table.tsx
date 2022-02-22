/* eslint-disable react/jsx-key */

import type { Column } from 'react-table';
import { useTable } from 'react-table';

interface Props<T extends object> {
  columns: ReadonlyArray<Column<T>>;
  data: T[];
}

function Table<T extends object>({ columns, data }: Props<T>) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 shadow">
      <table
        className="w-full table-auto border-collapse text-sm"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map(headerGroup => (
            <tr
              className="border-b border-b-gray-300 bg-gray-100 text-left"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map(column => (
                <th className="p-2 font-medium" {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr
                className="whitespace-nowrap border-b border-b-gray-300 last:border-none odd:bg-gray-50 even:bg-white"
                {...row.getRowProps()}
              >
                {row.cells.map(cell => {
                  return (
                    <td className="p-2" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
