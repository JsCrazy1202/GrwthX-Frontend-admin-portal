import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const BasicSelect = ({ defaultValue, items }) => {
    const [age, setAge] = useState('');
    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 130 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{defaultValue}</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={age} label={defaultValue} onChange={handleChange}>
                    {items.map((oneitem) => (
                        <MenuItem value={oneitem.value} key={oneitem.key}>
                            {oneitem.key}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default BasicSelect;
