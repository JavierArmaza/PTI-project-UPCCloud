import styled from 'styled-components';
import React, { useRef } from 'react';
import { PaletteMode } from '@mui/material';

import { Gauge } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';


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


interface DataProps {
    mode: PaletteMode;
    filesArray: [];
    setFilesArray: (arg0: []) => void;
    diskmax: number;
}
  

function Data ({ mode, filesArray, diskmax }: DataProps) {

    var diskusage = useRef(0)

    function calcDiskUsage() {
        diskusage.current = 0
        for (var i = 0; i < filesArray.length; i++) {
            //@ts-ignore
            diskusage.current += parseInt(filesArray[i].tamano)
        }
    }

    function mapTypes () {
        if (filesArray.length > 0) {
            var filetype = new Map()
            for (var i = 0; i < filesArray.length; i++) {
                //@ts-ignore
                var offset = filesArray[i].nombreArchivo.length
                //@ts-ignore
                while (filesArray[i].nombreArchivo[offset] !== '.') {
                    --offset;
                    if (offset <= 0) break;
                }
                var format: any;
                if (offset > 0) {
                    //@ts-ignore
                    format = filesArray[i].nombreArchivo.slice(offset,filesArray[i].nombreArchivo.length);
                }
                else {
                    format = "undefined"
                }
                if (filetype.has(format)) filetype.get(format).count++
                else filetype.set(format,{count:1})
            }
            var res = [{}]
            var filetype2 = new Map([...filetype.entries()].sort((a,b) => b[1].count - a[1].count))
            var pos = 0;
            for (const [key, count] of filetype2) {
                res.push({id: pos, value: count.count, label: key})
                pos++
            }
            return res
        }
        else return []

    }

    function formatDataset () {
        var res = [{size:0,month:"Jan"},{size:0,month:"Feb"},{size:0,month:"Mar"},{size:0,month:"Apr"},
        {size:0,month:"May"},{size:0,month:"Jun"},{size:0,month:"Jul"},{size:0,month:"Aug"},
        {size:0,month:"Sep"},{size:0,month:"Oct"},{size:0,month:"Nov"},{size:0,month:"Dec"}]
        if (filesArray.length > 0) {
            for (var i = 0; i < filesArray.length; i++) {
                //@ts-ignore
                res[new Date(filesArray[i].fecha).getMonth()].size += parseFloat(filesArray[i].tamano)/1000000
            }
            for (var j = 0; j < res.length; j++) {
                res[j].size = parseFloat((res[j].size).toFixed(2))
            }
        }
        return res;
    }

    function reformatSize(size: number) {
        if ((size / 1000000000) >= 1) return (size / 1000000000).toFixed(2) + "GB";
        else if ((size / 1000000) >= 1) return (size / 1000000).toFixed(2) + "MB";
        else if ((size / 1000) >= 1) return (size / 1000).toFixed(2) + "KB";
        else return size + "B";
    }
    
    const chartSetting = {
        xAxis: [
          {
            label: 'Size in MB',
          },
        ],
        width: 800,
        height: 350,
      };
    //@ts-ignore
    const valueFormatter = (value: number | null) => `${(reformatSize(value*1000000))}`;
    const dataset = formatDataset();

    function compareFn_rmod (a, b) {
        if (new Date(a.fecha) < new Date(b.fecha)) return -1;
        else if (new Date(a.fecha) > new Date(b.fecha)) return 1;
        else return 0;
    }


    function formatDatesLine () {
        if (filesArray.length > 0) {
            var newfiles= filesArray.sort(compareFn_rmod);
            var res = []
            for (var i = 0; i < newfiles.length; i++) {
                //@ts-ignore
                res.push(new Date(newfiles[i].fecha))
            }
            return res;
        }
        else return [];
    }

    function formatSizesLine () {
        if (filesArray.length > 0) {
            var newfiles= filesArray.sort(compareFn_rmod);
            //@ts-ignore
            var res = [parseFloat(newfiles[0].tamano)/1000000]
            for (var i = 1; i < newfiles.length; i++) {
                //@ts-ignore
                res.push(parseFloat(newfiles[i].tamano)/1000000+res[i-1])
            }
            return res;
        }
        else return [];
    }

    const datesLine = formatDatesLine();
    const sizesLine = formatSizesLine();

    calcDiskUsage()

    return (
        <DataContainer style={{margin: '0px 20px 0px 00px', maxWidth:'1600px', maxHeight:'100vh', overflowY:'scroll'}}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
                <Stack direction={{ xs: 'row', md: 'column' }} spacing={{ xs: 1, md: 3 }} sx={{maxWidth:'40vw', width:'40vw'}}>
                    <DataHeader>
                        <div className="headerLeft">
                            <text style={{color: 
                                mode === "light"
                                    ? "black"
                                    : 'rgba(190, 190, 190, 1)', 
                                fontSize: "15px"}}>Storage space used</text>
                        </div>
                    </DataHeader>
                    
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
                        <Gauge width={400} height={300} value={(diskusage.current/diskmax)*100} startAngle={-110} endAngle={110}
                            sx={{fontSize:30}} 
                            text={`${(reformatSize(diskusage.current))} / ${(reformatSize(diskmax))}`} />
                    </Stack>

                    <DataHeader>
                        <div className="headerLeft">
                            <text style={{color: 
                                mode === "light"
                                    ? "black"
                                    : 'rgba(190, 190, 190, 1)', 
                                fontSize: "15px"}}>File type uploaded</text>
                        </div>
                    </DataHeader>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}
                        sx= {{marginTop:'50px', marginBottom:'20px',transform: 'translate(40px,0px)'}}>
                        <PieChart
                            series={[
                                {
                                //@ts-ignore
                                data: mapTypes()
                                },
                            ]}
                            width={600}
                            height={350}
                            />
                    </Stack>       
                </Stack>
                <Stack direction={{ xs: 'row', md: 'column' }} spacing={{ xs: 1, md: 3 }} sx={{maxWidth:'40vw', width:'40vw'}}>
                    <Stack direction={{ xs: 'row', md: 'column' }} spacing={{ xs: 1, md: 3 }} sx={{maxWidth:'40vw', width:'40vw'}}>
                        <DataHeader>
                            <div className="headerLeft">
                                <text style={{color: 
                                    mode === "light"
                                        ? "black"
                                        : 'rgba(190, 190, 190, 1)', 
                                    fontSize: "15px"}}>Storage progression over time</text>
                            </div>   
                        </DataHeader>   
                            <LineChart
                                xAxis={[
                                    {
                                    id: 'Date',
                                    data: datesLine,
                                    scaleType: 'time',
                                    },
                                ]}
                                series={[
                                    {
                                        id: 'Current',
                                        label: 'Used space in MB',
                                        data: sizesLine,
                                        area: true,
                                        showMark: false,
                                        color:'DodgerBlue'
                                        },
                                        {
                                        id: 'Total',
                                        label: 'Total space in MB',
                                        data: new Array(sizesLine.length).fill(diskmax/1000000),
                                        area: true,
                                        showMark: false,
                                        color: 'lightblue'
                                        }                                    
                                ]}
                                width={800}
                                height={300}
                                margin={{ left: 70 }}
                                />
                    </Stack>
                    <Stack direction={{ xs: 'row', md: 'column' }} spacing={{ xs: 1, md: 3 }} sx={{maxWidth:'40vw', width:'40vw'}}>
                        <DataHeader>
                            <div className="headerLeft">
                                <text style={{color: 
                                    mode === "light"
                                        ? "black"
                                        : 'rgba(190, 190, 190, 1)', 
                                    fontSize: "15px"}}>Storage used per month</text>
                            </div>   
                        </DataHeader>   
                        <BarChart
                            dataset={dataset}
                            yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                            series={[{ dataKey: 'size', valueFormatter }]}
                            layout="horizontal"
                            {...chartSetting}
                            sx={{transform: 'translate(0px,-40px)', marginBottom:'-50px'}}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </DataContainer>
    )
}
export default Data;
