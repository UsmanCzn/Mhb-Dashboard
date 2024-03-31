import { Chip, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import React, { useState } from 'react';
import { useLocation, useNavigate, useHistory } from 'react-router-dom';
import { useFetchBranchList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Switch from '@mui/material/Switch';
import branchServices from 'services/branchServices';

const label = { inputProps: { 'aria-label': 'Size switch demo' } };

export default function BranchTable({ type, reload, setModalOpen, setUpdate, setUpdateData }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { branchesList, fetchBranchesList, totalRowCount, loading } = useFetchBranchList({reload});

    const [anchorEl, setAnchorEl] = useState(null);
    const [branch, setBranch] = useState({});

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
            navigate(`${location.pathname}/${branch?.id}`);

            // setUpdateData(branch);
            // setUpdate(true);
            // setModalOpen(true);
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

    const hideBranch = async (event,data) => {
        console.log(data);
        const tempData = {...data,ishide:event.target.checked}
        try {
         const res = await branchServices.editBranch(tempData)
         if(res) {
            console.log(res);
            fetchBranchesList()
         }
        }catch (err){

        }
    }

    const columns = [
        {
            field: 'navme',
            headerName: 'Image',
            headerAlign: 'left',
            renderCell: (params) => activeColumnFormater(params.row)
        },
        {
            field: 'isBusy',
            headerName: 'Is Busy',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => { 
                return  <Switch {...label} checked={ params.row.isBusy }  size="small" />  
            }
        },
        {
            field: 'ishide',
            headerName: 'Is Hide',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => { 
                return  <Switch {...label} checked={ params.row.ishide } onChange={(event)=>{hideBranch(event,params.row)}} size="small" />  
                // return params.row.ishide ? <Tooltip title="Hidden"> <CheckCircleIcon  /> </Tooltip>: <Tooltip title="Not Hidden"><CancelIcon title="false"/></Tooltip> ;
            }
        },
        {
            field: 'name',
            headerName: 'Location name',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'brand',
            headerName: 'Brand',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'branchAddress',
            headerName: 'Address',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'emailAddress',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'isRewardMissing',
            headerName: 'Rewards Program',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => { 
                return  <Switch {...label} checked={ params.row.isRewardMissing }  size="small" />  
            }
        },
        {
          field: "isRewardMissisng",
          headerName: "Action",
          sortable: false,
          flex: 0.5,
          headerAlign: "left",

          renderCell: (params) => {
                return <MoreVertIcon
                    onClick={(event)=>handleClick(event,params)} />
              }
        },
    ];

    const options = [
        {
            name: 'Edit Location',
            modal: true
        },
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
        //     name: 'Location Timings',
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
                rows={branchesList}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={totalRowCount}
                fetchCallback={fetchBranchesList}
                onRowClick={(row) => {
                }}
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
                        <MenuItem onClick={() => handleClose(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
