import { MessageSharp } from "@material-ui/icons";
import React from "react";
import ReactDOM from "react-dom";
import "/home/ankita/Documents/Decentmail/node_modules/bootstrap/dist/css/bootstrap.min.css";
import Modal from "./Modal";

import "./styles.css";

class Messages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      name: "",
      modalInputName: ""
    };
  }

  handleChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    this.setState({ name: this.state.modalInputName });
    this.modalClose();
  }

  modalOpen() {
    this.setState({ modal: true });
  }

  modalClose() {
    this.setState({
      modalInputName: "",
      modal: false
    });
  }

  render() {
    return (
      <div className="Messages">
        <h1>Hello!! {this.state.name}</h1>
        <button><a href="javascript:;" onClick={e => this.modalOpen(e)}>
          Compose
        </a></button>
        <Modal show={this.state.modal} handleClose={e => this.modalClose(e)}>
        <form >
      <h1>Create Account</h1>

      <label>
        Email:
        <input
          name="email"
          type="email"
         // value={}
         // onChange={e => setEmail(e.target.value)}
          required />
      </label>

      <label>
        Password:
        <input
          name="password"
          type="password"
          //value={}
         // onChange={e => setPassword(e.target.value)}
          required />
      </label>

      

      <label>
        <input
          name="acceptedTerms"
          type="checkbox"
         // onChange={e => setAcceptedTerms(e.target.value)}
          required />
        I accept the terms of service
      </label>

      <button>Submit</button>
    </form>
        </Modal>
      </div>
    );
  }
}

export default Messages;