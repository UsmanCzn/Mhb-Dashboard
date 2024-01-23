import { Button } from '@mui/material';
import React from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useNavigate } from 'react-router-dom';

export default function BackToList() {
    const navigate = useNavigate();

    return (
    <Button
        type="button"
        variant="text"
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIosNewOutlinedIcon   size={18}/>}
    >
        {"Back to List"}
    </Button>
    );
  }
  