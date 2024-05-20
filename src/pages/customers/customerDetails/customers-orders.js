import React, {useState, useEffect} from 'react'
import DataGridComponent from 'components/DataGridComponent'; 
import { useParams } from '../../../../node_modules/react-router-dom/dist/index';
import { Grid,Typography,FormControl,InputLabel,Select,MenuItem   } from '@mui/material';
import customerService from 'services/customerService';
import moment from 'moment/moment';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';



const CustomerOrders = () => {
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [page, setpage] = useState(0)
    const { cid } = useParams();
    const { brandsList } = useFetchBrandsList(true);
    const [selectedBrand, setselectedBrand] = useState({});
    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[0]);
            getCustomerOrders()
        } else {
            console.log('now goes to zero ', 'sb');
        }
    }, [brandsList]);

    useEffect(() => {
        getCustomerOrders(page)
    }, [selectedBrand,page])
    
    
    const columns = [
        {
            field: 'branchName',
            headerName: 'For Branch',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'deliverySystem',
            headerName: 'Type',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'orderNumber',
            headerName: 'Order Number',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            headerAlign: 'left'
        },
    
        {
            field: 'creationDate',
            headerName: 'Date',
            flex: 1.2,
            headerAlign: 'left',
            renderCell: (params) => {
                return <Typography>{moment(params?.row?.date).format('DD-MMM-YYYY hh:mm a')}</Typography>;
            }
        },
        // {
        //   field: "paymentMethod",
        //   headerName: "Payment Type",
        //   flex: 1,
        //   headerAlign: "left",
        // },
        {
            field: 'isHiddven',
            headerName: 'Order details',
            flex: 1.2,
            headerAlign: 'left',
            renderCell: (params) => {
                return (
                    <Grid container direction="column">
                        <Typography component="div" sx={{ '& ul': { m: 0, p: 0 }, '& li': { marginLeft: '-1em' } }}>
                            <ul>
                                {params?.row?.products?.map((obj,index) => (
                                    <li key={index}>
                                        <Typography variant="h6">{obj?.name + ' x ' + obj?.quantity}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </Typography>
                    </Grid>
                );
            }
        },
        // {
        //     field: 'isRewardMfissisng',
        //     headerName: 'Action',
        //     sortable: false,
        //     flex: 0.5,
        //     headerAlign: 'left',

        //     renderCell: (params) => {
        //         return <MoreVertIcon onClick={(event) => handleClick(event, params)} />;
        //     }
        // }
    ];

        const getCustomerOrders =async (pageNo) =>{
            setloading(true)
            try{
                const data = {brandIds:brandsList.map(e=> e.id),UserId:cid,skip:pageNo,take:10}
                const response = await customerService.getCustomerOrdersByBrand(data)
                if(response){
                    setdata([...response.data.result?.orderHistoryItems])
                    setloading(false)
                }
            }catch(error){
                setdata([]);
                setloading(false);
            }
        }

  return (<>
  <Grid container spacing={2}>
  <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs="auto">
                        <Typography fontSize={26} fontWeight={600}></Typography>
                    </Grid> 
                </Grid>
            </Grid>
  <Grid item xs={12}>
  <DataGridComponent
      rows={data}
      columns={columns}
      loading={loading} 
      getRowId={(row)=>row.id}
      rowsPerPageOptions={[10]}
      totalRowCount={data.length}
      fetchCallback={(page)=>setpage(page)} 
    />
    </Grid>
  </Grid>
  
  </>)
}

export default CustomerOrders