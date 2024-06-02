import * as React from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from '../landing-page/getLPTheme.tsx';
import { useEffect, useRef } from 'react';

import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import Data from './components/Data.tsx';
import DataTrash from './components/DataTrash.tsx';
import DataStorage from './components/DataStorage.tsx';
import DataShared from './components/DataShared.tsx';
//import DataRecent from './components/DataRecent.tsx';

import { backendUrl } from '../config.tsx';


export default function StoragePage() {
  const start_mode = (localStorage.getItem("mode") === null ? 'light' : localStorage.getItem("mode"));
  //@ts-ignore
  const [mode, setMode] = React.useState<PaletteMode>(start_mode);
  const LPtheme = createTheme(getLPTheme(mode));
  const [input_text, setInputTextState] = React.useState("");
  const [side_selection, setSideSelection] = React.useState("MyFiles");

  const [filesArray, setFilesArray] = React.useState([]);

  var diskusage = useRef(500000000);
  var diskmax = useRef(1000000000);


  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    localStorage.setItem("mode",mode === 'light' ? 'dark' : 'light');
  };

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
        }    
        else if (response.status === 404) {
          console.log("No files yet")
        }
        else {
            alert("An unexpected error ocurred while trying to load your files. Please try again later.");
            console.log(response.status)
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

  function renderSelection () {
    switch (side_selection) {
      case "MyFiles":
        //@ts-ignore
        return <Data mode={mode} input_text={input_text} filesArray={filesArray} setFilesArray={setFilesArray} />
      case "Shared":
        return <DataShared mode={mode} input_text={input_text} />
      case "Trash":
        //@ts-ignore
        return <DataTrash mode={mode} input_text={input_text} filesArray={filesArray} setFilesArray={setFilesArray} />
      case "Storage":
        //@ts-ignore
        return <DataStorage mode={mode} input_text={input_text} filesArray={filesArray} setFilesArray={setFilesArray} diskusage={diskusage.current} diskmax={diskmax.current}/>
    }
  }
  
  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <div style={{maxHeight:'100vh', overflowY:'hidden', overflowX:'hidden'}}>
        <Header mode={mode} toggleColorMode={toggleColorMode} setInputTextState={setInputTextState}/>
        <div style={{display:'flex'}}>
          {/*@ts-ignore*/}
          <Sidebar mode={mode} diskmax={diskmax.current} setSideSelection={setSideSelection} filesArray={filesArray} setFilesArray={setFilesArray}/>
          {renderSelection()}
        </div>
      </div>
    </ThemeProvider>
  );
}
