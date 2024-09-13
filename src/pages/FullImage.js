import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDocFromCache, getDocFromServer } from "firebase/firestore";
import {db} from "../firebase"
import {useState, useEffect} from "react"
import {Stack, Typography, CssBaseline, Container, Box, Button } from '@mui/material';
import ImgCard from '../components/ImgCard';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import LoadingScreen from '../components/LoadingScreen';
import TelegramLogo from '../static/telegram_icon.svg'
import { useAuth } from '../AuthContext';

export default function FullImage() {
  const {id} = useParams(null);
  const [file, setFile] = useState(null);
  const [alignment, setAlignment] = useState(null);
  const { currentUser } = useAuth()
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    window.scrollTo(0,0)
        async function getFile(){
          const docRef = doc(db, "files", id)
          try{
            var docSnap = await getDocFromCache(docRef)
          } catch {
              docSnap = await getDocFromServer(docRef)
            .catch(err => console.log(err))
          }
          if(docSnap && docSnap.data()){ 
                setFile(docSnap.data())
            }
          }
      getFile();
    
  }, [id, currentUser])


  return (
    <>
        <CssBaseline/>
        <Container maxWidth="sm" disableGutters={true} 
        sx={{mb:'48px',
        position:'relative'
      }}>


{file?

<>

      <Stack 
      sx={{p:1}}
      direction={"row"} 
      flexWrap={'wrap'}
      rowGap={1}
      justifyContent='center'
      >
              {file && file.tags.map((tag, i) => {
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
           
      <ImgCard id={file.id} 
      imgUrl={`https://res.cloudinary.com/dfoaqeavf/image/upload/w_640/v1707496275/${file.imgUrl}.jpg`} 
      title={`${file.title}_${1}`}  
      index={1}
      fileName={file.imgUrl} 
      />
      {file?.imgList &&
      file.imgList.map((item, i) => (
        <ImgCard id={file.id} 
        fileName={item} 
        title={`${file.title}_${i+2}`} 
        imgUrl={`https://res.cloudinary.com/dfoaqeavf/image/upload/w_640/v1707496275/${item}.jpg`} 
        index={i+2}/>
      ))
      }

<Stack justifyContent="center" direction="row">
            <Box sx={{p:2}}>
          <Typography fontSize={'small'}>
        Subscribe telegram chanel for regular updates.
       </Typography>
      </Box>
      <Box sx={{p:2}}>
        <Button component={Link}
           target="_blank" rel="noopener noreferrer"
           to={'https://t.me/aiartgaleria'}
           sx={{color:"text.primary"}}
           variant="outlined"
           >
          <img src={TelegramLogo} style={{margin:'auto', marginRight:'8px'}} width='25' height='25' alt="telegram-logo" />
          Join
        </Button>  
        </Box>  
        </Stack>
      <ToggleButtonGroup
sx={{p:2}}
size="small"
      color="primary"
      variant="filled"
      fullWidth
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Reaction"
    >
      <ToggleButton value="like"  ><FavoriteIcon sx={{mr:1}}/> Like</ToggleButton>
      <ToggleButton value="dislike"><HeartBrokenIcon sx={{mr:1}}/> Dislike</ToggleButton>
      </ToggleButtonGroup>

      <Typography sx={{m:1}} align="center">More Posts</Typography>

<Box align="center" maxWidth="sm" sx={{p:1}}>
<Button fullWidth component={Link} to={'/'} variant="outlined" sx={{color:"text.primary"}}>Home</Button>
</Box>

</>
              :
              <LoadingScreen/>
              }
    </Container>
    </>
  );
}