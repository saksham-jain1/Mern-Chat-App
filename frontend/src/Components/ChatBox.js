import React from 'react'
import {ChatState} from "../Context/ChatProvider";
import {Box, useColorMode} from "@chakra-ui/react"
import SingleChat from "../Components/SingleChat"

const ChatBox = ({fetchAgain,setFetchAgain}) => {

  const { selectedChat } = ChatState();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      width={{ base: "100%", md: "68%" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg={colorMode === "light" ? "white" : "#262626"}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />{" "}
    </Box>
  );
}

export default ChatBox