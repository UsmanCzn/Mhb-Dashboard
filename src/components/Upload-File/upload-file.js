import React, { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';

const UploadFile = (props) => {
    const { Image, setImage } = props;
    const inputRef = useRef(null);
    const [ImageView, setImageView] = useState(null);
    const handleClick = () => {
        inputRef.current.click();
    };

    useEffect(() => {
    }, [ImageView, Image]);

    const onChangeFile = (event) => {
        const input = event.target;
        if (input.files && input.files[0]) {
            console.log(event.target.files[0]);
            const file = event.target.files[0];
            setImage(file);
            setImageView(URL.createObjectURL(event.target.files[0]));
        }
    };
    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={($event) => {
                    onChangeFile($event);
                }}
                hidden
            ></input>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    border: 1,
                    maxWidth: '150px',
                    minWidth: '150px',
                    height: '150px',
                    minHeight: '150px',
                    borderColor: 'grey.500',
                    borderRadius: 1,
                    position: 'relative'
                }}
            >
                {ImageView && (
                    <IconButton
                        onClick={() => {
                            setImage(null);
                            setImageView(null);
                        }}
                        sx={{ color: 'grey.500', position: 'absolute', top: '2px', right: '5px' }}
                        aria-label="Example"
                    >
                        <CloseIcon />
                    </IconButton>
                )}
                <IconButton
                    onClick={handleClick}
                    sx={{ color: 'grey.500', position: 'absolute', bottom: '5px', right: '15px', backgroundColor: '#f0ffffab' }}
                    aria-label="Example"
                >
                    <FileUploadOutlinedIcon />
                </IconButton>
                {(ImageView || Image) && (
                    <img
                        style={{ maxWidth: '146px', minWidth: '146px', height: '146px', minHeight: '146px', objectFit: 'cover' }}
                        src={ImageView || Image}
                        alt="methods-img"
                    />
                )}
            </Box>
        </>
    );
};

export default UploadFile;
