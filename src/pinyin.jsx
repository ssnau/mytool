import React from "react";
import ReactDOM from "react-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import styled from "styled-components";
import rawDict from "./data/pinyin_dict_notone";
import "normalize.css";

console.log(rawDict)

class Pinyin extends React.Component {
  constructor() {
    super();
    this.state = {
      currentTab: 'regexp',
    };
  }

  handleTab1Pinyin(event) {
    const value = event.target.value;
    const regexp = new RegExp(value);
    const output = [];
    Object.keys(rawDict).forEach(k => {
      if (regexp.test(k)) {
        output.push(k);
        output.push(rawDict[k]);
      }
    });
    this.setState({output1: output.join('\n')})
  }

  renderRegexp() {
    return (
    <div>
      <Form>
        <Form.Group controlId="tab1-pinyin" onChange={(e) => this.handleTab1Pinyin(e)}>
          <Form.Label>Search with keyword</Form.Label>
          <Form.Control type="text"  placeholder="Enter a pinyin" />
        </Form.Group>
      </Form>
      <br />
      <pre>{this.state.output1 || ''}</pre>
      <br />
    </div>
    )
  }

  render() {
    const { currentTab, next } = this.state;
    return (
      <div style={{ marginTop: 12 }} >
      <Container>
        <Tabs activeKey={currentTab} onSelect={k => this.setKey(k)}>
          <Tab eventKey="regexp" title="regexp">
            <pre>{this.renderRegexp()}</pre>
          </Tab>
        </Tabs>
      </Container>
      </div>
    );
  }
}


ReactDOM.render(<Pinyin />, document.getElementById("root"));
