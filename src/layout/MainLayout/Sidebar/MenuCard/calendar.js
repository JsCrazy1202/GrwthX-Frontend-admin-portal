import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import * as actionTypes from '../../../../store/actions';
import { useDispatch } from 'react-redux';

export default function Calendarview() {
    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date());
    const monthArray = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const month = monthArray[value.getMonth()];

    const onChangeDate = (date) => {
        onChange(date)
        dispatch({type:actionTypes.SET_CALENDAR_DATE_DATA, payload:date})
    }

    return (
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
            {/* {'<' + month + '>'} */}
            <Calendar onChange={onChangeDate} value={value} />
        </div>
    );
}
