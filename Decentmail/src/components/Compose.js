import { ContactSupportOutlined, LocalConvenienceStoreOutlined, SentimentDissatisfiedOutlined } from '@material-ui/icons';
import React, {Component} from 'react';
import web3 from './web3';
import Sidebar from './Sidebar';
import Header from './Header';
import ipfs from './ipfs';
import contract from './contract';
import {Form, Row, Col, Button, Badge}from 'react-bootstrap';

//const IPFS = require('ipfs-core')

class Compose extends Component{
    constructor(props) {
        super(props);
        this.state = {
                    sender : '',
                    receiver : '', 
                    cc : '', 
                    subject: '' , 
                    message : '',
                    hash : ''
       };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    async componentDidMount(){
       await this.getAccount();
       await this.checkRegistration();
      // await this.uploadFile('Ankita');
      console.log(contract);
      console.log(contract.defaultAccount )
       console.log(this.state.sender);
       await this.getProperties();
       
    }
    async checkRegistration(){
      
      contract.methods.checkUserRegistration().call(function(error, result){
          console.log(result);
          console.log(contract.defaultAccount);

          if(result == false){
            contract.methods.registerUser().send({from : contract.defaultAccount},  function(error, result){
              console.log(contract.defaultAccount);
              console.log(error);
              console.log(result)
      
            })
          }
            
      })
    }
    async getProperties(){

      contract.methods.getContractProperties().call(function(error, result){
        console.log(result);
      })
    }
    async register(){
      contract.methods.registerUser().call(function(error, result){
        console.log(result)

      })
    }

    async uploadFile(message){
      var encrBuff = Buffer.from(message);
      await ipfs.files.add(encrBuff, async (err, ipfsHash) => {
        this.setState({hash : ipfsHash[0].hash})
        console.log(err, "ipfsHash:: " + ipfsHash[0].hash);
      })
      
    }

    
    async getAccount(){
        const accounts = await web3.eth.getAccounts();
        this.setState({sender : accounts[0]});
        web3.eth.defaultAccount = accounts[0];
        contract.defaultAccount = accounts[0];
        console.log(accounts[0]);
    }
   handleSubmit(event) {
      event.preventDefault();
      var encrBuff = Buffer.from(this.state.message);
      ipfs.files.add(encrBuff, async (err, ipfsHash) => {
        this.setState({hash : ipfsHash[0].hash})
        console.log(err, "ipfsHash:: " + ipfsHash[0].hash);
        contract.methods.sendMessage(this.state.receiver, this.state.subject, ipfsHash[0].hash, "passwoerd").send({from : contract.defaultAccount}, function(error, result){
          console.log(result);
          alert("Sent");

        })
       // alert("Sent");
      })
    }

    async sendFile(){
      //while(this.state.hash === "") continue;
      console.log(this.state.message + this.state.hash);
    }
    handleChange(e) {
        this.setState({ [e.target.name] : e.target.value });
     }
     
    render(){
        return(
            
          <div className = "row">
              <div class="col-sm-3">  <Sidebar/> </div>
                
                <div class = "col-sm-9">
                 <Header/>
                 <h4><Badge variant="light">New Email</Badge></h4>
                 <Form>
                  <Form.Group as={Row} controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                      To
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control type="text" placeholder="Address" name = "receiver" onChange = {this.handleChange} />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formHorizontalPassword">
                    <Form.Label column sm={2}>
                      Subject
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control type="text" placeholder="Subject"  name = "subject" onChange = {this.handleChange}/>
                    </Col>
                  </Form.Group>
                   
                  <Form.Group  as={Row} controlId="exampleForm.ControlTextarea1">
                    <Form.Label column sm={2}>Message</Form.Label>
                    <Col sm = {10}>
                    <Form.Control as="textarea" name = "message" value = {this.state.message} onChange= {this.handleChange}rows={5}/>
                   </Col>
                  </Form.Group>
                  <Button variant="primary" type="submit" onClick = {this.handleSubmit}>
                    Send
                  </Button>
                  </Form>
                   
                  </div>
                  </div>
                   

        )
    }

}
export default Compose;