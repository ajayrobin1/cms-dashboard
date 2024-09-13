import { Link } from 'react-router-dom';
import { Box, Stack, Typography, Container } from '@mui/material';
import UploadCard from './UploadCard';


const ImagePreview = (props) => {


  return (
    <>
<div class="smartphone" >
    <Container class="screen" disableGutters>
      <Box
      class="content"
      sx={{overflowY:'hidden'}}
      >
    <Stack 
      direction={"row"} 
      flexWrap={'wrap'}
      rowGap={1}
      justifyContent='center'
      >
              {props.selectTags && props.selectTags.map((tag, i) => {
                return(
                  <Typography
                  key={i}
                  color="text.secondary"
                  align='center'
                  size='small'
                  sx={{
                    mx:1
                  }}
                  clickable="true"
                  component={Link}
                  to={`../explore/${tag.name}`}
                  >
                    {`#${tag.name}`}
                  </Typography>
                
                )
              })}
              </Stack>

              <UploadCard 

              isList={false} 
              setImgUrl={props.setImgUrl}
              replace={props.imgUrl?true:false}
              imgUrl = {`https://res.cloudinary.com/dfoaqeavf/image/upload/w_720/v1707908274/${props.imgUrl}.jpg`}/>
              
              { (props.imgList) && ( props.imgList.length !== 0) &&
                props.imgList.map((item , index)=>(
                  <UploadCard 
                  isList={true}
                  replace={true}
                  index={index} 
                  imgList={props.imgList}
                  setImgList = {props.setImgList} 
                  imgUrl = {`https://res.cloudinary.com/dfoaqeavf/image/upload/w_720/v1707908274/${item}.jpg`}/>
                ))
              }

              {props.imgUrl &&
              <UploadCard isList={true}
              replace={false}
                imgUrl={props.imgList} setImgList = {props.setImgList}/>
              }
  </Box>
    </Container>
</div>
</>
  )
};

export default ImagePreview;
