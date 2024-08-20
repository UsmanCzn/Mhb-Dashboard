import { Chip, Grid, Typography,Menu,MenuItem,Button  } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent'; 
import React,{useState} from 'react'; 
import { useFetchRewardList } from '../hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import moment from 'moment-jalaali';
 import NewconstantCollection from "../newConstantCollection"
 import UpdateConstantCollection from "../updateConstantCollection"
 import DuplicateReward from "../duplicateReward"
 import rewardService from 'services/rewardService';
export default function ConstantsCollectionTable({ selectedBrand,reload,customerGroups,setReload }) {

    const {ConstantsCollectionList  ,fetchRewardList, totalRowCount, loading } = useFetchRewardList(reload,selectedBrand);
    
    const {branchesList} =useFetchBranchList(reload)
    const [modal,setModal] =useState(false) 
    const [newModal,setNewModal] =useState(false) 
    const [duplicateModal,setDuplicateModal] =useState(false) 
    
  
    
    const branchColumnFormater = item => {
      return (
        <Typography  variant="h6">
          {branchesList?.find(obj=>obj?.id==item?.branchId)?.name}
        </Typography>
      );
    };
    const groupsColumnFormater = item => { 
      return ( <Grid container spacing={1}>
         <Grid item xs="auto">
           <Typography  variant="h6" px={2} mr={1} border={0.6} borderRadius={1} >      
 {
        customerGroups?.find(obj=> obj?.id==item?.brandGroupId)?.name 
 }
       
        </Typography>
        </Grid> 
      </Grid>
      )
    };

    const rewardsColumnFormater = item => { 
      return ( <Grid container spacing={1}>
         <Grid item xs="auto">
          {
            
              item?.rewardProgramGifts?. map((obj, index)=>{
                return(
                  <Typography key={index}  variant="h6" px={2} mr={1} border={0.6} borderRadius={1} >  
                  {obj?.name +" - "+obj?.amount }
                  </Typography>
                )
              }) 
       }
          
         
        </Grid> 
      </Grid>
      )
    };
    const dateColumnFormater = item => { 
      return (  
                  <Typography  variant="h6"   >  
                  {moment(item?.startDate).format("DD/MM/YYYY") +" - "+moment(item?.endDate)?.format("DD/MM/YYYY") }
                  </Typography> 
      )
    };
  
  
    const [anchorEl, setAnchorEl] =  useState(null);
    const [constantCollection, setContantCollection] =  useState({});

  const open = Boolean(anchorEl);
  const handleClick = (event,params) => {
    setContantCollection(params?.row); 
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (data) => {  
    if(data.modal&&data?.name=="Edit"){
      setModal(true)
    }
    else  if( data?.name=="Delete"){
      deletePointsCollection(constantCollection?.id)
    } 
    else  if( data?.name=="Duplicate"){
      setDuplicateModal(true)
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
          field: "discountPercentage",
          headerName: "Discount Percentage",
          flex: 0.7,
          headerAlign: "left",  
      },
      {
          field: "branchId",
          headerName: "Branch",
          flex: 1,
          headerAlign: "left", 
          renderCell: params => branchColumnFormater(params.row)

      },
      {
          field: "brandGroupId",
          headerName: "Customer Group",
          flex: 1.2,
          headerAlign: "left",
         renderCell: params => groupsColumnFormater(params?.row)

      },
      {
        field: "emailAddresds",
        headerName: "Rewards Program Gifts",
        flex: 1,
        headerAlign: "left",
         renderCell: params =>rewardsColumnFormater(params?.row)

    },
    {
      field: "emailAddress",
      headerName: "Date Range",
      flex: 1,
      headerAlign: "left",
      renderCell: params => dateColumnFormater(params?.row)

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

      const deletePointsCollection=async (id)=>{  

        await rewardService.DeleteDiscountProgram(id)
        .then((res)=>{
            console.log(res.data,"delete response");
            setReload(prev=>!prev)
        })
        .catch((err)=>{
            console.log(err?.response?.data);
        }) 
     
  }

      const options=[
        {
          name:"Edit",
          modal:true,  
        },
        {
          name:"Duplicate",
          modal:true,  
        },
        {
          name:"Delete",
          modal:true,  
        }

      ]
 


  return (
    <> 
     <Grid container   mb={2} justifyContent="flex-end">
                
                <Grid item xs={"auto"}>
                    
                   <Button size="small" variant="contained" 
                   sx={{ textTransform: 'capitalize' }}
                   onClick={
                    ()=>{ 
                      setNewModal(true)
                    }
                   }
                   >
                                  Create New Constant Collection 
                 </Button> 
   
                   </Grid>
               
            </Grid>
    <DataGridComponent
      rows={ConstantsCollectionList}
      columns={columns}
      loading={loading} 
      getRowId={(row)=>row.id}
      rowsPerPageOptions={[10]}
      totalRowCount={totalRowCount}
      fetchCallback={fetchRewardList} 
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

      <UpdateConstantCollection  modal={modal} setModal={setModal}   constantCollection={constantCollection} setReload={setReload}  />
      <NewconstantCollection  modal={newModal} setModal={setNewModal} branchesList={branchesList}   setReload={setReload}  />
      <DuplicateReward  modal={duplicateModal} setModal={setDuplicateModal} branchesList={branchesList} reward={constantCollection}   setReload={setReload}  />
     
    </>
  );
}
