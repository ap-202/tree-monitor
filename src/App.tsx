import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, SimpleGrid, Table, TableData, AppShell, Burger, Center, Title, Text, UnstyledButton, ActionIcon } from '@mantine/core'
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {IconDeviceDesktopAnalytics} from '@tabler/icons-react'



function App() {
    // individual_courses: {"CS 1301": 1, "CS 1331": 2, "CS 1332": 3}
    //individual_courses: {"PHYS 2122": 3, "MATH 3012": 4, "ISYE 3770": 6}
    
    const data = [
        {date: "1234bdscdef", total_courses_searched: 7, total_duration: 1554},
        {date: "5678hijaskl", total_courses_searched: 4, total_duration: 1009},
        {date: "1234aabcdef", total_courses_searched: 6, total_duration: 1909},
        {date: "5678hijklsh", total_courses_searched: 4, total_duration: 1919},
        {date: "12345cdef12", total_courses_searched: 1, total_duration: 1419},
        {date: "56789ijklfd", total_courses_searched: 3, total_duration: 2919}
    ]

    const firebaseConfig = {
    apiKey: "AIzaSyB9_gnWKRWeYmND9tRzO7j3xK9Reg8-NpQ",
    authDomain: "tree-app-1f060.firebaseapp.com",
    databaseURL: "https://tree-app-1f060-default-rtdb.firebaseio.com",
    projectId: "tree-app-1f060",
    storageBucket: "tree-app-1f060.appspot.com",
    messagingSenderId: "702893689283",
    appId: "1:702893689283:web:a8de0008a0b32c11c21576"
    };

    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);

   const [table_data, setTableData] = useState([])
   const [opened, { toggle }] = useDisclosure();


    let tableRows:any = []

    useEffect(() => {
        fetchData()
        console.log(table_data)
    }, [])

    // useEffect(() => {
    //     tableRows = 
    // }, [table_data])

    const fetchData = async () => {
        const col = await getDocs(collection(firestore, "metrics"));
        let temp: any = []
        col.forEach((d) => {
            // table_data.push({
            //     session_id:d.
            // })
            let dat = d.data()
            let converted_list_str = convert_list(dat.individual_courses)
            console.log(converted_list_str)
            const row_data = {
                session_id: d.id,
                date: dat.date,
                total_courses_searched: dat.total_courses_searched,
                total_duration: dat.total_duration +"",
                individual_courses: converted_list_str
            }
            temp.push(row_data)
        });
        setTableData(temp)
    };

    const convert_list = (dict:any) => {
        let str = ""
        Object.keys(dict).forEach((key) => {
            str += "("+key+": "+dict[key]+"), "
        })
        return str.substring(0, str.length - 2)
    }
    
    const theme = createTheme({
        primaryColor: 'cyan'
      });


  return (
    <MantineProvider theme={theme}>
        <AppShell header={{height: 75}} >
            {/* navbar={{breakpoint: 'sm',width: 150}} */}
            <AppShell.Header p="md">
                <Title style={{color:"#2196f3"}}>Tree Monitor</Title>
            </AppShell.Header>
            {/* <AppShell.Navbar p="md">
                <UnstyledButton>Settings</UnstyledButton>
            </AppShell.Navbar> */}
            <AppShell.Main> 
                <Table.ScrollContainer minWidth={800} p="xl">
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Th>date</Table.Th>
                            <Table.Th>session_id</Table.Th>
                            <Table.Th>total_courses_searched</Table.Th>
                            <Table.Th>total_duration (seconds) </Table.Th>
                            <Table.Th>individual_course_durations (seconds)</Table.Th>
                        </Table.Thead>
                        <Table.Tbody>{table_data.map((x:any) => (
                            <Table.Tr key={x.session_id}>
                                <Table.Td>{new Date(x.date.seconds*1000).toLocaleDateString("en-US",{year: 'numeric', month: 'long', day: 'numeric'})}</Table.Td>
                                <Table.Td>{x.session_id}</Table.Td>
                                <Table.Td>{x.total_courses_searched}</Table.Td>
                                <Table.Td>{x.total_duration}</Table.Td>
                                <Table.Td>{x.individual_courses}</Table.Td>
                            </Table.Tr>
                        ))}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </AppShell.Main>
        </AppShell>
    </MantineProvider>
  );
}

export default App;
