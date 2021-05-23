import React, { Component } from "react";
import {Badge, Button, Form} from 'react-bootstrap';

import { Link } from 'react-router-dom';
import web3 from '../utils/web3';
import contract from '../utils/contract';

import "./Login.css"
class Login extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          email : '',
          account : '',
          redirect : true,
        };
        this.handleValidate= this.handleValidate.bind(this);
        this.handleChange = this.handleChange.bind(this);
      }
    async componentDidMount(){
        await this.getAccount();
        
    }
    handleChange(e) {
        console.log(e.target.value);
        this.setState({[e.target.name] : e.target.value });
        //console.log(this.state.email);
     }
    async getAccount(){
        const accounts = await web3.eth.getAccounts();
        this.setState({account : accounts[0]});
        web3.eth.defaultAccount = accounts[0];
        contract.defaultAccount = accounts[0];
        console.log(this.state.account);
    }
    handleValidate = async(event) => {
        event.preventDefault();
        console.log(this.state.email);
        var email = this.state.email;

        contract.methods.checkRegistration(this.state.email).call(function(error, result){
            console.log(email);
            if(error)
            {
              contract.methods.registerUser(email).send({from:contract.defaultAccount},  function(error, result){
                if(!error) 
                  alert("User registered successfully")
                else
                  alert(error);
        
              })
            }
            this.setState({redirect:true})
        })


    }
    render() {
        const { redirect } = this.state;
        return (
            <div className= "col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4">
            <Form>
                 <h4><Badge variant = "primary">Login/register</Badge></h4>
                  <Form.Group  controlId="formHorizontalEmail">
                    <Form.Label >
                      Email
                    </Form.Label>
                   
                      <Form.Control type="text" placeholder="Email" name = "email" onChange = {this.handleChange} />
                   
                  </Form.Group>

                <Form.Group>
                   Note: Make sure Email address and Account in metamask match.
                </Form.Group>

               

                <Button variant="primary" type="submit" onClick = {this.handleValidate}> Login/Register </Button>             
            </Form>
            {redirect && <Link to="/inbox">
                  </Link>}
            </div>
        );
    }
}
export default Login;