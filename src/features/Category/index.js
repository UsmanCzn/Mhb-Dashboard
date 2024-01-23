import React from 'react'
import { Grid, Box,OutlinedInput } from '@mui/material';
import { useFetchProductsList } from 'features/Store/Products/hooks/useFetchProductsList';
import GridItem from 'components/Categories/gridItem';
import { useFetchProductTypeList } from 'features/Store/ProductType/hooks/useFetchProductTypeList';
import CategoryTable from 'features/Store/ProductType';


const CategoryGrid = ({
    reload,
    selectedBrand
}) => {
  


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
                    placeholder="Search by Category name"
                     
                />

            </Box>
           


<CategoryTable  selectedBrand={selectedBrand}  />
        </Box>
    )

}

export default CategoryGrid