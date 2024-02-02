import React from 'react';
import {Grid, Stack, Typography} from "@mui/material";

import MainCard from "../../../components/MainCard";

const InfoSmallCard = ({ title, count }) => {
    return(
        <MainCard contentSX={{ p: 2.25 }} >
            <Stack spacing={0.5}>
                <Typography variant="h6" color="textSecondary">
                    {title}
                </Typography>
                <Grid container alignItems="center">
                    <Grid item>
                        <Typography variant="h4" color="inherit">
                            {count}
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>
        </MainCard>
    )
};
export default InfoSmallCard;