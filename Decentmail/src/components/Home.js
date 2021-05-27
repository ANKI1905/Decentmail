import React, {Component} from 'react';
import Header from './Header';
import Messages from './Messages';
import Sidebar from './Sidebar';

class Home extends Component{
    render(){
        return (
            <div className = "row">
              <div class="col-sm-3">  <Sidebar  /> </div>
              <div class = "col-sm-9">
                <Header email = {this.props.email} />
                <Messages/>
            </div>
            </div>
                
        )
    }
}
export default Home;