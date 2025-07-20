import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import DefaultImg from '../../assets/images/users/default-image.png';
import EditStockModal from '../../components/stockModal/index';
import stockService from 'services/stockService';

const ProductCard = (props) => {
    const { product, branchid, fetchProduct,user } = props;
    console.log(product,"product.....");
    console.log(branchid,"branchId.....");
    const branchProduct = product.productQtyWithBranchs?.find(
        (e) => e.branchid === branchid
      );
    const [Item, setItem] = useState(product);
    const handleToggle = (event) => {
        let temp = { ...product };
        temp.isQtyAvailable = event.target.checked;

        const body = {
            amount: !event.target.checked ? 0 : 1000,
            availability: event.target.checked
        };
        updateQty(body);

        setItem({ ...temp });
    };
    const [isModalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => {
        setModalOpen(true);
    };


    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleUpdateStock = (updatedStock) => {
        // Implement your logic to update stock here
        updateQty(updatedStock);
        handleCloseModal();
    };

    const updateQty = async (data) => {
        try {
            const body = {
                branchId: branchid,
                productId: product?.id,
                qty: +data?.amount,
                switch: data?.availability
            };

            const response = await stockService.ProductMenuSwitchV2(body);

            if (response) {
                let temp = { ...product };
                temp.isQtyAvailable = data?.availability;
                temp.branchQty = +data?.amount;
                setItem({ ...temp });
                fetchProduct();
            }
        } catch (error) {}
    };

    return (
        <>


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
                        src={product.productImage || DefaultImg}
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
                            {product?.name}
                        </Typography>
                        {
                        branchProduct && 
                        <IconButton
                        
                        onClick={handleOpenModal}
                        disabled={!branchProduct ||user?.isAccessRevoked}
                        size="small"
                        sx={{ color: !branchProduct ? 'gray' : 'inherit' }}
                      >
                        <EditIcon />
                      </IconButton>
                        
                        }
                    </Box>
         
                    <Grid container justifyContent="space-between">
                        <Typography variant="h5" style={{ fontSize: '14px' }} alignSelf="flex-start"> Price</Typography>
                        <Typography alignSelf="flex-end">{product?.price}</Typography>
                    </Grid>
                    {/* <Typography variant="h7" style={{ fontSize: '14px' }}>
                        Type: {type?.name}
                    </Typography> */}
                    {/* <Typography variant="h7" style={{ fontSize: '14px' }}>
                        Category: {type?.subTypes?.find((obj) => obj?.id == item?.productSubTypeId)?.name}
                    </Typography> */}
                    <Grid container justifyContent="space-between">
                        <Typography alignSelf="flex-start"> Available Quantity:</Typography>
                        <Typography alignSelf="flex-end">{product?.branchQty}</Typography>
                    </Grid>
                    <Grid container justifyContent="space-between">
                    <Typography alignSelf="flex-start"> Change Availability</Typography>
                    <Box>
                    {branchProduct && (
                        <Switch
                        title="Show Product Availability"
                        edge="end"
                        disabled={user?.isAccessRevoked}
                        onChange={(event) => handleToggle(event, product)}
                        checked={product.isQtyAvailable}
                        
                        />
                    )}
                    </Box>

                    </Grid>
                </Box>
            </Box>
 
            <EditStockModal open={isModalOpen} onClose={handleCloseModal} onUpdateStock={handleUpdateStock} selectedProduct={product} />
        </>
    );
};

export default ProductCard;
