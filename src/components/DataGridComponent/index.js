import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function NoRowsOverlay() {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="subtitle1" fontWeight={600}>No data</Typography>
      <Typography variant="body2" color="text.secondary">
        Nothing to show right now.
      </Typography>
    </Box>
  );
}

function NoResultsOverlay() {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="subtitle1" fontWeight={600}>No matching results</Typography>
      <Typography variant="body2" color="text.secondary">
        Try clearing your search or filters.
      </Typography>
    </Box>
  );
}

export default function DataGridComponent(props) {
  const {
    rows,
    columns,
    loading,
    getRowId,
    disableSelectionOnClick,
    CustomToolbar,
    totalRowCount,
    fetchCallback = () => {},
    onRowClick,
    onCellEditStop,
    initialState,
    search = '',
    customFilter = '',
    pSize = 10,
    pMode = 'server'
  } = props;

  const [pageSize, setPageSize] = useState(pSize);
  const [page, setPage] = useState(0);
  const [rowCountState, setRowCountState] = useState(totalRowCount || 0);

  // ✅ unchanged behavior
  useEffect(() => {
    fetchCallback(page, search, customFilter);
  }, [page, fetchCallback]);

  useEffect(() => {
    setRowCountState((prev) => (totalRowCount !== undefined ? totalRowCount : prev));
  }, [totalRowCount]);

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#fff',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 2,
        overflow: 'hidden'
      }}
    >
      <DataGrid
        {...props}
        rows={rows ?? []}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        autoHeight
        disableSelectionOnClick={disableSelectionOnClick}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10]} // unchanged
        pagination
        paginationMode={pMode}
        rowCount={rowCountState}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        onRowClick={onRowClick}
        onCellEditStop={onCellEditStop}
        initialState={initialState}
        getRowHeight={() => 'auto'}
        rowReordering
        components={{
          Toolbar: CustomToolbar,
          LoadingOverlay: LinearProgress,
          NoRowsOverlay,
          NoResultsOverlay
        }}
        sx={{
          backgroundColor: '#fff',
          border: 'none',

          // Density paddings
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },

          // Header
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'grey.50',
            color: 'text.primary',
            fontWeight: 600,
            borderBottom: '1px solid',
            borderColor: 'divider'
          },
          '& .MuiDataGrid-columnHeaderTitle': { fontSize: 13.5 },

          // Cells & rows (all same background now)
          '& .MuiDataGrid-cell': {
            borderColor: 'divider',
            backgroundColor: '#fff'
          },
          '& .MuiDataGrid-row': {
            backgroundColor: '#fff'
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'grey.100'
          },

          // Focus polish
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': { outline: 'none' },
          '& .MuiDataGrid-cell:focus-within': { outline: 'none' },

          // Footer
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#fff'
          }
        }}
      />
    </Box>
  );
}
