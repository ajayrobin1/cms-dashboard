import React, { useState } from 'react';
import { Box, useTheme} from '@mui/material';
import { useMediaQuery } from '@material-ui/core'
import { Skeleton } from '@mui/material';

const ImgCard = (props) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'), {noSsr:true})
  const [imgsLoaded, setImgsLoaded] = useState(false)

  const loadImage = src => {
    return new Promise((resolve, reject) => {
      const image =  new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(src);
      image.src = src
    }) 
  }

  async function checkStatus(){
    await Promise.all([loadImage(props.imgUrl)])
  .then(() => {
    setImgsLoaded(true)
  })
  .catch((err) => console.log("Error", err)) 
}
checkStatus();
  

  return (
      <>
            <Box 
            sx={{
              width:matchDownMd?'100vw':'360px',
              maxHeight:'100%',
              bgcolor: 'background.paper !important',
              mx:matchDownMd?0:'auto',
            minHeight: 360
            }}>
            {imgsLoaded?
            (<img
            id={props.id}
            src={props.imgUrl}
            alt={props.title}
            style={{
              width:'100%', 
              height:'100%',
              // margin:0,
              overFlow:'hidden',
              pointerEvents:'none !important',
              }}   
          />) :(
          <Skeleton
            animation="wave"
            variant = "rectangular"
            sx={{
              width:'100%', 
              height:'100%'
          }}/>
         ) }

      </Box>
      </>
  );

};

export default ImgCard;
