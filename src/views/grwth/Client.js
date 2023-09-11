import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import './index.css';
import { useRoutes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
// routes
import MainRoutes from '../../routes/MainRoutes';
import { AUTHORISATION_TOKEN_STORAGE_KEY, AUTHORISATION_USER_ID_STORAGE_KEY, AUTHORISATION_USER_NAME_STORAGE_KEY } from 'utils/constants';
import { useGetAccessTokenQuery, useGetUserDataMutation } from 'store/slices/apiSlice';

const Client = () => {
    const [cookies] = useCookies();
    const [queryParameters] = useSearchParams();
    const [code] = useState(queryParameters.get('code')); //get code value from thirty party api
    const [isLoaded, setIsLoaded] = useState(false);
    console.log(window.location.href, '=========== client =========');
    const { data: tokenData, isLoading: getTokenLoading } = useGetAccessTokenQuery({ code });
    const [getuserData, response] = useGetUserDataMutation();
    
    useEffect(() => {
        if (tokenData) {
            getuserData({accessToken: tokenData.access_token });
        } else {
            getuserData({ accessToken: cookies[AUTHORISATION_TOKEN_STORAGE_KEY] });
        } 
    }, [tokenData]);

    useEffect(() => {      
        if (response?.data) {
            setIsLoaded(true);
        }
    }, [response]);

    //Loading page
    return isLoaded ? (
        useRoutes([MainRoutes])
    ) : (
        <div className="center">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
        </div>
    );
    // return useRoutes([MainRoutes]);
};

export default Client;
