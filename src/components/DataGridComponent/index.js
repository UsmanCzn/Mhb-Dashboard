import { LinearProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

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
        search="",
        customFilter="",
        pSize=10,
        pMode='server'
    } = props;

    const [pageSize, setPageSize] = useState(pSize);

    const [page, setPage] = useState(0);

    const [rowCountState, setRowCountState] = useState(totalRowCount || 0);

    useEffect(() => { 
        fetchCallback(page,search,customFilter);
    }, [page, fetchCallback]);

    useEffect(() => {
        setRowCountState((prevRowCountState) => (totalRowCount !== undefined ? totalRowCount : prevRowCountState));
    }, [totalRowCount, setRowCountState]);

    return (
        <div style={{ width: '100%' }}>
            <DataGrid
                {...props}
                rows={rows ? rows : []}
                columns={columns}
                loading={loading}
                getRowId={getRowId}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick={disableSelectionOnClick}
                components={{
                    Toolbar: CustomToolbar,
                    LoadingOverlay: LinearProgress
                }}
                autoHeight
                pagination
                rowCount={rowCountState}
                page={page}
                onRowClick={onRowClick}
                paginationMode={pMode}
                onPageChange={(newPage) => setPage(newPage)}
                getRowHeight={() => 'auto'}
                experimentalFeatures={{ newEditingApi: true }}
                initialState={initialState}
                onCellEditStop={onCellEditStop}
                sx={{
                    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
                    borderColor: 'secondary.light',
                    boxShadow: 2,
                    '& .MuiDataGrid-cell:hover': {
                        color: 'primary.main'
                    },
                    '& .MuiDataGrid-cell': {
                        borderTop: '0.5px solid grey'
                    }
                }}
                rowReordering={true}
            />
        </div>
    );
}
