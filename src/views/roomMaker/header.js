import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// project imports
import LogoSection from './LogoSection';
import MenuPopover from '../../components/MenuPopover';
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
// assets
import { IconMenu2, IconBell } from '@tabler/icons';
import Stack from '@mui/material/Stack';
import usericon from 'assets/images/icons/UserIcon.webp';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    AUTHORISATION_TOKEN_STORAGE_KEY,
    AUTHORISATION_USER_HEAD_IMAGE_KEY,
    AUTHORISATION_USER_ID_STORAGE_KEY,
    AUTHORISATION_USER_NAME_STORAGE_KEY,
    AUTHORISATION_USER_NAME_ZH_STORAGE_KEY,
    ROOM_PLAY_MESSAGE,
    ROOM_PREVIEW_MESSAGE,
    ROOM_SAVE_MESSAGE
} from 'utils/constants';
import { useCookies } from 'react-cookie';
import { useGetUserInfoQuery, useSetMarkMutation, useUpdateStatusMutation, useUpdateTitleMutation } from 'store/slices/apiSlice';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useMemo } from 'react';
import CommentModal from 'components/CommentModal';
import { useLogoutMutation } from 'store/slices/apiSlice';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ data, userId, roomId, assignmentId, postMessage }) => {
    const [cookies, removeCookie, get] = useCookies();
    const theme = useTheme();
    const navigate = useNavigate();

    const [openCommentModal, setOpenCommentModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [isGroup, setIsGroup] = useState(false);

    const { data: userInfo } = useGetUserInfoQuery();
    const [updateStatus, response] = useUpdateStatusMutation();
    const [updateTitle, responseUpdateTitle] = useUpdateTitleMutation();
    const [logout] = useLogoutMutation();
    const [openTitleChange, setOpenTitleChange] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        setTitle(data.title)
        data?.groups?.map((group) => {
            if (group.assignmentId == assignmentId) {
                group.room?.map((room) =>{
                    if (room.roomId == roomId) {
                        setIsGroup(true);
                        setGroupName(group.groupName);
                    }
                })
            }
        })
    },[data?.title])

    const [open, setOpen] = useState(null);
    const [openMainPop, setOpenMainPop] = useState();
    const [openUsersPop, setOpenUsersPop] = useState();
    const [openGradePop, setOpenGradePop] = useState();
    const [mark, setMark] = useState('');

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleMainPop = (event) => {
        setOpenMainPop(event.currentTarget);
    };

    const handleUsersPop = (event) => {
        setOpenUsersPop(event.currentTarget);
    };

    const handleGradePop = (event) => {
        setOpenMainPop(null);
        setOpenGradePop(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleLogout = async () => {
        let url = '';

        if (process.env.NODE_ENV === 'development') {
            url = 'https://uatgrwth.app360.cn/grwth-as/logout?redirect=http://localhost:8081';
        } else {
            url = 'https://uatgrwth.app360.cn/grwth-as/logout?redirect=https://grwthx.grwth.hk';
        }
        logout({});
        removeCookie();

        setTimeout(() => (window.location.href = url), 1000);
    };

    const getCurrentStudent = (data) => {
        if (data) {
            const student = data?.students?.filter((student) => {
                return student.userId === userId;
            });

            if (student) {
                if (data?.groups?.length > 0) {
                    setMark(data?.groups[0]?.mark);
                } else {
                    setMark(student[0]?.mark);
                }
                return student[0];
            } else {
                return {};
            }
        }
        return {};
    };

    const getCurrentTeacher = (data) => {
        if (data) {
            const teacher = data?.students?.filter((student) => {
                return student.role === 'Teacher';
            });
            if (teacher) {
                return teacher[0];
            } else {
                return {};
            }
        }
        return {};
    };

    const onSubmit = () => {
        updateStatus({ roomId, assignmentId });
    };

    const currentStudent = useMemo(() => getCurrentStudent(data), [data]);

    const currentTeacher = useMemo(() => getCurrentTeacher(data), [data]);

    const [setMarkMutation, markResponse] = useSetMarkMutation();

    const handleMarkchange = (e, studentId, roomId, isGroup) => {
        e.stopPropagation();
        setMarkMutation({ studentId, roomId, mark: e.target.value });

        setMark(e.target.value);
    };

    const changeRoom = (userId, roomId, assignmentId) => {
        setOpenUsersPop(null);
        if (isGroup) {
            navigate(`/roomId/${roomId}/${assignmentId}`, { replace: true });
        }else{
            navigate(`/roomId/${roomId}/${assignmentId}/${userId}`, { replace: true });
        }
    };
    const handleGoPlayPreview = async (roomMessage) => {
        postMessage(roomMessage);
        let params = {};
        if (!!userId && (userId !== 'undefined')) {
            params = { 
                roomId,
                userId,
                assignmentId,
                mode:roomMessage
            };
        }else{
            params = { 
                roomId,
                assignmentId,
                mode:roomMessage
            };
        }
        if(roomMessage ===  ROOM_PREVIEW_MESSAGE){
            setTimeout(() => navigate('/preview', { state: params }), 6000);
        }else if(roomMessage ===  ROOM_PLAY_MESSAGE){
            setTimeout(() => navigate('/play', { state: params }), 6000);
        }
    }
    const handleSaveTitle = () =>{
        updateTitle({
            roomId,
            userId,
            title
        })
        setOpenTitleChange(false);
    }
    return (
        <>
            {
                <Box
                    sx={{
                        width: '100%',
                        height: '68px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        backgroundColor: '#7983FF',
                        alignItems: 'center',
                        textAlign: 'center',
                        [theme.breakpoints.down('md')]: {
                            width: 'auto'
                        }
                    }}
                >
                    <CommentModal
                        open={openCommentModal}
                        handleClose={() => setOpenCommentModal(false)}
                        roomId={data?.rooms?.length > 0 && data?.rooms[0]?._id}
                        senderId={userInfo?.type === 1 ? currentTeacher?._id : currentStudent?._id}
                    />
                    <Box component="span">
                        <LogoSection />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'end' }}>
                    <Box sx={{ background: '#5243B0', borderRadius: '10px' }}>
                            {openTitleChange ? 
                            <TextField sx={{ color: '#FFFFFF', fontSize: '28px', fontFamily: 'Livvic-SemiBold' }}
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)} />
                                :
                            <Typography sx={{ color: '#FFFFFF', fontSize: '28px', fontFamily: 'Livvic-SemiBold', margin: '2.5px 10px' }} onClick={() => '{setOpenTitleChange(true)}'}>
                                {title}
                            </Typography>
                            }
                        </Box>
                        {openTitleChange && 
                            <Button
                                variant="contained"
                                onClick = {handleSaveTitle}
                                sx={{
                                    margin: 'auto 20px',
                                    color: 'white',
                                    backgroundColor: '#7983FF',
                                    borderRadius: '10px',
                                }}
                            >
                                Save
                            </Button>
                        }
                       { !openTitleChange && 
                        <Box onClick={handleMainPop}>
                            <KeyboardArrowDownIcon style={{ color: '#FFFFFF' }} />
                        </Box>}
                        <MenuPopover
                            open={Boolean(openMainPop)}
                            anchorEl={openMainPop}
                            onClose={() => setOpenMainPop(null)}
                            sx={{
                                p: 0,
                                mt: 1.5,
                                ml: 0.75,
                                '& .MuiMenuItem-root': {
                                    typography: 'body2',
                                    borderRadius: 0.75
                                }
                            }}
                        >
                            <MenuItem sx={{ m: 1 }}>Assignment Info</MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setOpenCommentModal(true);
                                    setOpenMainPop(null);
                                }}
                                sx={{ m: 1 }}
                            >
                                Comments
                            </MenuItem>
                            {data?.groups?.length > 0
                                ? userInfo?.type === 1 &&
                                (data?.groups[0]?.status === 'Submitted' || data?.groups[0]?.status === 'Done late') && (
                                    <MenuItem onClick={handleGradePop} sx={{ m: 1 }}>
                                        Grade/Marks
                                    </MenuItem>
                                )
                                : userInfo?.type === 1 &&
                                (currentStudent?.status === 'Submitted' || currentStudent?.status === 'Done late') && (
                                    <MenuItem onClick={handleGradePop} sx={{ m: 1 }}>
                                        Grade/Marks
                                    </MenuItem>
                                )}
                        </MenuPopover>
                        {data?.groups?.length > 0
                            ? (data?.groups[0]?.status === 'Submitted' || data?.groups[0]?.status === 'Done late') && (
                                <MenuPopover
                                    anchorReference="anchorPosition"
                                    anchorPosition={{ top: 55, left: 700 }}
                                    open={Boolean(openGradePop)}
                                    anchorEl={openGradePop}
                                    onClose={() => setOpenGradePop(null)}
                                    sx={{
                                        p: 0,
                                        mt: 1.5,
                                        ml: 0.75,
                                        '& .MuiMenuItem-root': {
                                            typography: 'body2',
                                            borderRadius: 0.75
                                        }
                                    }}
                                >
                                    <MenuItem sx={{ m: 1, display: 'flex', justifyContent: 'space-between' }}>
                                        <TextField
                                            label={data?.grade}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            value={mark}
                                            onChange={(e) =>
                                                handleMarkchange(
                                                    e,
                                                    data?.groups[0]?._id,
                                                    data?.rooms[0]?._id,
                                                    currentStudent?.groupName ? true : false
                                                )
                                            }
                                        />
                                    </MenuItem>
                                </MenuPopover>
                            )
                            : (currentStudent?.status === 'Submitted' || currentStudent?.status === 'Done late') && (
                                <MenuPopover
                                    anchorReference="anchorPosition"
                                    anchorPosition={{ top: 55, left: 700 }}
                                    open={Boolean(openGradePop)}
                                    anchorEl={openGradePop}
                                    onClose={() => setOpenGradePop(null)}
                                    sx={{
                                        p: 0,
                                        mt: 1.5,
                                        ml: 0.75,
                                        '& .MuiMenuItem-root': {
                                            typography: 'body2',
                                            borderRadius: 0.75
                                        }
                                    }}
                                >
                                    <MenuItem sx={{ m: 1, display: 'flex', justifyContent: 'space-between' }}>
                                        <TextField
                                            label={data?.grade}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            value={mark}
                                            onChange={(e) =>
                                                handleMarkchange(
                                                    e,
                                                    currentStudent?._id,
                                                    data?.rooms[0]?._id,
                                                    currentStudent?.groupName ? true : false
                                                )
                                            }
                                        />
                                    </MenuItem>
                                </MenuPopover>
                            )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            pr: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '20px'
                        }}
                    >
                        {
                            isGroup && userInfo?.type === 1 ?(
                                <Box sx={{ mr: 6, display: 'flex', alignItems: 'end' }}>
                                    <Typography
                                        variant="h6"
                                        component="h6"
                                        sx={{
                                            pl: 2,
                                            fontWeight: '500',
                                            font: 'Lalezar',
                                            fontStyle: 'normal',
                                            color: '#FFFFFF',
                                            fontSize: '15px',
                                            fontFamily: 'Livvic',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {groupName}
                                    </Typography>
                                    <Box onClick={handleUsersPop}>
                                        <KeyboardArrowDownIcon style={{ color: '#FFFFFF' }} />
                                    </Box>
                                    <MenuPopover
                                        open={Boolean(openUsersPop)}
                                        anchorEl={openUsersPop}
                                        onClose={() => setOpenUsersPop(null)}
                                        sx={{
                                            p: 0,
                                            mt: 1.5,
                                            ml: 0.75,
                                            '& .MuiMenuItem-root': {
                                                typography: 'body2',
                                                borderRadius: 0.75
                                            }
                                        }}
                                    >
                                        {data?.groups?.map((group, key) => {
                                            return (
                                                <MenuItem
                                                    key = {key}
                                                    sx={{ m: 1, display: 'flex', justifyContent: 'space-between' }}
                                                    onClick={() => changeRoom(userId, group.room[0].roomId, assignmentId)}
                                                >
                                                    <Typography>{group.groupName}</Typography>
                                                </MenuItem>
                                            );
                                        })}
                                    </MenuPopover>
                                </Box>
                            
                            ):(
                                <Typography
                                    variant="h6"
                                    component="h6"
                                    sx={{
                                        pl: 2,
                                        fontWeight: '500',
                                        font: 'Lalezar',
                                        fontStyle: 'normal',
                                        color: '#FFFFFF',
                                        fontSize: '15px',
                                        fontFamily: 'Livvic',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {groupName}
                                </Typography>
                            )
                        }
                        {userInfo?.type === 1 && !isGroup && (
                            <Box sx={{ mr: 6, display: 'flex', alignItems: 'end' }}>
                                <Typography
                                    variant="h6"
                                    component="h6"
                                    sx={{
                                        pl: 2,
                                        fontWeight: '500',
                                        font: 'Lalezar',
                                        fontStyle: 'normal',
                                        color: '#FFFFFF',
                                        fontSize: '15px',
                                        fontFamily: 'Livvic',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {currentStudent?.nameZh || cookies[AUTHORISATION_USER_NAME_ZH_STORAGE_KEY]}
                                </Typography>
                                <Box onClick={handleUsersPop}>
                                    <KeyboardArrowDownIcon style={{ color: '#FFFFFF' }} />
                                </Box>
                                <MenuPopover
                                    open={Boolean(openUsersPop)}
                                    anchorEl={openUsersPop}
                                    onClose={() => setOpenUsersPop(null)}
                                    sx={{
                                        p: 0,
                                        mt: 1.5,
                                        ml: 0.75,
                                        '& .MuiMenuItem-root': {
                                            typography: 'body2',
                                            borderRadius: 0.75
                                        }
                                    }}
                                >
                                    {data?.students?.map((student, key) => {
                                        if (student.role === 'Student' && student._id !== currentStudent?._id)
                                            return (
                                                <MenuItem
                                                    key = {key}
                                                    sx={{ m: 1, display: 'flex', justifyContent: 'space-between' }}
                                                    onClick={() => changeRoom(student.userId, student.room[0].roomId, student.assignmentId)}
                                                >
                                                    <Typography>{student.nameZh}</Typography>
                                                    <Typography>{student.mark ? student.mark : student.status}</Typography>
                                                </MenuItem>
                                            );
                                    })}
                                </MenuPopover>
                            </Box>
                        )}
                        {userInfo?.type !== 1 && (
                            <Box>
                                <Button
                                    startIcon={<NoteAddIcon />}
                                    sx={{ background: '#C0BAE9', color: 'black', fontFamily: 'Livvic-SemiBold' }}
                                    onClick={onSubmit}
                                >
                                    Submit
                                </Button>
                            </Box>
                        )}
                        <Box onClick={() => postMessage(ROOM_SAVE_MESSAGE)}>
                            <SaveIcon sx={{ color: '#ffffff', width: '35px', height: '35px' }} />
                        </Box>
                        <Box
                            onClick={() => handleGoPlayPreview(ROOM_PREVIEW_MESSAGE)}
                        >
                            <VisibilityIcon sx={{ color: '#ffffff', width: '35px', height: '35px' }} />
                        </Box>
                        <Box
                            onClick={() => handleGoPlayPreview(ROOM_PLAY_MESSAGE)}
                        >
                            <PlayArrowIcon sx={{ color: '#ffffff', width: '35px', height: '35px' }} />
                        </Box>
                        <Stack direction="row" spacing={2}>
                            {/* <IconBell style={{ color: '#FFFFFF', width: '35px', height: '35px' }} /> */}
                            <img
                                src={cookies[AUTHORISATION_USER_HEAD_IMAGE_KEY] || usericon}
                                alt="UserIcon"
                                width={32}
                                height={32}
                                style={{ borderRadius: '50%' }}
                                onClick={handleOpen}
                            />
                        </Stack>
                        <MenuPopover
                            open={Boolean(open)}
                            anchorEl={open}
                            onClose={handleClose}
                            sx={{
                                p: 0,
                                mt: 1.5,
                                ml: 0.75,
                                '& .MuiMenuItem-root': {
                                    typography: 'body2',
                                    borderRadius: 0.75
                                }
                            }}
                        >
                            <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
                                Logout
                            </MenuItem>
                        </MenuPopover>
                    </Box>
                </Box>
            }
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
