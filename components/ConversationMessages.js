import { Flex, FormControl, Input, Button, Box, Image, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";


export function ConversationMessages() {
    const { user, orbis, currentConversationDetails } = useContext(GlobalContext);
    const [newMessage, setNewMessage] = useState("");
    const [currentDecryptedMessages, setCurrentDecryptedMessages] = useState([]);

    useEffect(() => {
        getOrbisMessages();
    }, [currentConversationDetails]);

    const getOrbisMessages = async () => {
        try {
            let { data, error } = await orbis.getMessages(currentConversationDetails.stream_id);
            if (data) {
                let decryptMessages = [];
                for (const message of data) {
                    console.log("This is the outcome of encrypyted message", message);
                    let { status, result } = await orbis.decryptMessage(message.content);
                    if (status == 200) {
                        let messageObject = {
                            content: result,
                            creator_details: message.creator_details,
                            timestamp: message.timestamp
                        }
                        console.log("This is the outcome of decrypted message", result);
                        decryptMessages.push(messageObject);
                    } else {
                        setCurrentDecryptedMessages([]);
                        console.log("Unable to decrypt message:", result);
                    }
                }
                console.log("These are the decrypted messages:", decryptMessages);
                setCurrentDecryptedMessages(decryptMessages.reverse());
            }
        } catch (error) {
            setCurrentDecryptedMessages([]);
            console.log("Could not decrypt messages:", error);
        }
    }

    const sendNewMessage = async () => {
        try {
            let res = await orbis.sendMessage({
                conversation_id: currentConversationDetails.stream_id,
                body: newMessage
            });
            setNewMessage("");
            console.log("New message sent!:", res);
            getOrbisMessages();
        } catch (error) {
            setNewMessage("");
            console.log("Unable to send new message:", error.message);
        }
    }
    return (
        <Flex
            direction='column'>
            <Box
                maxH='200px'
                overflow='auto'>
                <Flex
                    direction='column'
                    p={2}
                    bg='blackAlpha.600'
                    borderRadius={10}
                    mt={2}
                    justify='flex-end'
                    minH='150px'
                >
                    {!currentDecryptedMessages.length && <Text m={2}>No messages yet!</Text>}
                    {currentDecryptedMessages && currentDecryptedMessages.map((message, index) => {
                        return (
                            <Flex
                                direction='row'
                                key={index}
                                align='center'
                                gap={2}>
                                {message.creator_details.profile.pfp ? <Image
                                    w={6}
                                    h={6}
                                    borderRadius="50%"
                                    src={message.creator_details.profile.pfp} alt="profile picture" />
                                    :
                                    <Image
                                        w={6}
                                        h={6}
                                        borderRadius="50%"
                                        src="/defaultPFP.jpeg" alt="profile picture" />
                                }
                                <Box
                                    p={2}
                                    my={1}
                                    borderRadius={10}
                                    bg='blue.600'
                                    fontSize='sm'
                                >{message.content}</Box>
                                <Box fontSize={8}>{new Date(message.timestamp * 1000).toLocaleDateString("en-GB")}</Box>
                            </Flex>
                        )
                    })}
                </Flex>
            </Box>
            <Flex
                direction='row'
                mt={2}
                p={2}
                bg='gray.900'
                borderRadius={10}>
                <FormControl>
                    <Input
                        type='text'
                        placeholder='New Message'
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)} />
                </FormControl>
                <Button
                    colorScheme='cyan'
                    type='submit'
                    ml={2}
                    onClick={sendNewMessage}
                >
                    Send
                </Button>
            </Flex>
        </Flex>
    )
}