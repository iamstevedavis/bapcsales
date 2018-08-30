
import { chain, isEqual, keyBy } from 'lodash';
import React, { Component } from 'react';
import './App.css';
import DealTypeFilter from './components/DealTypeFilter';
import DealTypeToggler from './components/DealTypeToggler';
import Submission from './components/Submission';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResp: {},
      submissions: {},
      dealTypes: [],
      inactiveDealTypes: [],
      isCustomDealTypesView: false,
    };
  }

  componentDidMount() {
    this.APICall();
    this.getDealTypes();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.apiResp, this.state.apiResp)) {
      this.getDealTypes();
    }
  }

  getDealTypes() {
    const dealTypes = chain(this.state.apiResp)
      .uniqBy('dealType')
      .map('dealType')
      .value();
    this.setState({ dealTypes: dealTypes });
  }

  async APICall() {
    const response = await fetch('http://localhost:3001/bapcsales/posts', { mode: 'cors' });
    const body = await response.json();
    this.setState({ apiResp: body, submissions: keyBy(body, 'redditId') });
  }

  dealTypes(event) {
    let currentDealTypes = [];
    if (event === 'all') {
      currentDealTypes = [];
    } else if (event === 'none') {
      currentDealTypes = this.state.dealTypes;
    } else {
      currentDealTypes = this.state.inactiveDealTypes;
      if (currentDealTypes.indexOf(event) !== -1) {
        currentDealTypes.splice(currentDealTypes.indexOf(event), 1);
      } else {
        currentDealTypes.push(event);
      }
      if (currentDealTypes.length === 0) {
        this.setState({ isCustomDealTypesView: false });
      } else if (currentDealTypes.length > 0 && currentDealTypes.length === this.state.dealTypes.length) {
        this.setState({ isCustomDealTypesView: false });
      } else {
        this.setState({ isCustomDealTypesView: true });
      }
    }

    const submissions = chain(this.state.apiResp)
      .filter((o) => {
        return currentDealTypes.every((dealType) => {
          return o.dealType !== dealType;
        })
      })
      .value();

    this.setState({ submissions, inactiveDealTypes: currentDealTypes })
  }

  renderSubmission(submission) {
    return <Submission key={ submission.redditId } submission={ submission }/>;
  }

  renderDealType(dealType, checkedState) {
    return <DealTypeFilter key={dealType} dealTypes={this.dealTypes.bind(this)} checkedState={checkedState} dealType={dealType} />;
  }

  render() {
    const submissions = Object.keys(this.state.submissions);
    const dealTypes = this.state.dealTypes;
    const inactiveDealTypes = this.state.inactiveDealTypes;
    const isCustomDealTypesView = this.state.isCustomDealTypesView;

    return (
      <div style={{}}>
        <div style={{ justifyContent: "center", display: "flex" }}>
          <DealTypeToggler isCustom={isCustomDealTypesView} dealTypes={this.dealTypes.bind(this)} />
        </div>
        <div style={{ justifyContent: "center", width: "100%", flexWrap: "wrap", display: "flex", flexDirection: "row" }}>
          {dealTypes.map((dealType) => {
            let checkedState = true;
            if (inactiveDealTypes.indexOf(dealType) !== -1) {
              checkedState = false;
            }
            return this.renderDealType(dealType, checkedState);
          })}
        </div>
        <div style={{ justifyContent: "center", width: "100%", flexWrap: "wrap", display: "flex", flexDirection: "row" }}>
          {submissions.map((submission) => {
            return this.renderSubmission(this.state.submissions[submission])
          })}
        </div>
      </div>
    )
  }
}

export default App;
