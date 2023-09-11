import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import QuestionMarkSharpIcon from '@mui/icons-material/QuestionMarkSharp';
import AddHomeIcon from '@mui/icons-material/AddHome';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { Typography } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

// project imports
import MenuList from './MenuList';
import LogoSection from '../LogoSection';
import MenuCard from './MenuCard';
import { drawerWidth } from 'store/constant';
import Calendarview from './MenuCard/calendar';
import { IconTrash } from '@tabler/icons';
import axios from 'axios';
import * as dataSource from './drag-data.json';
import Assignicon from 'assets/images/icons/assign.png';
import AddAssignmentModal from 'components/AddAssignmentModal';

import './drag.css';
import './treeview.css';
import { AUTHORISATION_TOKEN_STORAGE_KEY, AUTHORISATION_USER_ID_STORAGE_KEY } from 'utils/constants';
import { useCreateRoomMutation, useGetUserInfoQuery } from 'store/slices/apiSlice';
import { useDispatch } from 'react-redux';
import { SET_REFETCH_DATA } from 'store/actions';
import { makeId } from 'utils/helpers';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, windowobject }) => {
    const [cookies] = useCookies();
    const dispatch = useDispatch();
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openpoper = Boolean(anchorEl);
    const navigate = useNavigate();

    const { data: userInfo, isLoading: isLoadingUsreInfo, error: userInfoError } = useGetUserInfoQuery();
    const [createRoomByApi, response] = useCreateRoomMutation();

    useEffect(() => {
        if (response?.data) {
            dispatch({ type: SET_REFETCH_DATA, payload: makeId(10) });
            navigate(`/createRoom/${response?.data?.roomId}/${cookies[AUTHORISATION_USER_ID_STORAGE_KEY]}`);

            setAnchorEl(null);
        }
    }, [response]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
        // setOpen(false);
        // setOpencancel(true);
    };
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
        setAnchorEl(null);
    };
    const handleCloseDialog = () => {
        setOpen(false);
    };

    const openLinkInNewTab = (url) => {
        const newTab = window.open(url, '_blank');
        if (newTab) newTab.opener = null;
        setAnchorEl(null);
    };

    const [listdata, setListdata] = useState([]);

    const data = dataSource;

    // Render the second TreeView by mapping its fields property with data source properties
    const fields = { dataSource: data.dragData2, id: 'id', text: 'name', child: 'child', selected: 'isSelected' };

    const [opencancel, setOpencancel] = useState(false);
    const handlecancelClose = () => {
        setOpencancel(false);
        setAnchorEl(null);
        setOpen(false);
    };
    const handlecancelnoClose = () => {
        setOpencancel(false);
    };

    const [openassign, setOpenassign] = useState(false);
    const handleassignClose = () => {
        setOpencancel(false);
        setAnchorEl(null);
        setOpenassign(false);
    };
    const handleassignnoClose = () => {
        setOpenassign(false);
        setOpen(true);
    };

    const handleassignevent = async () => {
        // listdata.map(async (onedata, index) => {
        //     assigninsertdata.push({
        //         name: onedata,
        //         subject: sendsubject,
        //         class: sendclass,
        //         title: sendtitle,
        //         gradeormark: sendnum,
        //         duedate: senddatetime,
        //         status: 'New'
        //     });
        // });
        // await axios
        //     .post('http://localhost:3000/api/assignments/insert', {
        //         assigninsertdata
        //     })
        //     .then((response) => {
        //         setAssignmentinsertdata([]);
        //     });
        // // setOpen(false);
        // setOpen(false);
        // setOpenassign(false);
    };

    const createRoom = () => {
        createRoomByApi({ object: false, headImg: '' });
    };

    const drawer = (
        <>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
                    <LogoSection />
                </Box>
            </Box>

            <Dialog
                open={openassign}
                onClose={handleassignClose}
                aria-labelledby="alert-dialog-title"
                sx={{ width: '20%', height: '25%', position: 'absolute', top: '40%', left: '40%' }}
            >
                <DialogTitle id="alert-dialog-title"></DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <img src={Assignicon} alt="icon" />

                        <Typography variant="h4" component="h4">
                            {'Are you sure you want to'} <br />
                            {'assign now?'}
                        </Typography>
                    </div>
                </DialogContent>

                <DialogActions sx={{ textAlign: 'center', marginRight: '20%' }}>
                    <Stack direction="row" spacing={5}>
                        <Button
                            onClick={handleassignnoClose}
                            sx={{ backgroundColor: '#818181', color: '#ffffff', '&:hover': { backgroundColor: '#818181' } }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleassignevent}
                            sx={{ backgroundColor: '#7983FF', color: '#ffffff', '&:hover': { backgroundColor: '#7983FF' } }}
                        >
                            Assign
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            <Dialog
                open={opencancel}
                onClose={handlecancelClose}
                aria-labelledby="alert-dialog-title"
                sx={{ width: '20%', height: '25%', position: 'absolute', top: '40%', left: '40%' }}
            >
                <DialogTitle id="alert-dialog-title"></DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <HighlightOffIcon
                            style={{ color: '#F7C005', width: '40px', height: '50px', fontWeight: '800', fontFamily: 'bold' }}
                        />
                        <Typography variant="h4" component="h4">
                            {'Are you sure you want to'} <br />
                            {'cancel?'}
                        </Typography>
                    </div>
                </DialogContent>
                <DialogActions sx={{ textAlign: 'center', marginRight: '20%' }}>
                    <Stack direction="row" spacing={5}>
                        <Button
                            onClick={handlecancelnoClose}
                            sx={{ backgroundColor: '#818181', color: '#ffffff', '&:hover': { backgroundColor: '#818181' } }}
                        >
                            No
                        </Button>
                        <Button
                            onClick={() => {
                                handlecancelClose();
                            }}
                            sx={{ backgroundColor: '#7983FF', color: '#ffffff', '&:hover': { backgroundColor: '#7983FF' } }}
                        >
                            Yes
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                sx={{ width: '20%', height: '25%', position: 'absolute', top: '40%', left: '40%' }}
            >
                <DialogTitle id="alert-dialog-title"></DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <IconTrash style={{ color: '#F7C005', width: '40px', height: '50px', fontWeight: '800', fontFamily: 'bold' }} />
                        <Typography variant="h4" component="h4">
                            {'Are you sure you want'} <br />
                            {'to delete this?'}
                        </Typography>
                    </div>
                </DialogContent>

                <DialogActions sx={{ textAlign: 'center', marginRight: '20%' }}>
                    <Button
                        onClick={handleClose}
                        sx={{ backgroundColor: '#818181', color: '#ffffff', '&:hover': { backgroundColor: '#818181' } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            // handleDelete();
                            handleClose();
                        }}
                        sx={{ backgroundColor: '#CE2C2C', color: '#ffffff', '&:hover': { backgroundColor: '#CE2C2C' } }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <AddAssignmentModal open={open} handleCloseDialog={handleCloseDialog} handleClose={handleClose} fields={fields} />

            <BrowserView>
                <PerfectScrollbar
                    component="div"
                    style={{
                        height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        borderRight: '3px solid #DFDFDF'
                    }}
                >
                    {userInfo?.type == 1 ? (
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: theme.palette.background.primaryColor,
                                borderRadius: '20px',
                                margin: '10px 20px',
                                width: '67%',
                                fontWeight: '500',
                                fontSize: '20px',
                                fontFamily: 'Livvic'
                            }}
                            id="fade-button"
                            aria-controls={openpoper ? 'fade-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openpoper ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            + Create
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: theme.palette.background.primaryColor,
                                borderRadius: '20px',
                                margin: '10px 20px',
                                width: '67%',
                                fontWeight: '500',
                                fontSize: '20px',
                                fontFamily: 'Livvic'
                            }}
                            id="fade-button"
                            aria-controls={openpoper ? 'fade-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openpoper ? 'true' : undefined}
                            onClick={createRoom}
                        >
                            + Create
                        </Button>
                    )}

                    <Menu
                        id="fade-menu"
                        MenuListProps={{
                            'aria-labelledby': 'fade-button'
                        }}
                        anchorEl={anchorEl}
                        open={openpoper}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={handleClickOpen} sx={{ color: theme.palette.background.primaryColor, fontWeight: '500' }}>
                            <CreateNewFolderIcon sx={{ color: '#2CC5CE', mr: '5px' }} /> Create Assignment
                        </MenuItem>
                        <MenuItem onClick={createRoom} sx={{ color: theme.palette.background.primaryColor, fontWeight: '500' }}>
                            <AddHomeIcon sx={{ color: '#F7C005', mr: '5px' }} /> Create Room
                        </MenuItem>
                    </Menu>

                    <MenuList />
                    {/* <MenuCard /> */}

                    <Calendarview />
                    {/* <QuestionMarkSharpIcon
                        style={{ position: 'absolute', bottom: '0px', color: '#7983FF', borderRadius: '50%', backgroundColor: '#F2F2F2' }}
                    /> */}
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ px: 2 }}>
                    <MenuList />
                    <MenuCard />
                </Box>
            </MobileView>
        </>
    );

    const container = windowobject !== undefined ? () => windowobject.document.body : undefined;

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderRight: 'none',
                        [theme.breakpoints.up('md')]: {
                            top: '50px'
                        }
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color="inherit"
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    windowobject: PropTypes.object
};

export default Sidebar;
