import React, { useState, useEffect } from 'react';

import axios from 'axios';
import './index.css';
import { styled } from '@mui/material/styles';
import beehiveData from './beehiveData';
import Beehive from './Beehive';

const PreviewIframe = styled('iframe')(() => ({
    border: 'none',
    height: '100vh',
    width: '100%',
    margin: '0'
}));


const OpenDay = () => {
    const [playModeFlag, setPlayModeFlag] = useState(false);
    const [currentPlayUrl, setCurrentplayUrl] = useState('');
    
    useEffect(()=>{
        console.log(playModeFlag, currentPlayUrl)
    },[playModeFlag, currentPlayUrl])
    return (
        <>
        {
            playModeFlag?
            (
                <PreviewIframe src={currentPlayUrl} same-origin-allow />
            )
            :(
                <div className="hero-image">
                    <div className="hero-text">
                        <div className='hero-content'>
                            <img src="../images/big1.png" />
                            <div className='hero-beehives'>
                                {
                                    beehiveData.map((beehive, key)=>
                                        <Beehive key = {key} imgUrl = {beehive.imgUrl} playUrl = {beehive.playUrl} setPlayModeFlag = {setPlayModeFlag} setCurrentplayUrl = {setCurrentplayUrl} />
                                    )
                                }
                            </div>
                            <img src="../images/big2.png" />
                        </div>
                        <p>四十周年校慶 「愛禮信羊羊造型設計計劃」</p>
                        <p>
                            聖經常把耶穌比喻為牧羊人，而我們是衪深愛的羊。 神又給予每個人有
                            不同的特質及能力 , 司以榮耀衪。 我們希望通過是項計劃 ，瀼學生一起
                            採索 、發現及發揮自己的漏質 ‧ 在主裏共同成長 。 是次計劃包括學生和
                            教師的創作 ‧ 也有小學創作比賽 ， 向共有450隼羊羊製成品 。
                        </p>
                        <p>
                            是炙展覽以元宇宙形式深行，一共屐出兩隻大羊及53隻小羊，學生的剷
                            作内容圖纏著不口旳主顧 ‧ 包括迪求夢想 、 追求進步 、 關愛他人 、真情
                            流霖、感恩善良、愛護大自然等。當你欣賞作品時，不妨閱讀每隻小羊 
                            的閻介 ，以了解每位學生萄後的構思及其獨特性 
                        </p>
                    </div>
                    <div className='hero-footer'>
                        <img src="../images/mark.png" />
                        <img src="../images/school.png" />
                    </div>
                </div>
            )
        }
        </>
    )
}


export default OpenDay;