import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// thirty party login page
const Login = () => {
    console.log(process.env.NODE_ENV);
    useEffect(() => {        
        if (process.env.NODE_ENV === 'development') {
            window.location.href =
                'https://uatgrwth.app360.cn/grwth-as/oauth/authorize?client_id=grwth_x&redirect_uri=http://localhost:8081/sso-demo-client/callback&response_type=code&state=aWhT2X';
        } else {
            window.location.href =
                'https://uatgrwth.app360.cn/grwth-as/oauth/authorize?client_id=grwth_x&redirect_uri=https://grwthx.grwth.hk/sso-demo-client/callback&response_type=code&state=aWhT2X';
        }
    }, [process.env.NODE_ENV]);

    return <div></div>;
};

export default Login;
