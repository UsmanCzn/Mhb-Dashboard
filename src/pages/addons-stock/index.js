import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddonGrid from '../../features/Store/AddonGroups/addonStockGroup';
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

export default function AddonsStock() {
    const { type } = useParams();

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false)
    const [data, setData] = useState({})
    const [reload, setReload] = useState(false)
    const [analytics, setAnalytics] = useState({
        pending: 0,
        accepted: 0,
        closed: 0,
        rejected: 0
    })



    const [branchZero, setBranchZero] = useState([{
        id: 0,
        name: "All Branches"
    }])

    const { brandsList } = useFetchBrandsList(reload)

    const [selectedBranch, setselectedBranch] = useState({}) 
    const [statustypes, setStatusTypes] = useState([])

    useEffect(
        () => {

            if (brandsList[0]?.id) {
                setselectedBranch(brandsList[0])
            }
        }
        , [brandsList]
    )

 
    return (
        <Grid container spacing={2}>




           

            <Grid item xs={12}>

                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs="auto">

                    </Grid>


                </Grid>
            </Grid>


            <Grid item xs={12}>
                <AddonGrid reload={reload} selectedBrand={selectedBranch} setData={setData} data={data} setModalOpen={setModalOpen} statustypes={statustypes} />
            </Grid>

        </Grid>
    );
}
