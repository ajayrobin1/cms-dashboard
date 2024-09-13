import * as React from 'react';
import {Toolbar, Box ,CssBaseline, Button, Typography, SwipeableDrawer } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from "../AuthContext"
import LogoutModal from './LogoutModal';
import { useState } from "react";
import CustomDialog from './CustomDialog';

function ResponsiveAppBar(props) {

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { currentUser } = useAuth()
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <>
    <CssBaseline/>
    <LogoutModal open={open} handleClose={handleClose} />

    <CustomDialog open={openDialog} handleClose={handleCloseDialog}
    setSafetyMode={props.setSafetyMode}
    setMode={props.setMode} />

    <SwipeableDrawer
            anchor={'left'}
            variant={'permanent'}
            >
            <Toolbar sx={{flexDirection:'column'}}>
              <Box align="left" sx={{p:1, ml:0}}>
              <Typography
                  variant="h6"
                  noWrap
                  component={Link}
                  to="/"
                  sx={{
                    fontFamily: 'Satisfy',
                    fontWeight: 600,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                  >
                  Ai Galeria
                </Typography>      
            </Box>
       {currentUser && 
          <Box  sx={{ display:'flex', flexDirection:'column', flexGrow: 1 }}>
            <Button
                key="addImage"
                component={Link} to="/"
                sx={{ my: 1, color: 'primary.text', display: 'block' }}
              >
                Add Image
              </Button>

              <Button
                key="tags"
                component={Link} to="/tags"
                sx={{ my: 1, color: 'primary.text', display: 'block' }}
              >
                Tags
              </Button>

              <Button
                key="carousel"
                component={Link} to="/carousel"
                sx={{ my: 1, color: 'primary.text', display: 'block' }}
              >
                Carousel
              </Button>
              
              <Button
                key="dashboard"
                component={Link} to="/dashboard"
                sx={{ my: 1, color: 'primary.text', display: 'block' }}
              >
                Dashboard
              </Button>   
              
              <Button
                key="settings"
                component={Link}
                onClick={handleOpenDialog}
                sx={{ my: 1, color: 'primary.text', display: 'block' }}
              >
                Settings
              </Button>  

              <Button key="Logout"
                  component={Link}
                  color="error"
                sx={{ my: 1, display: 'block' }}
                  onClick={handleOpen}>
                    <Typography>
                    Logout
                    </Typography>
                  </Button>
          </Box>
          }
        </Toolbar>
    </SwipeableDrawer>
    </>
  );
}
export default ResponsiveAppBar;