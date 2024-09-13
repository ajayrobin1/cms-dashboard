import { useEffect, useState } from 'react';
import {IconButton, Box, Stack, Skeleton } from '@mui/material';
import styled from 'styled-components'
import Axios from "axios";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowDownwardRounded from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded';
import RemoveCircleRounded from '@mui/icons-material/RemoveCircleRounded';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function UploadCard(props){
    const [imgsLoaded, setImgsLoaded] = useState(false)
  
    async function handleFileSubmit(e){
      e.preventDefault()
      const file = e.target.files[0]
         if (!file) return;
         const formData = new FormData ();
         formData.append("file", file);
         formData.append("upload_preset", "art-gallery");
         Axios.post(
          "https://api.cloudinary.com/v1_1/dfoaqeavf/image/upload",
          formData
        )
         .then((response) => {
           console.log(response);
           if(props.isList && props.replace){
              const imgList = [...props.imgList];
              imgList[props.index] = response.data.public_id;
              props.setImgList(imgList);
            }
          else if(props.isList && (!props.replace)){
            props.setImgList(oldList=> [...oldList, response.data.public_id ])
          } else {
             props.setImgUrl(response.data.public_id);
           }
  
         })
         .catch((error) => {
           console.log(error);
         });
  };
  
  
    const loadImage = src => {
        return new Promise((resolve, reject) => {
          const image =  new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(src);
          image.src = src
        }) 
      }
  
  
      useEffect(() =>{
        async function checkStatus(){
          await Promise.all([loadImage(props.imgUrl)])
        .then(() => setImgsLoaded(true))
        .catch((err) => setImgsLoaded(false)) 
      }
      if(props.imgUrl !== '') checkStatus();
  
      },[props])
  
    return(
      <>
  
        <Box   
        sx={{
          overflowY:'auto',
        position:'relative',  
        boxSizing:'border-box',
        cursor:'pointer',
        width: 280
        }}>
        {(imgsLoaded)?
        <>
        <img
        src={props.imgUrl}
        alt={props.title}
        title="click to upload image"
        style={{
          width:280, 
          height:'auto',
          margin:0,
          overFlow:'hidden',
        }}   
        />
         
        {props.isList && (props.imgList?.length !==0) &&
      <Stack
      direction="row"
      justifyContent='space-evenly'
      sx={{position: 'absolute', 
      width:'100%',
      bottom: '10%',
      left:0
      }}>
    {/* Up arrow Button */}
  
  
  
      <IconButton 
      value={props.index} 
      disabled={props.index===0?true:false}>
  
        <ArrowUpwardRounded/>
      </IconButton>
  
    {/* Remove Button */}
  
      <IconButton
      onClick={()=>{
        props.setImgList(props.imgList.filter((item,i)=>(i !== props.index)))
      }}>
        <RemoveCircleRounded />
      </IconButton>
  
    {/* Down arrow Button */}
  
      <IconButton 
      value={props.index} 
      disabled={props.index===(props.isList?.length-1)?true:false}>
        <ArrowDownwardRounded/>
      </IconButton>
      </Stack>
      }
        </>
        :
      <>
  <Skeleton component="label" sx={{width:280, height:450}} variant='rectangle'/>
  
      </>
      }  
        <IconButton
              sx={{
               position:'absolute',
              left: '40%',
              bottom: '50%',
              width:50
              }} 
              size='large'
              component="label"
              variant="contained" 
            >
              <CloudUploadIcon 
              />    
              <VisuallyHiddenInput type="file" required onChange={handleFileSubmit} />        
    </IconButton>
    <VisuallyHiddenInput type="file" required onChange={handleFileSubmit} />
  </Box>
  
  </>
    )
  }