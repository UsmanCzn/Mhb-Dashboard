import React from 'react';
import { Chip, Grid, Typography, Box, MenuItem, Button } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

const GridItem = ({ item, brand, productTypes, setModalOpen, setUpdateData, setUpdate }) => {
    const type = productTypes?.find((obj) => obj?.id == item?.productTypeId);

    const update = () => {
        setModalOpen(true);
        setUpdateData(item);
        setUpdate(true);
    };

    return (
        <Grid
            item
            xs={6}
            sm={4}
            md={3}
            sx={{
                height: 280,
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
                        height: 280,
                        border: '1px solid lightGrey',
                        backgroundColor: 'white',
                        p: 2,
                        borderRadius: 2
                    }}
                    boxShadow={1}
                    flexDirection="column"
                    display="flex"
                >
                    <img
                        src={item?.productImage}
                        style={{
                            width: '100%',
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: 12
                        }}
                        alt="img"
                    />
                    <Box
                        sx={{
                            width: '100%',
                            mt: 1
                        }}
                        justifyContent="space-between"
                        display="flex"
                    >
                        <Typography variant="h5" style={{ fontSize: '14px' }}>
                            {item?.name}
                        </Typography>
                        <EditIcon onClick={update} fontSize="small" />
                    </Box>
                    <Typography variant="h7" style={{ fontSize: '14px' }}>
                        Type: {type?.name}
                    </Typography>
                    <Typography variant="h7" style={{ fontSize: '14px' }}>
                        Category: {type?.subTypes?.find((obj) => obj?.id == item?.productSubTypeId)?.name}
                    </Typography>
                    <Grid container justifyContent="space-between">
                        <Typography alignSelf="flex-start"> Sort Order: {item?.orderValue}</Typography>
                        <Typography alignSelf="flex-end">{item?.price + ' ' + brand?.currency}</Typography>
                    </Grid>
                </Box>
            </Box>
        </Grid>
    );
};

export default GridItem;
