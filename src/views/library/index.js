import React from 'react';
import { useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import { Container, Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import SearchComponent from 'react-material-ui-searchbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import { userRows } from '../../components/Datagrid/dummyData';
import ImageListItem from '@mui/material/ImageListItem';
import room1 from '../../assets/images/roomimg/room1.png';
import { IconUserCircle } from '@tabler/icons';
// import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import PendingOutlinedIcon from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import { Link, useNavigate } from 'react-router-dom';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import RoomA1 from 'assets/images/roomimg/RoomA_V1.webp';
import RoomA_Items1 from 'assets/images/roomimg/RoomA_Items1.webp';
import RoomA_Items2 from 'assets/images/roomimg/RoomA_Items2.webp';
import RoomA_Items3 from 'assets/images/roomimg/RoomA_Items3.webp';
import RoomA_Items4 from 'assets/images/roomimg/RoomA_Items4.webp';
import PerfectScrollbar from 'react-perfect-scrollbar';
// import Paper from '@mui/material/Paper';
import UserIconGroup from 'assets/images/icons/UserIconGroup.png';
import { IconHeart, IconArchive } from '@tabler/icons';
import axios from 'axios';
import './index.css';
import { useCreateRoomMutation, useGetLibrayQuery } from 'store/slices/apiSlice';
import { useDispatch } from 'react-redux';
import { SET_REFETCH_DATA } from 'store/actions';
import { makeId } from 'utils/helpers';
import { useCookies } from 'react-cookie';
import { AUTHORISATION_USER_ID_STORAGE_KEY } from 'utils/constants';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 280,
    height: 300,
    // boxShadow: "3.0331px 0px 3.0331px rgba(0, 0, 0, 0.25)",
    boxShadow: '0 8px 8px 3px rgb(0 0 0 / 25%)',
    marginTop: 30,
    '&:hover': {
        border: 0,
        boxShadow: '5px 5px 8px 0px #afb5ff'
    },
    cursor: 'pointer'
    // transform: "rotate(90deg)",
}));

// Library page
const Library = () => {
    const [value, setValue] = useState('1');
    const { data: library, isLoading, isError } = useGetLibrayQuery();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const theme = useTheme();
    const StyledTab = styled(Tab)({
        '&.MuiTab-root': {
            color: '#CCCCCC',
            border: 0,
            marginLeft: '3px',
            width: '200px',
            borderBottom: '5px solid',
            '&:hover': {
                border: 0,
                borderBottom: '5px solid'
            }
        },
        '&.Mui-selected': {
            color: theme.palette.background.primaryColor
        }
    });

  

    const FormRow = () => {
        const dispatch = useDispatch();
        const [cookies] = useCookies()
        const navigate = useNavigate()
        const [createRoomByApi, response] = useCreateRoomMutation();
        useEffect(() => {
            if (response?.data) {
                dispatch({ type: SET_REFETCH_DATA, payload: makeId(10) });
                navigate(`/createRoom/${response?.data?.roomId}/${cookies[AUTHORISATION_USER_ID_STORAGE_KEY]}/${response?.data?.startobj}`);
                
            }
        }, [response]);

        const createRoom = (objectId) => {
            createRoomByApi({ object: true, objectId: objectId, headImg: `https://play.grwth.hk/library/room/${objectId}.png` });
        };

        return (
            <React.Fragment>
                <Grid container spacing={4}>
                    {library?.room?.map((room, index) => (
                        //spacing size problem
                        <Grid container spacing={-2} xs={3} item key={index}>
                            <Item sx={{ ml: 1 }}>
                                <ImageListItem sx={{ mt: 7 }}>
                                    <img
                                        src={`https://play.grwth.hk/library/room/${room.name}.png`}
                                        alt={room.name}
                                        loading="lazy"
                                        style={{ width: '270px', height: '200px' }}
                                        onClick={() => createRoom(room.name)}
                                    />
                                </ImageListItem>
                                {/* boxShadow:"0px 3.0331px 3.0331px rgba(0, 0, 0, 0.25)", borderRadius:"7.58274px 7.58274px 0px 0px" */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0px 13px' }}>
                                    <Typography component="h2" variant="h2"></Typography>
                                    {/* <IconHeart
                                        style={room.favourite == true ? { fill: '#CE2C2C' } : {}}
                                        onClick={() => iconheartclickdatabase(room.title, room.favourite)}
                                    /> */}
                                </Box>
                            </Item>
                            <Typography component="h2" variant="h2" sx={{ mt: 2, ml: 1, fontFamily: 'Livvic' }}>
                                {room.title}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </React.Fragment>
        );
    };

    function ObjectRoom() {
        const { data: library, isLoading, isError } = useGetLibrayQuery();
        const [cookies] = useCookies()
        const navigate = useNavigate()
        const dispatch = useDispatch();
        const [createRoomByApi, response] = useCreateRoomMutation();
        useEffect(() => {
            if (response?.data) {
                console.log(response.data, '=========  creating server room object =============')
                dispatch({ type: SET_REFETCH_DATA, payload: makeId(10) });
                navigate(`/createRoom/${response?.data?.roomId}/${cookies[AUTHORISATION_USER_ID_STORAGE_KEY]}/${response?.data?.startobj}`);
            }
        }, [response]);

        const createRoom = (objectId) => {
            console.log(objectId, '========== objectId ===========')
            createRoomByApi({ object: true, objectId: objectId, headImg: `https://play.grwth.hk/library/object/${objectId}.png` });
        };
        return (
            <React.Fragment>
                <Grid container spacing={4}>
                    {library?.object?.map((object, index) => (
                        //spacing size problem
                        <Grid container spacing={-2} xs={3} item key={index}>
                            <Item sx={{ ml: 2 }}>
                                <ImageListItem sx={{ mt: 7 }}>
                                    <img
                                        src={`https://play.grwth.hk/library/object/${object.name}.png`}
                                        alt={object.name}
                                        loading="lazy"
                                        style={{ width: '270px', height: '200px' }}
                                        onClick={ () => createRoom(object.name)}
                                    />
                                </ImageListItem>
                                {/* boxShadow:"0px 3.0331px 3.0331px rgba(0, 0, 0, 0.25)", borderRadius:"7.58274px 7.58274px 0px 0px" */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0px 13px' }}>
                                    <Typography component="h2" variant="h2"></Typography>
                                    {/* <IconHeart
                                        style={object.favourite == true ? { fill: '#CE2C2C' } : {}}
                                        onClick={() => iconObjectClick(object._id, object.favourite)}
                                    /> */}
                                </Box>
                            </Item>
                            <Typography component="h2" variant="h2" sx={{ mt: 2, fontFamily: 'Livvic', ml: 1 }}>
                                {object.title}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </React.Fragment>
        );
    }

    return (
        <Box>
            <Box sx={{ mt: '0px' }}>
                <Typography component="h2" variant="h3" sx={{ fontFamily: 'Livvic' }}>
                    Library
                </Typography>
            </Box>
            <TabContext value={value}>
                {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
                <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    TabIndicatorProps={{
                        style: { background: '#CCCCCC' }
                    }}
                >
                    <StyledTab label="Room" value="1" sx={{ fontFamily: 'Livicc' }} />
                    <StyledTab label="Object" value="2" sx={{ fontFamily: 'Livicc' }} />
                </TabList>

                <TabPanel value="1">
                    <div className="scrollbar scrollbar-primary">
                        <div className="force-overflow">
                            <Grid container item spacing={0.1}>
                                <FormRow />
                            </Grid>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    <div className="scrollbar scrollbar-primary">
                        <div className="force-overflow">
                            <Grid container item spacing={0.1}>
                                <ObjectRoom />
                            </Grid>
                        </div>
                    </div>
                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default Library;
