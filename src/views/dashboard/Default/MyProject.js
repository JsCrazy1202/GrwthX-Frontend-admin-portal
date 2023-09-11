import React, { useState } from 'react';
import Box from '@mui/material/Box';
import ImageListItem from '@mui/material/ImageListItem';
import { Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RoomA1 from '../../../assets/images/roomimg/RoomA1.png';
import { Menu, MenuItem } from '@mui/material';
import Fade from '@mui/material/Fade';
import { useGetAssignmentsByMutationMutation, useGetAssignmentsQuery, useGetRoomsMutation, useGetUserInfoQuery, useDeleteAssignmentMutation,useDeleteRoomByIdMutation } from 'store/slices/apiSlice';
import {AUTHORISATION_USER_ID_STORAGE_KEY } from 'utils/constants';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useCookies } from 'react-cookie';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 300,
    height: 250
    // boxShadow: "0 4px 0px -10px;  #ccc",
    // boxShadow: "3.0331px 3.0331px 3.0331px rgba(0, 0, 0, 0.25)",
}));
const MyProject = ({room, getRoomsFunc}) => {
    const navigate = useNavigate();
    const [cookies] = useCookies();
    const [formrowanchorEl, setFormrowanchorEl] = React.useState(null);
    const [openstudentlist, Setopenstudentlist] = useState(false);
    const [deleteProject, deleteResponse] = useDeleteRoomByIdMutation();
    const handleclickstudentlistopen = () => {
        Setopenstudentlist(true);
    };
    const handleclickstudentlistclose = () => {
        Setopenstudentlist(false);
    };
    const handleformrowClick = (event) => {
        setFormrowanchorEl(event.currentTarget);
    };
    const openpoper = Boolean(formrowanchorEl);
    const handleClose = () => {
        setFormrowanchorEl(null);
    };
    const [shareOpen, setShareOpen] = useState(false);
    const handleShareOpen = () => {
        setShareOpen(true);
        setFormrowanchorEl(null);
    };

    const handleDeleteOpen = async (projectId) => {
        console.log(projectId,'=== delete ====')
        await deleteProject({ roomId: projectId });
        getRoomsFunc();
    };
    const goToRoom = (path) => {
        navigate(path)
    };

  return (
      <Item>
        <ImageListItem
            sx={{ width: 300 }}
            onClick={() =>
                (!!room.startobj && (room.startobj !== 'undefined')) ? goToRoom(`/createRoom/${room.roomId}/${cookies[AUTHORISATION_USER_ID_STORAGE_KEY]}/${room.startobj}`):
                goToRoom(`/createRoom/${room.roomId}/${cookies[AUTHORISATION_USER_ID_STORAGE_KEY]}`)
            }
        >
            <img
                src={room?.headImg || RoomA1}
                alt="room1"
                loading="lazy"
                style={{ height: '170px', boxShadow: '3.0331px 3.0331px 3.0331px rgba(0, 0, 0, 0.25)' }}

                // onClick={ () => openLinkInNewTab('https://play.grwth.hk/?assignments=room2')}
            />
        </ImageListItem>

        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '10px',
                width: '300px',
                boxShadow: '3.0331px 8px 8px rgba(0, 0, 0, 0.25)'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                {/* <img src={UserIconGroup} alt="icon" loading="lazy" width={60} height={40} /> */}
                <Typography component="h2" variant="h5" sx={{ mr: 2 }}>
                    {room.sharingUsers.length}
                </Typography>
                <Typography component="h3" variant="h4">
                    {room.title}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={handleclickstudentlistopen}>
                {/* <PendingOutlinedIcon sx={{ color: '#2CC5CE', }} /> */}
                <Box
                    onClick={handleformrowClick}
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

                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button'
                    }}
                    anchorEl={formrowanchorEl}
                    open={openpoper}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                    sx={{ width: '130px' }}
                >
                    {/* <MenuItem
                        onClick={handleShareOpen}
                        sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                    >
                        Share Link
                    </MenuItem> */}
                    <MenuItem
                        onClick={() => {
                            handleDeleteOpen(room?.id);
                            handleClose();
                        }}
                        sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                    >
                        Delete
                    </MenuItem>
                    {/* <MenuItem sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}>
                        Download
                    </MenuItem> */}
                </Menu>
            </Box>
        </Box>
    </Item>
  )
}

export default MyProject
