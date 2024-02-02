import React from 'react';
import {Grid} from "@mui/material";
import InfoSmallCard from "../InfoSmallCard/InfoSmallCard";

const RewardUserComponent = () => {
    const rewardUsersData = [
        {
            title: "Fresh",
            count: 24,
        },
        {
            title: "Rookie",
            count: 65,
        },
        {
            title: "Holmie",
            count: 3000,
        },
        {
            title: "OG Holmie",
            count: 456,
        },
        {
            title: "Legendary Holmie",
            count: 235,
        },
    ];

    return (
        <Grid container alignItems="center" justifyContent="space-between">
                <Grid container spacing={2} direction="row">
                        {rewardUsersData.map(item =>{
                            return(
                                <Grid item xs={12} sm={6} md={4} lg={3} sx={{flexBasis:'20% !important'}}>
                                    <InfoSmallCard title={item.title} count={item.count + ' Users'} />
                                </Grid>
                            )
                        })}
            </Grid>
        </Grid>
    );
};
export default RewardUserComponent;