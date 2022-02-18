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
  // ignore extra
  extra: [], //processRawDict(rawDict.extra),
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

function pad(str, len) {
  if (str.length < len) return str + ' '.repeat(len - str.length);
  return str;
}

const alphabet=(function() {
  return `Aa Áá Àà Ảả Ãã Ạạ Ăă Ắắ Ằằ Ẳẳ Ẵẵ Ặặ Ââ Ấấ Ầầ Ẩẩ Ẫẫ Ậậ BbCcDd Đđ Ee Éé Èè Ẻẻ Ẽẽ Ẹẹ Êê Ếế Ềề Ểể Ễễ Ệệ FfGgHh Íí Ìì Ỉỉ Ĩĩ Ịị KLMN Oo Óó Òò Ỏỏ Õõ Ọọ Ôô Ốố Ồồ Ổổ Ỗỗ Ộộ Ơơ Ớớ Ờờ Ởở Ỡỡ Ợợ PpQqRrSsTt Uu Úú Ùù Ủủ Ũũ Ụụ Ưư Ứứ Ừừ Ửử Ữữ Ựự VvWwXxYy Ýý Ỳỳ Ỷỷ Ỹỹ Ỵỵ Z`.split(/\s+/).join('');
})();

function compare(a, b) {
  const l = Math.min(a.length, b.length);
  for (let i = 0; i < l; i++) {
    const aIndex = alphabet.indexOf(a[i]);
    const bIndex = alphabet.indexOf(b[i]);
    if (aIndex - bIndex !== 0) {
      return aIndex - bIndex;
    }
  }
  return 0;
}

const hanVietText = (() => {
  let output = '----- normal ------\n';
  h2vDict.normal.forEach(item => {
    output += `${item.han}:    ${item.viets.join(',')} \n`;
  });
  output + '\n ----- extra -----\n';
  h2vDict.extra.forEach(item => {
    output += `${item.han}:    ${item.viets.join(',')} \n`;
  });
  return output;
})();

const vietHanText = (() => {
  const output = [];
  Object.keys(v2hDict).sort(compare).forEach(v => {
    output.push(pad(`${v}:`, 10) + `${v2hDict[v].join(', ')}`);
  });
  return output.join('\n');
})();

function randomPick(arr) {
  const len = Object.keys(arr).length;
  const index = Math.floor(Math.random() * len);
  return arr[index];
}

class Hanviet extends React.Component {
  constructor() {
    super();
    this.state = {
      currentTab: 'han-viet',
    };
    this.setKey = this.setKey.bind(this);
    this.nextChar = this.nextChar.bind(this);
  }

  setKey(k) {
    this.setState({
      currentTab: k,
    });
  }

  nextChar() {
    const useHan = Math.random() - 0.5 > 0;
    const viet = randomPick(Object.keys(v2hDict));
    const hans = v2hDict[viet];
    const next = (() => {
      if (useHan) return { word: randomPick(hans), answer: viet };
      return { word: viet, answer: hans.join(', ') }
    })();
    this.setState({ next });
  }

  render() {
    const { currentTab, next } = this.state;
    const { nextChar } = this;
    return (
      <div style={{ marginTop: 12 }} >
      <Container>
        <Tabs activeKey={currentTab} onSelect={k => this.setKey(k)}>
          <Tab eventKey="han-viet" title="han-viet">
            <pre style={{ fontFamily: 'lora' }}>{hanVietText}</pre>
          </Tab>
          <Tab eventKey="viet-han" title="viet-han">
            <pre style={{ fontFamily: 'lora' }}>{vietHanText}</pre>
          </Tab>
          <Tab eventKey="test" title="test">
             <Button   onClick={nextChar} variant="primary">NEXT</Button>

              <br />
              <br />
             <pre  style={{ fontFamily: 'lora' }}> {next && next.word} </pre>
              <br />
             <pre style={{ fontFamily: 'lora' }}> {next && next.answer} </pre>
          </Tab>
        </Tabs>
      </Container>
      </div>
    );
  }
}


ReactDOM.render(<Hanviet />, document.getElementById("root"));
