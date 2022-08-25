import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

function ProfileModal({ user, children }) {
    const { isOpen, onOpen, onClose } = useDisclosure()



    return (
        <>
            {children ? (<span onClick={onOpen}>{children}</span>) : (
                <IconButton
                    d={{ base: "flex" }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                />
            )}

            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h="410px" w={{ base: "94%" }}>
                    <ModalHeader
                        fontSize="32px"
                        fontFamily="Work sans"
                        textAlign="center"
                        textTransform="capitalize"
                        d="flex"
                        justifyContent="center"
                        marginBottom="30px"
                    >{user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text
                            my="2px"
                            fontSize={{ base: "22px", md: "30px" }}
                            fontFamily="Work sans"
                        >Email : {user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        {/* <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button> */}

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
