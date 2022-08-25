import { Badge } from '@chakra-ui/react'
import React from 'react'
import { CloseIcon } from "@chakra-ui/icons"
function UserBadgeItem({ user, handleFunction }) {
    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme="purple"
            cursor="pointer"
            alignItems="center"
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon pl={1} alignItems="center" ml={2} mt={-1} />
        </Badge>
    )
}

export default UserBadgeItem
