
import { chain, filter, isEqual, keyBy } from 'lodash';
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
      uncheckedDealTypes: [],
      isCustomDealTypesView: false,
      currentBulkViewSelection: "all"
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
    // Need error handling
    const response = await fetch('http://localhost:3030/bapcsales/posts', { mode: 'cors' });
    const body = await response.json();

    this.setState({ apiResp: body, submissions: keyBy(body, 'redditId') });
  }

  dealCheckboxCheck(deal, checked) {
    let uncheckedDealTypes = this.state.uncheckedDealTypes;
    if (checked) {
      uncheckedDealTypes.splice(uncheckedDealTypes.indexOf(deal), 1);
    } else {
      uncheckedDealTypes.push(deal);
    }
    const submissions = filter(this.state.apiResp, (submission) => {
      if (uncheckedDealTypes.includes(submission.dealType)) {
        return false;
      }
      return true;
    });
    this.setState({submissions, uncheckedDealTypes, currentBulkViewSelection: 'custom'})
  }

  dealTypes(bulkViewSelection) {
    console.log(`dealTypes ${bulkViewSelection}`)
    if (bulkViewSelection === 'all') {
      this.setState({ submissions: this.state.apiResp, uncheckedDealTypes: [], currentBulkViewSelection: bulkViewSelection });
      return;
    } else if (bulkViewSelection === 'none') {
      this.setState({ submissions: [], uncheckedDealTypes: this.state.dealTypes, currentBulkViewSelection: bulkViewSelection });
      return;
    }
  }

  renderSubmission(submission) {
    return <Submission key={ submission.redditId } submission={ submission }/>;
  }

  renderDealType(dealType, checkedState) {
    return <DealTypeFilter key={dealType} dealTypes={this.dealCheckboxCheck.bind(this)} checkedState={checkedState} dealType={dealType} />;
  }

  render() {
    const submissions = Object.keys(this.state.submissions);
    const dealTypes = this.state.dealTypes;
    const uncheckedDealTypes = this.state.uncheckedDealTypes;
    const isCustomDealTypesView = this.state.isCustomDealTypesView;

    return (
      <div style={{}}>
        <div style={{ justifyContent: "center", display: "flex" }}>
          <DealTypeToggler isCustom={isCustomDealTypesView} dealTypes={this.dealTypes.bind(this)} value={this.state.currentBulkViewSelection}/>
        </div>
        <div style={{ justifyContent: "center", width: "100%", flexWrap: "wrap", display: "flex", flexDirection: "row" }}>
          {dealTypes.map((dealType) => {
            let checkedState = true;
            if (uncheckedDealTypes.indexOf(dealType) !== -1) {
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
