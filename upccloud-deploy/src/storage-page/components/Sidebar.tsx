import * as React from 'react';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import styled from 'styled-components';
import { Modal } from '@mui/base/Modal';
import { useState } from 'react';

import { IconButton, PaletteMode } from '@mui/material';
// @ts-ignore
import plus from '../../images/plus.png';
import StorageIcon from '@mui/icons-material/Storage';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled as styledMui } from '@mui/material/styles';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Box from '@mui/material/Box';
import { backendUrl } from '../../config.tsx';
import Button from '@mui/material/Button';

const SidebarOptions = styled.div`
    margin-top: 10px;
    .progress_bar {
        padding: 0px 20px;
    }
    .progress_bar span {
        display: block;
        color:#333;
        font-size: 13px;
    }
`


const ModalHeading = styled.div`
    text-align: center;
    border-bottom: 1px solid lightgray;
    height: 40px;
`

const ModalBody = styled.div`
    input.modal__submit {
        width: 100%;
        background: darkmagenta;
        padding: 10px 20px;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 5px;
        font-size: 16px;
        border: 0;
        outline: 0;
        border-radius: 5px;
        cursor: pointer;
        margin-top:20px
    }
    input.modal__file {
        background: whitesmoke;
        padding: 20px;
        color: #000;
        display: block;
        margin-top:20px
    }
`

const BorderLinearProgress = styledMui(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
  }));


interface SideBarProps {
    mode: PaletteMode;
    diskmax: number;
    setSideSelection: (arg0: string) => void;
    filesArray: [];
    setFilesArray: (arg0: []) => void
}

function Sidebar ({ mode, diskmax, setSideSelection, filesArray, setFilesArray }: SideBarProps) {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    var diskusage = React.useRef(0)

    function calcDiskUsage() {
        diskusage.current = 0
        for (var i = 0; i < filesArray.length; i++) {
            //@ts-ignore
            diskusage.current += parseInt(filesArray[i].tamano)
        }
    }

    const fetchData = async () => {
        if (localStorage.getItem("email") === null) {
            alert("An unexpected error ocurred while trying to load your files. Please try again later.");
            // @ts-ignore
            window.location = '/sign-in';
        }
        else {
            const userData = {
                correo: localStorage.getItem("email"),
                token: localStorage.getItem("token")
            }
            try {
            const response = await fetch(`${backendUrl}/archivo/getall`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const data = await response.json();
                setFilesArray(data.archivos);
                calcDiskUsage()
                
            } else {
                alert("An unexpected error ocurred while trying to load your files. Please try again later.");
            }
            } catch (error) {
            console.error("Error at storage:", error);
            alert("An unexpected error ocurred while trying to load your files. Please try again later.");
            }
        }
    };

    const StoreSup = async (file: FormData) => {
        try {
        //const response = await fetch(`http://10.4.41.54:9095/api/v0/add`, {//IPFS node
            const response = await fetch(`${backendUrl}/archivo/creararchivo`, {
                method: "POST",
                body: file
            });
            if (response.ok) {
                console.log("Upload succsessful! :)");
                fetchData()
                setUploading(false);
                setOpen(false);
        
            } else {
                console.error("Error at upload :( ",response.statusText);
            }
        } catch (error) {
          console.error("Error at upload :((:", error);
          alert("An error ocurred while trying to upload you file. Please try again later");
        }
    };


    const handleFile = e => {
        if(e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = (e) => {
        e.preventDefault();
        setUploading(true);

        if (file == null) alert("An error ocurred while trying to upload you file. Please try again later");
        else {
            const userData = {
                correo: localStorage.getItem("email"),
                token: localStorage.getItem("token")
            }
            let formData = new FormData()
            formData.append('JSON',JSON.stringify(userData))
            formData.append('file',file)
            StoreSup(formData);
            setFile(null);
        }
    }

    function reformatSize(size: number) {
        if ((size / 1000000000) >= 1) return (size / 1000000000).toFixed(2) + "GB";
        else if ((size / 1000000) >= 1) return (size / 1000000).toFixed(2) + "MB";
        else if ((size / 1000) >= 1) return (size / 1000).toFixed(2) + "KB";
        else return size + "B";
    }

    calcDiskUsage()

    return (
         <>
        <Modal open={open} onClose={() => setOpen(false)} 
                style={{
                    position: 'absolute', 
                    top:'40vh', 
                    left: '40vw', 
                    height: '193px',
                    width: '520px',
                    backgroundColor: mode === 'light'
                    ? 'rgba(230, 230, 230, 1)'
                    : 'rgba(30, 30, 30, 1)',
                    border: '1px solid',
                    borderRadius: '10px',
                    borderColor: 'rgba(0,150,255,1)'}}>
            <div>
                
                <form onSubmit={handleUpload} style={{position: 'relative'}}>
                    
                    <ModalHeading>
                        <h3>Select a file  to upload</h3>
                    </ModalHeading>
                    <ModalBody>
                        {uploading ? 
                                    <>
                                    <h4 style={{textAlign:'center'}}>Uploading...</h4>
                                    <Box sx={{ width: '92%' }} style={{position: 'relative',
                                                                        alignItems: 'center',
                                                                        margin: '20px'}}>
                                    <LinearProgress style={{height:'20px',borderRadius: '10px'}}/>
                                </Box></>
                                : (<>
                                <div style={{ 
                                    position: 'relative',
                                    alignItems: 'center',
                                    top: '7px',
                                    left: '155px',
                                    margin: '20px'
                                    }}>
                                <input type="file" onChange={handleFile}/>
                                </div>
                                <input type="submit" style={{
                                                        margin:'10px 10px 10px 10px',
                                                        height:'50px',
                                                        width:'500px',
                                                        borderRadius: '10px',
                                                        backgroundColor:'rgba(0,150,255,0.5)',
                                }} />
                            </>
                        )}
                    </ModalBody>
                    <IconButton onClick={() => setOpen(false)} style={{position:'relative',display:'flex',left:'477px',top:
                        uploading ?'-160px' : '-190px'}}>
                        <HighlightOffIcon/>
                    </IconButton>
                </form>
            </div>
        </Modal>
        
        <div style={{height:'100vh', width:'300px',background:
                                    mode === "light"
                                    ? 'rgba(250, 250, 250, 1)'
                                    : 'rgba(20, 20, 20, 0.1)'
        }}>
            <text><br/></text>
            <Button onClick={() => setOpen(true)} variant="outlined" style={{
                                                                            borderRadius:'999px',
                                                                            margin:'0px 0px 0px 15px'
            }}>
                <img src={plus} width={30} height={30} alt='New'/>
                <text style={{color: 
                    mode === "light"
                        ? "black"
                        : 'rgba(190, 190, 190, 1)', 
                    fontSize: "15px"}}>&nbsp;&nbsp;&nbsp;New</text>
            </Button>

            <Button onClick={() => setSideSelection("MyFiles")} style={{
                                                        borderRadius:'999px',
                                                        margin:'10px 0px 0px 15px',
                                                        width:'285px',
            }}>
                <div style={{display:'flex', transform: 'translate(-95px, 0px)'}}>
                <InsertDriveFileIcon style={{color: 
                    mode === "light"
                        ? 'rgba(90, 90, 90, 1)'
                        : 'rgba(190, 190, 190, 1)'}}/>
                <text style={{color: 
                    mode === "light"
                        ? 'rgba(90, 90, 90, 1)'
                        : 'rgba(190, 190, 190, 1)', 
                    fontSize: "13px"}}>&nbsp;&nbsp;&nbsp;My Files</text>
                </div>
            </Button>
            <Button onClick={() => setSideSelection("Shared")} style={{
                                                        borderRadius:'999px',
                                                        margin:'10px 0px 0px 15px',
                                                        width:'285px',
            }}>
                <div style={{display:'flex', transform: 'translate(-97px, 0px)'}}>
                <PeopleAltOutlinedIcon style={{color: 
                    mode === "light"
                        ? 'rgba(90, 90, 90, 1)'
                        : 'rgba(190, 190, 190, 1)'}}/>
                <text style={{color: 
                    mode === "light"
                        ? 'rgba(90, 90, 90, 1)'
                        : 'rgba(190, 190, 190, 1)', 
                    fontSize: "13px"}}>&nbsp;&nbsp;&nbsp;Shared</text>
                </div>
            </Button>
            <Button onClick={() => setSideSelection("Trash")} style={{
                                                        borderRadius:'999px',
                                                        margin:'10px 0px 0px 15px',
                                                        width:'285px',
            }}>
                <div style={{display:'flex', transform: 'translate(-103px, 0px)'}}>
                <DeleteOutlineOutlinedIcon style={{color: 
                    mode === "light"
                        ? 'rgba(90, 90, 90, 1)'
                        : 'rgba(190, 190, 190, 1)'}}/>
                <text style={{color: 
                    mode === "light"
                        ? 'rgba(90, 90, 90, 1)'
                        : 'rgba(190, 190, 190, 1)', 
                    fontSize: "13px"}}>&nbsp;&nbsp;&nbsp;Trash</text>
                </div>
            </Button>
                    

            <hr />

            <Button onClick={() => setSideSelection("Storage")} style={{
                                                        borderRadius:'999px',
                                                        margin:'10px 0px 0px 15px',
                                                        width:'285px',
            }}>
                <div style={{display:'flex', transform: 'translate(-94px, 0px)'}}>
                <StorageIcon style={{color: 
                    mode === "light"
                        ? 'rgba(90, 90, 90, 1)'
                        : 'rgba(190, 190, 190, 1)'}}/>
                <text style={{color: 
                    mode === "light"
                        ? 'rgba(90, 90, 90, 1)'
                        : 'rgba(190, 190, 190, 1)', 
                    fontSize: "13px"}}>&nbsp;&nbsp;&nbsp;Storage</text>
                </div>
            </Button>

            <SidebarOptions>
                <BorderLinearProgress variant="determinate" value={(diskusage.current/diskmax)*100} style={{margin:'05px 20px'}}/>
                <text style={{color: 
                        mode === "light"
                            ? 'rgba(90, 90, 90, 1)'
                            : 'rgba(190, 190, 190, 1)', 
                        fontSize: "13px"}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`${(reformatSize(diskusage.current))} / ${(reformatSize(diskmax))}`}</text>
            </SidebarOptions>
        </div>
        </>
    )
}
export default Sidebar;