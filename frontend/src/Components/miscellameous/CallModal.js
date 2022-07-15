import { PhoneIcon } from "@chakra-ui/icons";
import {
  IconButton, useColorMode,
} from "@chakra-ui/react";
import React from "react";

const CallModal = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const callHandler = () => {};

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<PhoneIcon />}
        bg={colorMode === "light" ? "#edf2f7" : "black"}
        marginX="6px"
        onClick={callHandler}
      />
    </>
  );
};

export default CallModal;
