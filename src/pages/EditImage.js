import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../AuthContext"
import { 
  query, 
  orderBy,
  startAt,
  doc,
  collection,
  // limit,
  updateDoc, 
  onSnapshot,
} from "firebase/firestore"; 
import {db} from "../firebase"

import {Alert, Snackbar,Switch, Box, Autocomplete, 
  Container ,CssBaseline, TextField, Button,
  FormControlLabel, Typography, Stack } from '@mui/material';
import ImagePreview from '../components/ImagePreview';


const EditImage = (props) => {
  //Load tags
  const [title, setTitle] = useState(null);
  const [imgUrl, setImgUrl] = useState();
  const [imgList, setImgList] = useState([]);
  const [selectTags, setSelectTags] = useState([]);
  const [nsfw, setNsfw] = useState(false);
  const { currentUser } = useAuth();
  const [tagList, setTagList] = useState([]);
  const { id } = useParams();
  const [keyword, setKeyword] = useState('');

  const navigate = useNavigate();

  useEffect(  () => { 
    const q = query(collection(db, "tags")
    ,orderBy("name")
    ,startAt(keyword)
    ,startAt(keyword.toUpperCase())
    // ,limit(4)
    );
    onSnapshot(q, (querySnapshot)  => {
      setTagList(querySnapshot.docs.map(doc =>({
        id: doc.id,
        name: doc.data().name
      })))
        })
        // console.log(tagList)
      },[keyword])


  useEffect(  () => { 
    onSnapshot(doc(db, "files", id), (doc) => {
      console.log(doc.data())
      if(doc.data()){
        setTitle(doc.data().title)
        setNsfw(doc.data().nsfw)
        setImgUrl(doc.data().imgUrl)
        setImgList(doc.data().imgList)
        setSelectTags(doc.data().tags)
      } else {
        console.log("File not found")
      }
  });
      },[id])

  const [alertVisibility, setAlertVisibility] = useState(false);
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

function nsfwToggle(){
  setNsfw(!nsfw);
}

function handleSelectChange(event, newvalue){
  setSelectTags(newvalue);
  console.log(newvalue)
  };

async function handleSubmit(e){
    e.preventDefault()
    if(imgUrl && (currentUser.uid==='GrnGWyuqqDOqdgEhkDwpTut45fL2')){
    try {
      const docRef =await updateDoc(doc(db, 'files', id), {
        title: title,
        tags: selectTags,
        updatedOn: new Date(),
        imgUrl: imgUrl,
        imgList:imgList,
        nsfw: nsfw
      });  
      console.log("Document updated with ID: ", docRef.id);
      setAlertVisibility(true)
      setMessage("File updated")
    } catch (e) {
      console.error("Error adding document: ", e);
      navigate('/')
      setAlertVisibility(true)
      setError("Failed to uploaded")
    }
  }
    setTitle('');
    setImgUrl('');
    setImgList([]);
    setTitle('');
    setTagList([]);
    setKeyword('')
    setSelectTags([]);
};

  return (
    <>
    {error &&
          <Snackbar
          open={alertVisibility}
          autoHideDuration={6000}
          >
          <Alert severity="error"
          onClose={() => setAlertVisibility(false)}
          sx={{ width: '100%' }}

          >{error}</Alert>
            </Snackbar>
      } 

        {message &&
          <Snackbar
          open={alertVisibility}
          autoHideDuration={6000}
          >
            <Alert
              onClose={() => setAlertVisibility(false)}
              severity="success" 
              sx={{ width: '100%' }}
              >{message}
            </Alert>
          </Snackbar>
        }
        <Stack direction={'row'} justifyContent={'center'}>
          <ImagePreview imgUrl={imgUrl} setImgList={setImgList} title={title} imgList={imgList} selectTags={selectTags} />
      <Container component="main" sx={{pt:2}} maxWidth="sm">

      <Typography component="h2" variant="h5" align="center">
            Upload File
          </Typography>
        <CssBaseline />

  <Box sx={{ px:3 }}>
         <form onSubmit={handleSubmit} > 
                    <TextField 
                    id="outlined-basic" 
                    onChange={(e) => setTitle(e.target.value)}
                    value={title} 
                    required 
                    fullWidth 
                    variant="outlined" />
         
          <FormControlLabel sx={{ pt: 1, pb:1 }} control={<Switch />} checked={nsfw} onChange={nsfwToggle} label="NSFW" />

          <Autocomplete
              multiple
              disablePortal
              fullWidth
              onChange={handleSelectChange}
              id="combo-box-demo"
              value={selectTags}
              options={tagList? tagList :[]}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField 
                fullWidth 
                onChange={(e)=>setKeyword(e.target.value)}  
              {...params} label="Tags" />}
            />

          <Button component="label" 
          fullWidth 
          onClick={handleSubmit}
          type="submit" 
          sx={{ mt: 3, mb: 2 }}
          variant="contained">
              Update
            </Button>
         
      </form>
      </Box>
    </Container>
    </Stack>
</>
  )
};

export default EditImage;
