import React, { useState, useEffect } from 'react';

import { Box } from '@mui/material';
import { IconX } from '@tabler/icons';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import _ from 'lodash';
import './treeview.css';
import './drag.css';
import { Divider } from '@mui/material';
import {
    useGetClassListOriginalQuery,
    useGetClassUsersMutation,
    useGetSubjectsOriginalQuery,
    useInsertAssignmentMutation
} from 'store/slices/apiSlice';
import { useDispatch } from 'react-redux';

import { SET_ASSIGNMENTS } from 'store/actions';
import DragDrop from 'components/DragDrop';
import { useMemo } from 'react';
import dayjs from 'dayjs';

const AddAssignmentModal = ({ open, handleClose, fields }) => {
    const [dialogvalue, setdialogValue] = useState('1');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [classType, setClassType] = useState('');
    const [subjectClassName, setSubjectClassName] = useState('');
    const [classClassName, setClassClassName] = useState('');
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState();
    const [dueDate, setDueDate] = React.useState();
    const [selectedValue, setSelectedValue] = useState('a');
    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState([]);
    const [listdata, setListdata] = useState([]);
    const [textInput, setTextInput] = useState('');
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isValidGroup, setIsValidGroup] = useState(true);
    const [dateError, setDateError] = useState(false);

    const dispatch = useDispatch();

    const handleTextInputChange = (event) => {
        setIsValidGroup(true);
        setTextInput(event.target.value);
    };

    const assignmentassignClick = async () => {
        const subject = _.filter(originalSubjects, (subject) => subject.subjectId === selectedSubjectId);
        const classObject = _.filter(originalClasses, (item) => item.classId === classType);

        const data = {
            title: title,
            grade: grade,
            dueDate: dueDate,
            students: listdata,
            class: classObject[0],
            subject: subject[0],
            groups: groups.length > 0 ? groups : false
        };
        insertAssignment({ ...data });
        closeDialog();
    };

    const handleRemoveItem = (oneitem) => {
        setGroups([]);
        setListdata(listdata.filter((item) => item !== oneitem));
    };

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
        setGroups([]);
        if (nodeIds[0] != 1) {
            const individual = students.filter((item) => item.userId === nodeIds[0]);
            const filterResult = listdata.filter((item) => item.userId === individual[0].userId);
            if (filterResult.length > 0) {
                return;
            } else {
                setListdata([...listdata, individual[0]]);
            }
        }
    };

    const handleExpandClick = () => {
        setExpanded((oldExpanded) => (oldExpanded.length === 0 ? ['1', '5', '6', '7'] : []));
    };

    const handleChangeradiobutton = (event) => {
        setIsValidGroup(true);
        setSelectedValue(event.target.value);
    };

    const handleChangeClass = (e) => {
        if (e.target.value !== '') {
            setClassType(e.target.value);
            const classObject = _.filter(originalClasses, (item) => item.classId === e.target.value);
            setSubjectClassName(classObject[0].className);
        } else {
            setClassType('');
            setSelectedSubjectId('');
            setClassClassName('');
            setSubjectClassName('');
        }
    };

    const handleChange = (event, newValue) => {
        setdialogValue(newValue);
    };

    const handlechangeSubject = (e) => {
        if (e.target.value !== '') {
            setSelectedSubjectId(e.target.value);
            const subject = _.filter(originalSubjects, (subject) => subject.subjectId === e.target.value);
            setClassClassName(subject[0].className);
        } else {
            setSelectedSubjectId('');
            setClassClassName('');
            setSubjectClassName('');
        }
    };

    const titleclick = (e) => {
        setTitle(e.target.value);
    };

    const datetimechange = (e) => {
        if (dayjs() > dayjs(e.target.value)) {
            setDateError(true);
        } else {
            setDueDate(e.target.value);
            setDateError(false);
        }
    };

    const nexttabvalue = () => {
        setdialogValue('2');
    };

    const { data: originalClasses } = useGetClassListOriginalQuery();
    const { data: originalSubjects } = useGetSubjectsOriginalQuery();
    const [insertAssignment, response] = useInsertAssignmentMutation();
    const [getClassUsers, classUsers] = useGetClassUsersMutation();

    const closeDialog = () => {
        setSubjectClassName('');
        setClassClassName('');
        setListdata([]);
        handleClose();
        setTitle('');
        setGrade('');
        setDueDate('');
        setIsValidGroup(false);
        setdialogValue('1');
        setSelectedSubjectId('');
        setClassType('');
    };

    useEffect(() => {
        if (response?.data) {
            dispatch({ type: SET_ASSIGNMENTS, payload: [...response.data] });
        }
    }, [response]);

    useEffect(() => {
        if (classType)
            (async () => {
                const response = await getClassUsers({ classId: classType });
                setStudents(response.data);
            })();
    }, [classType]);

    const onDropChange = (result) => {
        const groupList = Object.keys(result).map((groupId) => {
            return { ...result[groupId] };
        });

        const filteredGroups = _.filter(groupList, (group) => {
            return group.title !== 'User';
        });

        let count = 0;
        setGroups(filteredGroups);
        filteredGroups.map((group) => {
            if (group.items.length > 0) {
                count++;
            }
        });
        if (count === filteredGroups.length) {
            setIsValidGroup(false);
        } else {
            setIsValidGroup(true);
        }
        setListdata([]);
    };

    const filterSubjects = (originalSubjects, subjectClassName) => {
        return _.filter(originalSubjects, (item) =>
            subjectClassName !== '' ? item.className === subjectClassName : item.className !== subjectClassName
        );
    };

    const filterClasses = (originalClasses, classClassName) => {
        return _.filter(originalClasses, (item) =>
            classClassName !== '' ? item.className === classClassName : item.className !== classClassName
        );
    };

    const subjects = useMemo(() => filterSubjects(originalSubjects, subjectClassName), [originalSubjects, subjectClassName]);

    const classes = useMemo(() => filterClasses(originalClasses, classClassName), [originalClasses, classClassName]);

    return (
        <Dialog
            open={open}
            onClose={closeDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{ height: '85%' }}
        >
            <div style={{ display: 'flex', backgroundColor: '#2CC5CE', padding: '10px' }}>
                <Typography
                    variant="h3"
                    component="h3"
                    sx={{ color: 'black', width: '100%', height: '30px', margin: '0px', padding: '0px' }}
                ></Typography>
                <IconX style={{ backgroundColor: '#7983FF', color: 'white' }} onClick={closeDialog} />
            </div>
            <TabContext value={dialogvalue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example" indicator={{ backgroundColor: '#e77600' }}>
                        <Tab label="Assignment Info" value="1" />
                        <Tab label="Individual/Group" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '130px' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedSubjectId}
                                        label="Subject"
                                        onChange={handlechangeSubject}
                                    >
                                        <MenuItem
                                            value={''}
                                            sx={{
                                                '&:hover': { color: 'white', backgroundColor: '#2CC5CE' },
                                                color: '#2CC5CE',
                                                backgroundColor: 'white',
                                                fontFamily: 'Livicc'
                                            }}
                                        >
                                            None
                                        </MenuItem>
                                        {subjects?.map((u, i) => (
                                            <MenuItem
                                                value={u.subjectId}
                                                key={i}
                                                sx={{
                                                    '&:hover': { color: 'white', backgroundColor: '#2CC5CE' },
                                                    color: '#2CC5CE',
                                                    backgroundColor: 'white',
                                                    fontFamily: 'Livicc'
                                                }}
                                            >
                                                {u.shortName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{ marginLeft: '20px', width: '100px' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Class</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={classType}
                                        label="Class"
                                        onChange={handleChangeClass}
                                    >
                                        <MenuItem
                                            value={''}
                                            sx={{
                                                '&:hover': { color: 'white', backgroundColor: '#2CC5CE' },
                                                color: '#2CC5CE',
                                                fontFamily: 'Livicc'
                                            }}
                                        >
                                            None
                                        </MenuItem>
                                        {classes?.map((u, i) => (
                                            <MenuItem
                                                value={u.classId}
                                                key={i}
                                                sx={{
                                                    '&:hover': { color: 'white', backgroundColor: '#2CC5CE' },
                                                    color: '#2CC5CE',
                                                    fontFamily: 'Livicc'
                                                }}
                                            >
                                                {u.shortName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <form>
                            <Box style={{ marginTop: '5px', position: 'relative' }}>
                                <Stack mt={4}>
                                    <TextField
                                        id="title"
                                        label="Title"
                                        variant="outlined"
                                        value={title}
                                        sx={{ width: '100%' }}
                                        placeholder="Text Area"
                                        onChange={titleclick}
                                        inputProps={{ maxLength: 30 }}
                                    />
                                    <Box
                                        sx={{
                                            backgroundColor: '#818181',
                                            padding: '2px 10px',
                                            borderRadius: '10px',
                                            width: '35px',
                                            color: 'white',
                                            position: 'absolute',
                                            right: '10px',
                                            top: '13px'
                                        }}
                                    >
                                        30
                                    </Box>
                                </Stack>
                            </Box>

                            <Box style={{ marginTop: '5px', position: 'relative' }}>
                                <Stack mt={4}>
                                    <TextField
                                        type="text"
                                        id="grade"
                                        label="Text Area(Type in grade or marks)"
                                        variant="outlined"
                                        value={grade}
                                        sx={{ width: '100%' }}
                                        onChange={(e) => setGrade(e.target.value)}
                                        inputProps={{ maxLength: 30 }}
                                    />
                                    <Box
                                        sx={{
                                            backgroundColor: '#818181',
                                            padding: '2px 10px',
                                            borderRadius: '10px',
                                            width: '35px',
                                            color: 'white',
                                            position: 'absolute',
                                            right: '10px',
                                            top: '13px'
                                        }}
                                    >
                                        30
                                    </Box>
                                </Stack>
                            </Box>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '25px',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <TextField
                                        id="datetime-local"
                                        label="Due Date & Time:"
                                        type="datetime-local"
                                        defaultValue={dueDate}
                                        sx={{ width: 398 }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        onChange={datetimechange}
                                    />
                                    {dateError && (
                                        <Typography sx={{ color: 'red' }}>* Due date & time cann't be earlier than now</Typography>
                                    )}
                                </div>
                                <div style={{ bottom: '20px', position: 'absolute', right: '30px' }}>
                                    <Button
                                        variant="contained"
                                        onClick={closeDialog}
                                        style={{
                                            marginLeft: '10px',
                                            backgroundColor: '#818181',
                                            color: 'white',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disabled={!title || !grade || !dueDate || dateError || !classType || !selectedSubjectId}
                                        onClick={nexttabvalue}
                                        sx={{
                                            marginLeft: '20px',
                                            color: 'white',
                                            backgroundColor: '#7983FF',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </TabPanel>
                <TabPanel value="2" sx={{ padding: '0px' }}>
                    <div style={{ padding: '10px 17px' }}>
                        <FormControlLabel
                            value="female"
                            control={
                                <Radio
                                    checked={selectedValue === 'a'}
                                    onChange={handleChangeradiobutton}
                                    value="a"
                                    name="radio-buttons"
                                    inputProps={{ 'aria-label': 'A' }}
                                />
                            }
                            label="Individual Assignment"
                        />
                        <FormControlLabel
                            value="male"
                            control={
                                <Radio
                                    checked={selectedValue === 'b'}
                                    onChange={handleChangeradiobutton}
                                    value="b"
                                    name="radio-buttons"
                                    inputProps={{ 'aria-label': 'B' }}
                                />
                            }
                            label="Group Assignment"
                        />
                    </div>

                    <Divider sx={{ mt: 0.15, mb: 1, bgcolor: (theme) => theme.palette.background.dividerColor }} style={{ height: 2 }} />

                    {selectedValue == 'a' ? (
                        <div>
                            <div className="body" style={{ display: 'flex' }}>
                                <div
                                    className="sidebar"
                                    style={{
                                        width: '30%',
                                        borderStyle: 'solid',
                                        borderColor: '#e3dfdf',
                                        marginLeft: '9px',
                                        borderRadius: '9px'
                                    }}
                                >
                                    <Box sx={{ height: 500, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}>
                                        <Box sx={{ mb: 1 }}>
                                            <Button onClick={handleExpandClick}>
                                                {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
                                            </Button>
                                        </Box>
                                        <TreeView
                                            aria-label="controlled"
                                            defaultCollapseIcon={<ExpandMoreIcon />}
                                            defaultExpandIcon={<ChevronRightIcon />}
                                            expanded={expanded}
                                            selected={selected}
                                            onNodeToggle={handleToggle}
                                            onNodeSelect={handleSelect}
                                            multiSelect
                                        >
                                            <TreeItem nodeId="1" label="All Students">
                                                {students?.map((student, index) => (
                                                    <TreeItem nodeId={student.userId} label={student.nameZh} key={index} />
                                                ))}
                                            </TreeItem>
                                        </TreeView>
                                    </Box>
                                </div>

                                <div
                                    className="flex-container"
                                    style={{
                                        width: '67%',
                                        borderStyle: 'solid',
                                        borderColor: '#e3dfdf',
                                        borderRadius: '9px',
                                        marginLeft: '10px'
                                    }}
                                >
                                    <div>
                                        {listdata.map((oneitem, id) => {
                                            return (
                                                <div key={id} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div>
                                                        <HighlightOffIcon
                                                            sx={{ '&:hover': { color: 'black' } }}
                                                            onClick={() => handleRemoveItem(oneitem)}
                                                        />
                                                    </div>

                                                    <li style={{ listStyleType: 'none', marginLeft: '7px' }}>{oneitem.nameZh}</li>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '59%', marginTop: '10px' }}>
                                <div>
                                    <Button
                                        variant="contained"
                                        className="transform"
                                        style={{ marginLeft: '5%', position: 'absolute', backgroundColor: '#818181' }}
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                </div>

                                <div>
                                    <Button
                                        variant="contained"
                                        className="transform"
                                        style={{ marginLeft: '20%', position: 'absolute', backgroundColor: '#acaded' }}
                                    >
                                        Save As Draft
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        variant="contained"
                                        className="transform"
                                        disabled={
                                            !title ||
                                            !grade ||
                                            !dueDate ||
                                            !classType ||
                                            dateError ||
                                            !selectedSubjectId ||
                                            listdata.length === 0
                                        }
                                        sx={{ marginLeft: '35%', position: 'absolute', backgroundColor: '#7983FF' }}
                                        onClick={assignmentassignClick}
                                    >
                                        Assign
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <div style={{ fontWeight: 'bold', padding: '15px' }}>
                                    <span>Number of Groups </span>
                                    <TextField
                                        value={textInput}
                                        onChange={handleTextInputChange}
                                        placeholder="..."
                                        sx={{ width: '70px', height: '0px', marginTop: '-15px' }}
                                    />
                                </div>

                                <DragDrop groupCount={textInput} students={students} onDropChange={onDropChange} />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '59%', marginTop: '10px' }}>
                                    <div>
                                        <Button
                                            variant="contained"
                                            className="transform"
                                            style={{ marginLeft: '5%', position: 'absolute', backgroundColor: '#818181' }}
                                            onClick={handleClose}
                                        >
                                            Cancel
                                        </Button>
                                    </div>

                                    <div>
                                        <Button
                                            variant="contained"
                                            className="transform"
                                            style={{ marginLeft: '20%', position: 'absolute', backgroundColor: '#acaded' }}
                                        >
                                            Save As Draft
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            variant="contained"
                                            className="transform"
                                            disabled={
                                                !title ||
                                                !grade ||
                                                !dueDate ||
                                                dateError ||
                                                !classType ||
                                                !selectedSubjectId ||
                                                isValidGroup
                                            }
                                            sx={{ marginLeft: '35%', position: 'absolute', backgroundColor: '#7983FF' }}
                                            onClick={assignmentassignClick}
                                        >
                                            Assign
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </TabPanel>
            </TabContext>
        </Dialog>
    );
};

export default AddAssignmentModal;
