import React, {useEffect, useState} from 'react';
import {Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {useFetchBrandsList} from "../../features/BrandsTable/hooks";
import MainCard from "../../components/MainCard";
import OrdersTable from "../dashboard/OrdersTable";
import InfoSmallCard from "./InfoSmallCard/InfoSmallCard";
import RewardUserComponent from "./RewardUserComponent/RewardUserComponent";
import RewardPoint from "./RewardPointComponent/RewardPoint";
import BottomTableComponent from "./BottomTableComponent/BottomTableComponent";

const RewardStats=()=>{
    const [selectedBrand, setselectedBrand] = useState({});
    const [reload, setReload] = useState(false);
    const [ordersChartData, setOrdersChartData] = useState();
    const { brandsList } = useFetchBrandsList(reload);


    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[1]);
            setOrdersChartData(null);
            setReload((prev) => !prev);
        } else {
            console.log('now goes to zero ', 'sb');
        }
    }, [brandsList]);

    return(
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Rewards
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBrand}
                                label={'Brand'}
                                onChange={(event) => {
                                    setselectedBrand(event.target.value);
                                    setReload((prev) => !prev);
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
            <Grid item xs={12}>
                <RewardUserComponent/>
            </Grid>
            <Grid item xs={12}>
                <RewardPoint/>
            </Grid>
            <BottomTableComponent/>
        </Grid>
    )
}
export default RewardStats;