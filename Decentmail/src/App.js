import React, { Component } from "react";
import "./App.css";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './components/Home';
import Outbox from './components/Outbox';
import Compose from './components/Compose';
import Login from './components/Login';
class App extends Component{
    render(){
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path = "/" component = {Login} exact/>
                        <Route path = "/inbox" component = {Home} exact/>
                        <Route path = "/outbox" component = {Outbox} exact/>
                        <Route path = "/compose" component = {Compose} exact/>

                    </Switch> 
                </div>
            </BrowserRouter>
        )
    }

}
export default App;
