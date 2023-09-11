import { useState, React } from 'react';
import axios from 'axios';
import './index.css';
import { styled } from '@mui/material/styles';

const PreviewIframe = styled('iframe')(() => ({
    border: 'none',
    height: '100vh',
    width: '100%',
    margin: '0'
}));


const VrPasscode = () => {
    const [inputValues, setInputValues] = useState(['','','','']);
    const [verifyStatus, setVerifyStatus] = useState(false);
    const [vrRoomUrl, setVrRoomUrl] = useState('');
    const [error, setError] = useState(false);

    const handleClick = (value) => {
        if (value === "Done") {
            if (inputValues.join("").split("").length == 4) {
                const valueArray = inputValues.join("");
                const vrPasscodeVerifyUrl = `https://grwthx.grwth.hk/api/vr?passcode=${valueArray}`;
                axios.get(vrPasscodeVerifyUrl)
                    .then(response =>{
                        console.log(response.data);
                        if(response.data.verified){
                            setVerifyStatus(true);
                            setVrRoomUrl(response.data.url);
                        }else{
                            setError(true);
                        }
                    })
                    .catch(error =>{
                        console.log(error);
                        setError(true);
                    })
            }else{
                setError(true);
            }
        }else if(value === "Delete"){
            setError(false);
            let valueArray = inputValues.join("").split("");
            valueArray.pop();
            setInputValues([...valueArray]);
        }else{
            setError(false);
            let valueArray = inputValues.join("").split("");
            if (valueArray.length < 4) {
                setInputValues([...valueArray, value])
            }
        }
    };
    
    const inputOnChange = (e, key) =>{
        setError(false);
        let [...valueArray] = inputValues;
        valueArray[key] = e.target.value;
        setInputValues([...valueArray]);
        if (e.nativeEvent.inputType === "deleteContentBackward") {
            handleKeyBackspace();
        }else{
            handleKeyDown();
        }
    }

    const handleKeyDown = () => {
        const inputs = document.getElementsByClassName("otp-input");
        const currentInput = document.activeElement;
        const currentIndex = Array.from(inputs).indexOf(currentInput);
        const nextIndex = currentIndex + 1;
        if (nextIndex < inputs.length) {
            // setLastFocusedInput(inputs[nextIndex]);
            // console.log(inputs[nextIndex], "========= key down =========")
            inputs[nextIndex].focus();
        }
    }
    const handleKeyBackspace = () => {
        const inputs = document.getElementsByClassName("otp-input");
        const currentInput = document.activeElement;
        const currentIndex = Array.from(inputs).indexOf(currentInput);
        const nextIndex = currentIndex - 1;
        if (nextIndex >= 0) {
            inputs[nextIndex].focus();
        }
    }

    if (verifyStatus) {
        return (
            <PreviewIframe src={vrRoomUrl} />
        )
    }else{
        return (
            <div className="container">
                <h1>Enter the Passcode</h1>
                <div className="otp-group">
                    <input key='0' type="text" inputMode="numeric" pattern="\d{1}" maxLength={1} className="otp-input" value={inputValues[0] || ''}  onChange={(e) => inputOnChange(e, 0)} tabIndex={1}/>
                    <input key='1' type="text" inputMode="numeric" pattern="\d{1}" maxLength={1} className="otp-input" value={inputValues[1] || ''}  onChange={(e) => inputOnChange(e, 1)} tabIndex={2}/>
                    <input key='2' type="text" inputMode="numeric" pattern="\d{1}" maxLength={1} className="otp-input" value={inputValues[2] || ''}  onChange={(e) => inputOnChange(e, 2)} tabIndex={3}/>
                    <input key='3' type="text" inputMode="numeric" pattern="\d{1}" maxLength={1} className="otp-input" value={inputValues[3] || ""}  onChange={(e) => inputOnChange(e, 3)} tabIndex={4}/>
                </div>
                {error && <h4>Please input valid Passcode.</h4>}
                <div id="calculator">
                    <div className="keys">
                        <span onClick={(e)=>handleClick("7")} className='key--span__border__common'>7</span>
                        <span onClick={(e)=>handleClick("8")} className='key--span__border__common'>8</span>
                        <span onClick={(e)=>handleClick("9")} className='key--span__border__bottom'>9</span>
                        <span onClick={(e)=>handleClick("4")} className='key--span__border__common'>4</span>
                        <span onClick={(e)=>handleClick("5")} className='key--span__border__common'>5</span>
                        <span onClick={(e)=>handleClick("6")} className='key--span__border__bottom'>6</span>
                        <span onClick={(e)=>handleClick("1")} className='key--span__border__common'>1</span>
                        <span onClick={(e)=>handleClick("2")} className='key--span__border__common'>2</span>
                        <span onClick={(e)=>handleClick("3")} className='key--span__border__bottom'>3</span>
                        <span onClick={(e)=>handleClick("Delete")} >Delete</span>
                        <span onClick={(e)=>handleClick("0")} className='key--span__border__right key--span__border__left'>0</span>
                        <span onClick={(e)=>handleClick("Done")} >Done</span>
                    </div>
                </div>
            </div>
        )
    }
}


export default VrPasscode;