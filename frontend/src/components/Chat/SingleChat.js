import { Box, FormControl, FormLabel, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { AddIcon, ArrowBackIcon, AttachmentIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from '../../Config/Chatlogic';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../../animation/typingAnimation.json"

const ENDPOINT = "https://chat-app-talk-a-tive.herokuapp.com/";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
    const { user, setSelectedChat, selectedChat, notification, setNotification } = ChatState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState([])
    const [socketConnected, setSocketConnected] = useState(false)
    const toast = useToast()

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        renderSettings: {
            preserveAspectRatio: "xidYMid slice"
        }
    }


    const fetchMessage = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            setLoading(true)
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            // console.log(data);

            setMessages(data)
            setLoading(false)
            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    }

    const sendMessage = async () => {
        socket.emit("stop typing", selectedChat._id)
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }
            setNewMessage("");
            const { data } = await axios.post("/api/message", {
                content: newMessage,
                chatId: selectedChat._id,
                pic: pic
            },
                config
            );
            console.log(data)

            socket.emit("new message", data)
            setMessages([...messages, data])
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to send the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }

    }
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user)
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])

    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        console.log(pics);
        if (
            pics.type === "image/jpeg" ||
            pics.type === "image/png" ||
            pics.type === "image/gif"
            // pics.type === "image/jpg"
            // cloudinary://153322855229737:SH7JbgUfHNoSbDqKMeNJiIAPsfM@ar1stin
        ) {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "ar1stin");
            fetch("https://api.cloudinary.com/v1_1/ar1stin/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPicLoading(false);
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
    };

    useEffect(() => {
        fetchMessage()
        selectedChatCompare = selectedChat;
    }, [selectedChat]);
    // console.log(notification, "--------------------");
    useEffect(() => {
        socket.on("message recived", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })


    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        // borderBottom="1px solid black"
                        // boxShadow="0 0 3px 0 #38B2AC "
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        textTransform="capitalize"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none", }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal
                                    user=
                                    {getSenderFull(user, selectedChat.users)}
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName}
                                <UpdateGroupChatModal
                                    // fetchMessages={fetchMessages}
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
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                color="teal"
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className='messages' style={{
                                display: "flex",
                                flexDirection: "coloumn",
                                overflowY: "scroll",
                                scrollbarWidth: "none"
                            }}>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        {isTyping ? <div style={{ background: "transparent" }}>
                            <Lottie
                                style={{ marginBottom: 15, marginLeft: 0 }}
                                width={70}
                                options={defaultOptions}
                            />
                        </div> : ("")}

                        <FormControl display="flex" alignItems="center" isRequired>
                            <label for="image" style={{ marginRight: "10px" }}>
                                <AttachmentIcon />
                            </label>
                            <Input
                                id='image'
                                style={{ display: "none" }}
                                type="file"
                                p={1.5}
                                accept="image/*"
                                onChange={(e) => postDetails(e.target.files[0])}
                            />

                            <Input
                                variant="filled"
                                bg="white"
                                // border="1px solid teal"
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={typingHandler}
                            />
                            <IconButton
                                isLoading={picLoading}
                                onClick={sendMessage}
                                bg="teal"
                                icon={<ChevronRightIcon fontSize={30} />}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chat
                    </Text>
                </Box>
            )
            }
        </>
    )
}

export default SingleChat
