import React, {useEffect, useState} from 'react';
import {Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, Typography,Button,TextField } from "@mui/material";
import {useFetchBrandsList} from "../../features/BrandsTable/hooks";
import { useBranches } from 'providers/branchesProvider';
import MainCard from "../../components/MainCard";
import OrdersTable from "../dashboard/OrdersTable";
import InfoSmallCard from "./InfoSmallCard/InfoSmallCard";
import RewardUserComponent from "./RewardUserComponent/RewardUserComponent";
import RewardPoint from "./RewardPointComponent/RewardPoint";
import BottomTableComponent from "./BottomTableComponent/BottomTableComponent";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import rewardService from 'services/rewardService';

const RewardStats=()=>{
    const [selectedBrand, setselectedBrand] = useState({});
    const [selectedBranch, setselectedBranch] = useState('');

    const { branchesList } = useBranches();
    const [reload, setReload] = useState(false);
    const [ordersChartData, setOrdersChartData] = useState();
    const { brandsList } = useFetchBrandsList(reload);
    
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleDateChange = (newValue) => {
        setStartDate(newValue);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue);
    };

    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[1]);
            setselectedBranch(branchesList[0]);
            setOrdersChartData(null);
            setReload((prev) => !prev);
        } else {
            console.log('now goes to zero ', 'sb');
        }
    }, [brandsList]);

    const getData = async ()=>{
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        const formatedStartDate = `${parsedStartDate.getFullYear()}-${parsedStartDate.getMonth() + 1}-${parsedStartDate.getDate()}`;
        const formatedEndDate = `${parsedEndDate.getFullYear()}-${parsedEndDate.getMonth() + 1}-${parsedEndDate.getDate()}`;
        const data ={
            brandId: selectedBrand.id,
            branchId: selectedBranch.id,
            startDate: formatedStartDate,
            endDate: formatedEndDate,

        }
        try{
            const res =await rewardService.getRewardStats(data)
            if(res) {
                console.log(res);
            }
        }catch(err){

        }

    }

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
                        <Box sx={{display: 'flex', gap:"10px"}}>
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
                                        {branchesList.map((row, index) => {
                                            return (
                                                <MenuItem key={index} value={row}>
                                                    {row?.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                        </FormControl>
                        </Box>
                    </Grid>
                   
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={2.2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start"
                                value={startDate}
                                renderInput={(params) => <TextField {...params} />}
                                onChange={(newValue) => {
                                    handleDateChange(newValue);
                                }}
                                minDate={new Date(2023, 0, 1)}
                                maxDate={new Date()}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={2.2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="End"
                                value={endDate}
                                renderInput={(params) => <TextField {...params} />}
                                onChange={(newValue) => {
                                    handleEndDateChange(newValue);
                                }}
                                minDate={new Date(2023, 0, 1)}
                                maxDate={new Date()}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={getData}>
                            Submit
                        </Button>
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