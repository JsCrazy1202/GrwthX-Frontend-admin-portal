import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

const AccessToken = () => {
    const location = useLocation();
    const [queryParameters] = useSearchParams();

    useEffect(() => {}, []);

    return <div>AccessToken</div>;
};

export default AccessToken;
