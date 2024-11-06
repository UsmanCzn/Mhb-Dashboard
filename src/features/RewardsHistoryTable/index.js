import { Chip, Grid, Typography,Menu,MenuItem  } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent'; 
import React,{useState,useEffect} from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchCustomerList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import rewardService from 'services/rewardService';
import { bindKey } from 'lodash';
export default function RewardsHistoryTable({ reload, search ,branchId=5 }) {

    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setloading] = useState(true)
    // const { customersList, fetchCustomersList, totalRowCount, loading } = useFetchCustomerList({ reload, search });
    const [RewardList, setRewardList] = useState([])
    const [page, setPage] = useState(0);
    const getDiscountedOrders = async (page) => {                                        
        const body = {
            Take: 10,
            Skip: page ? page * 10 : 0,
            BranchId:branchId ,
            SearchExpression:search || ''
        };
        setloading(true);
        try{
        const res = await rewardService.getRewardHistory(body);
        console.log(res);
        setloading(false)
        if(res?.data?.result){
        setRewardList(res.data.result.data)
    }
        else{
            setRewardList({data:[],totalCount:0})
        }
        }
        catch(error){
          setloading(false)
          
        }
    };

    useEffect(()=>{

    },[RewardList.data])
    useEffect(() => {
      getDiscountedOrders(page);
  }, [page, reload,search,branchId]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
};
    const nameColumnFormater = (item) => {
        return <Typography variant="h6">{item?.customerName}</Typography>;
    };
    const groupsColumnFormater = (item) => {
        return (
            <Grid container spacing={1}>
                {item?.customerGroups?.map((obj, index) => {
                    return (
                        <Grid key={index} item xs="auto">
                            <Typography variant="h6" px={2} mr={1} border={0.6} borderRadius={1}>
                                {obj}
                            </Typography>
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    const [customer, setCustomer] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setCustomer(params);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (data) => {
        if (!data.modal && data.route) {
            navigate(`${location.pathname}/${customer?.id}`);
        }
        setAnchorEl(null);
    };

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            headerAlign: 'left'
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 0.7,
            headerAlign: 'left',
            renderCell: (params) => nameColumnFormater(params.row)
        },
        {
            field: 'customerPhoneNumber',
            headerName: 'Phone Number',
            flex: 1,
            headerAlign: 'left'
            // renderCell: params => groupsColumnFormater(params.row)
        },
        {
            field: 'billedInvoice',
            headerName: 'Billed Amount',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => `${params.row.billedInvoice} KD`
        },
        {
            field: 'actualInvoice',
            headerName: 'After Discount',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => `${params.row.actualInvoice} KD`
        },
        // {
        //     field: 'emailAddresds',
        //     headerName: 'Rewards Status',
        //     flex: 1,
        //     headerAlign: 'left',
        //     renderCell: (params) => 'completed'
        // },
        // {
        //     field: 'emailAddress',
        //     headerName: 'Transaction Status',
        //     flex: 1,
        //     headerAlign: 'left',
        //     renderCell: (params) => 'completed'
        // }
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

    const options = [
        {
            name: 'Customer Details',
            modal: false,
            route: 'customerDetails'
        }
    ];

    return (
        <>
            <DataGridComponent
                rows={RewardList.data}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={RewardList.totalCount}
                fetchCallback={handlePageChange}
                search={search}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                {options.map((row, index) => {
                    return (
                        <MenuItem key={index} onClick={() => handleClose(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
