import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from "../../Context/ChatProvider"
import SingleChat from './SingleChat'


function Chatbox({ fetchAgain, setFetchAgain }) {

    const { selectedChat } = ChatState()
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            // h={{ base: "95%", md: "100%" }}
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default Chatbox