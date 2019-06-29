import React from "react";
import ReactDOM from "react-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import styled from "styled-components";
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

function parseToDate(str) {
  return new Date(Date.parse(str));
}

function pad(str) {
  if (String(str).length === 1) return '0' + str;
  return str;
}

function normalizeDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function weekDayToName(num) {
  return ({
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
    7: 'Sun',
    0: 'Sun',
  })[num];
}

class CollabCompute extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleGenerate = this.handleGenerate.bind(this);
  }

  handleGenerate() {
    const startDate = parseToDate(byId('start-date').value);
    const endDate = parseToDate(byId('end-date').value);

    if (String(startDate.getDate()) == 'NaN') {
      return this.setState({ error: 'startDate is not valid' });
    }

    if (String(endDate.getDate()) == 'NaN') {
      return this.setState({ error: 'endDate is not valid' });
    }

    const incrementor = startDate < endDate ? 1 : -1;
    let currentDate = startDate;
    let outputs = [];
    let count = 0;
    while (normalizeDate(currentDate) != normalizeDate(endDate)) {
      outputs.push(`${normalizeDate(currentDate)} ${weekDayToName(currentDate.getDay())}`);
      currentDate.setDate(currentDate.getDate() + incrementor);
      count++;
      if (count > 1000) {
        this.setState({ error: "shit happens" });
        break;
      }
    }
    console.log(outputs);
    this.setState({ output: outputs.join('\n') });
  }

  render() {
    const { output, error } = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <h1> Note Calendar </h1>
            <Form>
              <Form.Group as={Row} controlId="start-date">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="text"  placeholder="Enter a date, like 2019-07-01" />
              </Form.Group>

              <Form.Group as={Row} controlId="end-date">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="text" placeholder="Enter a date, like 2019-07-01" />
              </Form.Group>

            </Form>
            <Button variant="primary" onClick={this.handleGenerate}>Generate</Button>
            <p> output:</p>
            <pre>{output || ''}</pre>
            <br />
            <pre style={{color: 'red'}}>{error || ''}</pre>
          </Col>
        </Row>
      </Container>
    );
  }
}


ReactDOM.render(<CollabCompute />, document.getElementById("root"));
