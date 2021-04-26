pragma solidity ^0.5.0;

contract DecentMail{
  struct Message {
    address sender;
    string subject;
    string hash;
    string key;
    uint timestamp;
    address receiver;
  }

  struct ContractProperties {
    address User;
    address[] registeredUsersAddress;
  }

  struct Inbox {
    
    uint numReceivedMessages;
    
    mapping (uint => Message) receivedMessages;
  }
  
  struct Sentbox {
      uint numSentMessages;
      mapping (uint => Message) sentMessages;
  }

  mapping (address => Inbox) userInboxes;
  mapping (address => bool) hasRegistered;
  mapping (address => Sentbox) userSentboxes;

  Inbox newInbox;
  Sentbox newSentbox;
  Message newMessage;
  ContractProperties contractProperties;

  constructor() public {

    registerUser();
    contractProperties.User = msg.sender;
  }

  function checkUserRegistration() public view returns (bool) {
    return hasRegistered[msg.sender];
  }

 

  function registerUser() public {
    if(!hasRegistered[msg.sender]) {
      userInboxes[msg.sender] = newInbox;
      userSentboxes[msg.sender] = newSentbox;
      hasRegistered[msg.sender] = true;
      contractProperties.registeredUsersAddress.push(msg.sender);
    }
  }

  function getContractProperties() public view returns (address, address[] memory ) {
    return (contractProperties.User, contractProperties.registeredUsersAddress);
  }

  function sendMessage(address _receiver, string memory subject, string memory  _hash,  string memory _key) public {
    newMessage.hash = _hash;
    newMessage.subject = subject;
    newMessage.key = _key;
    newMessage.timestamp = now;
    newMessage.sender = msg.sender;
    newMessage.receiver = _receiver;
   
    Sentbox storage sendermessages = userSentboxes[msg.sender];
    sendermessages.sentMessages[sendermessages.numSentMessages] = newMessage;
    sendermessages.numSentMessages++;

  
    Inbox storage receiversInbox = userInboxes[_receiver];
    receiversInbox.receivedMessages[receiversInbox.numReceivedMessages] = newMessage;
    receiversInbox.numReceivedMessages++;
    return;
  }
  
 

  function receiveMessages(uint index) public view returns ( string memory,  string memory, uint, address, string memory) {
    Inbox storage receiversInbox = userInboxes[msg.sender];
  
    Message memory message = receiversInbox.receivedMessages[index];
      
    return (message.hash,  message.key, message.timestamp, message.sender, message.subject);
  }

    function sentMessages(uint index) public view returns ( string memory, string memory, uint, address, string memory) {
    Sentbox storage sendermessages = userSentboxes[msg.sender];
  
    Message memory message = sendermessages.sentMessages[index];
      
    return (message.hash, message.key, message.timestamp, message.receiver, message.subject);
  }
 
      
  
  function getMyInboxSize() public view returns (uint) {
    return ( userInboxes[msg.sender].numReceivedMessages);
  }
  
  function getMySentSize() public view returns (uint) {
    return ( userSentboxes[msg.sender].numSentMessages);
  }

}