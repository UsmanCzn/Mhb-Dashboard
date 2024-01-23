import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ProductGrid from 'features/products';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import AnalyticBox from 'components/orders/analyticsBox';
import OrderDetail from 'components/orders/OrderDetails';
import { useFetchOrdersList } from 'features/OrdersTable/hooks/useFetchOrdersList';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import orderServices from 'services/orderServices';
import storeServices from 'services/storeServices';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import NewProduct from 'components/store/products/newProduct';
import UpdateProduct from 'components/store/products/updateProduct';
export default function Products() {
    const { type } = useParams();

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState({});
    const [reload, setReload] = useState(false);

    const { brandsList } = useFetchBrandsList(reload);
    // const { brandsList } = useFetchBranchList(reload)

    const [selectedBranch, setselectedBranch] = useState({});
    const [statustypes, setStatusTypes] = useState([]);

    const [sortOrder, setSortOrder] = useState(0);
    const sortOrders = [
        { value: 0, label: 'Ascending' },
        { value: 1, label: 'Descending' }
    ];
    const [sortBy, setSortBy] = useState('name');
    const sortArr = [
        { value: 'orderValue', label: 'Order Value' },
        { value: 'name', label: 'Name' }
    ];

    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBranch(brandsList[0]);
        }
    }, [brandsList]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Products
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs="auto"></Grid>

                    <Grid item xs="auto">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Branch'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBranch}
                                label={'Branch'}
                                onChange={(event) => {
                                    setselectedBranch(event.target.value);
                                }}
                            >
                                {brandsList.map((row, index) => {
                                    return <MenuItem value={row}>{row?.name}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">{'Sort By'}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sortBy}
                            label={'Sort By'}
                            onChange={(event) => {
                                setSortBy(event.target.value);
                            }}
                        >
                            {sortArr.map((row, index) => {
                                return <MenuItem value={row.value}>{row?.label}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                </Grid>

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
            </Grid>

            <Grid item xs={12}>
                <ProductGrid
                    reload={reload}
                    selectedBranch={selectedBranch}
                    setData={setData}
                    data={data}
                    setModalOpen={setModalOpen}
                    statustypes={statustypes}
                    setReload={setReload}
                    sortOrder={sortOrder}
                    sortBy={sortBy}
                />
            </Grid>

            <NewProduct modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload} selectedBrand={selectedBranch} />
        </Grid>
    );
}
