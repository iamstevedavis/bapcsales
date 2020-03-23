import { chain, filter } from 'lodash';
import React, { Component } from 'react';
import DealTypeFilter from './components/DealTypeFilter';
import DealTypeToggler from './components/DealTypeToggler';
import Submission from './components/Submission';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redditSubmissions: [],
      uncheckedSubmissionTypes: [],
      currentBulkViewSelection: 'all',
    };
  }

  componentDidMount() {
    this.APICall();
  }

  getDealTypes() {
    return chain(this.state.redditSubmissions)
      .uniqBy('dealType')
      .map('dealType')
      .value();
  }

  async APICall() {
    let body = [];

    try {
      body = await (await fetch('http://localhost:3030/bapcsales/posts', { mode: 'cors' })).json();
    } finally {
      this.setState({ redditSubmissions: body });
    }
  }

  dealCheckboxCheck(deal, checked) {
    let currentBulkViewSelection = 'custom';
    const { uncheckedSubmissionTypes } = this.state;
    if (checked) {
      uncheckedSubmissionTypes.splice(uncheckedSubmissionTypes.indexOf(deal), 1);
    } else {
      uncheckedSubmissionTypes.push(deal);
    }
    if (uncheckedSubmissionTypes.length === 0) {
      currentBulkViewSelection = 'all';
    }
    if (uncheckedSubmissionTypes.length === this.getDealTypes().length) {
      currentBulkViewSelection = 'none';
    }

    this.setState({ uncheckedSubmissionTypes, currentBulkViewSelection });
  }

  dealTypes(bulkViewSelection) {
    if (bulkViewSelection === 'all') {
      this.setState({ uncheckedSubmissionTypes: [], currentBulkViewSelection: bulkViewSelection });
    } else if (bulkViewSelection === 'none') {
      this.setState({
        uncheckedSubmissionTypes: this.getDealTypes(),
        currentBulkViewSelection: bulkViewSelection,
      });
    }
  }

  render() {
    const { uncheckedSubmissionTypes } = this.state;

    let redditSubmissionsToRender = [];
    if (uncheckedSubmissionTypes.length) {
      redditSubmissionsToRender = filter(this.state.redditSubmissions, (submission) => {
        if (uncheckedSubmissionTypes.includes(submission.dealType)) {
          return false;
        }
        return true;
      });
    } else {
      redditSubmissionsToRender = this.state.redditSubmissions;
    }

    return (
      <div style={{}}>
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          {/* Bind so we can call this.setState in the dealTypes function. */}
          <DealTypeToggler
            dealTypes={this.dealTypes.bind(this)}
            value={this.state.currentBulkViewSelection}
          />
        </div>
        <div style={{
          justifyContent: 'center', width: '100%', flexWrap: 'wrap', display: 'flex', flexDirection: 'row',
        }}
        >
          {this.getDealTypes().map((dealType) => (
            <DealTypeFilter
              key={dealType}
              dealTypes={this.dealCheckboxCheck.bind(this)}
              checkedState={!uncheckedSubmissionTypes.includes(dealType)}
              dealType={dealType}
            />
          ))}
        </div>
        <div style={{
          justifyContent: 'center',
          width: '100%',
          flexWrap: 'wrap',
          display: 'flex',
          flexDirection: 'row',
        }}
        >
          {
            redditSubmissionsToRender.map((submission) => (
              <Submission
                key={submission.redditId}
                submission={submission}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

export default App;
