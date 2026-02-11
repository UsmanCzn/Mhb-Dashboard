import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, OutlinedInput, Box } from '@mui/material';
import ProductCard from './product-card';
import stockService from 'services/stockService';
import LinearProgress from '@mui/material/LinearProgress';
import { useAuth } from 'providers/authProvider';
const StockList = (props) => {
    const { user, userRole, isAuthenticated } = useAuth();
    const { brandid, branchid } = props;
    const [loading, setloading] = useState(false);
    const [ProductList, setProductList] = useState([]);
    const [FilteredProductList, setFilteredProductList] = useState([]);
    useEffect(() => {
        if(branchid){
        getProductsList();
        }
    }, [brandid, branchid,]);
    useEffect(() => {
   
    }, [FilteredProductList])
    

    const getProductsList = async () => {
        const data = { branchid: branchid, brandid: brandid };
        setloading(true);

        try {
            const response = await stockService.getProductsListWithQty(data);
            if (response) {
                const temp = response.data.result;
                let products = getAllInnermostChildren(temp);
                setProductList([]);
                setProductList([...products]);
                setFilteredProductList([...products]);
                setloading(false);
            }
        } catch (error) {
            setloading(false);
        }
    };

    const searchArray = (value) => {
        const lowercaseValue = value.toLowerCase();
        // const results = ProductList.filter(item => item.name.toLowerCase().includes(LowercaseValue));
        const uniqueResults = new Set();
        ProductList.forEach(item => {
            if (item.name.toLowerCase().includes(lowercaseValue)) {
                uniqueResults.add(item); // Add matching item to the set
            }
        });
        
        const results = [...uniqueResults]; // Convert set back to array
        setFilteredProductList(results);
        console.log(results,'resluts');
    };

    const getAllInnermostChildren = (data) => {
        const innermostChildren = [];

        const traverse = (node) => {
            if (!node.children || node.children.length === 0) {
                if (node.type && node.type == 'product') {
                    const branch = node.productQtyWithBranchs.find((ele) => ele.branchid === branchid);
                    if (branch) {
                        node.branchQty = branch.availabilityQty;
                        node.isQtyAvailable = branch.isQtyAvailable;
                    } else {
                        node.branchQty = 0;
                    }
                    innermostChildren.push(node);
                }
            } else {
                node.children.forEach(traverse);
            }
        };

        data.forEach(traverse);

        return innermostChildren;
    };

return (
  <>
    <Box
      sx={{
        border: '1px solid lightGrey',
        borderRadius: 2,
        px: { xs: 1, sm: 2 },
      }}
      boxShadow={2}
    >
      {loading && <LinearProgress />}

      {/* Header */}
      <Box
        sx={{
          borderRadius: 2,
          px: 2,
          my: 3,
          width: '100%',
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Search */}
          <Grid item xs={12} sm={6} md={4}>
            <OutlinedInput
              fullWidth
              id="email-login"
              type="email"
              name="Search"
              onChange={(e) => searchArray(e.target.value)}
              placeholder="Search by Product name"
            />
          </Grid>

          {/* Total Count */}
          <Grid
            item
            xs={12}
            sm="auto"
            display="flex"
            justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          >
            <Typography>
              TOTAL ( {FilteredProductList.length} ) ITEMS
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Product Grid */}
      <Grid container spacing={2}>
        {FilteredProductList.map((ele, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <ProductCard
              product={ele}
              branchid={branchid}
              fetchProduct={getProductsList}
              user={user}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  </>
);

};

export default StockList;
