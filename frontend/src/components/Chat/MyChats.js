import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender } from '../../Config/Chatlogic';
import { ChatState } from '../../Context/ChatProvider';
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal';

function MyChats({ fetchAgain }) {
    const [loggedUser, setLogedUser] = useState()
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const toast = useToast()

    const fetchChats = async () => {
        // console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            // console.log(data);
            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-middle",
            });
        }
    };

    useEffect(() => {
        setLogedUser(JSON.parse(localStorage.getItem("userInfo")))
        fetchChats()
        // eslint-disable-next-line
    }, [fetchAgain])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            // marginLeft={{ md: "450px" }}
            p={3}
            bg="white"
            h={{ base: "620px", md: "580px" }}
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "19px", md: "30px" }}
                fontFamily="Work sans"
                fontWeight={{ base: 700 }}
                display="flex"
                // w="90%"
                justifyContent="space-between"
                alignItems="center"
            >
                <Text
                    textAlign="left"
                    marginRight="50px"
                >My Chats</Text>
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "16px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}>
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>

            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    )
}

export default MyChats
