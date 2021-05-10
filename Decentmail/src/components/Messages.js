import React from "react";
import "/home/ankita/Documents/Decentmail/node_modules/bootstrap/dist/css/bootstrap.min.css";
import Table from 'react-bootstrap/Table'
import web3 from './web3';
import ipfs from './ipfs';
import contract from './contract';
import "./styles.css";

class Messages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages :[], 
      sender :'',
      open : false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount(){
    await this.getAccount();
    await this.getMessages();
    //await this.displayMessage();
    console.log(this.state.messages);
   
  }

  async getMessages(){
    var result = await contract.methods.getMyInboxSize().call()
    
      console.log(result);
      if(result > 0){
      for(var i = result - 1; i >= 0; i--){
        var message = await contract.methods.receiveMessages(i).call()
          this.setState({messages:this.state.messages.concat(message)});
          console.log(message);
        }
      }
  }
   
  handleClick(e){
    var index = e.target.value;
    console.log(index);
    this.getData(this.state.messages[index][0]);
    
  }
   
  async getData(hash){
    await  ipfs.files.cat(hash, (err, res) => {
      console.log(res);
      console.log(res.toString('utf-8'))
  });
}
  

  async getAccount(){
    const accounts = await web3.eth.getAccounts();
    this.setState({sender : accounts[0]});
    web3.eth.defaultAccount = accounts[0];
    contract.defaultAccount = accounts[0];
    console.log(accounts[0]);
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
       </div>
    );
  }
}

export default Messages;