import React, { Component } from "react";
import {Badge} from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import "./Login.css"
class Login extends Component {
    render() {
        return (
            <div className= "col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4">
            <form>
                <h3><Badge variant="light">Login/Register</Badge></h3>

                <div className="form-group text-left">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                   Note: Make sure Email address and Account in metamask match.
                </div>

               

                <Button variant="contained" color="primary" component={Link} to="/inbox">Submit</Button>
               
            </form>
            </div>
        );
    }
}
export default Login;