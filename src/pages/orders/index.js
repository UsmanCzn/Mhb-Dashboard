import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import OrderDetail from 'components/orders/OrderDetails';
import AnalyticBox from 'components/orders/analyticsBox';
import { OrdersTable } from 'features';
import { useBranches } from 'providers/branchesProvider';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import orderServices from 'services/orderServices';
import branchServices from 'services/branchServices';


export default function Orders() {


    const { type } = useParams();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState({});
    const [reload, setReload] = useState(false);
    // const [timerReload, setTimerReload] = useState(false);
    const [analytics, setAnalytics] = useState({
        pending: 0,
        accepted: 0,
        closed: 0,
        rejected: 0,
        ready: 0
    });

    const [filter, setFilter] = useState('All');
    const [filterStatus, setFilterStatus] = useState(0);

    const [branchZero, setBranchZero] = useState([
        {
            id: 0,
            name: 'All Branches'
        }
    ]);

    const { branchesList } = useBranches();

    const [selectedBranch, setselectedBranch] = useState({});
    const [checked, setChecked] = useState(false);
    const [statustypes, setStatusTypes] = useState([
        { id: 1, title: 'Open' },
        { id: 3, title: 'Accepted' },
        { id: 4, title: 'Ready' },
        { id: 2, title: 'Closed' },
        { id: 5, title: 'Rejected' }
    ]);

    useEffect(() => {
        if (branchesList[0]?.id) {
            if (branchZero?.length == 1) {
                //  setBranchZero([...branchZero, ...branchesList])
                //  setselectedBranch( {
                //     id: 0,
                //     name: 'All Branches'
                // })
                setBranchZero((prev) => {
                    const merged = [...prev, ...branchesList]; // step 1: combine both lists
                
                    // step 2: remove duplicates using a Map
                    const uniqueById = Array.from(
                        new Map(merged.map(item => [item.id, item])).values()
                    );
                
                    setselectedBranch(uniqueById[0]); // step 3: set first item as selected
                    return uniqueById; // step 4: return the unique list
                });
                
            }
        } else {
            console.log('now goes to zero ', 'sb');
        }
    }, [branchesList]);



    const makeBranchBusy = async (event) => {
        try {
            // Create a copy of the selectedBranch with the updated isBusy property
            const tempBranch = { ...selectedBranch, isBusy: event.target.checked };

            // Find the index of the selectedBranch in branchZero array
            const selectedIndex = branchZero.findIndex((bran) => bran.id === selectedBranch.id);

            if (selectedIndex >= 0) {
                // Create a copy of branchZero and update the element at the selectedIndex
                const tempBranchZero = [...branchZero];
                tempBranchZero[selectedIndex] = tempBranch;

                // Update the state variable with the new array
                setBranchZero(tempBranchZero);
                setselectedBranch(tempBranch);
            }

            // Update the state variable with the checked property
            setChecked(event.target.checked);

            // Call the asynchronous function to edit the branch
            const res = await branchServices.editBranch(tempBranch);

            // Log the result to the console
            console.log(res, 'updatee**************');
        } catch (err) {
            // Handle any errors that occur during the process
            console.error(err);
        }
    };

    const getOrderTypes = async () => {
        orderServices
            .getOrderTypes()
            .then((res) => {
                setStatusTypes(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.response);
            });
    };

    const getAnalytics = async () => {
        try{
        const res= await orderServices.getAllOrderStatusCount(selectedBranch?.id,0)
        console.log(res.data.result);
        if(res){
            const stats = res.data.result;
        setAnalytics({
            pending: stats.pending,
            accepted: stats.accepted,
            closed: stats.closed,
            rejected: stats.rejected,
            ready: stats.ready
        })
        }else{
            setAnalytics({
                pending: 0,
                accepted: 0,
                closed: 0,
                rejected: 0,
                ready: 0
            })
        }
        
        }
        catch(error){

        }

        // await orderServices
        //     .getAcceptedOrdersNumbers(selectedBranch?.id)
        //     .then((res) => {
        //         setAnalytics((prevAnalytics) => ({
        //             ...prevAnalytics,
        //             accepted: res?.data?.result
        //         }));
        //     })
        //     .catch((err) => {
        //         console.log(err?.response?.data);
        //     });
        // await orderServices
        //     .getPendingOrdersNumbers(selectedBranch?.id)
        //     .then((res) => {
        //         setAnalytics((prevAnalytics) => ({
        //             ...prevAnalytics,
        //             pending: res?.data?.result
        //         }));
        //     })
        //     .catch((err) => {
        //         console.log(err?.response?.data);
        //     });
        // await orderServices
        //     .getReadyOrdersNumbers(selectedBranch?.id)
        //     .then((res) => {
        //         setAnalytics((prevAnalytics) => ({
        //             ...prevAnalytics,
        //             ready: res?.data?.result
        //         }));
        //     })
        //     .catch((err) => {
        //         console.log(err?.response?.data);
        //     });

        // await orderServices
        //     .getClosedOrdersNumbers(selectedBranch?.id)
        //     .then((res) => {
        //         setAnalytics((prevAnalytics) => ({
        //             ...prevAnalytics,
        //             closed: res?.data?.result
        //         }));
        //     })
        //     .catch((err) => {
        //         console.log(err?.response?.data);
        //     });
        // await orderServices.getRejectedOrdersNumbers(selectedBranch?.id)
        // .then((res)=>{
        //     setAnalytics(prevAnalytics => ({
        //         ...prevAnalytics,
        //         rejected: res?.data?.result
        //       }));

        // })
        // .catch((err)=>{
        //     console.log(err?.response?.data);
        // })
    };
    // useEffect(() => {
    //     // getOrderTypes()
    // }, []);
    useEffect(() => {
        getAnalytics();
    }, [selectedBranch, reload]);

    useEffect(() => {

    }, [reload]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setReload((prev) => !prev);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            All Orders
                        </Typography>
                    </Grid>
                    <Grid item xs="auto" justifyContent="space-between">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Branch'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBranch}
                                label={'Branch'}
                                onChange={(event) => {
                                    setselectedBranch(event.target.value);
                                    setChecked(event.target.value.isBusy);
                                }}
                            >
                                {branchZero.map((row, index) => {
                                    return (
                                        <MenuItem value={row} key={index}>
                                        {row?.name === 'All Branches' ? row?.name : `${row?.name} (${row?.brand})`}
                                      </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        {selectedBranch.id != 0 && (
                            <FormControlLabel
                                control={<Switch checked={checked} onChange={(e) => makeBranchBusy(e)} />}
                                label="Make Branch Busy"
                            />
                        )}
                    </Grid>
                    {/* <Grid item xs={6}>
                    <TableControl type="Customer"/>
                </Grid> */}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={10}>
                        <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-end">
                            <Grid item xs={2}>
                                <AnalyticBox
                                    title="All Orders"
                                    // count={analytics?.pending}
                                    value={'All'}
                                    filter={filter}
                                    handleClick={() => {
                                        setFilter('All');
                                        setFilterStatus(0);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <AnalyticBox
                                    title="Pending Orders"
                                    count={analytics?.pending}
                                    value={'Open'}
                                    filter={filter}
                                    handleClick={() => {
                                        setFilter('Open');
                                        setFilterStatus(1);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <AnalyticBox
                                    title="Preparing (Accepted)"
                                    count={analytics?.accepted}
                                    value={'Accepted'}
                                    filter={filter}
                                    handleClick={() => {
                                        setFilter('Accepted');
                                        setFilterStatus(3);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <AnalyticBox
                                    title="Delivered"
                                    count={analytics?.ready}
                                    value={'Ready'}
                                    filter={filter}
                                    handleClick={() => {
                                        setFilter('Ready');
                                        setFilterStatus(4);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <AnalyticBox
                                    title="Closed"
                                    count={analytics?.closed}
                                    value={'Close'}
                                    filter={filter}
                                    handleClick={() => {
                                        setFilter('Close');
                                        setFilterStatus(2);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <OrdersTable
                    reload={reload}
                    selectedBranch={selectedBranch}
                    setData={setData}
                    data={data}
                    setModalOpen={setModalOpen}
                    // statustypes={statustypes}
                    filter={filter}
                    // setTimerReload={setTimerReload}
                    filterStatus={filterStatus}
                    setReload={setReload}
                />
            </Grid>
            <OrderDetail modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload} data={data} statustypes={statustypes} />
        </Grid>
    );
}
