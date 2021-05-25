import React, {Component} from 'react';
import web3 from '../utils/web3';
import Sidebar from './Sidebar';
import Header from './Header';
import ipfs from '../utils/ipfs';
import contract from '../utils/contract';
import {Form, Row, Col, Button, Badge}from 'react-bootstrap';

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
      var encrBuff = Buffer.from(this.state.message);
      console.log(this.state.message.length);
      //console.log(this.state.buffer + encrBuff);
      var list = [encrBuff, this.state.buffer];
      var data = Buffer.concat(list);
      var mge = data.slice(0, 3)
      console.log(data);
      console.log(mge.toString())
      ipfs.files.add(data, async (err, ipfsHash) => {
        this.setState({hash : ipfsHash[0].hash})
        console.log(err, "ipfsHash:: " + ipfsHash[0].hash);
        contract.methods.sendMessage(this.state.receiver, this.state.subject, this.state.message.length, ipfsHash[0].hash, "passwoerd").send({from : contract.defaultAccount}, function(error, result){
          console.log(result);
          alert("Sent");
        })
      })
    }
    handleChange(e) {
        
        this.setState({ [e.target.name] : e.target.value });
     }
    captureFile = event => {
      event.stopPropagation();
      event.preventDefault();
      window.file = event.target.files[0];
      let reader = new window.FileReader();
      reader.readAsArrayBuffer(window.file);
      reader.onloadend = () => this.convertToBuffer(reader);
    };
  
    convertToBuffer = async reader => {
      const buffer = await Buffer.from(reader.result);
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