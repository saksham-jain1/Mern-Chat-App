import { Avatar, Tooltip, useColorMode } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ message }) => {
  const { user } = ChatState();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <ScrollableFeed id="chatBox">
      {message &&
        message.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(message, m, i, user._id) ||
              isLastMessage(message, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr="1"
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id
                    ? colorMode === "light"
                      ? "#bee3f8"
                      : "#2B6CB0"
                    : colorMode === "light"
                    ? "#b9f5d0"
                    : "#2F855A"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(message, m, i, user._id),
                marginTop: isSameUser(message, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
