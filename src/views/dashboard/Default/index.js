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
import { useMemo } from 'react';
import { assign } from 'lodash';
import MyProject from './MyProject';
import RecentAssignment from './RecentAssignment';

const NotFound = Loadable(lazy(() => import('../../Page404')));

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

const openLinkInNewTab = (url) => {
    const newTab = window.open(url, '_blank');
    if (newTab) newTab.opener = null;
};

function SamplePrevArrow(props) {
    const { className, style, onClick, currentSlide, slideCount } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: currentSlide == 0 ? 'none' : 'flex',
                color: 'black',
                backgroundColor: 'white',
                borderRadius: '30px',
                marginRight: '65px',
                left: '-75px',
                width: '35px',
                height: '35px',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '1.0331px 3.0331px 15.0331px rgba(0, 0, 0, 0.25)'
            }}
            onClick={() => onClick()}
        >
            <i
                className="arrow right"
                style={{
                    position: 'absolute',
                    border: 'solid black',
                    borderWidth: '0 3px 3px 0',
                    display: 'inline-block',
                    padding: '4px',
                    transform: 'rotate(-180deg)',
                    WebkitTransform: 'rotate(-220deg)',
                    margin: '-5px 14px'
                }}
            ></i>
        </div>
    );
}

function SampleNextArrow(props) {
    const [cookies] = useCookies();
    const { className, style, onClick, currentSlide, slideCount } = props;
    console.log(cookies);
    return (
        <div
            className={className}
            style={{
                display: currentSlide !== slideCount - 3 ? 'flex' : 'none',
                // position:'relative',
                color: 'black',
                backgroundColor: 'white',
                borderRadius: '30px',
                marginRight: '25px',
                width: '35px',
                height: '35px',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '1.0331px 3.0331px 15.0331px rgba(0, 0, 0, 0.25)'
            }}
            onClick={() => onClick()}
        >
            <i
                className="arrow right"
                style={{
                    position: 'absolute',
                    border: 'solid black',
                    borderWidth: '0 3px 3px 0',
                    display: 'inline-block',
                    padding: '4px',
                    transform: 'rotate(-45deg)',
                    WebkitTransform: 'rotate(-45deg)'
                }}
            ></i>
        </div>
    );
}

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
};

function FormRow() {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate()
    const [cookies] = useCookies();
    const refreshData = useSelector((state) => state.customization.refetchData);
    const assignmentsData = useSelector((state) => state.customization.assignments);
    const [getRooms, roomsResponse] = useGetRoomsMutation();

    const currentDate = new Date();
    const toIsodate = currentDate.toISOString();
    const getRoomsFunc = () =>{
        getRooms({ userId: cookies[AUTHORISATION_USER_ID_STORAGE_KEY] });
    }
    useEffect(() => {    
        getRoomsFunc();
    }, [refreshData, assignmentsData, cookies]);

    useEffect(() => {

        if (roomsResponse?.data) {
            const projectRooms = _.filter(roomsResponse?.data, (room) => {
                return room.assignmentId === null;
            });
            setRooms(projectRooms);
        }
    }, [roomsResponse]);

    return (
        <React.Fragment>
            <Container>
                <Slider {...settings}>
                    {rooms.map((room, id) => (
                        <MyProject key = {id} room = {room} getRoomsFunc ={getRoomsFunc} />
                    ))}
                </Slider>
            </Container>
        </React.Fragment>
    );
}

const RecentAssignmentsFormRow = () => {
    const [getAssignment, responseStudent] = useGetAssignmentsByMutationMutation();
    const [cookies] = useCookies();
    const { data: userInfo, isLoading, error } = useGetUserInfoQuery();
    const assignmentsData = useSelector((state) => state.customization.assignments);
    const [assignments, setAssignments] = useState([]);
  
    const [getAssignments, response] = useGetAssignmentsByMutationMutation();
    const getAssignmentFunc = () =>{
        if(userInfo?.type == 1){
            getAssignments({ userId: cookies[AUTHORISATION_USER_ID_STORAGE_KEY] });
        }else{
            getAssignment({ userId: cookies[AUTHORISATION_USER_ID_STORAGE_KEY] });
        }
    }
    useEffect(() => {       
        getAssignmentFunc();
    }, [assignmentsData, cookies, userInfo?.type]);

    useEffect(() => {
        if (response?.data && (userInfo?.type == 1)) {
            setAssignments([...response.data]);
        }else if(responseStudent?.data){
            setAssignments([...responseStudent.data]);
        }
    }, [response, responseStudent]);
    return (
        <Container>
            {assignments.length > 2 ? (
                <Slider {...settings}>
                    {assignments?.map((assignment, id) => {
                        return (
                            <RecentAssignment key ={id} assignment={assignment} getAssignmentFunc={getAssignmentFunc} />
                        );
                    })}
                </Slider>
            ) : (
                <Box sx={{ display: 'flex', gap: 10 }}>
                    {assignments?.map((assignment, id) => {
                        return (
                            <RecentAssignment key ={id} assignment={assignment} getAssignmentFunc={getAssignmentFunc} />
                        );
                    })}
                </Box>
            )}
        </Container>
    );
};

const Dashboard = () => {
    // dashboard page
    const [cookies] = useCookies();
    const [isLoading, setLoading] = useState(true);
    const theme = useTheme();
    if (!!!cookies[AUTHORISATION_TOKEN_STORAGE_KEY]) {
        window.location.href = `https://uatgrwth.app360.cn/grwth-as/login?redirect=${window.location.href}`;
    }
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={4} sx={{ mx: 'auto' }}>
                        <Box sx={{ mt: '30px' }}>
                            <Typography component="h2" variant="h3">
                                My projects
                            </Typography>
                        </Box>

                        <Grid container item spacing={1}>
                            <FormRow />
                        </Grid>
                        <Divider sx={{ mt: 3, mb: 1, backgroundColor: '#DBDBDB' }} style={{ height: 3, width: '100%' }} />

                        <Box sx={{ mt: '30px' }}>
                            <Typography component="h2" variant="h3">
                                Recent Assignments
                            </Typography>
                        </Box>
                        <Grid container item spacing={1}>
                            <RecentAssignmentsFormRow />
                        </Grid>
                    </Grid>
                </Box>
        </>
        
    );
};

export default Dashboard;
