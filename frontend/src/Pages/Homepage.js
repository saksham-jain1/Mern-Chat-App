import React from 'react'
import Login from '../Components/Authentication/Login'
import SignUp from '../Components/Authentication/SignUp'
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Homepage = () => {
  const history = useHistory();
    const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={colorMode === "light" ? "white" : "black"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize={"4xl"}
          fontFamily="WOrk sans"
          textAlign={"center"}
        >
          Chatting App
        </Text>
      </Box>
      <Box
        p={4}
        bg={colorMode === "light" ? "white" : "black"}
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage