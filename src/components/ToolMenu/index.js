import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Fingerprint from '@mui/icons-material/Fingerprint';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function ToolMenu({ closeOne, closeTwo, closeThree, data, clickOpen }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        clickOpen(data.roomId, data._id);
    };
    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };
    const handleCloseOne = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
        closeOne();
    };

    const handleCloseTwo = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
        closeTwo(data._id);
    };

    const handleCloseThree = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
        closeThree();
    };

    return (
        <div>
            <IconButton
                aria-label="fingerprint"
                color="secondary"
                onClick={handleClick}
                sx={{ background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            >
                <MoreHorizIcon sx={{color: "#2CC5CE"}}/>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                <MenuItem onClick={handleCloseOne} sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}>
                    Comment
                </MenuItem>
                <MenuItem onClick={handleCloseTwo} sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}>
                    Delete
                </MenuItem>
                {/* <MenuItem onClick={handleCloseThree} sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}>
                    Download
                </MenuItem> */}
            </Menu>
        </div>
    );
}
