import React from "react";
import ReactDOM from "react-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styled from "styled-components";
import uniq from 'lodash/uniq';
import "normalize.css";
const QIAN = 1000;
const YI = 100000000;
const BAIWAN = 1000000;
const nTable = ({
  Thousand: QIAN,
  Trillion: 1000 * 10 * YI,
  Billion: 10 * YI,
  Million: BAIWAN,
  '千': QIAN,
  '万': QIAN * 10,
  '千万': 10 * BAIWAN,
  '亿': YI,
  '千亿': 1000 * YI,
  '万亿': 10000 * YI,
});

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
};

function parseToNumber(text) {
      try {
        return eval('(' + text + ')');
      } catch (e) {
        return NaN;
      }
}

function genRandom(min, max) {
  return (Math.random() * max) + min;
}

function byId(id) {
  return document.getElementById(id);
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

class Danwei extends React.Component {
  constructor() {
    super();
    this.state = { 
      activeKey: '1',
    };
    this.handleCompute = this.handleCompute.bind(this);
  }

  handleCompute() {
    const number = byId('number').value;
    const danwei = (byId('danwei').innerText || '').trim();
    if (number == '') return alert('please input number');
    if (danwei == 'Select') return alert('please select danwei');
    const n = nTable[danwei] * (number - 0);
    this.setState({ output1: [n, numberWithCommas(n)].join('\n') });
  }

  handleCompute2() {
    const number = String(byId('purenum').value).replace(/,/g, '').replace(/ /g, '');
    if (number === '') return alert('please enter number');
    if (number[0] !== '1') return alert('number must starts with 1');
    if (!/^0+$/.test(number.slice(1))) return alert('number can only contain 0, and starts with 1');
    if (number < 10000) return alert('number too small');
    const output = [];
    const rTable = {};
    // 从大到小排序
    const values = uniq(Object.keys(nTable).map(k => nTable[k] - 0).sort((a, b) => b - a));
    Object.keys(nTable).forEach(k => {
      rTable[nTable[k]] = [k].concat(rTable[nTable[k]] || []);
    });
    values.forEach(v => {
      if (output.length > 2) return;
      if (v - 0 - number <= 0) {
        const danweis = rTable[v];
        const multiple = number / v;
        danweis.forEach(d => {
          output.push(multiple + ' ' + d);
        })
      }
    })
    output.push(numberWithCommas(number));
    this.setState({ output2: output.join('\n') });
  }

  setDanwei(d) {
    this.setState({ danwei: d })
  }

  renderDanweiToNum() {
    const { output1, error1 } = this.state;
    const danweis = [
      'Trillion',
      'Billion',
      'Million',
      '-',
      '亿',
      '千亿',
      '万亿',
      '百万',
    ];
    return (
      <div>
            <Form>
							<InputGroup>
								<FormControl
									placeholder="input the number" 
                  id='number'
									aria-label="input the number"
									aria-describedby="basic-addon2"
								/>

								<DropdownButton
									as={InputGroup.Append}
									variant="outline-secondary"
									title={this.state.danwei || 'Select'}
									id="danwei"
								>
                  {danweis.map(d => {
                    if (d === '-') return <Dropdown.Divider />
                    return <Dropdown.Item href="#" onClick={() => this.setDanwei(d)}>{d}</Dropdown.Item>
                  })}
								</DropdownButton>
							</InputGroup>

            </Form>
            <br />
            <Button variant="primary" onClick={this.handleCompute}>Compute</Button>
            <br />
            <br />
            <pre>{output1 || ''}</pre>
            <br />
            <pre style={{color: 'red'}}>{error1 || ''}</pre>
      </div>
    )
  }

  renderNumToDanwei() {
    const { output2, error2  } = this.state;
    return (
      <div style={{padding: 15}}>
            <Form>
              <Form.Group as={Row} controlId="purenum">
                <Form.Label>Number</Form.Label>
                <Form.Control type="text"  placeholder="Enter a number, like 1000" />
              </Form.Group>
            </Form>
            <br />
            <Button variant="primary" onClick={() => this.handleCompute2()}>Compute</Button>
            <br />
            <br />
            <pre>{output2 || ''}</pre>
            <br />
            <pre style={{color: 'red'}}>{error2 || ''}</pre>
      </div>
    )              
  }

  render() {
    const { activeKey } = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <h1> DANWEI </h1>
						<Nav variant="tabs" activeKey={this.state.activeKey} onSelect={(k) => this.setState({activeKey: k})}>
							<Nav.Item>
								<Nav.Link eventKey="1">DANWEI -> NUMBER</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="2">NUMBER -> DANWEI</Nav.Link>
							</Nav.Item>
						</Nav>
            <div style={{ padding: '8px 0px', display: String(activeKey) === '1' ? 'block' : 'none'  }}>
              {this.renderDanweiToNum()}
            </div>
            <div style={{ padding: '8px 0px', display: String(activeKey) === '2' ? 'block' : 'none'  }}>
              {this.renderNumToDanwei()}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}


ReactDOM.render(<Danwei />, document.getElementById("root"));
