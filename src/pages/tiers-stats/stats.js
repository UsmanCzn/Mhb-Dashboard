import React, { useEffect, useState } from 'react';
import { Chip, Grid, Typography, Menu, FormControl, InputLabel, Select, MenuItem, Button, Card, Box } from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';

const TierStats = () => {
    const [reload, setReload] = useState(false);
    const { brandsList } = useFetchBrandsList(reload);
    // const { brandsList } = useFetchBranchList(reload)

    const [selectedBranch, setselectedBranch] = useState({});
    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBranch(brandsList[0]);
        }
    }, [brandsList]);

    return (
        <>
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
            </Grid>
        </>
    );
};

export default TierStats;
