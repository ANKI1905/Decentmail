pragma solidity ^0.5.0;
contract DecentMail{
  event sendMessageEvent(address indexed from, address indexed to,  string _hash,  string _key);
  event registerUserEvent(address indexed from, string email);
  struct Message {
    address sender;
    string subject;
    string hash;
    uint message;
    string key;
    uint timestamp;
    address receiver;
    string filename;
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
  struct Member{
      bool isRegistered;
      string email;
      address user;
  }
  mapping (address => Member) mailId;
  mapping (string => Member) addresses;
  mapping (address => Inbox) userInboxes;
  mapping (address => Sentbox) userSentboxes;

  Inbox newInbox;
  Sentbox newSentbox;
  Message newMessage;
  ContractProperties contractProperties;

  function checkRegistration(string memory email) public view returns (bool){
        require(mailId[msg.sender].isRegistered == true);
        require(addresses[email].isRegistered == true);
        require(addresses[email].user == msg.sender);
        return true;
    }
  function getMail(address user) public view returns (string memory){
      require(mailId[user].isRegistered == true);
      return mailId[user].email;
  }
  function getAddress(string memory email) public view returns (address){
      require(addresses[email].isRegistered == true);
      return addresses[email].user;
  }
  function registerUser(string memory email) public{
      require(mailId[msg.sender].isRegistered == false);
      require(addresses[email].isRegistered == false);
 
      userInboxes[msg.sender] = newInbox;
      userSentboxes[msg.sender] = newSentbox;
      mailId[msg.sender]  = Member(true, email, msg.sender);
      addresses[email] = mailId[msg.sender];
      contractProperties.registeredUsersAddress.push(msg.sender);
     
      emit registerUserEvent(msg.sender, email);
  }
  function getContractProperties() public view returns (address, address[] memory ) {
    return (contractProperties.User, contractProperties.registeredUsersAddress);
  }
  function sendMessage(string memory  _receiver,  string memory _subject, uint _message, string memory  _hash,  string memory _key, string memory _filename) public {
    require(addresses[_receiver].isRegistered == true);
    newMessage.hash = _hash;
    newMessage.key = _key;
    newMessage.message = _message;
    newMessage.timestamp = now;
    newMessage.sender = msg.sender;
    newMessage.receiver = getAddress(_receiver);
    newMessage.subject = _subject;
    newMessage.filename = _filename;
    Sentbox storage sendermessages = userSentboxes[msg.sender];
    sendermessages.sentMessages[sendermessages.numSentMessages] = newMessage;
    sendermessages.numSentMessages++;
    Inbox storage receiversInbox = userInboxes[newMessage.receiver];
    receiversInbox.receivedMessages[receiversInbox.numReceivedMessages] = newMessage;
    receiversInbox.numReceivedMessages++;
    
    emit sendMessageEvent(msg.sender, newMessage.receiver, _hash, _key);
  }
  function receiveMessages(uint index) public view returns ( string memory,  string memory, uint, string memory, string memory, uint, string memory) {
    require (index >= 0);
    Inbox storage receiversInbox = userInboxes[msg.sender];
    Message memory message = receiversInbox.receivedMessages[index];
    return (message.hash, message.key, message.timestamp, getMail(message.sender), message.subject, message.message, message.filename);
  }
  function sentMessages(uint index) public view returns ( string memory, string memory, uint, string memory, string memory, uint, string memory) {
    require(index >= 0);
    Sentbox storage sendermessages = userSentboxes[msg.sender];
    Message memory message = sendermessages.sentMessages[index];
    return (message.hash, message.key, message.timestamp, getMail(message.receiver), message.subject, message.message, message.filename);
  }
  function getMyInboxSize() public view returns (uint) {
    return ( userInboxes[msg.sender].numReceivedMessages);
  }
  function getMySentSize() public view returns (uint) {
    return ( userSentboxes[msg.sender].numSentMessages);
  }
}