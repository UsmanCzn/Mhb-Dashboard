import React, { useState } from 'react';
import { Chip, Grid, Typography, Box, Menu, MenuItem, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';

const GridItem = ({ item, brand, productTypes, setModalOpen, setUpdateData, setUpdate, duplicateProduct }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const type = productTypes?.find((obj) => obj?.id === item?.productTypeId);
    const navigate = useNavigate();
    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        // setModalOpen(true);
        // setUpdateData(item);
        // setUpdate(true);
        navigate(`addEditProduct/${brand.id}/${item.id}`);
        // closeMenu();
    };

    const handleDuplicate = async () => {
        // Implement duplicate logic here
        console.log('Duplicate item:', item);
        duplicateProduct(item);
        closeMenu();
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
                        <MoreVertIcon onClick={openMenu} fontSize="small" />
                    </Box>
                    <Typography variant="body2" style={{ fontSize: '14px' }}>
                        Type: {type?.name}
                    </Typography>
                    <Typography variant="body2" style={{ fontSize: '14px' }}>
                        Category: {type?.subTypes?.find((obj) => obj?.id === item?.productSubTypeId)?.name}
                    </Typography>
                    <Grid container justifyContent="space-between">
                        <Typography alignSelf="flex-start">Sort Order: {item?.orderValue}</Typography>
                        <Typography alignSelf="flex-end">{item?.price + ' ' + brand?.currency}</Typography>
                    </Grid>

                    {/* Menu for Edit and Duplicate */}
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
                    </Menu>
                </Box>
            </Box>
        </Grid>
    );
};;

export default GridItem;
