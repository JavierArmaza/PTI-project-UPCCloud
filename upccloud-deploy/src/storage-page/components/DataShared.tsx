import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DownloadIcon from '@mui/icons-material/Download';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal } from '@mui/base/Modal';
import { IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { styled as styledMui } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';


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
const DataListRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    p {
        display: flex;
        align-items: center;
        font-size: 13px;
        b {
            display: flex;
            align-items: center;
        }
        svg {
            font-size: 22px;
            margin:10px
        }
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
    input_text: string;

}
  

function Data ({ mode, input_text }: DataProps) {
    
    const [filesRow, setFilesRow] = useState([]);

    const [name_state,setNameState] = useState(false);
    const [owner_state,setOwnerState] = useState(false);
    const [mod_state,setModState] = useState(false);
    const [size_state,setSizeState] = useState(false);

    const [mOptions_state,setMOptionsState] = useState(false);

    const [open, setOpen] = useState(false);

    const [share, setShare] = useState(false);

    const [sharedFilesArray, setSharedFilesArray] = useState([]);

    var optionX = useRef(0);
    var optionY = useRef(0);
    var optionId = useRef(0);
    var optionName = useRef(" ");
    var optionFile = useRef({_id:"",ArchivoCompartido:"",fechacompartido:"",tamañoArchivo:"",correoCompartido:"",correoOwner:""});
    var optionShare = useRef("test@test.com")
    var lastOrder = useRef("name")

    var timesShared = useRef(0)
    var timesDownloaded = useRef(0)



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
        optionName.current = file.ArchivoCompartido
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


    useEffect(() => {

        var filesLoopRow = () => {
            var res: React.JSX.Element [] = []
            var i = 0
            if (input_text === "") {
                for (i = 0; i < sharedFilesArray.length; i++) {
                        const file = sharedFilesArray[i]
                        res.push(
                            <DataListRow style={{height:'70px', width: '100%'}}>
                                <Box width={'25%'}>
                                    {/*@ts-ignore*/}
                                    <Button onMouseDown={handleMouseDown} onClick={() => handleMoreOptions(file)}>
                                        {/*@ts-ignore*/}
                                        <p>{selectIcon(file.ArchivoCompartido)}{file.ArchivoCompartido.length <= 65  ? file.ArchivoCompartido : file.ArchivoCompartido.slice(0,61)+".."+file.ArchivoCompartido.slice(file.ArchivoCompartido.length-4,file.ArchivoCompartido.length)}</p>
                                    </Button>
                                </Box>
                                <Box width={'25%'} style={{transform: 'translate(200px, 0px)'}}>
                                    {/*@ts-ignore*/}
                                    <p style={{position:'relative',alignItems:'center'}}>{file.correoOwner}</p>
                                </Box>
                                <Box width={'25%'} style={{transform: 'translate(250px, 0px)'}}>
                                    {/*@ts-ignore*/}
                                    <p style={{position:'relative',alignItems:'center'}}>{file.fechacompartido}</p>
                                </Box>
                                <Box width={'25%'} style={{transform: 'translate(250px, 0px)'}}>
                                    {/*@ts-ignore*/}
                                    <p style={{position:'relative',alignContent:'center'}}>{reformatSize(file.tamañoArchivo)}</p>
                                </Box>
                            </DataListRow>
                        )
                }
                return res
            }
            else {
                for (i = 0; i < sharedFilesArray.length; i++) {
                    //@ts-ignore
                    if (sharedFilesArray[i].ArchivoCompartido.includes(input_text)) {
                        const file = sharedFilesArray[i]
                        res.push(
                            <DataListRow style={{height:'70px', width: '100%'}}>
                                <Box width={'25%'}>
                                    {/*@ts-ignore*/}
                                    <Button onMouseDown={handleMouseDown} onClick={() => handleMoreOptions(file)}>
                                        {/*@ts-ignore*/}
                                        <p>{selectIcon(file.ArchivoCompartido)}{file.ArchivoCompartido.length <= 65  ? file.ArchivoCompartido : file.ArchivoCompartido.slice(0,61)+".."+file.ArchivoCompartido.slice(file.ArchivoCompartido.length-4,file.ArchivoCompartido.length)}</p>
                                    </Button>
                                </Box>
                                <Box width={'25%'} style={{transform: 'translate(200px, 0px)'}}>
                                    {/*@ts-ignore*/}
                                    <p style={{position:'relative',alignItems:'center'}}>{file.correoOwner}</p>
                                </Box>
                                <Box width={'25%'} style={{transform: 'translate(250px, 0px)'}}>
                                    {/*@ts-ignore*/}
                                    <p style={{position:'relative',alignItems:'center'}}>{file.fechacompartido}</p>
                                </Box>
                                <Box width={'25%'} style={{transform: 'translate(250px, 0px)'}}>
                                    {/*@ts-ignore*/}
                                    <p style={{position:'relative',alignContent:'center'}}>{reformatSize(file.tamañoArchivo)}</p>
                                </Box>
                            </DataListRow>
                        )
                    }
                }
                return res
            }
        }
        //@ts-ignore
        setFilesRow(filesLoopRow());
    },[sharedFilesArray,mode,handleMoreOptions,input_text])

    useEffect(() => {
        var blockchainData = async () => {
            const userData = {
                _id: optionFile.current._id,
                correo: localStorage.getItem("email"),
                token: localStorage.getItem("token")
            }
            try {
            const response = await fetch(`${backendUrl}/archivo/blockchain`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const data = await response.json()
                timesShared.current = data.shared;
                timesDownloaded.current = data.viewed;
            } else {
                alert("An error ocurred while trying to get info of your file. Please try again later.");
            }
            } catch (error) {
            console.error("Error at data rename:", error);
            alert("An unexpected error ocurred while trying to get info of your file. Please try again later.");
            }
        };
        blockchainData();
    },[optionFile.current._id])


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

    function compareFn_name (a: { ArchivoCompartido: { toLowerCase: () => number; }; }, b: { ArchivoCompartido: { toLowerCase: () => number; }; }) {
        if (a.ArchivoCompartido.toLowerCase() < b.ArchivoCompartido.toLowerCase()) return -1;
        else if (a.ArchivoCompartido.toLowerCase() > b.ArchivoCompartido.toLowerCase()) return 1;
        else return 0;
    }
    function compareFn_rname (a: { ArchivoCompartido: { toLowerCase: () => number; }; }, b: { ArchivoCompartido: { toLowerCase: () => number; }; }) {
        if (a.ArchivoCompartido.toLowerCase() > b.ArchivoCompartido.toLowerCase()) return -1;
        else if (a.ArchivoCompartido.toLowerCase() < b.ArchivoCompartido.toLowerCase()) return 1;
        else return 0;
    }
    function compareFn_owner (a: { correoOwner: { toLowerCase: () => number; }; }, b: { correoOwner: { toLowerCase: () => number; }; }) {
        if (a.correoOwner.toLowerCase() > b.correoOwner.toLowerCase()) return -1;
        else if (a.correoOwner.toLowerCase() < b.correoOwner.toLowerCase()) return 1;
        else return 0;
    }
    function compareFn_rowner (a: { correoOwner: { toLowerCase: () => number; }; }, b: { correoOwner: { toLowerCase: () => number; }; }) {
        if (a.correoOwner.toLowerCase() < b.correoOwner.toLowerCase()) return -1;
        else if (a.correoOwner.toLowerCase() > b.correoOwner.toLowerCase()) return 1;
        else return 0;
    }
    function compareFn_mod (a, b) {
        if (new Date(a.fechacompartido) > new Date(b.fechacompartido)) return -1;
        else if (new Date(a.fechacompartido) < new Date(b.fechacompartido)) return 1;
        else return 0;
    }
    function compareFn_rmod (a, b) {
        if (new Date(a.fechacompartido) < new Date(b.fechacompartido)) return -1;
        else if (new Date(a.fechacompartido) > new Date(b.fechacompartido)) return 1;
        else return 0;
    }
    function compareFn_size (a: { tamañoArchivo: string; }, b: { tamañoArchivo: string; }) {
        if (parseInt(a.tamañoArchivo) < parseInt(b.tamañoArchivo)) return -1;
        else if (parseInt(a.tamañoArchivo) > parseInt(b.tamañoArchivo)) return 1;
        else return 0;
    }
    function compareFn_rsize (a: { tamañoArchivo: string; }, b: { tamañoArchivo: string; }) {
        if (parseInt(a.tamañoArchivo) > parseInt(b.tamañoArchivo)) return -1;
        else if (parseInt(a.tamañoArchivo) < parseInt(b.tamañoArchivo)) return 1;
        else return 0;
    }

    function filesSorter (order: string) {
        switch (order) {
            case "name":
                setSharedFilesArray(sharedFilesArray.sort(compareFn_name));
                lastOrder.current = "name"
                break;
            case "rname":
                setSharedFilesArray(sharedFilesArray.sort(compareFn_rname));
                lastOrder.current = "rname"
                break;
            case "owner":
                setSharedFilesArray(sharedFilesArray.sort(compareFn_owner));
                lastOrder.current = "owner"
                break;
            case "rowner":
                setSharedFilesArray(sharedFilesArray.sort(compareFn_rowner));
                lastOrder.current = "rowner"
                break;
            case "mod":
                setSharedFilesArray(sharedFilesArray.sort(compareFn_mod));
                lastOrder.current = "mod"
                break;
            case "rmod":
                setSharedFilesArray(sharedFilesArray.sort(compareFn_rmod));
                lastOrder.current = "rmod"
                break;
            case "size":
                setSharedFilesArray(sharedFilesArray.sort(compareFn_size));
                lastOrder.current = "size"
                break;
            case "rsize":
                setSharedFilesArray(sharedFilesArray.sort(compareFn_rsize));
                lastOrder.current = "rsize"
                break;
        }
    }

    function filesLoopRow ()  {
        var res: React.JSX.Element [] = []
        var i = 0
        console.log(input_text)
        if (input_text === "") {
            for (i = 0; i < sharedFilesArray.length; i++) {
                const file = sharedFilesArray[i]
                res.push(
                    <DataListRow style={{height:'70px', width: '100%'}}>
                        <Box width={'25%'}>
                            {/*@ts-ignore*/}
                            <Button onMouseDown={handleMouseDown} onClick={() => handleMoreOptions(file)}>
                                {/*@ts-ignore*/}
                                <p>{selectIcon(file.ArchivoCompartido)}{file.ArchivoCompartido.length <= 65  ? file.ArchivoCompartido : file.ArchivoCompartido.slice(0,61)+".."+file.ArchivoCompartido.slice(file.ArchivoCompartido.length-4,file.ArchivoCompartido.length)}</p>
                            </Button>
                        </Box>
                        <Box width={'25%'} style={{transform: 'translate(200px, 0px)'}}>
                            {/*@ts-ignore*/}
                            <p style={{position:'relative',alignItems:'center'}}>{file.correoOwner}</p>
                        </Box>
                        <Box width={'25%'} style={{transform: 'translate(250px, 0px)'}}>
                            {/*@ts-ignore*/}
                            <p style={{position:'relative',alignItems:'center'}}>{file.fechacompartido}</p>
                        </Box>
                        <Box width={'25%'} style={{transform: 'translate(250px, 0px)'}}>
                            {/*@ts-ignore*/}
                            <p style={{position:'relative',alignContent:'center'}}>{reformatSize(file.tamañoArchivo)}</p>
                        </Box>
                    </DataListRow>
                )
            }
            return res
        }
        else {
            for (i = 0; i < sharedFilesArray.length; i++) {
                //@ts-ignore
                if (sharedFilesArray[i].ArchivoCompartido.includes(input_text)) {
                    const file = sharedFilesArray[i]
                    res.push(
                        <DataListRow style={{height:'70px', width: '100%'}}>
                            <Box width={'25%'}>
                                {/*@ts-ignore*/}
                                <Button onMouseDown={handleMouseDown} onClick={() => handleMoreOptions(file)}>
                                    {/*@ts-ignore*/}
                                    <p>{selectIcon(file.ArchivoCompartido)}{file.ArchivoCompartido.length <= 65  ? file.ArchivoCompartido : file.ArchivoCompartido.slice(0,61)+".."+file.ArchivoCompartido.slice(file.ArchivoCompartido.length-4,file.ArchivoCompartido.length)}</p>
                                </Button>
                            </Box>
                            <Box width={'25%'} style={{transform: 'translate(200px, 0px)'}}>
                                {/*@ts-ignore*/}
                                <p style={{position:'relative',alignItems:'center'}}>{file.correoOwner}</p>
                            </Box>
                            <Box width={'25%'} style={{transform: 'translate(250px, 0px)'}}>
                                {/*@ts-ignore*/}
                                <p style={{position:'relative',alignItems:'center'}}>{file.fechacompartido}</p>
                            </Box>
                            <Box width={'25%'} style={{transform: 'translate(250px, 0px)'}}>
                                {/*@ts-ignore*/}
                                <p style={{position:'relative',alignContent:'center'}}>{reformatSize(file.tamañoArchivo)}</p>
                            </Box>
                        </DataListRow>
                    )
                }
            }
            return res
        }
    }

    function handleRowOrder (section: string) {
        switch (section) {
            case "name":
                setNameState(!name_state);
                //@ts-ignore
                name_state ? filesSorter("name") : filesSorter("rname");
                //@ts-ignore
                setFilesRow(filesLoopRow());
                break;
            case "owner":
                setOwnerState(!owner_state);
                //@ts-ignore
                owner_state ? filesSorter("owner") : filesSorter("rowner");
                //@ts-ignore
                setFilesRow(filesLoopRow());
                break;
            case "mod":
                setModState(!mod_state);
                //@ts-ignore
                mod_state ? filesSorter("mod") : filesSorter("rmod");
                //@ts-ignore
                setFilesRow(filesLoopRow());
                break;
            case "size":
                setSizeState(!size_state);
                //@ts-ignore
                size_state ? filesSorter("size") : filesSorter("rsize");
                //@ts-ignore
                setFilesRow(filesLoopRow());
                break;
        }
    }

    function swapIconOrder (section: string) {
        var aux: boolean = false;
        switch (section) {
            case "name":
                aux = name_state;
                break;
            case "owner":
                aux = owner_state;
                break;
            case "mod":
                aux = mod_state;
                break;
            case "size":
                aux = size_state;
                break;
        }
        if (aux) return <ArrowDropDownIcon />
        else return <ArrowDropUpIcon />
    }

    function handleShare(share: string) {
        const sendData = async () => {
                const userData = {
                    new_user: share,
                }
                try {
                const response = await fetch(`${backendUrl}/archivo/compartir`, {
                    method: "PUT",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });
                if (response.ok) {
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

    function handleDelete() {
        const sendData = async () => {
                const userData = {
                    _id: optionFile.current._id,
                    token: localStorage.getItem("token"),
                    correo: localStorage.getItem("email")
                }
                try {
                const response = await fetch(`${backendUrl}/compartido/eliminarArchivoCompartido`, {
                    method: "DELETE",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });
                if (response.ok) {
                    fetchData()
                    setMOptionsState(false)
                    
                } else {
                    alert("An error ocurred while trying to remove this shared file. Please try again later.");
                }
                } catch (error) {
                console.error("Error at data rename:", error);
                alert("An unexpected error ocurred while trying to remove this shared file. Please try again later.");
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
            try {
            const response = await fetch(`${backendUrl}/compartido/obtener`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const data = await response.json()
                window.open(data.message)
                setMOptionsState(false)                
            } else {
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
                            }}>{selectIcon(optionFile.current.ArchivoCompartido)}</DataFile>
                        </Box>
                        <p style={{
                            maxWidth:'270px', 
                            wordWrap: 'break-word', 
                            margin: '0px 0px 0px 25px',
                            alignSelf:'center'
                            }}><b>{optionFile.current.ArchivoCompartido}</b></p>
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
                                }}>{optionFile.current.fechacompartido}</p>
                            </Box>
                        </Box>
                        <Box sx={{display:'flex'}}>
                            <Box sx={{
                                width:'30%',
                                margin: '0px 0px 0px 20px',
                            }}>
                                <p>original owner:</p>
                            </Box>
                            <Box sx={{
                                width:'62%',
                                margin: '0px 0px 0px 0px',
                            }}>
                                <p style={{
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                }}>{optionFile.current.correoOwner}</p>
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
                                }}>{reformatSize(parseInt(optionFile.current.tamañoArchivo))}</p>
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
                                }}>{timesShared.current}</p>
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
                                }}>{timesDownloaded.current}</p>
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
                            }}>{selectIcon(optionFile.current.ArchivoCompartido)}</DataFile>
                        </Box>
                        <p style={{
                            maxWidth:'270px', 
                            wordWrap: 'break-word', 
                            margin: '0px 0px 0px 25px',
                            alignSelf:'center'
                            }}><b>{optionFile.current.ArchivoCompartido}</b></p>
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
                            }} variant='contained' onClick={() => handleShare(optionShare.current)}>
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
                        fontSize: "15px"}}>My Shared Files</text>
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
                        }} onClick={handleDelete}>
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
                <DataListRow>
                    <Box width={'25%'}>
                        <p><b>Name
                        <Button onClick={() => handleRowOrder("name")} >
                            {swapIconOrder("name")}
                        </Button> </b></p>
                    </Box>
                    <Box width={'25%'} style={{transform: 'translate(200px, 0px)'}}>
                    <p><b>Owner
                        <Button onClick={() => handleRowOrder("owner")} >
                            {swapIconOrder("owner")}
                        </Button></b></p>
                    </Box>
                    <Box width={'25%'} style={{transform: 'translate(250px, 0px)'}}>
                    <p><b>Last Modified
                        <Button onClick={() => handleRowOrder("mod")} >
                            {swapIconOrder("mod")}
                        </Button></b></p>
                    </Box>
                    <Box width={'25%'} style={{transform: 'translate(250px, 0px)'}}>
                    <p><b>File Size
                        <Button onClick={() => handleRowOrder("size")} >
                            {swapIconOrder("size")}
                        </Button></b></p>
                    </Box>
                </DataListRow>
                
                <Box sx={{
                    maxHeight: '700px',
                    maxWidth:'1600px',
                    overflowY:'scroll',
                    overflowX:'hidden'
                }}>
                <div/>
                    {filesRow} 
                <div/>  

                </Box>
            </div>
        </DataContainer>
    )
}
export default Data;
