import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, effect, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import ChatLoading from './ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../Config/Chatlogic'
import NotificationBadge, { Effect } from "react-notification-badge"
function SideDrawer() {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [chatLoading, setChatLoading] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const navigate = useNavigate()
    const toast = useToast()

    const logOut = () => {
        localStorage.removeItem("userInfo")
        navigate("/")
    }

    const handleUser = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-middle",
            });
            return
        }
        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-middle",
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setChatLoading(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post("/api/chat", { userId }, config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
            setSelectedChat(data)
            setChatLoading(false)
            onClose()
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-middle",
            });
        }
    }
    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>

                    <Button variant="ghost" onClick={onOpen}>
                        <i class="fas fa-search"></i>
                        <Text px="4" display={{ base: "none", md: "flex" }}>
                            Search User
                        </Text>
                    </Button>

                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work-sans">Talk-A-tive</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={6}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notify) => (
                                <MenuItem key={notify._id} onClick={() => {
                                    setSelectedChat(notify.chat);
                                    setNotification(notification.filter((n) => n !== notify))
                                }}>
                                    {notify.chat.isGroupChat ? `New Message in ${notify.chat.chatName}` : `New Message from ${getSender(user, notify.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} p={1}>
                            <Avatar size="sm" cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logOut}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Search User</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleUser}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {chatLoading && <Spinner ml='auto' d="flex" />}
                    </DrawerBody>
                </DrawerContent>


            </Drawer>
        </>
    )
}

export default SideDrawer
