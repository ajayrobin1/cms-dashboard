import React, { useState, useEffect } from "react"
import { useAuth } from "../AuthContext"
import {collection, orderBy, limit, query, onSnapshot, doc, deleteDoc, getDoc } from "firebase/firestore";
import {db} from "../firebase"
import { Button, Modal, Box, Typography, Alert, CssBaseline, TextField, Snackbar } from "@mui/material";
import LoadingScreen from '../components/LoadingScreen'
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const columns = [
    { field: 'imgUrl', headerName: 'Preview', width: 130, sortable: false, 
    renderCell: (params)=>{
        return (
          <Link to={`/gallery/${params.row.id}`} target="_blank">
            <img src={`${params.row.imgUrl}.webp`} alt={params.row.title} />
          </Link>
        )} 
    },
    { field: 'views', headerName: 'Views', width:100 },

    {
      field: 'uploadedOn',
      headerName: 'Uploaded On',
      width: 100,
      renderCell: (params)=>{
        var date = params.row.uploadedOn.toDate().toDateString()
        
        return (
          <div>
            {date}
          </div>
        )} 
    },
    { field: 'id', headerName: 'ID', width:100, sortable: false, 

    renderCell: (params)=>{
      return(
        <Button
        onClick={() => {
          navigator.clipboard.writeText(params.row.id)
          alert("Copied to clipboard")
        }
        }
        >
          ID
        </Button>
      )
    }
     },
    { field: 'trend', headerName: 'Trending', width:100 },
    { field: 'url',sortable: false, headerName: 'Title', width: 100,

    renderCell: (params)=>{
      const url = `https://sexyaigirls.fun/gallery/${params.row.url}`
      function sendTelegramMessage(){        
        fetch(`https://api.telegram.org/bot7363791132:AAHFBnvu3GgwbN5wGlVs9LWPDXd2KAj37TY/sendphoto?chat_id=@aiartgaleria&photo=${params.row.imgUrl.replace('w_120', 'w_480')}&has_spoiler=${params.row.nsfw}&caption=${url}`,
        {
          method: "POST"
        })
        alert("Telegram message sent")
      }
      
      return(
        <>
        <Button
        onClick={() => {
          navigator.clipboard.writeText(url)
          console.log(url)
          alert("Copied to clipboard")
        }
      }
      >
          Link
        </Button>
        <Button sx={{mt:2}}
        onClick={sendTelegramMessage}
        >
          Telegram
        </Button>
          </>
      )
    }

     },
    { headerName: 'Action', sortable: false, width:200,  renderCell: (params)=>{
      return(
        <div>
              <Button
                color="secondary" 
                component={Link}
                to={`/edit/${params.row.id}`}
                target="_blank"
                size="small">
                  Edit
                </Button>
                <Button
                sx={{mt:2}}
                color="error" 
                size="small"
                onClick={(e)=> {
                  params.row.setDeleteId(params.row.id);
                  params.row.setOpenDelete(true)}}
                  >
                Delete
                </Button>
        </div>
      )
    } }
  ];

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


const Dashboard = () => {
  const [sortModel, setSortModel] = useState([
    {
      field: 'uploadedOn',
      sort: 'desc',
    },
  ]);

  const [paginationModel, setPaginationModel] = useState(
  { page: 0, pageSize: 10 }
)
  const [openDelete, setOpenDelete] = useState(false);
  const [message, setMessage] = useState("")
  const [deleteId, setDeleteId] = useState("")
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("")

  const [fileId, setFileId] = useState(null)

  const [loading, setLoading] = useState(false);
  const [alertVisibility, setAlertVisibility] = useState(false);
  
  const { currentUser } = useAuth()
  const handleOpenDelete = () => setOpenDelete(true)
  const handleCloseDelete = () => {
    setError("")
    setOpenDelete(false);
  }

  async function handleDelete(event) {
    setLoading(true)
    handleOpenDelete()

    if (currentUser.uid === 'GrnGWyuqqDOqdgEhkDwpTut45fL2'){
      await deleteDoc(doc(db, "files", deleteId))

    .then(()=>{
        setMessage("File deleted")
        setLoading(false);
        setDeleteId(null)
        handleCloseDelete();
    }
    )
    .catch(()=>{
      console.error();
      setLoading(false);
      handleCloseDelete();
      setAlertVisibility(true)
      setError("Failed to Delete file");
      setDeleteId(null)
    })
  
} else {
  // handleCloseDelete();
  setLoading(false);
  setAlertVisibility(true)
  setError("Permission Denied")
  }
};



    useEffect(  () => { 
        async function getFile(){
        const docRef = doc(db, "files", fileId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const file = {
            imgUrl: `https://res.cloudinary.com/dfoaqeavf/image/upload/w_120/v1707496275/${docSnap.data().imgUrl}`,
            uploadedOn: docSnap.data().uploadedOn,
            views: Number(docSnap.data().views),
            url: docSnap.data().url,
            id: docSnap.id,
            nsfw: doc.data().nsfw,
            trend:doc.data().views - doc.data().oldViews,
            setDeleteId: setDeleteId,
            setOpenDelete:setOpenDelete
          }
          setRows([])
          setRows(oldArray => [...oldArray, file])
          setLoading(false)

        } else {
          console.log("No such document!");
        }
      }
      if(fileId) {
        getFile()
      } else {
       if(sortModel.length !== 0 && paginationModel){
         const q = query(collection(db, "files"),
         orderBy(sortModel[0]?.field, sortModel[0]?.sort), 
         limit(paginationModel.pageSize));
         onSnapshot(q, (querySnapshot)  => {
           setLoading(true)
           const newArray = querySnapshot.docs.map(doc =>({
             id: doc.id,
            nsfw: doc.data().nsfw,
             url: doc.data().url,
             imgUrl: `https://res.cloudinary.com/dfoaqeavf/image/upload/w_120/v1707496275/${doc.data().imgUrl}`,
             views: doc.data().views,
             uploadedOn: doc.data().uploadedOn,
             trend:doc.data().views - doc.data().oldViews,
            setDeleteId: setDeleteId,
            setOpenDelete:setOpenDelete
          }))
          setRows([])
          setRows(oldArray => [...oldArray, ...newArray])
          setLoading(false)
        })
      } 
    }
  },[fileId,sortModel, paginationModel])
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

    <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography sx={{py:1}} id="modal-modal-title">
            Are you sure? want to delete this file?
          </Typography>
          <Box sx={{py:1}}>
            <Button variant="outlined" disabled={loading} onClick={handleDelete}>Yes</Button>
            <Button color="error"  onClick={handleCloseDelete} >No</Button>
          </Box>

        </Box>
      </Modal>
{loading 
    ?<LoadingScreen/>
    :<Box sx={{m:1}}>
      <CssBaseline/>
      <TextField fullWidth placeholder="Search file ID"
      
      onChange={(e)=> 
        {setFileId(e.target.value)
        console.log(fileId)
        }}
      
      />

<DataGrid
getRowHeight={() => 'auto'} 
        rows={rows}
        columns={columns}
        sortModel={sortModel}
        onSortModelChange={(newSortModel) => setSortModel(newSortModel)}

        initialState={{
          pagination: {
            paginationModel: paginationModel,
          },
        }}
        pageSizeOptions={[10, 20, 30]}
        onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
      />

    </Box>
}
   </>
  );
};
export default Dashboard;