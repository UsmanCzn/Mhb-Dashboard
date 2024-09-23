import React from 'react';
import { Chip, Grid, Typography, Box, MenuItem, Button, ButtonBase } from '@mui/material';
import DefaultImage from '../../assets/images/users/default-image.png';
const AddonItem = ({ item, brand, addonGroupList, setModalOpen, setUpdate, setUpdateData }) => {
    const handleClick = async () => {
        setModalOpen(true);
        setUpdate(true);
        setUpdateData(item);
    };

    return (
        <Grid
            item
            xs={6}
            sm={4}
            md={3}
            sx={{
                height: 200,
                my: 2
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    // backgroundColor:"white",
                    display: 'flex',
                    justifyContent: 'center',
                    px: 2
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: 200,
                        border: '1px solid lightGrey',
                        backgroundColor: 'white',

                        borderRadius: 2
                    }}
                    boxShadow={1}
                    flexDirection="column"
                    display="flex"
                >
                    <ButtonBase
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            p: 2,
                            alignItems: 'flex-start'
                        }}
                        onClick={() => handleClick(item)}
                    >
                        <img
                            src={item?.image}
                            style={{
                                width: '100%',
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: 12
                            }}
                            alt="img"
                        />
                        <Typography
                            overflow="hidden"
                            variant="h5"
                            style={{ fontSize: '14px', height: 40, width: '100%' }}
                            textAlign="left"
                            mt={1}
                        >
                            {item?.name}
                        </Typography>

                        <Typography alignSelf="flex-end">{item?.price + ' ' + brand?.currency}</Typography>
                    </ButtonBase>
                </Box>
            </Box>
        </Grid>
    );
};

export default AddonItem;
