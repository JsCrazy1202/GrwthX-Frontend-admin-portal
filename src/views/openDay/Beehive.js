import {React, useState} from 'react'

export default function Beehive({imgUrl, playUrl, setPlayModeFlag, setCurrentplayUrl}) {
    const onClickHandle = () => {
        setPlayModeFlag(true);
        setCurrentplayUrl(playUrl)
        console.log("true");
    }

  return (
    <>
        <img src = {imgUrl} className='beehive' onClick={onClickHandle} />
    </>
  )
}
