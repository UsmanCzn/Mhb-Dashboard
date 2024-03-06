import React, { useState, useEffect } from 'react';
import { Grid, Box, OutlinedInput, Button, CircularProgress } from '@mui/material';
import { useFetchProductsList } from 'features/Store/Products/hooks/useFetchProductsList';
import GridItem from 'components/products/gridItem';
import { useFetchProductTypeList } from 'features/Store/ProductType/hooks/useFetchProductTypeList';
import UpdateProduct from 'components/store/products/updateProduct';

const ProductGrid = ({ reload, selectedBranch, setReload, setModalOpen, sortOrder, sortBy }) => {
    const { productsList, loading, setProductsList } = useFetchProductsList(reload, selectedBranch);
    const { productTypes } = useFetchProductTypeList(true, selectedBranch);

    const [updateModalOpen, setUpdateModalOpen] = useState(false);

    const [update, setUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const [SortedProductList, setSortedProductList] = useState([]);

    const sortByProperty = (array, propertyName, sortOrder = 0) => {
        return array.sort((a, b) => {
            const aValue = a[propertyName];
            const bValue = b[propertyName];

            if (sortOrder === 0) {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else if (sortOrder === 1) {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }

            return 0;
        });
    };

    const searchProducts =(search)=>{
        const searchNameLower = search.toLowerCase();
        const result = productsList.filter(item => item.name.toLowerCase().includes(searchNameLower));
        setSortedProductList(result);
    }
    
    useEffect(() => {
        const temp = sortByProperty(productsList, sortBy, sortOrder);
        setSortedProductList([...temp]);

        return () => {};
    }, [sortOrder, sortBy, productsList]);

    return (
        <Box
            sx={{
                // backgroundColor:"white",
                border: '1px solid lightGrey',
                borderRadius: 2,
                px: 2,
                py: 4
            }}
            boxShadow={2}
        >
            <Box
                sx={{
                    // backgroundColor:"red",
                    // border: '1px solid lightGrey',
                    borderRadius: 2,
                    // mx: 2,
                    // py: 2,
                    px: 2,
                    width: '100%'
                }}
                display="flex"
                justifyContent="space-between"
                xs={12}
                boxShadow={0}
            >
                <OutlinedInput
                    id="email-login"
                    type="text"
                    name="Search"
                    placeholder="Search by Product name"
                    sx={{
                        width: '30%'
                    }}
                    onChange={(event)=>{ searchProducts(event.target.value)}}
                />
                <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={() => setModalOpen(true)}>
                    Add new Product
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} justify="space-between">
                    {SortedProductList?.map((item, index) => {
                        return (
                            <GridItem
                                key={index}
                                item={item}
                                brand={selectedBranch}
                                productTypes={productTypes}
                                setUpdateData={setUpdateData}
                                setUpdate={setUpdate}
                                setModalOpen={setUpdateModalOpen}
                            />
                        );
                    })}
                </Grid>
            )}

            <UpdateProduct
                modalOpen={updateModalOpen}
                setModalOpen={setUpdateModalOpen}
                setReload={setReload}
                selectedBrand={selectedBranch}
                update={update}
                updateData={updateData}
            />
        </Box>
    );
};

export default ProductGrid;
