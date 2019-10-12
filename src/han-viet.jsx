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
import rawDict from "./data/hanviet";
import "normalize.css";
const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
};

function processRawDict(str) {
  return str
    .trim()
    .split('\n')
    .filter(x => x.trim().length)
    .map(x => {
      const [han, viet] = x.split(':');
      const viets = viet.split(',');
      return {
        han: han.trim(),
        viets: viets.map(v => v.trim()).filter(x => x.trim().length),
    };
  });
}

const h2vDict = {
  normal: processRawDict(rawDict.normal),
  extra: processRawDict(rawDict.extra),
}

const v2hDict = (() => {
  const fullDict = {};
  process(h2vDict.normal);
  process(h2vDict.extra);
  function process(items) {
    items.forEach(k => {
      const { han, viets } = k;
      viets.forEach(v => {
        fullDict[v] = (fullDict[v] || []).concat(han);
      });
    });
  }
  return fullDict;
})();

const hanVietText = (() => {
  let output = '----- normal ------\n';
  h2vDict.normal.forEach(item => {
    output += `${item.han}: ${item.viets.join(',')} \n`;
  });
  output + '\n ----- extra -----\n';
  h2vDict.extra.forEach(item => {
    output += `${item.han}: ${item.viets.join(',')} \n`;
  });
  return output;
})();

const vietHanText = (() => {
  const output = [];
  Object.keys(v2hDict).sort().forEach(v => {
    output.push(`${v}: ${v2hDict[v].join(', ')}`);
  });
  return output.join('\n');
})();

class Hanviet extends React.Component {
  constructor() {
    super();
    this.state = {
      currentTab: 'han-viet',
    };
    this.setKey = this.setKey.bind(this);
  }

  setKey(k) {
    this.setState({
      currentTab: k,
    });
  }

  render() {
    const { currentTab, } = this.state;
    return (
      <div style={{ marginTop: 12 }} >
      <Container>
        <Tabs activeKey={currentTab} onSelect={k => this.setKey(k)}>
          <Tab eventKey="han-viet" title="han-viet">
            <pre>{hanVietText}</pre>
          </Tab>
          <Tab eventKey="viet-han" title="viet-han">
            <pre>{vietHanText}</pre>
          </Tab>
        </Tabs>
      </Container>
      </div>
    );
  }
}


ReactDOM.render(<Hanviet />, document.getElementById("root"));
