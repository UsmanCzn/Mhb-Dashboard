import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CategoryGrid from 'features/Store/ProductType';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import AnalyticBox from 'components/orders/analyticsBox';
import OrderDetail from 'components/orders/OrderDetails';
import { useFetchOrdersList } from 'features/OrdersTable/hooks/useFetchOrdersList';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import orderServices from 'services/orderServices';
import storeServices from 'services/storeServices';

export default function Products() {
    const { type } = useParams();

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState({});
    const [reload, setReload] = useState(false);
    const [analytics, setAnalytics] = useState({
        pending: 0,
        accepted: 0,
        closed: 0,
        rejected: 0
    });

    const [branchZero, setBranchZero] = useState([
        {
            id: 0,
            name: 'All Branches'
        }
    ]);

    const [statustypes, setStatusTypes] = useState([]);
    const [sortOrder, setSortOrder] = useState(0);

    const sortOrders = [
        { value: 0, label: 'Ascending' },
        { value: 1, label: 'Descending' }
    ];



    return (
        <Grid container spacing={2}>
            {/* <Grid item xs={12}>

                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Categories
                        </Typography>
                    </Grid>
                    <Grid item xs={"auto"}>

                        <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}
                            onClick={() => setModalOpen(true)}
                        >
                            Add new Category
                        </Button>

                    </Grid>

                </Grid>

            </Grid> */}


            {/* <Grid item xs={12}>
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">{'Sort Order'}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sortOrder}
                            label={'SortOrder'}
                            onChange={(event) => {
                                setSortOrder(event.target.value);
                            }}
                        >
                            {sortOrders.map((row, index) => {
                                return <MenuItem value={row.value}>{row?.label}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid> */}

            <Grid item xs={12}>
                <CategoryGrid
                    reload={reload}
                    setData={setData}
                    data={data}
                    sortOrder={sortOrder}
                    setModalOpen={setModalOpen}
                    statustypes={statustypes}
                />
            </Grid>
        </Grid>
    );
}
