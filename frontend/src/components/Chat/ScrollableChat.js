import { Avatar, Box, Image, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSenderMargin, isSameUser, isSemSender } from '../../Config/Chatlogic'
import { ChatState } from '../../Context/ChatProvider'


const ScrollableChat = ({ messages }) => {

    const { user } = ChatState()
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <div style={{ display: "flex" }} key={m._id}>
                    {(isSemSender(messages, m, i, user._id)
                        || isLastMessage(messages, i, user._id)
                    ) && (
                            <Tooltip
                                label={m.sender.name}
                                placement="bottom-start"
                                hasArrow
                            >
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        )}
                    {m.content ? (
                        <Box
                            textAlign="right"
                            marginLeft={{ base: isSameSenderMargin(messages, m, i, user._id) ? 320 : 0, md: isSameSenderMargin(messages, m, i, user._id) ? 70 : 0 }}
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                // marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                borderRadius: "20px",
                                // marginLeft: "200px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                                marginBottom: "20px",
                            }}>
                            {m.content}
                        </Box>
                    ) : ("")}

                    {m.pic ? (
                        <Box
                        // ml={{ base: isSameSenderMargin(messages, m, i, user._id) ? 600 : 0 }}
                        >
                            <Image
                                // ml={{ base: "1", md: "8" }}
                                // mr="100px"
                                w={{ base: "60%", md: "80%" }}
                                src={m.pic}
                                mb={4}
                            />
                        </Box>

                    ) : ("")}
                </div>
            ))
            }
        </ScrollableFeed >
    )
}

export default ScrollableChat