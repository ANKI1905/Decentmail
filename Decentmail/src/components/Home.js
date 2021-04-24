import React, {Component} from 'react';
import Header from './Header';
import Messages from './Messages';
import Sidebar from './Sidebar';

class Home extends Component{
    render(){
        return (
            <div>
            <Sidebar/>
            <div>
                <Header/>
                <Messages/>
            </div>
            </div>
                
        )
    }
}
export default Home;