pragma solidity ^0.5.0;
contract DecentMail{
  event sendMessageEvent(address indexed from, address indexed to,  string _hash,  string _key);
  event registerUserEvent(address indexed from, string email);
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
  function getMail() public view returns (string memory){
      require(mailId[msg.sender].isRegistered == true);
      return mailId[msg.sender].email;
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
  function sendMessage(address _receiver,  string memory _subject, string memory  _hash,  string memory _key) public {
    require(mailId[_receiver].isRegistered == true);
    newMessage.hash = _hash;
    newMessage.key = _key;
    newMessage.timestamp = now;
    newMessage.sender = msg.sender;
    newMessage.receiver = _receiver;
    newMessage.subject = _subject;
    Sentbox storage sendermessages = userSentboxes[msg.sender];
    sendermessages.sentMessages[sendermessages.numSentMessages] = newMessage;
    sendermessages.numSentMessages++;
    Inbox storage receiversInbox = userInboxes[_receiver];
    receiversInbox.receivedMessages[receiversInbox.numReceivedMessages] = newMessage;
    receiversInbox.numReceivedMessages++;
    
    emit sendMessageEvent(msg.sender, _receiver, _hash, _key);
  }
  function receiveMessages(uint index) public view returns ( string memory,  string memory, uint, address, string memory) {
    require (index >= 0);
    Inbox storage receiversInbox = userInboxes[msg.sender];
    Message memory message = receiversInbox.receivedMessages[index];
    return (message.hash, message.key, message.timestamp, message.sender, message.subject);
  }
  function sentMessages(uint index) public view returns ( string memory, string memory, uint, address, string memory) {
    require(index >= 0);
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