import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, useToast, Button, Stack, Text, useColorMode, Avatar } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getLatestMessage, getSender, getSenderFull } from "../config/ChatLogics";
import GroupChatModal from "../Components/miscellameous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.log(error)
      toast({
        title: "Error Occured!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={colorMode === "light" ? "white" : "#262626"}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bg={colorMode === "light" ? "#edf2f7" : "black"}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg={colorMode === "light" ? "white" : "black"}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowy="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
              >
                {!chat.isGroupChat ? (
                  <Avatar
                    mr={2}
                    size="md"
                    cursor="pointer"
                    name={getSenderFull(loggedUser, chat.users).name}
                    src={getSenderFull(loggedUser, chat.users).pic}
                  />
                ) : (
                  <Avatar
                    mr={2}
                    size="md"
                    cursor="pointer"
                    name={chat.chatName}
                    src={chat.chatName}
                  />
                )}
                <Box>
                  <Text fontSize={20} fontWeight="normal">
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  <Text fontWeight="light" fontSize={14}>
                    {getLatestMessage(chat, loggedUser)}
                  </Text>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
