import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchBrandsList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from 'providers/authProvider';


export default function BrandsTable({ type, setUpdate, setUpdateData, setModalOpen }) {

  const { user } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();

  const { brandsList, loading } = useFetchBrandsList();

    const [anchorEl, setAnchorEl] = useState(null);
    const [brand, setBrand] = useState({});
  const [viewMode, setViewMode] = useState('grid');

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setBrand(params?.row);
        setAnchorEl(event.currentTarget);
    };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (data) => {
    if (!data.modal && data.route) {
      navigate(`${location.pathname}/${brand?.id}/${data.route}`);
    } else if (data?.name === 'Edit Brand') {
            navigate('/addEditBrand/' + brand.id);
      setUpdateData?.(brand);
      setUpdate?.(true);
      setModalOpen?.(true);
        }
    closeMenu();
    };

const columns = [
  {
    field: 'image',
    headerName: 'Image',
    minWidth: 80,
    flex: 0.6,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: ({ row }) => {
      const handleError = (event) => {
        event.target.src =
          'https://syyve.blob.core.windows.net/users-avatar/default-user.png';
      };

      return (
        <img
          src={
            row.logoUrl ||
            'https://syyve.blob.core.windows.net/users-avatar/default-user.png'
          }
          onError={handleError}
          alt="brand logo"
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            objectFit: 'cover',
          }}
        />
      );
    },
  },
  {
    field: 'name',
    headerName: 'Brand Name',
    minWidth: 180,
    flex: 1.4,
    headerAlign: 'left',
    align: 'left',
    renderCell: (params) => (
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {params.value}
      </span>
    ),
  },
  {
    field: 'amountOfBranches',
    headerName: 'Branches',
    minWidth: 120,
    flex: 0.8,
    headerAlign: 'left',
    align: 'left',
  },
  {
    field: 'amountOfGroups',
    headerName: 'Customer Groups',
    minWidth: 160,
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  },
  {
    field: 'amountOfCustomers',
    headerName: 'Customers',
    minWidth: 140,
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  },
  {
    field: 'isHidden',
    headerName: 'Hidden',
    minWidth: 100,
    flex: 0.7,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) =>
      params.row.isHidden ? (
        <Tooltip title="Hidden">
          <CheckCircleIcon color="error" />
        </Tooltip>
      ) : (
        <Tooltip title="Visible">
          <CancelIcon color="success" />
        </Tooltip>
      ),
  },
  {
    field: 'actions',
    headerName: 'Action',
    sortable: false,
    minWidth: 80,
    flex: 0.5,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <MoreVertIcon
        sx={{ cursor: 'pointer' }}
        onClick={(event) => handleClick(event, params)}
      />
    ),
  },
];


    const options = [
        {
            name: 'Edit Brand',
            modal: true
        },
        // {
        //     name: 'Create Brand User',
        //     modal: true
        // },
        // {
        //     name: 'Show all Brand Users',
        //     modal: false,
        //     route: 'branchRewardProgram'
        // },
        // {
        //     name: 'QR scans',
        //     modal: false,
        //     route: 'branchTimings'
        // },
        // {
        //     name: 'Brand Fees',
        //     modal: true
        // },
        // {
        //     name: 'Brand Taxs',
        //     modal: true
        // },
        // {
        //     name: 'Brand Payments',
        //     modal: true
        // },
        // {
        //     name: 'Brand Topups',
        //     modal: true
        // },
        // {
        //     name: 'Brand Cars Settings',
        //     modal: true
        // },
        // {
        //     name: 'Brand Tutorial',
        //     modal: true
        // },
        // {
        //     name: 'Brand Events',
        //     modal: true
        // }
    ];

    return (
        <>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            size="small"
            onChange={(event, newMode) => {
              if (newMode !== null) {
                setViewMode(newMode);
              }
            }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              <TableRowsIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {loading ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : viewMode === 'table' ? (
          <DataGridComponent
            rows={brandsList}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            rowsPerPageOptions={[10]}
            totalRowCount={brandsList?.length ?? 0}
            pSize={10}
            pMode={'client'}
          />
        ) : (
          <Grid container spacing={2}>
            {(brandsList || []).map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
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
                  <IconButton
                    size="small"
                    disabled={user?.isAccessRevoked}
                    onClick={(event) => handleClick(event, { row: item })}
                    sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>

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
                      src={
                        item.logoUrl ||
                        'https://syyve.blob.core.windows.net/users-avatar/default-user.png'
                      }
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </Box>

                  <Typography variant="subtitle1" fontWeight={700} noWrap>
                    {item.name || '-'}
                  </Typography>

                  <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Branches: {item.amountOfBranches ?? 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customer Groups: {item.amountOfGroups ?? 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customers: {item.amountOfCustomers ?? 0}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status:
                      </Typography>
                      {item.isHidden ? (
                        <Tooltip title="Hidden">
                          <CheckCircleIcon color="error" fontSize="small" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Visible">
                          <CancelIcon color="success" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && (brandsList || []).length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No brands found.
          </Typography>
        )}

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
          onClose={closeMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                {options.map((row, index) => {
                    return (
              <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleOptionClick(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
