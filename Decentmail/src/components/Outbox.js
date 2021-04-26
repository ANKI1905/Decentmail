import React, {Component} from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Sentmessages from './Sentmessages';

class Outbox extends Component{
    render(){
        return (
            <div className = "row">
              <div class="col-sm-3">  <Sidebar/> </div>
              <div class = "col-sm-9">
                <Header/>
                <Sentmessages/>
            </div>
            </div>
                
        )
    }
}
export default Outbox;