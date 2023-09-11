import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ImageListItem from '@mui/material/ImageListItem';
import room1 from '../../assets/images/roomimg/room1.png';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { IconTrash } from '@tabler/icons';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useTheme } from '@mui/styles';
import {
    useCreateCommentMutation,
    useDeleteStudentByIdMutation,
    useGetAssignmentByIdMutation,
    useGetCommentsMutation,
    useGetUserInfoQuery
} from 'store/slices/apiSlice';
import { useEffect } from 'react';
import { fontSize } from '@mui/system';
import StudentList from './studentList';
import { useCookies } from 'react-cookie';
import { AUTHORISATION_USER_ID_STORAGE_KEY, AUTHORISATION_USER_NAME_STORAGE_KEY } from 'utils/constants';
import { socket } from '../utilities/Socket';
import CommentModal from 'components/CommentModal';

export default function Studentlists() {
    // studentlists component
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate ()
    const [cookies] = useCookies();

    const [assignment, setAssignment] = useState({});
    const [statusFilter, setStatusFilter] = useState('None');
    const [studentId, setSelectedStudentId] = useState('');
    const [roomId, setSelectedRoomId] = useState('');
    const [comment, setComment] = useState('');
    const [deleteopen, setDeleteopen] = useState(false);

    const assignmentId = location.pathname.split('/')[2];
    const [getAssignmentById, assignmentResponse] = useGetAssignmentByIdMutation();
    const [deleteStudentByRoomId, response] = useDeleteStudentByIdMutation();
    const [getComments, commentsResponse] = useGetCommentsMutation();
    const [createComment, createCommentResponse] = useCreateCommentMutation();
    const { data: userInfo } = useGetUserInfoQuery();

    useEffect(() => {
        getAssignmentById({ assignmentId });
    }, [assignmentId, response]);

    useEffect(() => {
        if (assignmentResponse.data) {
            setAssignment(assignmentResponse.data);
        }
    }, [assignmentResponse]);

    useEffect(() => {
        if (createCommentResponse?.data) {
            getComments({ roomId });
        }
    }, [createCommentResponse]);

    const filterstatus = [
        // mockup data
        { key: 'None', value: 'None' },
        { key: 'New', value: 'New' },
        { key: 'Submitted', value: 'Submitted' },
        { key: 'Missing', value: 'Missing' },
        { key: 'Done late', value: 'Done late' }
    ];

    const [anchorEl, setAnchorEl] = useState('');

    const handleClick = (id, studentId) => {
        console.log(id);
        setSelectedRoomId(id);
        setSelectedStudentId(studentId);
    };

    const [openstudentlist, Setopenstudentlist] = useState(false);

    const handleclickstudentlistclose = () => {
        Setopenstudentlist(false);
    };

    const openCommentModal = () => {
        console.log(roomId);
        getComments({ roomId });
        Setopenstudentlist(true);
    };

    const handleChangeFilter = (e) => {
        //filter by None, New, Submitted, Missing, Done late

        setStatusFilter(e.target.value);
    };

    const rowdelete = async (id) => {
        setDeleteopen(true);
        setAnchorEl(null);
    };
    const handledeleteClose = () => {
        setDeleteopen(false);
        setAnchorEl(null);
    };
    const handleDelete = () => {
        deleteStudentByRoomId({ roomId: roomId });
    };

    const getSubmittedCount = () => {
        const submittedStudents = _.filter(assignment?.students, (student) => {
            return student?.status === 'Submitted' && student?.role !== 'Teacher';
        });

        return submittedStudents.length;
    };

    const getAssignedCount = () => {
        const assignedStudents = _.filter(assignment?.students, (student) => {
            return student?.role !== 'Teacher';
        });

        return assignedStudents.length;
    };

    const goToRoom = (path, e) => {
        e.stopPropagation();
        console.log(path)
        navigate(path)
        // window.open(path, '_blank');
    };


    const getFilteredStudents = () => {
        if (statusFilter !== 'None') {
            if (assignment?.students) {
                const students = _.filter(assignment?.students, (student) => {
                    return student?.status === statusFilter;
                });
                const studentsWithRoom = students.map((item) => {
                    const room = _.filter(assignment?.rooms, (room) => {
                        return room._id === item.roomId;
                    });
                    return { ...item, room: { ...room[0] } };
                });
                return studentsWithRoom;
            } else {
                return [];
            }
        } else {
            const studentsWithRoom = assignment?.students?.map((item) => {
                const room = _.filter(assignment?.rooms, (room) => {
                    return room._id === item.roomId;
                });
                return { ...item, room: { ...room[0] } };
            });
            return studentsWithRoom;
        }
    };

    const getGroups = (assignment) => {
        const filteredGroups = assignment?.groups?.map((group) => {
            let filteredStudents = _.filter(group?.members, (member) => {
                return member.role !== 'Teacher';
            });

            return { ...group, members: filteredStudents, room: group.room[0] };
        });
        return filteredGroups;
    };

    const submittedCount = useMemo(() => getSubmittedCount(assignment), [assignment]);

    const assignedCount = useMemo(() => getAssignedCount(assignment), [assignment]);

    const students = useMemo(() => getFilteredStudents(assignment), [statusFilter, assignment]);

    const groups = useMemo(() => getGroups(assignment), [assignment]);

    const senderId = useMemo(() => {
        const teacher = _.filter(assignment?.students, (student) => {
            return student.role === 'Teacher';
        });
        if (teacher.length > 0) {
            return teacher[0]._id;
        } else {
            return "";
        }
    }, [assignment]);

    return (
        <Box>
            <Dialog
                open={deleteopen}
                onClose={handledeleteClose}
                aria-labelledby="alert-dialog-title"
                sx={{ width: '20%', height: '25%', position: 'absolute', top: '40%', left: '40%' }}
            >
                <DialogTitle id="alert-dialog-title"></DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <IconTrash style={{ color: '#F7C005', width: '40px', height: '60px', fontWeight: '800', fontFamily: 'bold' }} />
                        <Typography variant="h3" component="h3">
                            {'Are you sure you want'} <br />
                            {'to delete this?'}
                        </Typography>
                    </div>
                </DialogContent>

                <DialogActions sx={{ textAlign: 'center', marginRight: '22%' }}>
                    <Button
                        onClick={handledeleteClose}
                        sx={{ backgroundColor: '#818181', color: '#ffffff', '&:hover': { backgroundColor: '#818181' } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleDelete();
                            handledeleteClose();
                        }}
                        sx={{ backgroundColor: '#CE2C2C', color: '#ffffff', '&:hover': { backgroundColor: '#CE2C2C' } }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#7983FF' }}>
                        {assignment?.title}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Box sx={{ backgroundColor: '#F2F2F2', padding: '10px 39px', borderRadius: '20px' }}>
                        {`Subject: ${assignment?.subject && assignment?.subject[0].shortName}`}
                    </Box>

                    <Box sx={{ backgroundColor: '#F2F2F2', padding: '10px 39px', borderRadius: '20px' }}>
                        {`Class: ${assignment?.class && assignment?.class[0].shortName}`}
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-around ', marginTop: '80px' }}>
                <Box sx={{ display: 'flex' }}>
                    <Stack spacing={4} direction="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 8, justifyContent: 'center' }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    padding: '2px 9px',
                                    borderRadius: '50%',
                                    backgroundColor: theme.palette.success.main,
                                    color: 'white',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {submittedCount}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    padding: '2px 9px',
                                    borderRadius: '50%',
                                    color: theme.palette.success.main
                                }}
                            >
                                Submitted
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    padding: '2px 9px',
                                    borderRadius: '50%',
                                    backgroundColor: theme.palette.grey[700],
                                    color: 'white',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {assignedCount}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    padding: '2px 9px',
                                    borderRadius: '50%',
                                    color: theme.palette.grey[700]
                                }}
                            >
                                Assigned
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Box sx={{ width: '140px' }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Filter by</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={statusFilter}
                            label="Subject"
                            onChange={handleChangeFilter}
                        >
                            {filterstatus.map((item, index) => (
                                <MenuItem
                                    value={item.value}
                                    sx={{ '&:hover': { color: 'white', backgroundColor: '#2CC5CE' }, color: '#2CC5CE' }}
                                >
                                    {item.key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <CommentModal open={openstudentlist} handleClose={handleclickstudentlistclose} roomId={roomId} senderId={senderId} />

            {groups?.length > 0
                ? groups.map((group, index) => (
                      <StudentList
                          key={index}
                          student={group}
                          rowdelete={rowdelete}
                          goToRoom={goToRoom}
                          clickOpen={handleClick}
                          anchorEl={anchorEl}
                          openCommentModal={openCommentModal}
                          assignment={assignment}
                      />
                  ))
                : students?.map((student, index) => {
                      if (student.role !== 'Teacher')
                          return (
                              <StudentList
                                  student={student}
                                  rowdelete={rowdelete}
                                  goToRoom={goToRoom}
                                  open={open}
                                  clickOpen={handleClick}
                                  anchorEl={anchorEl}
                                  openCommentModal={openCommentModal}
                                  assignment={assignment}
                              />
                          );
                  })}
        </Box>
    );
}
