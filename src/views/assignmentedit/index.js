import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { IconTrash } from '@tabler/icons';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import {
    useGetSubjectsOriginalQuery,
    useGetClassListOriginalQuery,
    useGetAssignmentByIdMutation,
    useUpdateAssignmentMutation
} from 'store/slices/apiSlice';

export default function AssignmentEdit() {
    //Assignment Edit page
    const navigate = useNavigate();
    const location = useLocation();
    const duedateinfo = location.state.eachvalue._id;

    const [open, setOpen] = useState(false);
    const [assignment, setAssignment] = useState({});
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState('');
    const [classItem, setClassItem] = useState('');
    const [subject, setSubject] = useState('');
    const [dueDate, setDueDate] = useState('');

    const assignmentId = location.pathname.split('/')[2];

    const { data: originalClasses } = useGetClassListOriginalQuery();
    const { data: originalSubjects } = useGetSubjectsOriginalQuery();
    const [getAssignmentById, assignmentResponse] = useGetAssignmentByIdMutation();
    const [updateAssignment, response] = useUpdateAssignmentMutation();

    useEffect(() => {
        getAssignmentById({ assignmentId });
    }, [assignmentId]);

    useEffect(() => {
        if (assignmentResponse?.data) {
            console.log(assignmentResponse.data);
            setClassItem(assignmentResponse.data?.class[0].classId);
            setSubject(assignmentResponse.data?.subject[0].subjectId);
            setAssignment(assignmentResponse.data);
            setDueDate(assignmentResponse.data?.dueDate);
            setTitle(assignmentResponse.data?.title);
            setGrade(assignmentResponse.data?.grade);
        }
    }, [assignmentResponse]);

    useEffect(() => {
        console.log(response?.data);
        if (response?.data && !response?.data?.error) {
            
            navigate('/assignments');
        }
    }, [response]);

    const handleChangeClass = (e) => {
        setClassItem(e.target.value);
    };

    const handleChangeSubject = (e) => {
        setSubject(e.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const ondialogopen = () => {
        setOpen(true);
    };

    const titleChange = (e) => {
        setTitle(e.target.value);
    };
    const dueDateChange = (e) => {
        setDueDate(e.target.value);
    };
    const gardeChange = (e) => {
        setGrade(e.target.value);
    };
    const handleupdate = () => {
        const subjectItem = _.filter(originalSubjects, (subjectItem) => subjectItem.subjectId === subject);
        const classObject = _.filter(originalClasses, (item) => item.classId === classItem);
        console.log({
            id: assignment._id,
            title,
            grade,
            dueDate,
            class: classObject[0],
            subject: subjectItem[0]
        });
        updateAssignment({
            id: assignment._id,
            title,
            grade,
            dueDate,
            class: classObject[0],
            subject: subjectItem[0]
        });
    };

    return (
        <Container fixed>
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
                            <IconTrash style={{ color: '#F7C005', width: '40px', height: '60px', fontWeight: '800', fontFamily: 'bold' }} />
                            <Typography variant="h3" component="h3">
                                {'Are you sure you want'} <br />
                                {'to update this?'}
                            </Typography>
                        </div>
                    </DialogContent>

                    <DialogActions sx={{ textAlign: 'center', marginRight: '22%' }}>
                        <Button
                            onClick={handleClose}
                            sx={{ backgroundColor: '#818181', color: '#ffffff', '&:hover': { backgroundColor: '#818181' } }}
                        >
                            No
                        </Button>
                        <Button
                            onClick={() => {
                                handleupdate();
                                handleClose();
                            }}
                            sx={{ backgroundColor: '#CE2C2C', color: '#ffffff', '&:hover': { backgroundColor: '#CE2C2C' } }}
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box>
                    <Typography variant="h3" component="h4" sx={{ fontFamily: 'Livvic' }}>
                        Assignment Edit
                    </Typography>

                    <Stack spacing={4}>
                        <Typography variant="h4" component="h5" sx={{ marginTop: '20px', fontFamily: 'Livvic' }}>
                            Class:
                        </Typography>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Class</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={classItem}
                                label="Class"
                                onChange={handleChangeClass}
                                sx={{ width: 250 }}
                            >
                                {originalClasses?.map((item, i) => (
                                    <MenuItem
                                        value={item.classId}
                                        key={i}
                                        sx={{
                                            '&:hover': { color: 'white', backgroundColor: '#2CC5CE' },
                                            color: '#2CC5CE',
                                            fontFamily: 'Livicc'
                                        }}
                                    >
                                        {item.shortName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Stack spacing={4}>
                        <Typography variant="h4" component="h5" sx={{ marginTop: '20px', fontFamily: 'Livvic' }}>
                            Subject:
                        </Typography>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Class</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={subject}
                                label="Class"
                                onChange={handleChangeSubject}
                                sx={{ width: 250 }}
                            >
                                {originalSubjects?.map((item, i) => (
                                    <MenuItem
                                        value={item.subjectId}
                                        key={i}
                                        sx={{
                                            '&:hover': { color: 'white', backgroundColor: '#2CC5CE' },
                                            color: '#2CC5CE',
                                            fontFamily: 'Livicc'
                                        }}
                                    >
                                        {item.shortName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Stack spacing={4}>
                        <Typography variant="h4" component="h5" sx={{ marginTop: '20px', fontFamily: 'Livvic' }}>
                            Title:
                        </Typography>
                        <TextField
                            id="datetime-local"
                            label="Title"
                            type="text"
                            value={title}
                            sx={{ width: 250, fontFamily: 'Livvic' }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={titleChange}
                        />
                    </Stack>

                    <Stack spacing={4}>
                        <Typography variant="h4" component="h5" sx={{ marginTop: '20px', fontFamily: 'Livvic' }}>
                            Grade:
                        </Typography>
                        <TextField
                            id="datetime-local"
                            label="Title"
                            type="text"
                            value={grade}
                            sx={{ width: 250, fontFamily: 'Livvic' }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={gardeChange}
                        />
                    </Stack>

                    <Stack spacing={4}>
                        <Typography variant="h4" component="h5" sx={{ marginTop: '20px', fontFamily: 'Livvic' }}>
                            Due Date:
                        </Typography>
                        <TextField
                            id="datetime-local"
                            label="Due Time"
                            type="datetime-local"
                            value={dueDate}
                            sx={{ width: 250, fontFamily: 'Livvic' }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={dueDateChange}
                        />
                    </Stack>

                    <Box sx={{ display: 'flex', marginTop: '80px' }}>
                        <Link to={'/assignments'} style={{ textDecoration: 'none', fontFamily: 'Livvic' }}>
                            <Button
                                sx={{
                                    fontFamily: 'Livvic',
                                    backgroundColor: '#818181',
                                    color: '#ffffff',
                                    '&:hover': { backgroundColor: '#818181' }
                                }}
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button variant="contained" sx={{ marginLeft: '50px', fontFamily: 'Livvic' }} onClick={ondialogopen}>
                            Update
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
