import React, {Component} from 'react'
import {Navbar, Nav} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import Userprofile from '../utils/Userprofile';
const hStyle = { color: 'white' };

class Header extends Component{
    constructor(props) {
        super(props);
        this.state = {
            logout: false,
            email: "",
       };
    
        this.handleLogOut = this.handleLogOut.bind(this);
    }
    async componentDidMount(){
        var email = Userprofile.getEmail();
        this.setState({email:email})
    }
    handleLogOut(){
        
            this.setState({logout:true})
            alert("For security, also remove account from metamask")
      
        
    }
    render(){
        if (this.state.logout) {
        return <Redirect to= "/"/> 
       }
    return (
     
        <Navbar bg="dark" variant="dark">
        <Nav className="container-fluid">
        <Nav.Item className="ml-auto">
        <h5 style={hStyle} > Welcome {this.state.email} </h5>
                </Nav.Item>
                <Nav.Item className="ml-auto">
                <Nav.Link onClick={this.handleLogOut}>Log Out</Nav.Link>
                </Nav.Item>
                </Nav>
                </Navbar>

                )
    }
}
export default Header;
