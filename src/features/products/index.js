import React, { useState, useEffect, useMemo, memo } from 'react';
import { Grid, Box, OutlinedInput, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useFetchProductsList } from 'features/Store/Products/hooks/useFetchProductsList';
import GridItem from 'components/products/gridItem';
import { useFetchProductTypeList } from 'features/Store/ProductType/hooks/useFetchProductTypeList';
import UpdateProduct from 'components/store/products/updateProduct';
import storeServices from 'services/storeServices';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { useAuth } from 'providers/authProvider';

const ProductGrid = ({ reload, selectedBranch, setReload, setModalOpen, sortOrder, sortBy }) => {
    const { user, userRole, isAuthenticated } = useAuth();

    const { productsList, loading, setProductsList } = useFetchProductsList(reload, selectedBranch);
    const { productTypes } = useFetchProductTypeList(true, selectedBranch);
    const navigate = useNavigate();
    const [category, setCategory] = useState();
    const [subCategory, setSubCategory] = useState();
    const [updateModalOpen, setUpdateModalOpen] = useState(false);

    const [update, setUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const [SortedProductList, setSortedProductList] = useState([]);
    const reset = useMemo(() => {
        setSubCategory();
        setCategory();
    }, [selectedBranch]);

    const subTypes = useMemo(() => {
        const temp = productTypes.find((e) => e.id === category?.id);
        return temp ? temp?.subTypes : [];
    }, [category]);

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

    const searchProducts = (search) => {
        const searchNameLower = search.toLowerCase();

        // Filter based on search term, category, and subcategory
        let result = productsList.filter((item) => item.name.toLowerCase().includes(searchNameLower));

        if (category && subCategory !== undefined) {
            if (subCategory !== 0) {
                result = result.filter((item) => item.productTypeId === category?.id && item.productSubTypeId === subCategory);
            } else {
                result = result.filter((item) => item.productTypeId === category?.id);
            }
        }
        console.log(result, 'search');

        setSortedProductList(result);
    };

    const filterByCategory = useMemo(() => {
        if (category && subCategory !== undefined) {
            if (subCategory !== 0) {
                const result = productsList.filter((item) => item.productTypeId === category?.id && item.productSubTypeId === subCategory);
                setSortedProductList(result);
            } else {
                setSortedProductList(productsList);
            }
        } else if (category) {
            const result = productsList.filter((item) => item.productTypeId === category?.id);
            setSortedProductList(result);
        } else {
            setSortedProductList([]);
        }
    }, [category, subCategory]);

    const handleSubCategoryChange = (event) => {
        const selectedValue = event.target.value;

        // Check if "All SubCategories" is selected based on id (id: 0)

        setSubCategory(selectedValue);
    };
    const duplicateProduct = (item) => {
        storeServices
            .DuplicateProducts({
                productId: item.id
            })
            .then((response) => {
                setReload((prev) => !prev);
            })
            .catch((error) => {
                console.error('Error duplicating product:', error);
            });
    };

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
                    borderRadius: 2,
                    px: 2,
                    width: '100%'
                }}
                display="flex"
                justifyContent="space-between"
                xs={12}
                boxShadow={0}
            >
                <Box sx={{ display: 'flex', gap: '20px' }}>
                    <OutlinedInput
                        id="email-login"
                        type="text"
                        name="Search"
                        placeholder="Search by Product name"
                        // sx={{
                        //     width: '30%'
                        // }}
                        onChange={(event) => {
                            searchProducts(event.target.value);
                        }}
                    />
                    <FormControl sx={{ width: '150px' }}>
                        <InputLabel id="demo-simple-select-label">{'Category'}</InputLabel>
                        <Select
                            placeholder=" Select Category"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={category}
                            label={'Category'}
                            onChange={(event) => {
                                setCategory(event.target.value);
                            }}
                        >
                            {productTypes.map((row, index) => {
                                return (
                                    <MenuItem key={index} value={row}>
                                        {row?.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '150px' }}>
                        <InputLabel id="demo-simple-select-label">SubCategory</InputLabel>
                        <Select
                            placeholder="Select Category"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={subCategory}
                            label="SubCategory"
                            onChange={handleSubCategoryChange}
                        >
                            {subTypes && subTypes.length > 0 && <MenuItem value={0}>All SubCategories</MenuItem>}

                            {subTypes?.map((row, index) => (
                                <MenuItem key={row.id || index} value={row.id}>
                                    {row?.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Button
                    size="small"
                    variant="contained"
                    disabled={user?.isAccessRevoked}
                    sx={{ textTransform: 'capitalize' }}
                    onClick={() => navigate(`/addEditProduct/${selectedBranch.id}`)}
                >
                    Add new Product
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} sx={{ mt: 2 }} justify="space-between">
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
                                duplicateProduct={duplicateProduct}
                                user={user}
                            />
                        );
                    })}
                </Grid>
            )}

            {/* <UpdateProduct
                modalOpen={updateModalOpen}
                setModalOpen={setUpdateModalOpen}
                setReload={setReload}
                selectedBrand={selectedBranch}
                update={update}
                updateData={updateData}
            /> */}
        </Box>
    );
};

export default ProductGrid;
