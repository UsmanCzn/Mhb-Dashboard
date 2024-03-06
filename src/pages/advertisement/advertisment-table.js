import { Chip, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import React, { useState ,useEffect } from 'react';
import { useLocation, useNavigate, useHistory } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import advertisementService from 'services/advertisementService';
import DefaultImg from '../../assets/images/users/default-image.png';


const AdvertisementTable = ({selectAdvertisement , setModalOpen, reload, setreload}) => {
    const [advertisements, setAdvertisements] = useState([])
    const [loading, setloading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const options = [
        {
            name: 'Edit Advertisement',
            modal: true
        },
    ]

    useEffect(() => {
        getAdvertisements()
    }, [reload])

    const activeColumnFormater = (item) => {
        return (
            <img
                alt="logo"
                src={item.brandNewsImageUrl || DefaultImg}
                style={{
                    width: 40,
                    height: 40
                }}
            />
        );
    };

    const handleClose = (data) => {
        setModalOpen(true);
        setAnchorEl(null);
    };

    const handleClick = ( event,params) => {
        selectAdvertisement(params.row)
        setAnchorEl(event.currentTarget);
    };

    const columns = [
    {
        field: 'navme',
        headerName: 'Image',
        headerAlign: 'left',
        renderCell: (params) => activeColumnFormater(params.row)
    },
    {
        field: 'title',
        headerName: 'Ttile',
        flex: 1,
        headerAlign: 'left'
    },
    {
        field: 'startDate',
        headerName: 'Start Date',
        flex: 1,
        headerAlign: 'left'
    },
    {
        field: 'endDate',
        headerName: 'End Date',
        flex: 1,
        headerAlign: 'left'
    },
    {
        field: 'showingOccurence',
        headerName: 'Show no of Times',
        flex: 1,
        headerAlign: 'left'
    },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        headerAlign: 'left'
    },
    {
        field: "isRewardMissisng",
        headerName: "Action",
        sortable: false,
        flex: 0.5,
        headerAlign: "left",

        renderCell: (params) => {
            return <MoreVertIcon
                onClick={(event)=>handleClick(event, params)} />
            }
    },
    ];
    const getAdvertisements =async () => {
       
     setloading(true)
     setreload(false)

     try{
      const response = await  advertisementService.getAllAdvertisements()
      if (response) {
        setAdvertisements(response.data.result)
        setloading(false)
      } }
      catch(error){
        setloading(false)
      }
    }
    
  return (
    <>
    <DataGridComponent
    rows={advertisements}
    columns={columns}
    loading={loading}
    getRowId={(row) => row.id}
    rowsPerPageOptions={[advertisements.length]}
    totalRowCount={advertisements.length}
    fetchCallback={()=>{}}
    onRowClick={(row) => {
        selectAdvertisement(row)
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
        <MenuItem key={index} onClick={() => handleClose(row)} value={row.name}>
            {row.name}
        </MenuItem>
    );
    })}
    </Menu>
    </>
  )
}

export default AdvertisementTable