import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import { PaletteMode } from '@mui/material';
import { backendUrl } from '../../config.tsx';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/Download';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal } from '@mui/base/Modal';
import { IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { styled as styledMui } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';


const DataContainer = styled.div`
    flex: 1 1;
    padding: 10px 0px 0px 20px;
`

const DataHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid lightgray;
    height: 40px;
    .headerLeft {
        display: flex;
        align-items: center;
    }
    .headerRight svg {
        margin:0px 10px;
    }
`

const DataGrid = styled.div`
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
`

const DataFile = styled.div`
    text-align: center;
    border: 1px solid rgb(204 204 204 / 46%);
    margin: 10px;
    min-width: 200px;
    padding: 10px 0px 0px 0px;
    border-radius: 5px;
    svg {
        font-size: 60px;
        color:gray
    }
    p {
        margin-top: 5px;
        font-size: 12px;
        padding: 10px 0px;
    }
`

const InputRename = styledMui('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 
        theme.palette.mode === 'light'
            ? 'rgba(210, 210, 210, 0.4)'
            : 'rgba(0, 0, 0, 0.4)',
        '&:hover': {
            backgroundColor: 
                theme.palette.mode === 'light'
                    ? 'rgba(180, 180, 180, 0.4)'
                    : 'rgba(20, 20, 20, 0.4)',
        },
    border: '1px solid',
    borderColor:  
        theme.palette.mode === 'light'
            ? 'rgba(50, 50, 50, 0.4)'
            : 'rgba(80, 80, 80, 0.4)',
    marginRight: theme.spacing(0),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
      width: 'auto',
    },
  }));

const StyledInputBase = styledMui(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 1),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(0)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '47ch',
      },
    },
  }));


interface DataProps {
    mode: PaletteMode;
    toggleColorMode: () => void;
    input_text: string;
    filesArray: [];
    setFilesArray: (arg0: []) => void

}
  

function Data ({ mode, toggleColorMode, input_text, filesArray, setFilesArray }: DataProps) {
    
    const [filesGrid, setFilesGrid] = useState([]);


    const [mOptions_state,setMOptionsState] = useState(false);

    const [open, setOpen] = useState(false);

    const [share, setShare] = useState(false);
    const [sharedFilesArray, setSharedFilesArray] = useState([]);

    var optionX = useRef(0);
    var optionY = useRef(0);
    var optionId = useRef(0);
    var optionName = useRef(" ");
    var optionFile = useRef({_id:"",nombreArchivo:"",fecha:"",tamano:"",ipfs_hash:"",estado:"",correo:""});
    var optionShare = useRef("test@test.com")
    var lastOrder = useRef("name")



    function useOutsideAlerter(ref) {
        useEffect(() => {
          /**
           * Alert if clicked on outside of element
           */
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              //alert("You clicked outside of me!");
              setMOptionsState(false);
            }
          }
          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
      }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);


    const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        if ((e.clientX + 200 + 10) > window.innerWidth) optionX.current = e.clientX - (e.clientX + 200 + 10 - window.innerWidth);
        else optionX.current = e.clientX + 10;
        if ((e.clientY + 300 + 10) > window.innerHeight) optionY.current = e.clientY - (e.clientY + 300 + 10 - window.innerHeight);
        else optionY.current = e.clientY;
    }

    var handleMoreOptions = useCallback((file) => {
        setMOptionsState(!mOptions_state);
        optionId.current = file._id
        optionName.current = file.nombreArchivo
        optionFile.current = file
    }, [mOptions_state])

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
            const response = await fetch(`${backendUrl}/compartido/obtenerArchivosCompartidos`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const data = await response.json();
                setSharedFilesArray(data.archivosCompartidos);
                
            } else if (response.status === 404) {
                console.log("No shared files yet")
                setSharedFilesArray([])
            } else {
                alert("An unexpected error ocurred while trying to load your files. Please try again later.");
            }
            } catch (error) {
            console.error("Error at storage:", error);
            alert("An unexpected error ocurred while trying to load your files. Please try again later.");
            }
        }
    };

    useEffect(() => {
        fetchData();
    },[])
    filesSorter(lastOrder.current)


    useEffect(() => {
        var recentFiles = filesArray
        recentFiles.push(...sharedFilesArray)
        var filesLoopGrid = () => {
                var result: React.JSX.Element
                var res: (React.JSX.Element | React.JSX.Element[])[] = []
                var partial_res: React.JSX.Element [] = [];
                var i = 0;
                var j = 0;
                if (input_text === "") {
                    for (j = 0; j < recentFiles.length; j+=7) {
                    for (i = j; i < recentFiles.length && i<(j+7); i++) {
                            const file = recentFiles[i]
                            if (file["nombreArchivo"]) { 
                            partial_res.push(
                                //@ts-ignore
                                <DataFile key={file._id}>
                                    {/*@ts-ignore*/ }
                                    {selectIcon(file.nombreArchivo)}
                                    <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
                                    {/*@ts-ignore*/ }
                                    <Button sx={{width:'100%', borderRadius:'0px'}} onMouseDown={handleMouseDown} onClick={() => handleMoreOptions(file)}>
                                        {/*@ts-ignore*/}
                                        <p>{file.nombreArchivo.length <= 28  ? file.nombreArchivo : file.nombreArchivo.slice(0,22)+".."+file.nombreArchivo.slice(file.nombreArchivo.length-4,file.nombreArchivo.length)}</p>
                                    </Button>
                                </DataFile>
                            )
                            }
                            else {
                                partial_res.push(
                                    //@ts-ignore
                                    <DataFile key={file._id}>
                                        {/*@ts-ignore*/ }
                                        {selectIcon(file.ArchivoCompartido)}
                                        <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
                                        {/*@ts-ignore*/ }
                                        <Button sx={{width:'100%', borderRadius:'0px'}} onMouseDown={handleMouseDown} onClick={() => handleMoreOptions(file)}>
                                            {/*@ts-ignore*/}
                                            <p>{file.ArchivoCompartido.length <= 28  ? file.ArchivoCompartido : file.ArchivoCompartido.slice(0,22)+".."+file.ArchivoCompartido.slice(file.ArchivoCompartido.length-4,file.ArchivoCompartido.length)}</p>
                                        </Button>
                                    </DataFile>
                                )
                            }
                    }
                    res.push(<Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>{partial_res}</Stack>)
                    partial_res = []
                    }
                    result = <Stack direction={{ xs: 'row', md: 'column' }} spacing={{ xs: 1, md: 3 }}>{res}</Stack>
                    return result
                } 
                else {
                    for (i = 0; i < filesArray.length; i++) {
                            //@ts-ignore
                            if (filesArray[i].nombreArchivo.includes(input_text)) {
                                const file = filesArray[i]
                                res.push(
                                    //@ts-ignore
                                    <DataFile key={file._id}>
                                        {/*@ts-ignore*/ }
                                        {selectIcon(file.nombreArchivo)}
                                        <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
                                        {/*@ts-ignore*/ }
                                        <Button sx={{width:'100%', borderRadius:'0px'}} onMouseDown={handleMouseDown} onClick={() => handleMoreOptions(file)}>
                                            {/*@ts-ignore*/}
                                            <p>{file.nombreArchivo.length <= 28  ? file.nombreArchivo : file.nombreArchivo.slice(0,22)+".."+file.nombreArchivo.slice(file.nombreArchivo.length-4,file.nombreArchivo.length)}</p>
                                        </Button>
                                    </DataFile>
                                )
                            }
                    }
                    return res
                }  
        }
        //@ts-ignore
        setFilesGrid(filesLoopGrid());
    },[filesArray,mode,handleMoreOptions,input_text,setFilesArray,sharedFilesArray])


    function reformatSize(size: number) {
        if ((size / 1000000000) >= 1) return (size / 1000000000).toFixed(2) + "GB";
        else if ((size / 1000000) >= 1) return (size / 1000000).toFixed(2) + "MB";
        else if ((size / 1000) >= 1) return (size / 1000).toFixed(2) + "KB";
        else return size + "B";
    }

    function selectIcon(name: string) {
        var format = name.slice(name.length-4,name.length);
        var res = <InsertDriveFileIcon/>
        switch (format) {
            case "apng":
                res = <ImageIcon/>
                break;
            case "avif":
                res = <ImageIcon/>
                break;
            case ".gif":
                res = <ImageIcon/>
                break;
            case ".jpg":
                res = <ImageIcon/>
                break;
            case "jpeg":
                res = <ImageIcon/>
                break;
            case "jfif":
                res = <ImageIcon/>
                break;
            case ".pjp":
                res = <ImageIcon/>
                break;
            case ".png":
                res = <ImageIcon/>
                break;
            case ".svg":
                res = <ImageIcon/>
                break;
            case "webp":
                res = <ImageIcon/>
                break;
            case ".ico":
                res = <ImageIcon/>
                break;
            case ".pdf":
                res = <PictureAsPdfIcon/>
                break;
            case ".zip":
                res = <FolderZipIcon/>
                break;
            case ".rar":
                res = <FolderZipIcon/>
                break;
            case ".tar":
                res = <FolderZipIcon/>
                break;
            case "r.gz":
                res = <FolderZipIcon/>
                break;
            default:
                res = <InsertDriveFileIcon/>
                break;
        }
        return res
    }

    // function filesLoopGrid ()  {
    //     filesSorter(lastOrder.current)
    //         var res: (React.JSX.Element | React.JSX.Element[])[] = [[]];
    //         var partial_res: React.JSX.Element [] = [];
    //         var i = 0;
    //         var j = 0;
    //         if (input_text === "") {
    //             for (j = 1; j < filesArray.length; j*=7) {
    //                 for (i = j-1; i < filesArray.length; i++) {
    //                         const file = filesArray[i]
    //                         partial_res.push(
    //                             //@ts-ignore
    //                             <DataFile key={file._id}>
    //                                 {/*@ts-ignore */}
    //                                 {selectIcon(file.nombreArchivo)}
    //                                 <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
    //                                 {/*@ts-ignore */}
    //                                 <Button sx={{width:'100%', borderRadius:'0px'}} onMouseDown={handleMouseDown} onClick={() => handleMoreOptions(file)}>
    //                                     {/*@ts-ignore*/}
    //                                     <p>{file.nombreArchivo.length <= 28  ? file.nombreArchivo : file.nombreArchivo.slice(0,22)+".."+file.nombreArchivo.slice(file.nombreArchivo.length-4,file.nombreArchivo.length)}</p>
    //                                 </Button>
    //                             </DataFile>
    //                         )
    //                 }
    //                 console.log("partial\n" + partial_res)
    //                 res.push(partial_res)
    //                 partial_res = []
    //                 }
    //                 console.log(res)
    //                 return res
    //             }
    //         else {
    //             for (i = 0; i < filesArray.length; i++) {
    //                 //@ts-ignore
    //                 if (filesArray[i].estado === "activo") {
    //                     //@ts-ignore
    //                     if (filesArray[i].nombreArchivo.includes(input_text)) {
    //                         const file = filesArray[i]
    //                         res.push(
    //                             //@ts-ignore
    //                             <DataFile key={file._id}>
    //                                 {/*@ts-ignore */}
    //                                 {selectIcon(file.nombreArchivo)}
    //                                 <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
    //                                 {/*@ts-ignore */}
    //                                 <Button sx={{width:'100%', borderRadius:'0px'}} onMouseDown={handleMouseDown} onClick={() => handleMoreOptions(file)}>
    //                                     {/*@ts-ignore*/}
    //                                     <p>{file.nombreArchivo.length <= 28  ? file.nombreArchivo : file.nombreArchivo.slice(0,22)+".."+file.nombreArchivo.slice(file.nombreArchivo.length-4,file.nombreArchivo.length)}</p>
    //                                 </Button>
    //                             </DataFile>
    //                         )
    //                     }
    //                 }
    //             }
    //             return res
    //         }  
    // }
    // filesLoopGrid()

    function compareFn_mod (a, b) {
        console.log(new Date(a.fecha))
        if (new Date(a.fecha) > new Date(b.fecha)) return -1;
        else if (new Date(a.fecha) < new Date(b.fecha)) return 1;
        else return 0;
    }
    function compareFn_rmod (a, b) {
        if (new Date(a.fecha) < new Date(b.fecha)) return -1;
        else if (new Date(a.fecha) > new Date(b.fecha)) return 1;
        else return 0;
    }

    function filesSorter (order: string) {
        switch (order) {
            case "mod":
                setFilesArray(filesArray.sort(compareFn_mod));
                lastOrder.current = "mod"
                break;
            case "rmod":
                setFilesArray(filesArray.sort(compareFn_rmod));
                lastOrder.current = "rmod"
                break;
        }
    }


    function handleShare() {
        const sendData = async () => {
            console.log(optionShare.current)
                const userData = {
                    ArchivoCompartido: optionFile.current._id,
                    correoCompartido: optionShare.current,
                    token: localStorage.getItem("token"),
                    correo: localStorage.getItem("email")
                }
                try {
                const response = await fetch(`${backendUrl}/compartido/ArchivoCompartido`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });
                if (response.ok) {
                    console.log("file shared correctly")
                    fetchData()
                    setShare(false)
                    setMOptionsState(false)
                    
                } else {
                    alert("An error ocurred while trying to share your file. Please try again later.");
                }
                } catch (error) {
                console.error("Error at file share:", error);
                alert("An unexpected error ocurred while trying to share your file. Please try again later.");
                }
            };
        sendData();
    }

    function handleMoveToTrash() {
        const sendData = async () => {
                const userData = {
                    correo: localStorage.getItem("email"),
                    token: localStorage.getItem("token"),
                    _id: optionFile.current._id
                }
                try {
                const response = await fetch(`${backendUrl}/archivo/archivararchivo`, {
                    method: "PUT",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });
                if (response.ok) {
                    fetchData()
                    setMOptionsState(false)
                    
                } else {
                    alert("An error ocurred while trying to move to trash your file. Please try again later.");
                }
                } catch (error) {
                console.error("Error at data rename:", error);
                alert("An unexpected error ocurred while trying to move to trash your file. Please try again later.");
                }
            };
        sendData();
    }

    function handleInputShare (e) {
        optionShare.current = e.target.value
    }

    function handleDownload() {
        const recieveData = async () => {
            const userData = {
                _id: optionFile.current._id,
                correo: localStorage.getItem("email"),
                token: localStorage.getItem("token")
            }
            console.log(optionFile.current._id)
            try {
                console.log("a")
            const response = await fetch(`${backendUrl}/archivo/obtenerarchivo`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const data = await response.json()
                //console.log(data.message)
                window.open(data.message)
                setMOptionsState(false)                
            } else {
                console.log("b")
                alert("An error ocurred while trying to download your file. Please try again later.");
            }
            } catch (error) {
            console.error("Error at data rename:", error);
            alert("An unexpected error ocurred while trying to download your file. Please try again later.");
            }
        };
        recieveData();
    }

    function handleModals(modal: String) {
        switch (modal) {
            case "open":
                setOpen(true)
                setShare(false)
                break;
            case "rename":
                setOpen(false)
                setShare(false)
                break;
            case "share":
                setOpen(false)
                setShare(true)
                break;
        }
    }
    

    return (
        <DataContainer style={{margin: '0px 20px 0px 00px', maxWidth:'1600px'}}>

            <Modal open={open} onClose={() => setOpen(false)} 
                    style={{
                        position: 'absolute', 
                        top:'25vh', 
                        left: '40vw', 
                        width: '520px',
                        backgroundColor: mode === 'light'
                        ? 'rgba(230, 230, 230, 1)'
                        : 'rgba(30, 30, 30, 1)',
                        border: '1px solid',
                        borderRadius: '10px',
                        borderColor: 'rgba(0,150,255,1)',
                        zIndex: 2,
                        }}>
                <div>
                    <IconButton onClick={() => setOpen(false)} style={{position:'relative',display:'flex',left:'477px'}}>
                        <HighlightOffIcon/>
                    </IconButton>
                    <div style={{display:'flex'}}>
                        <Box sx={{
                            margin: '0px 0px 0px 0px',
                            width:'200px'
                        }}>
                            <DataFile style={{
                                minWidth: '0px',
                                height: '80%',
                                width: '100%'
                            }}>{selectIcon(optionFile.current.nombreArchivo)}</DataFile>
                        </Box>
                        <p style={{
                            maxWidth:'270px', 
                            wordWrap: 'break-word', 
                            margin: '0px 0px 0px 25px',
                            alignSelf:'center'
                            }}><b>{optionFile.current.nombreArchivo}</b></p>
                    </div>
                    <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
                    <div>
                        <Box sx={{display:'flex'}}>
                            <Box sx={{
                                width:'30%',
                                margin: '0px 0px 0px 20px',
                            }}>
                                <p>id:</p>
                            </Box>
                            <Box sx={{
                                width:'62%',
                                margin: '0px 0px 0px 0px',
                            }}>
                                <p style={{
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                }}>{optionFile.current._id}</p>
                            </Box>
                        </Box>
                        <Box sx={{display:'flex'}}>
                            <Box sx={{
                                width:'30%',
                                margin: '0px 0px 0px 20px',
                            }}>
                                <p>last modified:</p>
                            </Box>
                            <Box sx={{
                                width:'62%',
                                margin: '0px 0px 0px 0px',
                            }}>
                                <p style={{
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                }}>{optionFile.current.fecha}</p>
                            </Box>
                        </Box>
                        <Box sx={{display:'flex'}}>
                            <Box sx={{
                                width:'30%',
                                margin: '0px 0px 0px 20px',
                            }}>
                                <p>owner:</p>
                            </Box>
                            <Box sx={{
                                width:'62%',
                                margin: '0px 0px 0px 0px',
                            }}>
                                <p style={{
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                }}>{optionFile.current.correo}</p>
                            </Box>
                        </Box>
                        <Box sx={{display:'flex'}}>
                            <Box sx={{
                                width:'30%',
                                margin: '0px 0px 0px 20px',
                            }}>
                                <p>size:</p>
                            </Box>
                            <Box sx={{
                                width:'62%',
                                margin: '0px 0px 0px 0px',
                            }}>
                                <p style={{
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                }}>{reformatSize(parseInt(optionFile.current.tamano))}</p>
                            </Box>
                        </Box>
                        <Box sx={{display:'flex'}}>
                            <Box sx={{
                                width:'30%',
                                margin: '0px 0px 0px 20px',
                            }}>
                                <p>hash:</p>
                            </Box>
                            <Box sx={{
                                width:'62%',
                                margin: '0px 0px 0px 0px',
                            }}>
                                <p style={{
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                }}>{optionFile.current.ipfs_hash}</p>
                            </Box>
                        </Box>
                    </div>
                    <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
                    <div>
                        <Box sx={{display:'flex'}}>
                            <Box sx={{
                                width:'30%',
                                margin: '0px 0px 0px 20px',
                            }}>
                                <p>times shared:</p>
                            </Box>
                            <Box sx={{
                                width:'62%',
                                margin: '0px 0px 0px 0px',
                            }}>
                                <p style={{
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                }}>{0}</p>
                            </Box>
                        </Box>
                        <Box sx={{display:'flex'}}>
                            <Box sx={{
                                width:'30%',
                                margin: '0px 0px 0px 20px',
                            }}>
                                <p>times downloaded:</p>
                            </Box>
                            <Box sx={{
                                width:'62%',
                                margin: '0px 0px 0px 0px',
                            }}>
                                <p style={{
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                }}>{0}</p>
                            </Box>
                        </Box>
                    </div>
                </div>
            </Modal>

            <Modal open={share} onClose={() => setShare(false)} 
                    style={{
                        position: 'absolute', 
                        top:'25vh', 
                        left: '40vw', 
                        width: '520px',
                        backgroundColor: mode === 'light'
                        ? 'rgba(230, 230, 230, 1)'
                        : 'rgba(30, 30, 30, 1)',
                        border: '1px solid',
                        borderRadius: '10px',
                        borderColor: 'rgba(0,150,255,1)',
                        zIndex: 2,
                        }}>
                <div>
                        <IconButton onClick={() => setShare(false)} style={{position:'relative',display:'flex',left:'477px'}}>
                            <HighlightOffIcon/>
                        </IconButton>
                    <div style={{display:'flex'}}>
                        <Box sx={{
                            margin: '0px 0px 0px 0px',
                            width:'200px'
                        }}>
                            <DataFile style={{
                                minWidth: '0px',
                                height: '80%',
                                width: '100%'
                            }}>{selectIcon(optionFile.current.nombreArchivo)}</DataFile>
                        </Box>
                        <p style={{
                            maxWidth:'270px', 
                            wordWrap: 'break-word', 
                            margin: '0px 0px 0px 25px',
                            alignSelf:'center'
                            }}><b>{optionFile.current.nombreArchivo}</b></p>
                    </div>
                    <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
                    <div>
                        <Box sx={{display:'flex'}}>
                            <InputRename sx={{
                                marginTop:'10px'
                            }}>
                                <StyledInputBase
                                    placeholder="user_to_share@email.com"
                                    onChange={handleInputShare}
                                    />
                            </InputRename>
                        </Box>
                        <Box sx={{display:'flex'}}>
                            <Button sx={{
                                width:'100%',
                                margin:'10px'
                            }} variant='contained' onClick={() => handleShare()}>
                                <p>Share file</p>
                            </Button>
                        </Box>
                        
                    </div>
                </div>
            </Modal>

            <DataHeader>
                <div className="headerLeft">
                    <text style={{color: 
                        mode === "light"
                            ? "black"
                            : 'rgba(190, 190, 190, 1)', 
                        fontSize: "15px"}}>My Storage</text>
                </div>
            </DataHeader>
            <div>
                {mOptions_state === true &&
                    <Box ref={wrapperRef} sx={{
                        position: 'absolute',
                        left: optionX.current,
                        top: optionY.current,
                        border: '1px solid',
                        borderRadius: '10px',
                        borderColor:
                            mode === 'light' ? 'rgba(155,155,155,1)' : 'rgba(200,200,200,1)',
                        width: '200px',
                        background:
                            mode === 'light' ? 'rgba(255,255,255,1)' : 'rgba(20,20,20,1)',
                        zIndex: 1,
                    }}>
                        <Box sx={{
                            maxWidth: '100%',
                        }}>
                        <b><p style={{color: 
                                    mode === "light"
                                        ? 'rgba(90, 90, 90, 1)'
                                        : 'rgba(190, 190, 190, 1)',
                                    textAlign: 'center', 
                                    wordWrap: 'break-word',
                                    fontSize: "13px"}}>{optionName.current}</p></b>
                        </Box>
                        <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
                        <Button sx={{
                            width: '100%',
                            borderRadius: '0px'
                        }} onClick={handleDownload}>
                            <DownloadIcon style={{margin:'0px 10px 0px 0px',
                             color: 
                                mode === "light"
                                    ? 'rgba(90, 90, 90, 1)'
                                    : 'rgba(190, 190, 190, 1)'
                                }}/><p style={{color: 
                                    mode === "light"
                                        ? 'rgba(90, 90, 90, 1)'
                                        : 'rgba(190, 190, 190, 1)', 
                                    fontSize: "13px"}}>Download</p>
                        </Button>
                        <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
                        <Button sx={{
                            width: '100%',
                            borderRadius: '0px'
                        }} onClick={() => handleModals("share")}>
                            <PersonAddAltIcon style={{margin:'0px 10px 0px 0px',
                             color: 
                                mode === "light"
                                    ? 'rgba(90, 90, 90, 1)'
                                    : 'rgba(190, 190, 190, 1)'
                                }}/><p style={{color: 
                                    mode === "light"
                                        ? 'rgba(90, 90, 90, 1)'
                                        : 'rgba(190, 190, 190, 1)', 
                                    fontSize: "13px"}}>Share</p>
                        </Button>
                        <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
                        <Button sx={{
                            width: '100%',
                            borderRadius: '0px'
                        }} onClick={() => handleModals("open")}>
                            <InfoIcon style={{margin:'0px 10px 0px 0px',
                             color: 
                                mode === "light"
                                    ? 'rgba(90, 90, 90, 1)'
                                    : 'rgba(190, 190, 190, 1)'
                                }}/><p style={{color: 
                                    mode === "light"
                                        ? 'rgba(90, 90, 90, 1)'
                                        : 'rgba(190, 190, 190, 1)', 
                                    fontSize: "13px"}}>More info</p>
                        </Button>
                        <Divider sx={{borderColor: mode === 'light' ? 'rgba(210, 210, 210, 0.8)' : 'rgba(240,240,240,0.6)'}}/>
                        <Button sx={{
                            width: '100%',
                            borderRadius: '0px'
                        }} onClick={handleMoveToTrash}>
                            <DeleteIcon style={{margin:'0px 10px 0px 0px',
                             color: 
                                mode === "light"
                                    ? 'rgba(90, 90, 90, 1)'
                                    : 'rgba(190, 190, 190, 1)'
                                }}/><p style={{color: 
                                    mode === "light"
                                        ? 'rgba(90, 90, 90, 1)'
                                        : 'rgba(190, 190, 190, 1)', 
                                    fontSize: "13px"}}>Delete</p>
                        </Button>
                    </Box>
                }
            </div>
            <div>
                <Box sx={{
                        maxHeight: '700px',
                        maxWidth:'1600px',
                        overflowY:'scroll',
                        overflowWrap:'break-word',
                        overflowX:'hidden'
                    }}>
                    <DataGrid>
                        
                        {filesGrid}  

                    </DataGrid>
                </Box>
            </div>
        </DataContainer>
    )
}
export default Data;
