import { Chip, Grid, Typography,Menu,MenuItem,TextField,Box,  Select, InputLabel, FormControl,  } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent'; 
import React,{useState,useCallback,useEffect} from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchCustomerList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import customerService from 'services/customerService';

export default function CustomerTable({ type,reload,setCustomerStats }) {

  const [search, setSearch] = useState("")
  const [companies, setcompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const navigate = useNavigate();
  const location = useLocation();

    const { customersList, fetchCustomersList, totalRowCount, loading } = useFetchCustomerList({reload,search,setCustomerStats,selectedCompany});

    useEffect(() => {
      getCompanies()
    }, [])
    
       
  
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
      console.log(item,"sss");
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

    const companyFormatter = (item) =>{
      const temp = companies.find(com => com.id === item.companyId)
      return temp?.name || ""
    }
  
    const [anchorEl, setAnchorEl] =  useState(null);
    const [customer, setCustomer] =  useState({});

  const open = Boolean(anchorEl);
  const handleClick = (event,params) => {
    setCustomer(params); 
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (data) => {  
    if(!data.modal && data.route){
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
          headerName: "Company",
          flex: 1.5,
          headerAlign: "left", 
          renderCell: params => companyFormatter(params.row)

      },
      {
          field: "displayPhone",
          headerName: "Phone Number",
          flex: 0.7,
          headerAlign: "left"
      },
      {
        field: "displayEmailAddress",
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

      const getCompanies =async ()=>{
        try{
        const res =await  customerService.getComapniesByUserRole();
        if(res){
          const tempComp = res.data.result;
          if(tempComp.length){
          }
          setcompanies(res.data.result)
        }
        }catch(err){

        }
      }


  return (
    <> 
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <TextField
      style={{marginBottom:"10px"}}
      id="search"
      label="Search Users"
      variant="outlined"
      placeholder="Search by name or number"
      onChange={(event)=>{
        setSearch(event.target.value)
      }}
    />

      <FormControl sx={{minWidth:"200px",maxWidth:"200px"}}>
          <InputLabel id="demo-simple-select-label">{'Companies'}</InputLabel>
          <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCompany}
              label={'Customer Group'}
              name="customerGroupId"
              onChange={(e)=>{
                setSelectedCompany(e.target.value)
              }}
          >
              {companies.map((row, index) => {
                return (
                    <MenuItem key={index} value={row.id}>
                        {row?.name}
                    </MenuItem>
                );
              })}
          </Select>
          </FormControl>
    </Box>
    <DataGridComponent
      rows={customersList}
      columns={columns}
      loading={loading} 
      getRowId={(row)=>row.id}
      rowsPerPageOptions={[10]}
      totalRowCount={totalRowCount}
      fetchCallback={fetchCustomersList} 
      search={search}
      customFilter={selectedCompany}
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
