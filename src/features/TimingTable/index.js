import { Grid, Box, Button } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; 
import { useFetchTimingList } from './hooks';
import { useAuth } from 'providers/authProvider';

export default function TimingTable({
  updateTiming,
  deleteTiming,
  reload
}) {

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user, userRole, isAuthenticated } = useAuth();

  const { timingList, fetchTimingList, totalRowCount, loading } = useFetchTimingList(id, reload);

 
const columns = [
  {
    field: 'dayOfTheWeekDisplay',
    headerName: 'Day of Week',
    flex: 1,
    minWidth: 150,
    headerAlign: 'left',
    align: 'left',
  },
  {
    field: 'startTime',
    headerName: 'Start Time',
    flex: 1,
    minWidth: 120,
    headerAlign: 'left',
    align: 'left',
  },
  {
    field: 'endTime',
    headerName: 'End Time',
    flex: 1,
    minWidth: 120,
    headerAlign: 'left',
    align: 'left',
  },
  {
    field: 'isOrderingEnable',
    headerName: 'Ordering Enabled',
    flex: 1,
    minWidth: 160,
    headerAlign: 'left',
    align: 'left',
    renderCell: (params) => (
      <span>
        {params.value ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    field: 'actions',
    headerName: 'Operation',
    sortable: false,
    flex: 1,
    minWidth: 180,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <Grid
        container
        spacing={1}
        justifyContent="center"
        alignItems="center"
        wrap="nowrap"
      >
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            disabled={user?.isAccessRevoked}
            onClick={(event) => updateTiming(event, params)}
          >
            Edit
          </Button>
        </Grid>

        <Grid item>
          <Button
            size="small"
            variant="outlined"
            color="error"
            disabled={user?.isAccessRevoked}
            onClick={(event) => deleteTiming(event, params)}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    ),
  },
];



  return (
    <DataGridComponent
      rows={timingList}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id}
      rowsPerPageOptions={[10]}
      totalRowCount={totalRowCount}
      fetchCallback={fetchTimingList}
    />
  );
}
