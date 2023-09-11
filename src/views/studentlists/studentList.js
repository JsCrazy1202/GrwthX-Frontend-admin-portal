import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ImageListItem from '@mui/material/ImageListItem';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import dayjs from 'dayjs';
import ToolMenu from '../../components/ToolMenu';
import RoomA1 from '../../assets/images/roomimg/RoomA1.png';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { AUTHORISATION_USER_ID_STORAGE_KEY } from 'utils/constants';
import { useSetMarkMutation } from 'store/slices/apiSlice';

const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 80
    }
});

const StudentList = React.forwardRef(({ student, rowdelete, goToRoom, openCommentModal, clickOpen, assignment }, ref) => {
    const [cookies] = useCookies();
    const [mark, setMark] = useState('');
    const [membersName, setMembersName] = useState('');
    const [setMarkMutation, response] = useSetMarkMutation();

    useEffect(() => {
        if (student?.groupName) {
            let names = '';
            student.members.map((item) => {
                names += item.nameZh + ' \n ';
            });
            
            setMembersName(names);
        }
        if(student.mark){
            setMark(student.mark)
        }
    }, [student]);

    const handleMarkchange = (e, studentId, roomId, isGroup) => {
        e.stopPropagation();
        console.log(studentId, roomId, isGroup);
        setMarkMutation({ studentId, roomId, mark: e.target.value });
        // _.debounce(() => {
        //     setMarkMutation({ studentId, mark: e.target.value });
        // }, 500);
        setMark(e.target.value);
    };

    console.log(response);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                marginTop: '40px',
                backgroundColor: 'white',
                alignItems: 'center',
                boxShadow: '10px 8px 10px -10px;  #ccc',
                padding: '10px'
            }}
            ref={ref}
            onClick={(event) => {
                if (student?.userId) {
                    goToRoom(`/roomId/${student.room?.roomId}/${student.assignmentId}/${student?.userId}`, event);
                } else {
                    goToRoom(`/roomId/${student.room?.roomId}/${student.assignmentId}`, event);
                }
            }}
        >
            <ImageListItem sx={{ width: 100, height: 100 }}>
                <img src={student?.headImg || RoomA1} alt="room1" loading="lazy" />
            </ImageListItem>
            {student?.groupName ? (
                <CustomWidthTooltip title={<span style={{ whiteSpace: 'pre-line' }}>{membersName}</span>}>
                    <Box sx={{ alignItems: 'center', justifyContent: 'center', width: '50px' }}>
                        <Typography
                            variant="h5"
                            component="h6"
                            sx={{
                                borderRadius: '50%',
                                height: '30px',
                                width: '30px',
                                backgroundColor: '#9cdd73',
                                color: 'black',
                                padding: '8.5px'
                            }}
                        >
                            {student?.nameEn}
                        </Typography>
                        <Box sx={{ width: '50px', fontSize: '12px' }}>{student?.nameZh || student.groupName}</Box>
                    </Box>
                </CustomWidthTooltip>
            ) : (
                <Box sx={{ alignItems: 'center', justifyContent: 'center', width: '50px' }}>
                    <Typography
                        variant="h5"
                        component="h6"
                        sx={{
                            borderRadius: '50%',
                            height: '30px',
                            width: '30px',
                            backgroundColor: '#9cdd73',
                            color: 'black',
                            padding: '8.5px'
                        }}
                    >
                        {student?.nameEn}
                    </Typography>
                    <Box sx={{ width: '50px', fontSize: '12px' }}>{student?.nameZh || student.groupName}</Box>
                </Box>
            )}

            <Box sx={{ width: '60px', fontSize: '20px' }}>
                {student.status === 'Submitted' || student.status === 'Done late'
                    ? mark
                        ? mark
                        : student.status
                    : dayjs(assignment.dueDate).get('month') - dayjs().get('month') >= 0
                    ? dayjs(assignment.dueDate).get('date') - dayjs().get('date') > 0
                        ? student.status
                        : dayjs(assignment.dueDate).get('date') - dayjs().get('date') === 0
                        ? dayjs(assignment.dueDate).get('hour') - dayjs().get('hour') > 0
                            ? student.status
                            : dayjs(assignment.dueDate).get('hour') - dayjs().get('hour') === 0
                            ? dayjs(assignment.dueDate).get('minute') - dayjs().get('minute') > 0
                                ? student.status
                                : 'Missing'
                            : 'Missing'
                        : 'Missing'
                    : 'Missing'}
            </Box>
            <Box sx={{ width: '120px', fontSize: '20px' }}>
                {student?.status != 'New' && student?.status != 'Missing' && (
                    <TextField
                        label={assignment?.grade}
                        type="text"
                        InputLabelProps={{
                            shrink: true
                        }}
                        value={mark}
                        onChange={(e) => handleMarkchange(e, student._id, student?.room.id, student?.groupName ? true : false)}
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
            </Box>
            <Box sx={{ width: '15%', fontSize: '20px' }}>{dayjs(assignment?.dueDate).format('MM-DD-YYYY HH:mm:ss')}</Box>

            <ToolMenu closeTwo={rowdelete} closeOne={openCommentModal} data={student} clickOpen={clickOpen} />
        </Box>
    );
});

export default StudentList;
