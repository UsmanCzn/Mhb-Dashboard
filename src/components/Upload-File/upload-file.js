import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DefaultImg from '../../assets/images/users/default-image.png';

const UploadFile = (props) => {
    return (
        <>
            <input type="file"></input>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    border: 1,
                    maxWidth: '150px',
                    height: '150px',
                    borderColor: 'grey.500',
                    borderRadius: 1,
                    position: 'relative'
                }}
            >
                <IconButton sx={{ color: 'grey.500', position: 'absolute', bottom: '5px', right: '15px' }} aria-label="Example">
                    <FileUploadOutlinedIcon />
                </IconButton>
                <img src={DefaultImg} alt="methods-img" />
            </Box>
        </>
    );
};

export default UploadFile;
