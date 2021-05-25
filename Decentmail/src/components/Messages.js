import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {Table, Modal, Button} from 'react-bootstrap';
import web3 from '../utils/web3';
import ipfs from '../utils/ipfs';
import contract from '../utils/contract';
import "./styles.css";

const FileSaver=require('file-saver');
class Messages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages :[], 
      sender :'',
      open : false,
      messagepop: '',
      index : '',
      filebuf:'',
      filename:'',
      attach: true,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFile = this.handleFile.bind(this);
  }

  async componentDidMount(){
    await this.getAccount();
    await this.getMessages();
   
  }

  async getMessages(){
    var result = await contract.methods.getMyInboxSize().call()
    
    console.log(result);
    if(result > 0){
      for(var i = result - 1 ; i >= 0 ; i--){
        var message = await contract.methods.receiveMessages(i).call()
          this.setState({messages:this.state.messages.concat(message)});
          console.log(message);
      }
    }
  }

  handleClose(e){
    this.setState({open:false});
    this.setState({messagepop:""})
    this.setState({filebuf:""})
    this.setState({attach:true})
  }
   handleFile = async() => {
     let file = this.state.filebuf;
    var blob=new Blob([file],{type:"application/octet-stream;"});
    FileSaver.saveAs(blob,"attach");
   }
  handleClick = async(event)  => {
    let fname = "attached";
    event.preventDefault();
    var index = event.target.value;
    this.setState({index : index});
    this.setState({open : true});
    var hash = this.state.messages[index][0];
    const result = await ipfs.files.cat(hash);
    console.log(result);
    const message = result.slice(0, this.state.messages[index][5]);
    const file = result.slice(this.state.messages[index][5]);
    if(file.length){
       this.setState({attach:false})
       this.setState({filebuf:file})
    }
    this.setState({messagepop:message.toString('utf-8')});
    console.log(this.state.messagepop);
  }
  
   
  async getAccount(){
    const accounts = await web3.eth.getAccounts();
    this.setState({sender : accounts[0]});
    web3.eth.defaultAccount = accounts[0];
    contract.defaultAccount = accounts[0];
}

  render() {
    return (
      <div> 
      <Table responsive="sm">
    
      <thead>
        <tr>
          <th>From</th>
          <th>Subject</th>
          <th>Time</th>
          <th></th>
         
        </tr>
      </thead>
      <tbody>
        { (this.state.messages.length > 0) ? this.state.messages.map( (message, index) => {
           return (
            <tr key={ index }>
              <td>{ message[3] }</td>
              <td>{ message[4] }</td>
              <td>{ message[2]}</td>
              <td>{<button value = {index} onClick = {this.handleClick} >Open</button>}</td>
              
            </tr>
          )
         }) : <tr><td colSpan="5">Loading...</td></tr> }
      </tbody>
    </Table>
    <Modal show={this.state.open} onHide={this.handleClose} animation={false} data = {this.state.messagepop}>
        <Modal.Header closeButton>
          <Modal.Title>Inbox</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.state.messagepop.split('\n').map(function(item, key) {
  return (
    <span key={key}>
      {item}
      <br/>
    </span>
  )
})}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="secondary" disabled={this.state.attach} onClick={this.handleFile}>Download attachment</Button>
          
        </Modal.Footer>
      </Modal>

       </div>
    );
  }
}

export default Messages;