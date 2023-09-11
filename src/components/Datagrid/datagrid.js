import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { IconTrash, IconX } from '@tabler/icons';
import { Typography } from '@mui/material';
import './index.css';
import DropdownTreeSelectHOC from './HOC';
import data from './data.json';
import usericon from 'assets/images/roomimg/Vector.png';
import Snackbar from '@mui/material/Snackbar';
import { useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import fileDownload from 'js-file-download';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { SET_ASSIGNMENT, SET_ASSIGNMENTS } from 'store/actions';
import { useCreateCommentMutation, useDeleteAssignmentMutation, useGetCommentsMutation, useGetUserInfoQuery } from 'store/slices/apiSlice';
import { useCookies } from 'react-cookie';
import {
    AUTHORISATION_USER_ID_STORAGE_KEY,
    AUTHORISATION_USER_NAME_STORAGE_KEY,
    AUTHORISATION_USER_NAME_ZH_STORAGE_KEY
} from 'utils/constants';
import { useRef } from 'react';
import useChatScroll from 'hooks/useChatScroll';
import { useSelector } from 'react-redux';
import CommentModal from 'components/CommentModal';
import { useMemo } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#FFFFFF',
        fontFamily: 'Livvic',
        fontSize: 16,
        fontWeight: 300
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 22,
        fontFamily: 'Livvic',
        fontWeight: 300
    },
    fontWeight: 300,
    marginTop: 30,
    padding: '9px'
}));

const StyledTableCellstudent = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#FFFFFF',
        color: theme.palette.common.white,
        fontFamily: 'Livvic',
        fontSize: 16
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 18,
        fontFamily: 'Livvic'
    },
    marginTop: 30,
    padding: '13px'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    cursor: 'pointer',

    '&:last-child td, &:last-child th': {
        border: 0
    },
    borderSpacing: '0 5px !important',
    borderCollapse: 'separate !important',
    boxShadow: '0 4px 20px -10px;  #ccc'
}));

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

export default function CustomizedTables({ subject, classtype, searchvalue, checkusertype, assignmentslists }) {
    // Customized table component
    const pickAssignmentDate = useSelector((state) => state.customization.pickAssignmentDate);
    const [cookies] = useCookies();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [checkrowcolornumber, setCheckrowcolornumber] = useState(null);
    const [assignmentslist, setAssignmentslist] = useState([]);
    const [shareValue, setShareValue] = useState(null);
    const [shareOpen, setShareOpen] = useState(false);
    const [assignmentId, setAssignmentId] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertplayOpen, setAlertPlayOpen] = useState(false);
    const [sharetoEdit, setShareToEdit] = useState('https://grwthx.com/file/d/1awregsdf5/view?usp=sharing');
    const [sharetoPlay, setShareToPlay] = useState('https://grwthx.com/file/d/2awregege3/view?usp=sharing');
    const [roomId, setRoomId] = useState('');
    const [senderId, setSenderId] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const datevalue = new Date();
    const openpoper = Boolean(anchorEl);
    const currentdatevalue = new Date(datevalue.toISOString().slice(0, 16)).getTime(); // get localtime value
    const [deleteAssignmentById, response] = useDeleteAssignmentMutation();
    const [getComments, commentsResponse] = useGetCommentsMutation();
    const [createComment, createCommentResponse] = useCreateCommentMutation();
    const { data: userInfo } = useGetUserInfoQuery();

    useEffect(() => {
        if (createCommentResponse?.data) {
            getComments({ roomId });
        }
    }, [createCommentResponse]);

    useEffect(() => {
        if (assignmentslists) {
            const get_assignments = async () => {
                var subJectFilter = assignmentslists.filter((assignment) =>
                    subject !== 'None' ? assignment.subject[0].shortName === subject : assignment.subject[0].shortName !== subject
                );
                var classFilter = subJectFilter.filter((assignment) =>
                    classtype !== 'None' ? assignment.class[0].shortName === classtype : assignment.class[0].shortName !== classtype
                );

                var dateFilter = classFilter.filter((assignment) =>
                    pickAssignmentDate
                        ? dayjs(assignment.dueDate).get('year') === dayjs(pickAssignmentDate).get('year') &&
                          dayjs(assignment.dueDate).get('month') === dayjs(pickAssignmentDate).get('month') &&
                          dayjs(assignment.dueDate).get('date') === dayjs(pickAssignmentDate).get('date')
                        : dayjs(assignment.dueDate).get('year') > 0
                );

                setAssignmentslist(dateFilter);
            };
            get_assignments();
        }
    }, [assignmentslists, subject, classtype, pickAssignmentDate]);

    useEffect(() => {
        document.addEventListener('keydown', keyPressHandler, false);
    }, []);

    useEffect(() => {
        if (response?.data?.result) {
            const result = _.filter(assignmentslists, (assignment) => {
                return assignment._id !== assignmentId;
            });
            dispatch({ type: SET_ASSIGNMENTS, payload: [...result] });
        }
    }, [response]);

    const handleClick = (event, id, assignmentId) => {
        event.stopPropagation();
        setAssignmentId(assignmentId);
        setAnchorEl(event.currentTarget);
        setCheckrowcolornumber(id);
    };

    const handleStudentThreeDotsClick = (event, id, assignmentId, roomId) => {
        console.log('roomId:', roomId);
        event.stopPropagation();
        setRoomId(roomId);
        setAssignmentId(assignmentId);
        setAnchorEl(event.currentTarget);
        setCheckrowcolornumber(id);

        const assignment = _.filter(assignmentslists, (assignment) => {
            return assignment._id === assignmentId;
        });

        const student = _.filter(assignment[0]?.students, (student) => {
            return student.userId === cookies[AUTHORISATION_USER_ID_STORAGE_KEY];
        });
        setSenderId(student[0]._id);
        console.log('senderId:', student[0]._id);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setOpen(false);
        setAnchorEl(null);
        setCheckrowcolornumber(null);
    };

    const handleshareClose = () => {
        setShareOpen(false);
        setShareValue(null);
    };

    const handleShareOpen = (e) => {
        e.stopPropagation();

        setShareOpen(true);
        setAnchorEl(null);
    };

    const handleOpenComment = (e) => {
        e.stopPropagation();
        getComments({ roomId });
        setShareOpen(true);
        setAnchorEl(null);
    };

    const onChange = (currentNode, selectedNodes) => {};

    const TableRowonClick = (assignment, e) => {
        e.stopPropagation();
        dispatch({ type: SET_ASSIGNMENT, payload: { ...assignment } });
        navigate(`/studentlists/${assignment._id}`);
    };

    const sharetoeditClick = () => {
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const sharetoplayClick = () => {
        setAlertPlayOpen(true);
    };

    const handleClosePlayAlert = () => {
        setAlertPlayOpen(false);
    };

    const keyPressHandler = (event) => {
        if (event.keyCode === 86) {
            setShareToPlay('https://grwthx.com/file/d/2awregege3/view?usp=sharing');
        }
    };

    const handleDownload = (data, filename, e) => {
        e.stopPropagation();
        fileDownload(JSON.stringify(data), filename);
    };

    const rowdelete = async (id, e) => {
        e.stopPropagation();
        setOpen(true);
        setAnchorEl(null);
    };

    const handleDelete = () => {
        deleteAssignmentById({ assignmentId: assignmentId });
    };

    const goEditAssignment = (e, assignment) => {
        e.stopPropagation();
        navigate(`/assignmentedit/${assignment._id}`, { state: { eachvalue: assignment } });
    };

    const goToRoom = (path, e) => {
        e.stopPropagation();
        navigate(path);
    };

    return (
        <Box>
            {checkusertype == 1 ? (
                <Box>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        sx={{ width: '20%', height: '25%', position: 'absolute', top: '40%', left: '40%' }}
                    >
                        <DialogTitle id="alert-dialog-title"></DialogTitle>
                        <DialogContent>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <IconTrash
                                    style={{ color: '#F7C005', width: '40px', height: '50px', fontWeight: '800', fontFamily: 'bold' }}
                                />
                                <Typography variant="h4" component="h4">
                                    {'Are you sure you want'} <br />
                                    {'to delete this?'}
                                </Typography>
                            </div>
                        </DialogContent>

                        <DialogActions sx={{ textAlign: 'center', marginRight: '20%' }}>
                            <Stack direction="row" spacing={5}>
                                <Button
                                    onClick={handleClose}
                                    sx={{ backgroundColor: '#818181', color: '#ffffff', '&:hover': { backgroundColor: '#818181' } }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        handleDelete();
                                        handleClose(e);
                                    }}
                                    sx={{ backgroundColor: '#CE2C2C', color: '#ffffff', '&:hover': { backgroundColor: '#CE2C2C' } }}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </DialogActions>
                    </Dialog>

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
                            <DropdownTreeSelectHOC data={data} onChange={onChange} />

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
                                    sx={{
                                        height: '25px',
                                        backgroundColor: '#7983FF',
                                        color: 'white',
                                        marginTop: '15px',
                                        marginRight: '10px'
                                    }}
                                    onClick={handleshareClose}
                                >
                                    Done
                                </Button>
                            </Box>
                        </DialogContent>
                    </Dialog>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700, marginTop: '50px' }} aria-label="customized table" size="large">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Class</StyledTableCell>
                                    <StyledTableCell align="center">Subject</StyledTableCell>
                                    <StyledTableCell align="center">Assignment Title</StyledTableCell>
                                    <StyledTableCell align="center">Due Date & Time</StyledTableCell>
                                    <StyledTableCell align="center">More</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assignmentslist?.map((row, id) => (
                                    <StyledTableRow
                                        key={id}
                                        sx={{
                                            backgroundColor: checkrowcolornumber != id ? '#FFFFFF' : '#CECAFF',
                                            borderColor: checkrowcolornumber != id ? '' : '#7983FF',
                                            borderStyle: checkrowcolornumber != id ? '' : 'solid'
                                        }}
                                        onClick={(e) => TableRowonClick(row, e)}
                                    >
                                        <StyledTableCell component="th" align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                                                <Stack spacing={2} direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography
                                                        sx={{
                                                            backgroundColor: '#2CC5CE',
                                                            color: 'white',
                                                            borderRadius: '50%',
                                                            width: '25px',
                                                            height: '25px',
                                                            padding: '5px'
                                                        }}
                                                    >
                                                        G
                                                    </Typography>
                                                    <Box align="center" style={{ fontFamily: 'Livvic' }}>
                                                        {row.class[0].shortName}
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.subject[0].shortName}</StyledTableCell>
                                        <StyledTableCell align="center">{row.title}</StyledTableCell>
                                        <StyledTableCell align="center">{dayjs(row.dueDate).format('MM-DD-YYYY HH:mm:ss')}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                                                <Button
                                                    sx={{
                                                        height: '25px',
                                                        backgroundColor: '#CCCCCC',
                                                        margin: '15px',
                                                        color: 'white',
                                                        fontFamily: 'Livvic',
                                                        '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }
                                                    }}
                                                    onClick={(e) => goEditAssignment(e, row)}
                                                >
                                                    Edit
                                                </Button>

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
                                                        onClick={(e) => {
                                                            rowdelete(row._id, e);
                                                        }}
                                                        sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                                                    >
                                                        Delete
                                                    </MenuItem>
                                                    {/* <MenuItem
                                                        sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                                                        onClick={(e) => {
                                                            handleDownload(row, `${row.title}.csv`, e);
                                                        }}
                                                    >
                                                        Download
                                                    </MenuItem> */}
                                                </Menu>

                                                <Box
                                                    sx={{
                                                        backgroundColor: '#FFFFFF',
                                                        borderRadius: '30px',
                                                        width: '25px',
                                                        height: '25px',
                                                        boxShadow: '1.0331px 3.0331px 15.0331px rgba(0, 0, 0, 0.25)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                    onClick={(e) => handleClick(e, id, row._id)}
                                                >
                                                    <Box
                                                        sx={{
                                                            height: '4px',
                                                            width: '4px',
                                                            backgroundColor: '#2CC5CE',
                                                            borderRadius: '50%',
                                                            margin: '3px 1px',
                                                            display: 'inline-block'
                                                        }}
                                                    ></Box>
                                                    <Box
                                                        sx={{
                                                            height: '4px',
                                                            width: '4px',
                                                            backgroundColor: '#2CC5CE',
                                                            borderRadius: '50%',
                                                            margin: '3px 1px',
                                                            display: 'inline-block'
                                                        }}
                                                    ></Box>
                                                    <Box
                                                        sx={{
                                                            height: '4px',
                                                            width: '4px',
                                                            backgroundColor: '#2CC5CE',
                                                            borderRadius: '50%',
                                                            margin: '3px 1px',
                                                            display: 'inline-block'
                                                        }}
                                                    ></Box>
                                                </Box>
                                            </Box>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : (
                <Box>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        sx={{ width: '20%', height: '25%', position: 'absolute', top: '40%', left: '40%' }}
                    >
                        <DialogTitle id="alert-dialog-title"></DialogTitle>
                        <DialogContent>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <IconTrash
                                    style={{ color: '#F7C005', width: '40px', height: '60px', fontWeight: '800', fontFamily: 'bold' }}
                                />
                                <Typography variant="h3" component="h3">
                                    {'Are you sure you want'} <br />
                                    {'to delete this?'}
                                </Typography>
                            </div>
                        </DialogContent>

                        <DialogActions sx={{ textAlign: 'center', marginRight: '22%' }}>
                            <Button
                                onClick={handleClose}
                                sx={{ backgroundColor: '#818181', color: '#ffffff', '&:hover': { backgroundColor: '#818181' } }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    handleDelete();
                                    handleClose();
                                }}
                                sx={{ backgroundColor: '#CE2C2C', color: '#ffffff', '&:hover': { backgroundColor: '#CE2C2C' } }}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <CommentModal open={shareOpen} handleClose={handleshareClose} senderId={senderId} roomId={roomId} />

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700, marginTop: '50px' }} aria-label="customized table" size="large">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCellstudent align="center" style={{ fontFamily: 'Livvic' }}>
                                        Assignment Title
                                    </StyledTableCellstudent>
                                    <StyledTableCellstudent align="center" style={{ fontFamily: 'Livvic' }}>
                                        Subject
                                    </StyledTableCellstudent>
                                    <StyledTableCellstudent align="center" style={{ fontFamily: 'Livvic' }}>
                                        Status
                                    </StyledTableCellstudent>
                                    <StyledTableCellstudent align="center" style={{ fontFamily: 'Livvic' }}>
                                        Due Date & Time
                                    </StyledTableCellstudent>
                                    <StyledTableCellstudent align="center" style={{ fontFamily: 'Livvic' }}>
                                        Reminder
                                    </StyledTableCellstudent>
                                    <StyledTableCellstudent align="center" style={{ fontFamily: 'Livvic' }}>
                                        Grade/Marks
                                    </StyledTableCellstudent>
                                    <StyledTableCellstudent align="center" style={{ fontFamily: 'Livvic' }}>
                                        More
                                    </StyledTableCellstudent>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assignmentslist?.map((row, id) => {
                                    const studentInfo = _.filter(
                                        row?.students,
                                        (student) => student.userId === cookies[AUTHORISATION_USER_ID_STORAGE_KEY]
                                    )[0];

                                    const roomInfo = _.filter(row?.rooms, (room) => room._id === studentInfo?.roomId)[0];
                                    return (
                                        <StyledTableRow
                                            key={id}
                                            sx={{
                                                backgroundColor: checkrowcolornumber != id ? '#FFFFFF' : '#CECAFF',
                                                borderColor: checkrowcolornumber != id ? '' : '#7983FF',
                                                borderStyle: checkrowcolornumber != id ? '' : 'solid'
                                            }}
                                            onClick={(event) =>
                                                goToRoom(
                                                    (( row.groups?.length > 0)? (`/roomId/${roomInfo?.roomId}/${row._id}`) : (`/roomId/${roomInfo?.roomId}/${row._id}/${cookies[AUTHORISATION_USER_ID_STORAGE_KEY]}`)),
                                                    event
                                                )
                                            }
                                        >
                                            <StyledTableCellstudent component="th" scope="row" align="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Stack spacing={2} direction="row">
                                                        <Typography
                                                            sx={{
                                                                backgroundColor: '#2CC5CE',
                                                                color: 'white',
                                                                borderRadius: '50%',
                                                                width: '25px',
                                                                height: '25px',
                                                                padding: '5px'
                                                            }}
                                                        >
                                                            G
                                                        </Typography>
                                                        <Box align="center" style={{ fontFamily: 'Livvic' }}>
                                                            {row.title}
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            </StyledTableCellstudent>
                                            <StyledTableCellstudent align="center">{row.subject[0].shortName}</StyledTableCellstudent>
                                            <StyledTableCellstudent align="center">
                                                {studentInfo.status === 'Submitted' || studentInfo.status === 'Done late'
                                                    ? studentInfo?.mark
                                                        ? studentInfo?.mark
                                                        : studentInfo.status
                                                    : dayjs(row.dueDate).get('month') - dayjs().get('month') >= 0
                                                    ? dayjs(row.dueDate).get('date') - dayjs().get('date') > 0
                                                        ? studentInfo.status
                                                        : dayjs(row.dueDate).get('date') - dayjs().get('date') === 0
                                                        ? dayjs(row.dueDate).get('hour') - dayjs().get('hour') > 0
                                                            ? studentInfo.status
                                                            : dayjs(row.dueDate).get('hour') - dayjs().get('hour') === 0
                                                            ? dayjs(row.dueDate).get('minute') - dayjs().get('minute') > 0
                                                                ? studentInfo.status
                                                                : 'Missing'
                                                            : 'Missing'
                                                        : 'Missing'
                                                    : 'Missing'}
                                            </StyledTableCellstudent>
                                            <StyledTableCellstudent align="center">
                                                {dayjs(row.dueDate).format('DD-MM-YYYY HH:mm:ss')}{' '}
                                            </StyledTableCellstudent>
                                            <StyledTableCellstudent align="center">
                                                {studentInfo.status === 'Submitted' || studentInfo.status === 'Done late'
                                                    ? ''
                                                    : dayjs(row.dueDate).get('month') - dayjs().get('month') >= 0
                                                    ? dayjs(row.dueDate).get('date') - dayjs().get('date') > 0
                                                        ? `${dayjs(row.dueDate).get('date') - dayjs().get('date')} Days Left`
                                                        : dayjs(row.dueDate).get('date') - dayjs().get('date') === 0
                                                        ? dayjs(row.dueDate).get('hour') - dayjs().get('hour') > 0
                                                            ? `${dayjs(row.dueDate).get('date') - dayjs().get('date')} Days Left`
                                                            : dayjs(row.dueDate).get('hour') - dayjs().get('hour') === 0
                                                            ? dayjs(row.dueDate).get('minute') - dayjs().get('minute') > 0
                                                                ? `${dayjs(row.dueDate).get('date') - dayjs().get('date')} Days Left`
                                                                : ''
                                                            : ''
                                                        : ''
                                                    : ''}
                                            </StyledTableCellstudent>
                                            <StyledTableCellstudent align="center">{row.grade}</StyledTableCellstudent>
                                            <StyledTableCellstudent align="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box
                                                        style={{
                                                            backgroundColor: '#FFFFFF',
                                                            borderRadius: '30px',
                                                            width: '25px',
                                                            height: '25px',
                                                            boxShadow: '1.0331px 3.0331px 15.0331px rgba(0, 0, 0, 0.25)'
                                                        }}
                                                        onClick={(e) => handleStudentThreeDotsClick(e, id, row._id, studentInfo.roomId)}
                                                    >
                                                        <Box
                                                            sx={{
                                                                height: '4px',
                                                                width: '4px',
                                                                backgroundColor: '#2CC5CE',
                                                                borderRadius: '50%',
                                                                margin: '3px 1px',
                                                                display: 'inline-block'
                                                            }}
                                                        ></Box>
                                                        <Box
                                                            sx={{
                                                                height: '4px',
                                                                width: '4px',
                                                                backgroundColor: '#2CC5CE',
                                                                borderRadius: '50%',
                                                                margin: '3px 1px',
                                                                display: 'inline-block'
                                                            }}
                                                        ></Box>
                                                        <Box
                                                            sx={{
                                                                height: '4px',
                                                                width: '4px',
                                                                backgroundColor: '#2CC5CE',
                                                                borderRadius: '50%',
                                                                margin: '3px 1px',
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
                                                        <MenuItem
                                                            onClick={handleOpenComment}
                                                            sx={{
                                                                '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }
                                                            }}
                                                        >
                                                            Comment
                                                        </MenuItem>
                                                    </Menu>
                                                </Box>
                                            </StyledTableCellstudent>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Box>
    );
}
