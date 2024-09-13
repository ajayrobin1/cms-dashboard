import React, { useState, useEffect } from "react"
import { 
  collection, 
  getCountFromServer, 
  onSnapshot,
  limit,
  where, 
  addDoc, 
  query
  } from "firebase/firestore"; 
import { doc, deleteDoc } from "firebase/firestore";
import {db} from "../firebase"
import {Switch, Alert, Snackbar, Box, List, ListItemText, ListItem,Modal,FormControl, TextField, Button, FormControlLabel, Typography, IconButton, Stack   } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon'
import TagIcon from '@mui/icons-material/Tag';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from "../AuthContext";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  align: 'center'
};


const ManageTags = () => {
  const [loading, setLoading] = useState(false);
  const [tagName, setTagName] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [isNSFW, setIsNsfw] = useState(false);
  const { currentUser } = useAuth();
  const [isFeatured, setIsFeatured] = useState(false);
  const [idTodelete, setIdToDelete] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [alertVisibility, setAlertVisibility] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  }
 
  async function handleDelete(event) {
    setLoading(true)
    console.log(idTodelete);
    await deleteDoc(doc(db, "tags", idTodelete))
    .then(()=>{
        setMessage("Tag deleted")
        setAlertVisibility(true)
        setIdToDelete(null)
        handleCloseDelete();
        setLoading(false)
    }
    )
    .catch(()=>{
      console.error();
      setError("Failed to Delete file");
      setAlertVisibility(true)
      setIdToDelete(null)
      setLoading(false);
      handleCloseDelete();
    })
}

  useEffect(  () => { 
    setLoading(true)
    if(keyword){
    const q = query(collection(db, "tags")
    ,where('name', '>=', keyword.toLowerCase())
    ,limit(4)
    );
    onSnapshot(q, (querySnapshot)  => {
      setTagList(querySnapshot.docs.map(doc =>({
        id: doc.id,
        name: doc.data().name
      })))
        })
        setLoading(false)
      }
      },[keyword])

function nsfwToggle(){
    setIsNsfw(!isNSFW);
  }
  function featuredToggle(){
    setIsFeatured(!isFeatured);
  }

  async function handleTagUpload(e){
    if((currentUser.uid==='GrnGWyuqqDOqdgEhkDwpTut45fL2')){

      setLoading(true)
      try {
        const q =query(collection(db, "tags"), where("name", "==", tagName));
        const snapshot = await getCountFromServer(q);
        if(snapshot.data().count === 0) {
          console.log('count: ', snapshot.data().count);
          const docRef =await addDoc(collection(db, "tags"), {
            name: tagName,
          isNSFW: isNSFW,
          isFeatured: false
        });
        setAlertVisibility(true)
        setMessage("uploaded");
        setLoading(false)
        console.log("Document written with ID: ", docRef.id)
      } else {
        setLoading(false)
        setAlertVisibility(true)
        setError("Already exists");
        // throw new Error("Already exists")
      }
    
  } catch (e) {
    setLoading(false)
    setAlertVisibility(true)
    setError("Error adding document:", e);
  };
  }
  }

  return (
    <>
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography sx={{py:1}} id="modal-modal-title">
            Are you sure? want to delete?
          </Typography>
          <Box sx={{py:1}}>
            <Button variant="outlined" disabled={loading} onClick={handleDelete}>Yes</Button>
            <Button color="error"  onClick={handleCloseDelete} >No</Button>
          </Box>
        </Box>
      </Modal>


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

<Stack direction={'row'}> 
<Box sx={{ p:3, minWidth:400 }}>
          <Typography variant="h6" component="h2" align="center">
            Available tags
          </Typography>
          <TextField
          fullWidth
          onChange={(e) => setKeyword(e.target.value)} 
          label="Search">
          </TextField>
            <List>
            {tagList.map((item) => (   
              <ListItem>
                <ListItemIcon>
                    <TagIcon />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  />
                <IconButton id={item.id} onClick={(e) => {
                setIdToDelete(item.id);
                console.log(item.id)
                setOpenDelete(true)
                
                }} edge="end" aria-label="delete">
                    <DeleteIcon/>
                  </IconButton>
              </ListItem>
            ))}
            </List>
</Box>
         <Box sx={{ p:3, minWidth:400 }}>
         <Typography variant="h6" component="h2" align="center">
            Manage Tags
          </Typography>
         <form >
          <FormControl fullWidth >
          <TextField
          onChange={(e) => setTagName(e.target.value)} 
          label="Tags">
          </TextField>
        </FormControl>

        <FormControlLabel sx={{ pt: 1, pb:1 }} control={<Switch />} onChange={nsfwToggle} label="NSFW" />

        <FormControlLabel sx={{ pt: 1, pb:1 }} control={<Switch />} onChange={featuredToggle} label="Featured" />

          <Button component="label" 
          fullWidth 

          onClick={handleTagUpload}
          sx={{ mt: 3, mb: 2 }}
          variant="contained">
              Upload
            </Button>
        </form>
      </Box>
</Stack>
      
</>
  )
};

export default ManageTags;