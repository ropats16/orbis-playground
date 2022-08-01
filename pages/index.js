import Head from 'next/head'
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Image,
  Input,
  useDisclosure,
  Spacer,
  Heading,
} from '@chakra-ui/react';
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';

/** Import Orbis SDK */
import { Orbis } from "@orbisclub/orbis-sdk";

export default function Home() {
  const [user, setUser] = useState();
  const [conversationName, setConversationName] = useState("");
  const [conversationDescription, setConversationDescription] = useState("");
  const [conversationContext, setConversationContext] = useState("");
  const [conversationRecipients, setConversationRecipients] = useState([]);
  const [conversationsList, setConversationsList] = useState();
  const [currentConversationDetails, setCurrentConversationDetails] = useState();
  const [newMessage, setNewMessage] = useState();
  const [currentConversationID, setCurrentConversationID] = useState();
  const [currentMessages, setCurrentMessages] = useState();

  /** Initialize the Orbis class object */
  let orbis = new Orbis();

  useEffect(() => {
    checkConnectionToOrbis();
    getOrbisConversations();
    getOrbisMessages();
  }, [])

  const connectToOrbis = async () => {
    try {
      let res = await orbis.connect();
      console.log("Result from connect:", res);
      if (res.status == 200) {
        setUser(res.details);
      }
    } catch (error) {
      setUser();
      console.log("Could not connect to orbis:", error.message);
    }
  }

  const checkConnectionToOrbis = async () => {
    try {
      let res = await orbis.isConnected();
      console.log("Result from connect:", res);
      if (res.status == 200) {
        setUser(res.details);
      }
    } catch (error) {
      setUser();
      console.log("Could not connect to orbis:", error.message);
    }
  }

  const getTruncatedDID = (did, length) => {
    if (!did) {
      return '';
    }
    return `${did.slice(0, length + 2)}...${did.slice(
      did.length - length
    )}`;
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  // const convoContent = {
  //   content: {
  //     recipients: conversationRecipients,
  //     name: conversationName,
  //     description: conversationDescription,
  //   },
  //   context: conversationContext
  // }

  const content = {
    recipients: conversationRecipients,
    name: conversationName,
    description: conversationDescription,
    context: conversationContext,
  }


  const newOrbisConversation = async () => {
    try {
      await orbis.isConnected();
      let res = await orbis.createConversation(content);
      console.log("Result from new conversation:", res);
      setConversationName("");
      setConversationDescription("");
      setConversationContext("");
      setConversationRecipients([]);
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

  const getOrbisConversations = async () => {
    await orbis.isConnected();
    if (user) {
      let { data, error } = await orbis.getConversations(
        {
          did: user.did,
        }
      );
      setConversationsList(data);
      if (data) {
        setCurrentConversationDetails(data[0]);
        setCurrentConversationID(data[0].stream_id);
        console.log("These are your conversations:", data);
        console.log("This is current conversation id:", data[0].stream_id);
      } else {
        setCurrentConversationDetails();
        setCurrentConversationID("");
        console.log("Could not load conversations:", error);
      }
    }
  }

  const messageContent = {
    conversation_id: currentConversationID,
    body: newMessage
  }

  const sendNewMessage = async () => {
    try {
      await orbis.isConnected();
      console.log("This is the list of conversations:", conversationsList);
      console.log("This is the conversation the message will be sent on:", currentConversationDetails);
      console.log("This is the meesage you want to send:", messageContent);
      let res = await orbis.sendMessage(messageContent);
      setNewMessage("");
      console.log("New message sent!:", res);
      getMessages();
    } catch (error) {
      console.log("Unable to send new message:", error.message);
    }
  }

  const getOrbisMessages = async () => {
    try {
      await orbis.isConnected();
      let { data, error } = await orbis.getMessages(currentConversationID);
      if (data.length != 0) {
        setCurrentMessages(data);
        console.log("These are the messages from this conversation:", data);
      } else {
        console.log("Could not get messages:", error);
      }
    } catch (error) {
      console.log("Could not fetch messages:", error.message);
    }
  }

  console.log("This is the user details", user);

  return (
    <div className={styles.container}>
      <Head>
        <title>OrbiSlack</title>
        <meta name="Composable Slack-like dashboard built on Orbis" content="Created by Ropats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Flex
          direction='row'
          justify='space-between'
          align='center'
          padding='10px 0'>
          <Text
            fontWeight='extrabold'
            fontStyle='italic'>OrbiSlack</Text>
          {user ?
            <Text>Connected with: {user.profile?.username ?
              user.profile.username
              :
              getTruncatedDID(user.did, 5)}</Text>
            :
            <Button onClick={connectToOrbis} colorScheme='cyan'>Connect</Button>}
        </Flex>
      </header>
      <Divider />
      {user &&
        <main>
          <Flex direction='row'>
            <Flex
              direction='column'
              m={5}
              gap={1}
            >
              {conversationsList && conversationsList.map((conversation, index) => (
                <Button
                  colorScheme='teal'
                  onClick={() => { setCurrentConversationDetails(conversationsList[index]) }}
                  key={index}
                >
                  {conversation.content.name}
                </Button>
              ))}
              <Divider my={2} />
              <Button onClick={getOrbisConversations}>Get Conversations</Button>
              <Spacer />
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
            </Flex>
            <Flex
              m={5}
              p={5}
              border='1px'
              borderRadius='10px'
              grow={1}
            >
              <Flex
                direction='column'
                flexFlow='wrap'
              >
                {currentConversationDetails && (
                  <Heading
                    as='h2'
                    fontSize='md'>{currentConversationDetails.content.name}</Heading>
                )}
                <Flex
                  direction='row'>
                  {currentConversationDetails && currentConversationDetails.recipients_details.map((recipient, index) => {
                    return (
                      <Flex
                        key={index}
                        direction="row"
                        gap={1}
                        justify='space-evenly'
                        p={1}>
                        {recipient.profile.pfp ? <Image
                          w={4}
                          h={4}
                          borderRadius="50%"
                          src={recipient.profile.pfp} alt="profile picture" />
                          :
                          <Image
                            w={4}
                            h={4}
                            borderRadius="50%"
                            src="/defaultPFP.jpeg" alt="profile picture" />
                        }
                        <Text
                          fontSize='xs'>{getTruncatedDID(recipient.did, 3)}</Text>
                      </Flex>
                    )
                  })}
                </Flex>
                <Button
                  colorScheme='cyan'
                  onClick={getOrbisMessages}
                  m={2}
                  fontSize='xs'
                  p={1}
                >Load Messages</Button>
                <Divider />
                <Flex
                  minH='16em'
                  border='1px'
                  grow={1}
                  m={2}
                ></Flex>
                <Divider />
                <Flex
                  direction='row'
                  grow={1}
                  mt={2}>
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
                    mx={2}
                    onClick={sendNewMessage}
                  >
                    Send
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </main>
      }
    </div >
  )
}

// did:pkh:eip155:5:0x1a5b1d94a576d56e8556924d7935ecef00a797f4,did:pkh:eip155:1:0x9fd07f4ee4f18e27f9d958fb42e8ea2e6ee547bd,did:pkh:eip155:1:0x075286d1a22b083ebcaf6b7fb4cf970cfc4a18f0