import {
  Box,
  IconButton,
  Spinner,
  Text,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
  useColorMode,
  InputLeftElement,
} from "@chakra-ui/react";
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { useEffect, useState, useRef } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "../Components/miscellameous/ProfileModal";
import CallModal from "./miscellameous/CallModal.js";
import UpadteGroupChatModal from "./miscellameous/UpadteGroupChatModal";
import axios from "axios";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import animationData1 from "../animations/welcome.json";

//development
// const ENDPOINT = "http://localhost:3000";

//production
const ENDPOINT = "http://chatting-app-0.herokuapp.com/";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConneted, setsocketConneted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputM = useRef();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const iconsVisibility = () => {
    setVisible(!visible);
  }
  const onEmojiClick = async (event, emojiObject) => {
    await setChosenEmoji(emojiObject);
    var start = inputM.current.selectionStart;
    var startM = newMessage.slice(0,start);
    var endM = newMessage.slice(start);
    var msg = startM + emojiObject.emoji + endM;
    await setNewMessage(msg);
    inputM.current.focus();
    inputM.current.selectionEnd = start+2;
  };

  const defaultOptions1 = {
    loop: true,
    autoplay: true,
    animationData: animationData1,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const fetchMessage = async (req, res) => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessage(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setsocketConneted(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessage([...message, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage!=="") {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage(" ");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessage([...message, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConneted) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 5000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <span style={{ display: "flex" }}>
                  <CallModal />
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </span>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpadteGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg={colorMode === "light" ? "#e8e8e8" : "black"}
            w="100%"
            h="100%"
            pr={0}
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages" id="chatBox">
                <ScrollableChat message={message} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Box display="flex">
                <InputGroup>
                  <InputLeftElement>
                    <button id="myBtn">
                      <BsEmojiSmileFill
                        size={30}
                        color={colorMode === "light" ? "#080420" : "yellow"}
                        onClick={() => iconsVisibility()}
                      />
                    </button>
                    <div
                      id="myModal"
                      class="modal"
                      style={{ visibility: visible ? "visible" : "hidden" }}
                    >
                      <div class="modal-content" id="modal-content">
                        <Picker
                          id="chatBox"
                          width="280px"
                          onEmojiClick={onEmojiClick}
                        />
                      </div>
                    </div>
                  </InputLeftElement>
                  <Input
                    varient="filled"
                    bg="##bdbdbd"
                    ref={inputM}
                    value={newMessage}
                    placeholder="Enter a message..."
                    onChange={typingHandler}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      colorScheme="blue"
                      h={{ base: "100%", md: "96%" }}
                      size={{ base: "sm", md: "md" }}
                      onClick={(e) => sendMessage(e)}
                      borderRadius={{ base: "3xl", md: "3" }}
                    >
                      <Text mx="1" display={{ base: "none", md: "flex" }}>
                        Send
                      </Text>
                      <i className="fas fa-paper-plane"></i>
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" h="100%">
          <Box>
            <Lottie
              options={defaultOptions1}
              height="45vh"
              style={{ marginBottom: 15, marginLeft: 0 }}
            />
            <Text pb={3} fontSize={36} fontFamily="Work sans">
              Click on a user to start chatting
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
