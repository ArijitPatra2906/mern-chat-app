import { Box } from '@chakra-ui/react';
import React, { useState } from 'react'
import Chatbox from '../components/Chat/Chatbox';
import MyChats from '../components/Chat/MyChats';
import SideDrawer from '../components/Chat/SideDrawer';
import { ChatState } from '../Context/ChatProvider'

function Chatpage() {

    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                display="flex" justifyContent="space-between" width="100%" height="91.5vh" padding="10px">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}

            </Box>
        </div>
    )
}

export default Chatpage
