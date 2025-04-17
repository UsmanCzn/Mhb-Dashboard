import React, { useState } from 'react';
import { Chip, Grid, Typography, Box, Menu, MenuItem, Button, ButtonBase } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import DefaultImage from '../../assets/images/users/default-image.png';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import storeServices from 'services/storeServices';
const AddonItem = ({ item, brand, addonGroupList, setModalOpen, setUpdate, setUpdateData, setAddsonReload }) => {
    const handleClick = async () => {
        setModalOpen(true);
        setUpdate(true);
        setUpdateData(item);
        closeMenu();
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };
    const deleteAddon = async () => {
        await storeServices
            .deleteProductAddon(item?.id, brand?.id)

            .then((res) => {
                // console.log(res?.data, "deleted");
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setAddsonReload((prev) => !prev);
                setModalOpen(false);
            });
    };

    return (
        <Grid
            item
            xs={6}
            sm={4}
            md={4}
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
                    {/* <ButtonBase
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}
                    >
                        <img
                            src={item?.image}
                            style={{
                                width: '100%',
                                height: 100,
                                objectFit: 'cover',
                                borderTopLeftRadius: 12, // Apply border radius to the top-left corner
                                borderTopRightRadius: 12, // Apply border radius to the top-right corner
                                borderBottomLeftRadius: 0, // No border radius on the bottom-left corner
                                borderBottomRightRadius: 0 // No border radius on the bottom-right corner
                            }}
                            alt="img"
                        />
                        <Typography
                            overflow="hidden"
                            variant="h5"
                            style={{ fontSize: '14px', height: 40, width: '100%' }}
                            textAlign="left"
                            mt={1}
                            sx={{ px: 1 }}
                        >
                            {item?.name}
                        </Typography>

                        <Typography sx={{ px: 1 }}>{item?.price + ' ' + brand?.currency}</Typography>
                    </ButtonBase> */}
                    <Card sx={{ maxWidth: 345 }}>
                        <CardMedia sx={{ height: 130 }} image={item?.image || DefaultImage} title="green iguana" />
                        <CardContent
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between', // Space out the elements horizontally
                                alignItems: 'center' // Center align items vertically
                            }}
                        >
                            <Box>
                                <Typography variant="h5" fontSize={14}>
                                    {item?.name}
                                </Typography>
                                <Typography variant="h5" fontSize={14}>
                                    {brand?.currencyDecimals != null
                                        ? `${Number(item?.price).toFixed(brand.currencyDecimals)} ${brand.currency}`
                                        : `${item?.price} ${brand?.currency}`}
                                </Typography>
                            </Box>
                            <MoreVertIcon onClick={openMenu} />
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                                <MenuItem onClick={() => handleClick(item)}>Edit</MenuItem>
                                <MenuItem onClick={() => deleteAddon()}>Delete</MenuItem>
                            </Menu>
                        </CardContent>
                        {/* <CardActions>
                            <Button size="small" onClick={() => handleClick(item)}>
                                Edit
                            </Button>
                            <Button size="small">Delete</Button>
                        </CardActions> */}
                    </Card>
                </Box>
            </Box>
        </Grid>
    );
};

export default AddonItem;
