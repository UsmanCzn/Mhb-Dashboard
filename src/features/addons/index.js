import React from 'react'
import { Grid, Box,OutlinedInput } from '@mui/material';
import { useFetchProductsList } from 'features/Store/Products/hooks/useFetchProductsList';
import GridItem from 'components/products/gridItem';
import { useFetchProductTypeList } from 'features/Store/ProductType/hooks/useFetchProductTypeList';


const ProductGrid = ({
    reload,
    selectedBranch
}) => {

    const { productsList } = useFetchProductsList(reload, selectedBranch)
    const { productTypes } = useFetchProductTypeList(true, selectedBranch);


    return (
        <Box sx={{
            // backgroundColor:"white", 
            border: '1px solid lightGrey',
            borderRadius: 2,
            px: 2,
            py: 4

        }}
            boxShadow={2}
        >

            <Box sx={{
                // backgroundColor:"white", 
                border: '1px solid lightGrey',
                borderRadius: 2,
                mx: 2,
                py: 2,
                px:2


            }}
                xs={12}
                boxShadow={0} >

                <OutlinedInput
                    id="email-login"
                    type="email"
                    name="Search"  
                    placeholder="Search by Product name"
                     
                />

            </Box>
            <Grid container
                spacing={2} justify="space-between"
            >
                {
                    productsList?.map(item => {
                        return (
                            <GridItem item={item} brand={selectedBranch} productTypes={productTypes} />
                        )
                    })
                }

            </Grid>
        </Box>
    )

}

export default ProductGrid