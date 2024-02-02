import React from 'react';
import {Grid} from "@mui/material";
import RewardPointCard from "./RewardPointCard";

const RewardPoint=()=>{
    const rewardPoint = [
        {
            title: "Total Points Earned",
            points: 150,
            imgUrl: "https://example.com/reward-a.jpg",
            altText: "Reward A Alt Text",
            isSharq:false
        },
        {
            title: "Total Points Expired",
            points: 10,
            imgUrl: "https://example.com/reward-b.jpg",
            altText: "Reward B Alt Text",
            isSharq:false,
        },
        {
            title: "Which stores has more redeems order?",
            orders: 75,
            imgUrl: "https://example.com/reward-c.jpg",
            altText: "Reward C Alt Text",
            isSharq:true,

        },
        {
            title: "Which store has collected the highest points?",
            points: 20,
            imgUrl: "https://example.com/reward-d.jpg",
            altText: "Reward D Alt Text",
            isSharq:true,
        },
    ];


    return(
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid container spacing={2} direction="row">
                {rewardPoint.map(item =>{
                    return(
                        <Grid item xs={12} sm={6} md={4} lg={3} sx={{flexBasis:'50% !important',maxWidth:'50% !important'}}>
                            <RewardPointCard title={item.title} points={item.points || null} orders={item.orders || null} imgUrl={item.imgUrl} altText={item.altText} isSharq={item.isSharq}/>
                        </Grid>
                    )
                })}
            </Grid>
        </Grid>
    )

}
export default RewardPoint;