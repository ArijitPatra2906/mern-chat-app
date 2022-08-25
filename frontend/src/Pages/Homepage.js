import React, { useEffect } from "react";
import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from "@chakra-ui/react";
import Login from "../components/Login";
import Register from "../components/Register";

import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (user) {
            navigate("/chats");
        }
    }, [navigate]);
    return (
        <Container maxW="xl">
            <Box
                d="flex"
                justifyContent="center"
                bg={"white"}
                w="100%"
                m="20px 0 10px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" fontFamily="work sans" textAlign="center">
                    Talk-A-Tive
                </Text>
            </Box>
            <Box bg="white" w="100%" p={3} borderRadius="lg" color="black" borderWidth="1px">
                <Tabs variant="soft-rounded">
                    <TabList mb="5px">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Register />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default Homepage;
