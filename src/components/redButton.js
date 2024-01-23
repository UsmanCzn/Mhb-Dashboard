import React from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    redButton: {
        backgroundColor: 'red',
        color: 'white', // Set text color to white so it's readable on a red background
        '&:hover': {
            backgroundColor: 'darkred' // Change the hover color if desired
        }
    }
}));

const RedButton = ({ children, onClick }) => {
    const classes = useStyles();

    return (
        <Button className={classes.redButton} onClick={onClick}>
            {children}
        </Button>
    );
};

export default RedButton;
