import { Dialog, DialogTitle, List, ListItem, ToggleButton, Button, ToggleButtonGroup } from "@mui/material";



export default function CustomDialog(props){
    return(
        <Dialog
        open={props.open}
        >
          <DialogTitle sx={{pb:0}}>Settings</DialogTitle>
          <List sx={{ pt: 0 }}>
        <ListItem 
          sx={{ color: 'primary.text', display: 'block' }}
          >
                <ToggleButtonGroup            
                fullWidth variant="outlined" size="xs" aria-label="outlined button group">
                  <ToggleButton onClick={()=>{ 
                    props.setMode("dark")
                    localStorage.setItem('theme', "dark");
                props.handleClose()
                  }}
                  variant= {localStorage.getItem('theme')==='dark'? "contained" : "outlined" }
                  >
                    Dark</ToggleButton>
                    <ToggleButton onClick={()=>{ 
                      props.setMode("light")
                      localStorage.setItem('theme', "light");
                props.handleClose()
                    }}
                    variant= {localStorage.getItem('theme')==='light'? "contained" : "outlined" }
                    >
                    Light
                </ToggleButton>
                </ToggleButtonGroup>
                  </ListItem>
    
                  <ListItem
                    sx={{ my: 1, display: 'block' }}
                    >
                <ToggleButtonGroup fullWidth variant="outlined" size="xs" aria-label="outlined button group">
    
              <ToggleButton 
              onClick={()=>{ 
                props.setSafetyMode("hide")
                localStorage.setItem('safety', "hide");
                props.handleClose()
              }}
              variant= {localStorage.getItem('safety')!=='hide'? "outlined" : "contained" }
              > Hide </ToggleButton>
                                  <ToggleButton onClick={()=>{ 
                                    props.setSafetyMode("blur")
                                    localStorage.setItem('safety', "blur");
                props.handleClose()
                                  }}
                                  variant= {localStorage.getItem('safety')!=='blur'? "outlined" : "contained" }
                                  >
                    Blur
                    
                </ToggleButton>
    
                    <ToggleButton 
                    onClick={()=>{ 
                      props.setSafetyMode("show")
                      localStorage.setItem('safety', "show");
                props.handleClose()
                    }}
                    variant= {localStorage.getItem('safety')!=='show'? "outlined" : "contained" }
                    >
                    Show

                    </ToggleButton>
    
              </ToggleButtonGroup>
                  </ListItem>
                  <ListItem>
                    <Button variant="outlined" onClick={()=> props.handleClose()}>
                      Close
                    </Button>
                  </ListItem>
        </List>
        </Dialog>
    )
}