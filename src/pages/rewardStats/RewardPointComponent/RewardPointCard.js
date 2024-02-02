import React from 'react';
import { Grid, Stack, Typography } from "@mui/material";
import MainCard from "../../../components/MainCard";
import { Image } from "@material-ui/icons";

const RewardPointsCard = ({ title, points, orders, imgUrl, altText, isSharq }) => {

    return (
        <MainCard contentSX={{ p: 2.25 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                    <Stack spacing={0.5}>
                        <Typography variant="h6" color="textSecondary">
                            {title}
                        </Typography>
                        <Typography>
                            {isSharq ?
                                `Sharq ${points !== null ? points + " Points" : orders !== null ? orders + " Orders" : ""}`
                                :
                                `${points} Points`
                            }
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item xs={4}>
                    {imgUrl &&
                        <Image src={imgUrl} alt={altText} />
                    }
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default RewardPointsCard;
