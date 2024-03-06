import { Chip, Grid, Typography,Menu,MenuItem  } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent'; 
import React,{useState} from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchCustomerList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function RewardsHistoryTable({  reload, search }) {

  const navigate = useNavigate();

  const location = useLocation();

    const { customersList, fetchCustomersList, totalRowCount, loading } = useFetchCustomerList({reload,search});

   
  
    const activeColumnFormater = item => {
        
      return (
        <img alt='img' src={item?.userAvatar}style={{
          width:40,
          height:40
        }} />
      );
    };
    const nameColumnFormater = item => {
      return (
        <Typography  variant="h6">
          {item?.name+" "+item?.surname}
        </Typography>
      );
    };
    const groupsColumnFormater = item => {
      return ( <Grid container spacing={1}>
 {
        item?.customerGroups?.map(obj=>{
          return <Grid item xs="auto"> <Typography  variant="h6" px={2} mr={1} border={0.6} borderRadius={1} >
          {obj}
        </Typography>
        </Grid>
        })
        }
       
      </Grid>
      )
    };
  
    const [anchorEl, setAnchorEl] =  useState(null);
    const [customer, setCustomer] =  useState({});

  const open = Boolean(anchorEl);
  const handleClick = (event,params) => {
    setCustomer(params); 
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (data) => {  
    if(!data.modal&&data.route){
      navigate(`${location.pathname}/${customer?.id}`);
    }
    setAnchorEl(null);
  };
    
 
    const columns = [
      {
          field: "id",
          headerName: "ID",
          headerAlign: "left", 
      },
      {
          field: "name",
          headerName: "Name",
          flex: 0.7,
          headerAlign: "left", 
          renderCell: params => nameColumnFormater(params.row)
      },
      {
          field: "phoneNumber",
          headerName: "Phone Number",
          flex: 1,
          headerAlign: "left", 
          // renderCell: params => groupsColumnFormater(params.row)

      },
      {
          field: "phoneNumber2",
          headerName: "Invoice",
          flex: 1,
          headerAlign: "left",
         renderCell: params => 120

      },
      {
        field: "emailAddresds",
        headerName: "Rewards Status",
        flex: 1,
        headerAlign: "left",
         renderCell: params => "completed"

    },
    {
      field: "emailAddress",
      headerName: "Transaction Status",
      flex: 1,
      headerAlign: "left",
      renderCell: params => "completed"

  },
    // {
    //   field: "isRewardMfissisng",
    //   headerName: "Action",
    //   sortable: false,
    //   flex: 0.5,
    //   headerAlign: "left",
      
    //   renderCell: (params) => { 
    //         return <MoreVertIcon 
    //             onClick={(event)=>handleClick(event,params)} />
    //       }
    // },
      ];


      const options=[
        {
          name:"Customer Details",
          modal:false, 
          route:"customerDetails"
        }

      ]


  return (
    <> 
    <DataGridComponent
      rows={customersList}
      columns={columns}
      loading={loading} 
      getRowId={(row)=>row.id}
      rowsPerPageOptions={[10]}
      totalRowCount={totalRowCount}
      fetchCallback={fetchCustomersList} 
      search={search}
    />
     <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
         
          {
            options.map((row, index) => { 
                   return (
                       <MenuItem onClick={()=> handleClose(row)} value={row.name}>{row.name}</MenuItem>
                   )
            }
            )
           }
       

      </Menu>
    </>
  );
}
