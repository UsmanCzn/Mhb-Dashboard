import { Chip, Grid, Typography,Menu,MenuItem  } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent'; 
import React,{useState} from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchCustomerList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function CustomerTable({ type,reload }) {

  const navigate = useNavigate();

  const location = useLocation();

    const { customersList, fetchCustomersList, totalRowCount, loading } = useFetchCustomerList(reload);

   
  
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
        item?.customerGroups?.map((obj,index)=>{
          return <Grid key={index} item xs="auto"> <Typography  variant="h6" px={2} mr={1} border={0.6} borderRadius={1} >
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
      navigate(`/customers/${customer?.id}`);
    }
    setAnchorEl(null);
  };
    
 
    const columns = [
      {
          field: "userAvatar",
          headerName: "Image",
          headerAlign: "left",
          renderCell: params => activeColumnFormater(params.row)
      },
      {
          field: "name",
          headerName: "Name",
          flex: 0.7,
          headerAlign: "left", 
          renderCell: params => nameColumnFormater(params.row)
      },
      {
          field: "customerGroups",
          headerName: "Groups",
          flex: 1.5,
          headerAlign: "left", 
          renderCell: params => groupsColumnFormater(params.row)

      },
      {
          field: "phoneNumber",
          headerName: "Phone Number",
          flex: 0.7,
          headerAlign: "left"
      },
      {
        field: "emailAddress",
        headerName: "Email",
        flex: 1,
        headerAlign: "left"
    },
    {
      field: "isRewardMfissisng",
      headerName: "Action",
      sortable: false,
      flex: 0.5,
      headerAlign: "left",
      
      renderCell: (params) => { 
            return <MoreVertIcon 
                onClick={(event)=>handleClick(event,params)} />
          }
    },
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
                       <MenuItem key={index} onClick={()=> handleClose(row)} value={row.name}>{row.name}</MenuItem>
                   )
            }
            )
           }
       

      </Menu>
    </>
  );
}
