import React from 'react';
import { useEffect, useState } from 'react';
// material-ui
import { Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import room1 from 'assets/images/roomimg/room1.png';
import ImageListItem from '@mui/material/ImageListItem';
import { Typography } from '@mui/material';
import { Card } from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
// ==============================|| DEFAULT DASHBOARD ||============================== //
import RoomA1webp from 'assets/images/roomimg/RoomA_V1.webp';
import RoomA1 from 'assets/images/roomimg/RoomA1.png';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import UserIconGroup from 'assets/images/icons/UserIconGroup.png';
import AssignmentTitle from 'assets/images/roomimg/Assignment Title.png';
import Divider from '@mui/material/Divider';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import fileDownload from 'js-file-download';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Snackbar from '@mui/material/Snackbar';
import { IconTrash, IconX, IconCheck, IconShare } from '@tabler/icons';
import data from '../../components/Datagrid/data.json';
import DropdownTreeSelectHOC from '../../components/Datagrid/HOC';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import usericon from 'assets/images/roomimg/Vector.png';
import '../../components/Datagrid/index.css';
import '../myprojects/index.css';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 330,
    height: 280,
    boxShadow: '3.0331px  3px 3.0331px rgba(0, 0, 0, 0.25)',
    marginTop: 70

    // transform: "rotate(90deg)",
}));

function FormRow() {
    const Userlist = [{ title: 'Everyone' }, { title: 'Joby' }, { title: 'Alan' }, { title: 'Kaya' }, { title: 'Noah' }];
    const [openstudentlist, Setopenstudentlist] = useState(false);
    const handleclickstudentlistopen = () => {
        Setopenstudentlist(true);
    };
    const handleclickstudentlistclose = () => {
        Setopenstudentlist(false);
    };

    const currentDate = new Date();
    const toIsodate = currentDate.toISOString();
    const toIsodate1 = toIsodate.slice(0, -5);

    const createdByMeMockdatas = [
        { imageurl: RoomA1, title: 'Room Name', sharedNumber: '+5' },
        { imageurl: RoomA1, title: 'Room Name', sharedNumber: '+5' },
        { imageurl: RoomA1, title: 'Room Name', sharedNumber: '+5' },

        { imageurl: RoomA1, title: 'Room Name', sharedNumber: '' },
        { imageurl: RoomA1, title: 'Room Name', sharedNumber: '+5' },
        { imageurl: RoomA1, title: 'Room Name', sharedNumber: '+5' }
    ];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openpoper = Boolean(anchorEl);
    const [open, setOpen] = useState(false);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    const handleDownload = (data, filename) => {
        fileDownload(JSON.stringify(data), filename);
    };

    const [shareValue, setShareValue] = React.useState(null);
    const [shareOpen, setShareOpen] = useState(false);

    const handleshareClose = () => {
        setShareOpen(false);
        setShareValue(null);
    };
    const handleShareOpen = () => {
        setShareOpen(true);
        setAnchorEl(null);
    };
    const onChange = (currentNode, selectedNodes) => {
        console.log('path::', currentNode.path);
    };

    const [sharetoEdit, setShareToEdit] = useState('https://grwthx.com/file/d/1awregsdf5/view?usp=sharing');
    const [sharetoPlay, setShareToPlay] = useState('https://grwthx.com/file/d/2awregege3/view?usp=sharing');

    const [alertOpen, setAlertOpen] = useState(false);

    const sharetoeditClick = () => {
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };
    const [alertplayOpen, setAlertPlayOpen] = useState(false);
    const sharetoplayClick = () => {
        setAlertPlayOpen(true);
    };

    const handleClosePlayAlert = () => {
        setAlertPlayOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={shareOpen}
                onClose={handleshareClose}
                aria-labelledby="alert-dialog-title"
                sx={{ width: '25%', height: '70%', position: 'absolute', top: '10%', left: '40%' }}
            >
                <div style={{ display: 'flex', padding: '10px', backgroundColor: '#2CC5CE' }}>
                    <Typography variant="h3" component="h3" sx={{ color: 'black', width: '100%', margin: '0px', padding: '0px' }}>
                        {'Share Link'} <br />
                    </Typography>
                    <IconX style={{ backgroundColor: '#7983FF', color: 'white' }} onClick={handleshareClose} />
                </div>
                <DialogContent sx={{ backgroundColor: '#f3efef' }}>
                    <DropdownTreeSelectHOC onChange={onChange} data={data} />
                    <Stack mt={28}>
                        <Typography variant="h3" component="h3">
                            Share to Edit
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                id="sharetoedit"
                                value={sharetoEdit}
                                variant="outlined"
                                sx={{ width: '100%', mr: '10px' }}
                                placeholder="URL"
                            />

                            <CopyToClipboard text={sharetoEdit} onCopy={() => {}}>
                                <img
                                    src={usericon}
                                    alt="UserIcon"
                                    width={15}
                                    height={15}
                                    onClick={sharetoeditClick}
                                    sx={{ backgroundColor: 'red' }}
                                />
                            </CopyToClipboard>

                            <Snackbar
                                open={alertOpen}
                                autoHideDuration={1000}
                                message="Link Copied"
                                onClose={handleCloseAlert}
                                sx={{ position: 'absolute', top: '17%', width: '10%' }}
                            />
                        </Box>
                    </Stack>
                    <Stack mt={2}>
                        <Typography variant="h3" component="h3">
                            Share to Play only
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                id="sharetoplay"
                                value={sharetoPlay}
                                variant="outlined"
                                sx={{ width: '100%', mr: '10px' }}
                                placeholder="URL"
                            />

                            <CopyToClipboard text={sharetoPlay}>
                                <img src={usericon} alt="UserIcon" width={15} height={15} onClick={sharetoplayClick} />
                            </CopyToClipboard>

                            <Snackbar
                                open={alertplayOpen}
                                autoHideDuration={1000}
                                message="Link Copied"
                                onClose={handleClosePlayAlert}
                                sx={{ position: 'absolute', top: '48%', right: '70%', width: '10%' }}
                            />
                        </Box>
                    </Stack>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            aria-haspopup="true"
                            sx={{ height: '25px', backgroundColor: '#7983FF', color: 'white', marginTop: '15px', marginRight: '10px' }}
                            onClick={handleshareClose}
                        >
                            Done
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            <Grid container spacing={0} sx={{ ml: 12 }}>
                {createdByMeMockdatas.map((onedata, index) => (
                    //spacing size problem
                    <Grid container spacing={0} xs={4} item key={index}>
                        <Item>
                            <ImageListItem>
                                <img
                                    src={onedata.imageurl}
                                    alt="room1"
                                    loading="lazy"

                                    // onClick={ () => openLinkInNewTab('https://play.grwth.hk/?assignments=room2')}
                                />
                            </ImageListItem>
                            {/* boxShadow:"0px 3.0331px 3.0331px rgba(0, 0, 0, 0.25)", borderRadius:"7.58274px 7.58274px 0px 0px" */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', mt: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                    <img src={UserIconGroup} alt="icon" loading="lazy" width={60} height={40} />
                                    <Typography component="h2" variant="h5" sx={{ mr: 2 }}>
                                        {onedata.sharedNumber}
                                    </Typography>
                                    <Typography component="h2" variant="h2">
                                        {onedata.title}
                                    </Typography>
                                </Box>
                                {/* // boxShadow:" 0px 4px 4px rgba(0, 0, 0, 0.15)",background:"#F2F2F2",borderRadius:"30px" */}
                                {/* <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={handleclickstudentlistopen}>
                                        <PendingOutlinedIcon sx={{ color: '#2CC5CE',  }} />
                                    </Box> */}

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Menu
                                        id="fade-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'fade-button'
                                        }}
                                        anchorEl={anchorEl}
                                        open={openpoper}
                                        onClose={handleClose}
                                        TransitionComponent={Fade}
                                        sx={{ width: '130px' }}
                                    >
                                        {/* <MenuItem onClick={handleClickOpen} sx={{"&:hover": { color: "white",backgroundColor:"#2CC5CE" }}}>Share Link</MenuItem> */}
                                        <MenuItem
                                            sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                                            onClick={handleShareOpen}
                                        >
                                            Share
                                        </MenuItem>
                                        <MenuItem
                                            // onClick={() => {
                                            //  rowdelete(row.title)
                                            // }}
                                            sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                                        >
                                            Delete
                                        </MenuItem>
                                        <MenuItem
                                            sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                                            onClick={() => {
                                                handleDownload(onedata, `${onedata.title}.csv`);
                                            }}
                                        >
                                            Download
                                        </MenuItem>
                                    </Menu>
                                    <Box
                                        onClick={handleClick}
                                        style={{
                                            backgroundColor: '#F2F2F2',
                                            borderRadius: '30px',
                                            width: '25px',
                                            height: '25px',
                                            boxShadow: '1.0331px 3.0331px 15.0331px rgba(0, 0, 0, 0.25)'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                height: '4px',
                                                width: '4px',
                                                backgroundColor: '#2CC5CE',
                                                borderRadius: '50%',
                                                margin: '0px 1px',
                                                display: 'inline-block'
                                            }}
                                        ></Box>
                                        <Box
                                            sx={{
                                                height: '4px',
                                                width: '4px',
                                                backgroundColor: '#2CC5CE',
                                                borderRadius: '50%',
                                                margin: '0px 1px',
                                                display: 'inline-block'
                                            }}
                                        ></Box>
                                        <Box
                                            sx={{
                                                height: '4px',
                                                width: '4px',
                                                backgroundColor: '#2CC5CE',
                                                borderRadius: '50%',
                                                margin: '0px 1px',
                                                display: 'inline-block'
                                            }}
                                        ></Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Item>
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    );
}

const Sharedwithme = () => {
    const [isLoading, setLoading] = useState(true);
    const theme = useTheme();
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1} sx={{ mx: 'auto' }}>
                <Box sx={{ mt: '10px' }}>
                    <Typography component="h2" variant="h3" sx={{ fontFamily: 'Livvic' }}>
                        Shared with me
                    </Typography>
                </Box>

                <div className="scrollbar scrollbar-primary">
                    <div className="force-overflow">
                        <Grid container item spacing={1}>
                            <FormRow />
                        </Grid>
                    </div>
                </div>
            </Grid>
        </Box>
    );
};

export default Sharedwithme;
