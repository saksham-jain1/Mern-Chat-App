import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/miscellameous/SideDrawer";
import { Box } from "@chakra-ui/react";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { useState } from "react";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <>
      {Object.keys(user) !==0 && (
        <div style={{ width: "100%" }}>
          <SideDrawer />
          <Box
            display="flex"
            justifyContent="space-between"
            w="100%"
            h={{ base: "86vh", md: "91.5vh" }}
            p="10px"
          >
            <MyChats fetchAgain={fetchAgain} />

            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Box>
        </div>
      )}
    </>
  );
};

export default Chatpage;
