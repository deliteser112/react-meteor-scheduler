import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Switch,
  Box,
  FormControlLabel,
  Tooltip,
  IconButton
} from '@mui/material';
// hooks
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// components
import Scrollbar from '../../../components/Scrollbar';
import Iconify from '../../../components/Iconify';

import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadNoCheckBoxCustom,
  TableSelectedActions
} from '../../../components/table';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// sections
import { ScheduleTableRow, ScheduleTableToolbar } from '../../../sections/@dashboard/schedule-list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'template', label: 'Template', alignRight: false },
  { id: 'state', label: 'State', alignRight: false },
  { id: 'createdBy', label: 'Created By', alignRight: false },
  { id: 'startDate', label: 'Start Date', alignRight: false },
  { id: 'endDate', label: 'End Date', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------
export default function ScheduleList({
  scheduleList,
  isLoading,
  onDelete,
  onPreviewSchedule,
  onPublishSchedule,
  isAdmin
}) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultOrderBy: 'title'
  });

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    if (scheduleList.length) {
      setTableData(scheduleList);
    }
  }, [scheduleList]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row._id !== id);
    setSelected([]);
    setTableData(deleteRow);
    onDelete(id);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.schedule.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Card>
      <ScheduleTableToolbar filterName={filterName} onFilterName={handleFilterName} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 960, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedActions
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              actions={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                    <Iconify icon={'eva:trash-2-outline'} />
                  </IconButton>
                </Tooltip>
              }
            />
          )}

          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadNoCheckBoxCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
            />

            <TableBody>
              {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) =>
                  row ? (
                    <ScheduleTableRow
                      key={index}
                      row={row}
                      isAdmin={isAdmin}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onPublishSchedule={(state) => onPublishSchedule(row._id, state)}
                      onPreviewSchedule={(_id) => onPreviewSchedule(_id)}
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}

              <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />

        <FormControlLabel
          control={<Switch checked={dense} onChange={onChangeDense} />}
          label="Dense"
          sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
        />
      </Box>
    </Card>
  );
}

ScheduleList.propTypes = {
  isAdmin: PropTypes.bool,
  isLoading: PropTypes.bool,
  scheduleList: PropTypes.array,
  onDelete: PropTypes.func,
  onPreviewSchedule: PropTypes.func,
  onPublishSchedule: PropTypes.func
};

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
