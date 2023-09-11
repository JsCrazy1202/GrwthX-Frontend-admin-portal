import React, { useEffect, useState, lazy } from 'react';
// material-ui
import { Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project imports

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ImageListItem from '@mui/material/ImageListItem';
import { Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';
// ==============================|| DEFAULT DASHBOARD ||============================== //
import RoomA1webp from 'assets/images/roomimg/RoomA_V1.webp';
import RoomA1 from '../../../assets/images/roomimg/RoomA1.png';
import Slider from 'react-slick';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import UserIconGroup from 'assets/images/icons/UserIconGroup.png';
import AssignmentTitle from 'assets/images/roomimg/Assignment Title.png';
import Tilt from 'react-parallax-tilt';
import { Menu, MenuItem } from '@mui/material';
import Fade from '@mui/material/Fade';
import { useGetAssignmentsByMutationMutation, useGetAssignmentsQuery, useGetRoomsMutation, useGetUserInfoQuery, useDeleteAssignmentMutation,useDeleteRoomByIdMutation } from 'store/slices/apiSlice';
import { AUTHORISATION_TOKEN_STORAGE_KEY, AUTHORISATION_USER_ID_STORAGE_KEY } from 'utils/constants';
import { useSelector } from 'react-redux';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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

const RecentAssignment = ({assignment, getAssignmentFunc}) => {
    const [cookies] = useCookies();
    const [assignmentUrl, setAssignmentUrl] = useState('');
    const { data: userInfo, isLoading, error } = useGetUserInfoQuery();
    const [deleteAssignmentById, responseDelAsg] = useDeleteAssignmentMutation();
    const handleclickstudentlistopen = () => {
        Setopenstudentlist(true);
    };
    const currentDate = new Date();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openpoper = Boolean(anchorEl);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDeleteOpen = async (assignmentId) => {
        deleteAssignmentById({ assignmentId: assignmentId });
        getAssignmentFunc();
    };
    useEffect(()=>{
        if(assignment?.groups?.length >0){ // in group case
            assignment?.groups?.map((group)=>{
                console.log(assignment, '=========');
                if(group?.assignmentId === assignment._id){
                    group?.members?.map((member)=>{
                        if (member?.userId === userInfo?.userId) {
                            assignment.rooms.map((room) => {
                                if ((member?.assignmentId === room.assignmentId) && (member?.roomId === room.id)) {
                                    setAssignmentUrl(`/roomId/${room.roomId}/${assignment._id}`)
                                }
                            })
                        }
                    })
                }
            })
            
        }else{
            assignment?.students?.map((student)=>{
                if((student?.assignmentId === assignment._id) && (student?.userId === userInfo?.userId)){
                    assignment.rooms.map((room) => {
                        if ((student?.assignmentId === room.assignmentId) && (student?.roomId === room.id)) {
                            setAssignmentUrl(`/roomId/${room.roomId}/${assignment._id}/${userInfo?.userId}`)
                        }
                    })
                }
            })
        }
    },[userInfo])
  return (
    <Item>
        <ImageListItem sx={{ width: 300 }} onClick={() => (userInfo?.type == '1') ? navigate(`/studentlists/${assignment._id}`) :navigate(assignmentUrl)}>
            <img
                src={AssignmentTitle}
                alt="room1"
                loading="lazy"
                style={{ height: '200px' }}

                // onClick={ () => openLinkInNewTab('https://play.grwth.hk/?assignments=room2')}
            />
            <Typography
                component="h2"
                variant="h2"
                sx={{ position: 'absolute', top: '30%', margin: '0 25px', textAlign: 'center' }}
            >
                {assignment.title}
            </Typography>
        </ImageListItem>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 32px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <img src={UserIconGroup} alt="icon" loading="lazy" width={60} height={40} /> */}

                <Typography component="h2" variant="h5" sx={{ mr: 2 }}>
                    {assignment?.students.length == 2
                        ? 1
                        : assignment?.students.length < 2
                        ? 0
                        : assignment?.students.length / 2}
                </Typography>
            </Box>
            {(userInfo?.type == 1) && (
                <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={handleclickstudentlistopen}>
                    <Box
                        onClick={handleClick}
                        sx={{
                            backgroundColor: '#F2F2F2',
                            borderRadius: '30px',
                            width: '25px',
                            height: '25px',
                            boxShadow: '1.0331px 3.0331px 15.0331px rgba(0, 0, 0, 0.25)',
                            margin: '0px 75px'
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
                        anchorEl={anchorEl}
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
                                handleDeleteOpen(assignment?.id);
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
            )}
        </Box>
    </Item>
  )
}

export default RecentAssignment
