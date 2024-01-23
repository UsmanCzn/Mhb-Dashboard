import { Chip, IconButton, Tooltip,Menu,MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent'; 
import React,{useState} from 'react'; 
import { useLocation, useNavigate,useParams } from 'react-router-dom';
import { useFetchBranchUsers } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export default function BranchUsers( ) {

  const navigate = useNavigate(); 
  const location = useLocation();
  const { bhid } = useParams();

    const { usersList, fetchUsersList, totalRowCount, loading } = useFetchBranchUsers(bhid);

    const [anchorEl, setAnchorEl] =  useState(null);
    const [branch, setBranch] =  useState({});

  const open = Boolean(anchorEl);
  const handleClick = (event,params) => {
    setBranch(params); 
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (data) => { 
    if(!data.modal){
        navigate(`${location.pathname}/${branch?.id}/${data.route}`);
    }
    setAnchorEl(null);
  };
  
    const activeColumnFormater = item => {
        
      return (
        <img alt='logo' src={item.logoUrl}style={{
          width:40,
          height:40
        }} />
      );
    };
    
  
    const columns = [
      {
          field: "navme",
          headerName: "Image",
          headerAlign: "left",
          renderCell: params => activeColumnFormater(params.row)
      },
      {
          field: "isBusy",
          headerName: "Is Busy",
          flex: 1,
          headerAlign: "left", 
      },
      {
          field: "ishide",
          headerName: "Is Hide",
          flex: 1,
          headerAlign: "left", 
      },
      {
          field: "name",
          headerName: "Branch name",
          flex: 1,
          headerAlign: "left"
      },
      {
          field: "brand",
          headerName: "Brand",
          flex: 1,
          headerAlign: "left",
      },
      {
        field: "branchAddress",
        headerName: "Address",
        flex: 1,
        headerAlign: "left"
    },
    {
      field: "emailAddress",
      headerName: "Email",
      flex: 1,
      headerAlign: "left"
  },
  {
    field: "isRewardMissing",
    headerName: "Rewards Program",
    flex: 1,
    headerAlign: "left"
},
{
  field: "isRewardMissisng",
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
          name:"Edit Branch",
          modal:true,
        },
        {
          name:"Create Branch User",
          modal:true,
        },
        {
          name:"Reward programs",
          modal:false,
          route:"branchRewardProgram"
        },
        {
          name:"Branch Timings",
          modal:false,
          route:"branchTimings"
        },
        {
          name:"Branch Users",
          modal:false,
          route:"branchUsers"
        },
        {
          name:"Branch Paddle",
          modal:false,
          route:"branchPaddle"
        }
      ]


  return (
    <>
    
    <DataGridComponent
      rows={usersList}
      columns={columns}
      loading={loading} 
      getRowId={(row)=>row.id}
      rowsPerPageOptions={[10]}
      totalRowCount={totalRowCount}
      fetchCallback={fetchUsersList} 
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
