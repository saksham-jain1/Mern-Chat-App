import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import { useColorMode } from '@chakra-ui/react';
import React from 'react'

const UserBadgeItem = ({user , handleFunction}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="purple"
      cursor="pointer"
      textColor={colorMode === "light" ? "black" : "white"}
    >
      {user.name}
      <CloseIcon pl={1} onClick={handleFunction} />
    </Box>
  );
}

export default UserBadgeItem