import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Text,
    useDisclosure,
    Divider,
    Flex
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";


export function ConversationButtons() {
    const { user, orbis, setCurrentConversationDetails, getTruncatedDID } = useContext(GlobalContext);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [conversationName, setConversationName] = useState("");
    const [conversationDescription, setConversationDescription] = useState("");
    const [conversationContext, setConversationContext] = useState("");
    const [conversationRecipients, setConversationRecipients] = useState([]);
    const [conversationsList, setConversationsList] = useState(null);

    useEffect(() => {
        getOrbisConversations();
    }, [user])

    const getOrbisConversations = async () => {
        if (user) {
            let { data, error } = await orbis.getConversations(
                {
                    did: user.did,
                }
            );
            setConversationsList(data);
            // console.log("These are your conversations:", data);
            console.log("These are your conversations:", data);
            if (data.length != 0) {
                setCurrentConversationDetails(data[0]);
                // setCurrentConversationID(data[0].stream_id);
                console.log("This is current conversation id:", data[0].stream_id);
            } else {
                setConversationsList(null);
                setCurrentConversationDetails(null);
                // setCurrentConversationID("");
                console.log("Could not load conversations:", error);
            }
        }
    }

    const newOrbisConversation = async () => {
        try {
            let res = await orbis.createConversation({
                recipients: conversationRecipients,
                name: conversationName,
                description: conversationDescription,
                context: conversationContext,
            });
            if (res.status == 200) {
                console.log("Result from new conversation:", res);
                setConversationName("");
                setConversationDescription("");
                setConversationContext("");
                setConversationRecipients([]);
            }
            await getOrbisConversations();
            onClose();
        } catch (error) {
            setConversationName("");
            setConversationDescription("");
            setConversationContext("");
            setConversationRecipients([]);
            onClose();
            console.log("Could not create a new conversation:", error.message);
        }
    }

    return (
        <Flex
            direction='column'
            m={5}
            gap={3}
        >
            {conversationsList && conversationsList.map((conversation, index) => {
                return (
                    <Button colorScheme='cyan' key={index} onClick={() => { setCurrentConversationDetails(conversationsList[index]) }}>{conversation.content.name ? conversation.content.name : getTruncatedDID(conversation.content.recipients[0], 5)}</Button>
                )
            })}
            <Button colorScheme='purple' onClick={getOrbisConversations}>Get Conversations</Button>
            <Divider />
            <Button onClick={onOpen}>Create Conversation</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Enter Conversation Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input placeholder='Name' value={conversationName} onChange={e => setConversationName(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Input placeholder='Description' value={conversationDescription} onChange={e => setConversationDescription(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Context</FormLabel>
                            <Input placeholder='Context' value={conversationContext} onChange={e => setConversationContext(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>List of Recipient DIDs</FormLabel>
                            <Input placeholder='Recipients' value={conversationRecipients} onChange={e => setConversationRecipients(e.target.value.split(","))} />
                            <Text fontSize='xs' m={2}>Example: did1,did2,... (No Spaces)</Text>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='cyan' onClick={newOrbisConversation}>
                            Create New Conversation
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex >
    )
}