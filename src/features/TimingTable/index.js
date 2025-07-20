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
      field: "dayOfTheWeekDisplay",
      headerName: "Day of Week",
      flex: 1,
      headerAlign: "left"
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "endTime",
      headerName: "End Time",
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "isOrderingEnable",
      headerName: "Ordering enabled",
      flex: 1,
      headerAlign: "left"
    },
    {
      field: "isHidden",
      headerName: "Operation",
      flex: 1,
      headerAlign: "center",

      renderCell: (params) => {
        return <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
      
          <Button variant="outlined" disabled={user?.isAccessRevoked} onClick={(event)=>updateTiming(event,params)}>
            Edit
          </Button>
          <Button variant="outlined" disabled={user?.isAccessRevoked}  color="error" onClick={(event)=>deleteTiming(event,params)}>
            Delete
          </Button>
        </Grid>
      }
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
