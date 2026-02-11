import { Chip, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useHistory } from 'react-router-dom';
import { useFetchBranchList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Switch from '@mui/material/Switch';
import branchServices from 'services/branchServices';
import { useAuth } from 'providers/authProvider';

const label = { inputProps: { 'aria-label': 'Size switch demo' } };

export default function BranchTable({ type, reload, setModalOpen, setUpdate, setUpdateData, bid }) {
    const { user, userRole, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { branchesList, fetchBranchesList, totalRowCount, loading } = useFetchBranchList({ reload });
    const filteredBranchList = bid === 'all' || !bid ? branchesList : branchesList.filter((e) => e.brandId == bid);

    const [anchorEl, setAnchorEl] = useState(null);
    const [branch, setBranch] = useState({});
    useEffect(() => {}, [bid]);

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setBranch(params?.row);
        setAnchorEl(event.currentTarget);
        // navigate(`${location.pathname}/${params.row?.id}`);
    };
    const handleClose = (data) => {
        if (!data.modal && data.route) {
            navigate(`${location.pathname}/${branch?.id}/${data.route}`);
        } else if (data?.name == 'Edit Location') {
            navigate(`/locationAddEdit/${branch?.id}/${bid}`);
        }
        setAnchorEl(null);
    };

    const activeColumnFormater = (item) => {
        return (
            <img
                alt="logo"
                src={item.logoUrl}
                style={{
                    width: 40,
                    height: 40
                }}
            />
        );
    };

    const hideBranch = async (event, data) => {
        const tempData = { ...data, ishide: event.target.checked };
        try {
            const res = await branchServices.editBranch(tempData);
            if (res) {
                fetchBranchesList();
            }
        } catch (err) {}
    };
    const branchSwitch = async (event, data) => {
        const tempData = { ...data, isBusy: event.target.checked };
        try {
            const res = await branchServices.editBranch(tempData);
            if (res) {
                fetchBranchesList();
            }
        } catch (err) {}
    };

    const columns = [
    {
        field: 'navme',
        headerName: 'Image',
        minWidth: 80,
        flex: 0.6,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: (params) => activeColumnFormater(params.row),
    },
    {
        field: 'isBusy',
        headerName: 'Is Busy',
        minWidth: 120,
        flex: 0.8,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
        <Switch
            {...label}
            disabled={user?.isAccessRevoked}
            checked={params.row.isBusy}
            onChange={(event) => branchSwitch(event, params.row)}
            size="small"
        />
        ),
    },
    {
        field: 'ishide',
        headerName: 'Is Hidden',
        minWidth: 120,
        flex: 0.8,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
        <Switch
            {...label}
            disabled={user?.isAccessRevoked}
            checked={params.row.ishide}
            onChange={(event) => hideBranch(event, params.row)}
            size="small"
        />
        ),
    },
    {
        field: 'name',
        headerName: 'Store Name',
        minWidth: 180,
        flex: 1.2,
        headerAlign: 'left',
        align: 'left',
    },
    {
        field: 'brand',
        headerName: 'Brand',
        minWidth: 150,
        flex: 1,
        headerAlign: 'left',
        align: 'left',
    },
    {
        field: 'branchAddress',
        headerName: 'Address',
        minWidth: 220,
        flex: 1.5,
        headerAlign: 'left',
        align: 'left',
    },
    // {
    //     field: 'emailAddress',
    //     headerName: 'Email',
    //     minWidth: 200,
    //     flex: 1.3,
    //     headerAlign: 'left',
    //     align: 'left',
    // },
    {
        field: 'isRewardMissisng',
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
            name: 'Edit Location',
            modal: true
        }
        // {
        //   name:"Create Branch User",
        //   modal:true,
        // },
        // {
        //   name:"Reward programs",
        //   modal:false,
        //   route:"branchRewardProgram"
        // },
        // {
        //     name: 'Store Timings',
        //     modal: false,
        //     route: 'branchTimings'
        // },
        // {
        //   name:"Branch Users",
        //   modal:false,
        //   route:"branchUsers"
        // },
        // {
        //   name:"Branch Paddle",
        //   modal:false,
        //   route:"branchPaddle"
        // }
    ];

    return (
        <>
            <DataGridComponent
                rows={filteredBranchList}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={filteredBranchList?.length ?? 0}
                // fetchCallback={fetchBranchesList}
                onRowClick={(row) => {}}
                pSize={10}
                pMode={'client'}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                {options.map((row, index) => {
                    return (
                        <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleClose(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
