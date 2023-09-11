import React from 'react';
import { useEffect, useState } from 'react';
// material-ui
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ImageListItem from '@mui/material/ImageListItem';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// ==============================|| DEFAULT DASHBOARD ||============================== //
import RoomA1 from 'assets/images/roomimg/RoomA1.png';
import 'react-perfect-scrollbar/dist/css/styles.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import fileDownload from 'js-file-download';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Snackbar from '@mui/material/Snackbar';
import { IconX } from '@tabler/icons';
import { IconHeart } from '@tabler/icons';
import data from '../../components/Datagrid/data.json';
import DropdownTreeSelectHOC from '../../components/Datagrid/HOC';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import usericon from 'assets/images/roomimg/Vector.png';
import '../../components/Datagrid/index.css';
import './index.css';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { useDeleteRoomByIdMutation, useGetRoomsMutation, useToggleFavoriteMutation } from 'store/slices/apiSlice';
import { AUTHORISATION_USER_HEAD_IMAGE_KEY, AUTHORISATION_USER_ID_STORAGE_KEY } from 'utils/constants';
import { useDispatch } from 'react-redux';
import { SET_REFETCH_DATA } from 'store/actions';
import { makeId } from 'utils/helpers';
import { useNavigate } from 'react-router';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 330,
    height: 280,
    boxShadow: '3.0331px 3px 3.0331px rgba(0, 0, 0, 0.25)',
    marginTop: 25,
    position: 'relative'
    // transform: "rotate(90deg)",
}));

function FormRow() {
    const dispatch = useDispatch();
    const [cookies] = useCookies();
    const navigate = useNavigate()
    const refreshData = useSelector((state) => state.customization.refetchData);

    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState('');


    const [getProjects, projectResponse] = useGetRoomsMutation();
    const [toggleProjectFavorite, favoriteResponse] = useToggleFavoriteMutation();
    const [deleteProject, deleteResponse] = useDeleteRoomByIdMutation();

    useEffect(() => {
        getProjects({ userId: cookies[AUTHORISATION_USER_ID_STORAGE_KEY] });
    }, [refreshData, favoriteResponse]);

    useEffect(() => {
        if (projectResponse?.data) {
            const projectRooms = _.filter(projectResponse?.data, (room) => {
                return room.assignmentId === null;
            });
            setProjects(projectRooms);
        }
    }, [projectResponse]);

    useEffect(() => {
        if (deleteResponse?.data?.result) {
            dispatch({ type: SET_REFETCH_DATA, payload: makeId(10) });
        }
    }, [deleteResponse]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openpoper = Boolean(anchorEl);
    const [open, setOpen] = useState(false);
    const handleClick = (event, projectId) => {
        setProjectId(projectId);
        setAnchorEl(event.currentTarget);
    };
    const deleteRoom = () => {
        console.log(projectId);
        deleteProject({ roomId: projectId });
        setAnchorEl(null);
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

    const gotoRoom = (path) => {
        navigate(path);
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

                            <CopyToClipboard text={sharetoEdit}>
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

            <Grid container spacing={5} sx={{ ml: 6 }}>
                {projects.map((project, index) => {
                    const favoriteUser = _.filter(project?.sharingUsers, (user) => {
                        return user.userId === cookies.userId;
                    })[0];
                    return (
                        <Grid container spacing={0} xs={4} item key={index}>
                            <Item>
                                <ImageListItem>
                                    <img
                                        src={project?.headImg || RoomA1}
                                        alt="room1"
                                        loading="lazy"
                                        onClick={() =>
                                            gotoRoom(
                                                `/createRoom/${project.roomId}/${cookies[AUTHORISATION_USER_ID_STORAGE_KEY]}/${project.startobj}`
                                            )
                                        }
                                    />
                                </ImageListItem>

                                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                    <IconHeart
                                        style={
                                            favoriteUser.isFavorite === true
                                                ? { fill: '#CE2C2C', width: '40px', height: '40px' }
                                                : { width: '40px', height: '40px' }
                                        }
                                        onClick={() => toggleProjectFavorite({ roomId: project.id, favorite: !favoriteUser.isFavorite })}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', mt: 1.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                        <img
                                            src={cookies[AUTHORISATION_USER_HEAD_IMAGE_KEY]}
                                            alt="icon"
                                            loading="lazy"
                                            width={40}
                                            height={40}
                                        />

                                        <Typography component="h2" variant="h5" sx={{ mr: 2 }}>
                                            {project.sharingUsers.length}
                                        </Typography>
                                        <Typography component="h2" variant="h2">
                                            {project.title}
                                        </Typography>
                                    </Box>
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
                                            {/* <MenuItem
                                                sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                                                onClick={handleShareOpen}
                                            >
                                                Share
                                            </MenuItem> */}
                                            <MenuItem
                                                onClick={deleteRoom}
                                                sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                                            >
                                                Delete
                                            </MenuItem>
                                            {/* <MenuItem
                                                sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                                                onClick={() => {
                                                    handleDownload(onedata, `${onedata.title}.csv`);
                                                }}
                                            >
                                                Download
                                            </MenuItem> */}
                                        </Menu>

                                        <Box
                                            onClick={(e) => handleClick(e, project._id)}
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
                    );
                })}
            </Grid>
        </React.Fragment>
    );
}

const Myprojects = () => {
    const [isLoading, setLoading] = useState(true);
    const theme = useTheme();
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1} sx={{ mx: 'auto' }}>
                <Box sx={{ mt: '10px' }}>
                    <Typography component="h2" variant="h2" sx={{ fontFamily: 'Livvic' }}>
                        My projects
                    </Typography>
                </Box>

                <Grid container item spacing={0} sx={{ mt: 4 }}>
                    <FormRow />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Myprojects;
