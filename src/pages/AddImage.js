import React, { useState, useEffect } from 'react';
import { useAuth } from "../AuthContext"
import { 
  collection, 
  addDoc, 
  orderBy,
  startAt, 
  onSnapshot, 
  query, 
  getDocs,
  limit
} from "firebase/firestore"; 
import {db} from "../firebase"
import {Alert,Switch, Box, Autocomplete, TextField, Button,
  FormControlLabel, Typography, Snackbar, Stack } from '@mui/material';
import ImagePreview from '../components/ImagePreview';


const AddImage = () => {

  const [title, setTitle] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [imgList, setImgList] = useState([]);
  const [selectTags, setSelectTags] = useState([]);
  const [nsfw, setNsfw] = useState(false);
  const { currentUser } = useAuth();
  const [tagList, setTagList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [index, setIndex] = useState();

  const [alertVisibility, setAlertVisibility] = useState(false);
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
 
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
      },[keyword])
//--end-load-tag--

function nsfwToggle(){
  setNsfw(!nsfw);
}

function handleSelectChange(event, newvalue){
  setSelectTags(newvalue);
  console.log(newvalue)
  };

async function handleSubmit(e){
  e.preventDefault()
    if(imgUrl && (currentUser.uid==='GrnGWyuqqDOqdgEhkDwpTut45fL2') && title && (selectTags.length !==0)){

      const q = query(collection(db, "files"),
      orderBy('uploadedOn', 'desc'), limit(1));
     await getDocs(q).then((querySnapshot)=>{
      querySnapshot.docs.map((doc=>{
        setIndex(Number(doc.data().url.split('-').at(-1)) +1)
        return null;
      }))
    
      const url = title.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() +'-' +index;

      console.log(url)

      async function uploadFile(){
        await addDoc(collection(db, "files"), {
          title: title,
          tags: selectTags,
          uploadedOn: new Date(),
          imgUrl: imgUrl,
          imgList:imgList,
          nsfw: nsfw,
          views: 0,
          trend: 0,
          oldViews:0,
          downloads: 0,
          url: url
        })
      .then(()=>{  
          console.log("Document written");
          setAlertVisibility(true)
          setMessage("File uploaded")
      })
      .catch((e) =>{
        setAlertVisibility(true)
        console.log(e)
        setError("Failed to uploaded")
      })
      }
      uploadFile()
    }
      )

  }
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

        <Stack direction={'row'} justifyContent={'center'} justifyItems={'center'}>
     
        <ImagePreview 
        imgUrl={imgUrl} 
        setImgUrl = {setImgUrl} 
        title={title} 
        imgList={imgList} 
        setImgList={setImgList}
        selectTags={selectTags} />     
      
  <Box sx={{ py:3, pr:6, mr:6, width:512 }}>
         <form > 
         <Typography component="h2" variant="h5" align="center">
            Upload File
          </Typography>

                    <TextField id="outlined-basic" 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                      fullWidth
                      label="Title" 
                      variant="outlined" />
              
              
         
          <FormControlLabel sx={{ pt: 1, pb:1 }} control={<Switch />} onChange={nsfwToggle} label="NSFW" />

          <Autocomplete
              multiple
              disablePortal
              fullWidth
              onChange={handleSelectChange}
              id="combo-box-demo"
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
          sx={{ mt: 3, mb: 2 }}
          variant="contained">
              Submit
            </Button>
         
      </form>
      </Box>
  </Stack>
</>
  )
};

export default AddImage;
