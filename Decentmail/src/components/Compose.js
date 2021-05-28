import React, {Component} from 'react';
import web3 from '../utils/web3';
import Sidebar from './Sidebar';
import Header from './Header';
import ipfs from '../utils/ipfs';
import contract from '../utils/contract';
import {Form, Row, Col, Button, Badge}from 'react-bootstrap';
const CryptoJS = require("crypto-js");
var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz*&-%/!?*+=()";

class Compose extends Component{
    constructor(props) {
        super(props);
        this.state = {
                    sender : '',
                    receiver : '', 
                    cc : '', 
                    subject: '' , 
                    message : '',
                    hash : '',
                    buffer:'',
                    filename: '',
       };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.captureFile = this.captureFile.bind(this);
      }
    async componentDidMount(){
       await this.getAccount();
      
    }
    
    
    
  
   
    
    async getAccount(){
        const accounts = await web3.eth.getAccounts();
        this.setState({sender : accounts[0]});
        web3.eth.defaultAccount = accounts[0];
        contract.defaultAccount = accounts[0];
    }
   
   /* async handleSubmit(event) {
      event.preventDefault();
      var encrBuff = Buffer.from(this.state.message);
      var rec_address = contract.methods.getAddress(this.state.receiver).call();
      console.log(rec_address);
      ipfs.files.add(encrBuff, async (err, ipfsHash) => {
        this.setState({hash : ipfsHash[0].hash})
        console.log(err, "ipfsHash:: " + ipfsHash[0].hash);
        contract.methods.sendMessage(this.state.receiver, this.state.subject, ipfsHash[0].hash, "passwoerd").send({from : contract.defaultAccount}, function(error, result){
          console.log(result);
          alert("Sent");
        })
      })
    }*/
    async handleSubmit(event) {
      event.preventDefault();
      var senderList = this.state.receiver;
      var split_sender = senderList.split(" ");
      console.log(split_sender[0]);
      var length = split_sender.length;

      window.key = this.genPassPhrase(8);
      console.log("AES key " + window.key);
      var aesEncrypted = CryptoJS.AES.encrypt(this.state.message, window.key).toString()
      var e64 = CryptoJS.enc.Base64.parse(aesEncrypted);
      var eHex = e64.toString(CryptoJS.enc.Hex);
      console.log("aesEncrypted:: " + aesEncrypted);
  
      var encr = Buffer.from(eHex); 
      var list = [encr, this.state.buffer]
      this.setState({message : encr})
      if(this.state.buffer.length)
        var encrBuff = Buffer.concat(list)
      else
        var encrBuff = encr
      console.log(encr);     
      ipfs.files.add(encrBuff, async (err, ipfsHash) => {
        this.setState({hash : ipfsHash[0].hash})
        console.log(err, "ipfsHash:: " + ipfsHash[0].hash);
        console.log(this.state.filename);
        for(var i = 0; i < length; i++){
        contract.methods.sendMessage(split_sender[i], this.state.subject, this.state.message.length, ipfsHash[0].hash, window.key, this.state.filename).send({from : contract.defaultAccount}, function(error, result){
          console.log(result);
        
         
        })
      }
        this.setState({receiver : ''})
        this.setState({cc : ''})
        this.setState({subject: ''})  
        this.setState({message : ''})
        this.setState({hash : ''})
        this.setState({buffer:''})
      })

    }
  
    genPassPhrase = keyLength => {
      var randomstring = "";
  
      for (var i = 0; i < keyLength; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
      }
      return randomstring;
    };
    handleChange(e) {
        
        this.setState({ [e.target.name] : e.target.value });
     }
    captureFile = event => {
      event.stopPropagation();
      event.preventDefault();
      window.file = event.target.files[0];
      console.log(window.file.name)
      this.setState({filename: window.file.name})
      let reader = new window.FileReader();
      reader.readAsArrayBuffer(window.file);
      reader.onloadend = () => this.convertToBuffer(reader);
    };
  
    convertToBuffer = async reader => {
      const buffer = await Buffer.from(reader.result, 'ascii');
      this.setState({ buffer: buffer });
      console.log(this.state.buffer)
    };
     
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
                      <Form.Control type="text" placeholder="Address" name = "receiver" value = {this.state.receiver} onChange = {this.handleChange} />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formHorizontalPassword">
                    <Form.Label column sm={2}>
                      Subject
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control type="text" placeholder="Subject" value = {this.state.subject} name = "subject" onChange = {this.handleChange}/>
                    </Col>
                  </Form.Group>
                   
                  <Form.Group  as={Row} controlId="exampleForm.ControlTextarea1">
                    <Form.Label column sm={2}>Message</Form.Label>
                    <Col sm = {10}>
                    <Form.Control as="textarea" name = "message" value = {this.state.message} onChange= {this.handleChange}rows={5}/>
                   </Col>
                  </Form.Group>

                  
                  <Form.Group>
                    <Form.File id="exampleFormControlFile1" label="" onChange = {this.captureFile} />
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