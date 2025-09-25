import React, { useState } from 'react';
import { Grid, Typography, Box, Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';

const GridItem = ({
  item, brand, productTypes, duplicateProduct, user,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const type = productTypes?.find(obj => obj?.id === item?.productTypeId);
  const category = type?.subTypes?.find(obj => obj?.id === item?.productSubTypeId);
  const navigate = useNavigate();

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleEdit = () => navigate(`addEditProduct/${brand.id}/${item.id}`);
  const handleDuplicate = () => { duplicateProduct(item); closeMenu(); };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: 3,
          border: '1px solid #eee',
          overflow: 'hidden',
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          p: 2
        }}
      >
        {/* Order badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 10, left: 10,
            bgcolor: '#222',
            color: '#fff',
            fontSize: 11,
            px: 1.5, py: 0.5,
            borderRadius: 10,
            fontWeight: 700,
            zIndex: 2
          }}
        >
          #{item?.orderValue}
        </Box>

        {/* Menu */}
        <IconButton
          size="small"
          onClick={openMenu}
          sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
          <MenuItem disabled={user?.isAccessRevoked} onClick={handleEdit}>Edit</MenuItem>
          <MenuItem disabled={user?.isAccessRevoked} onClick={handleDuplicate}>Duplicate</MenuItem>
        </Menu>

        {/* Image */}
        <Box
          sx={{
            width: '100%',
            height: 140,
            mb: 2,
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: '#f9f9f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={item?.productImage}
            alt={item?.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            loading="lazy"
          />
        </Box>

        {/* Product Name */}
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {item?.name}
        </Typography>
        {/* Type & Category */}
        <Typography variant="body2" color="text.secondary" noWrap>
          {type?.name}
        </Typography>
        <Typography variant="body2" color="text.disabled" mb={1} noWrap>
          {category?.name}
        </Typography>

        {/* Price */}
        <Box
  sx={{
    bgcolor: '#f6f6f6',
    borderRadius: 999,
    px: 2,
    py: 0.5,
    alignSelf: 'flex-end',
    fontWeight: 600,
    fontSize: 15,      // reduced from 17 to 16

  }}
>
  {brand?.currencyDecimals != null
    ? `${Number(item?.price).toFixed(brand.currencyDecimals)} ${brand?.currency || ''}`
    : `${item?.price} ${brand?.currency || ''}`}
</Box>

      </Box>
    </Grid>
  );
};

export default GridItem;
