import { ChatState } from "../Context/ChatProvider"
import SideDrawer from "../Components/miscellameous/SideDrawer";
import { Box } from "@chakra-ui/react";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { useState } from "react";


const Chatpage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{width:'100%'}}>
    <div>
      Loading...
    </div>
        {user && <SideDrawer/> }
        <Box
        display='flex'
        justifyContent="space-between"
        w="100%"
        h={{ base: "86vh", md: "91.5vh" }}
        p="10px"
        >
          {user && (<MyChats fetchAgain={fetchAgain} />)}
          {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
        </Box>
    </div>
  )
}

export default Chatpage
