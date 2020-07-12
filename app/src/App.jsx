import { chain, filter } from 'lodash';
import React, { useEffect, useState } from 'react';
import DealTypeFilter from './components/DealTypeFilter';
import DealTypeToggler from './components/DealTypeToggler';
import Submission from './components/Submission';

const App = () => {
  const [redditSubmissions, setRedditSubmissions] = useState([]);
  const [uncheckedSubmissionTypes, setUncheckedSubmissionTypes] = useState([]);
  const [currentBulkViewSelection, setCurrentBulkViewSelection] = useState('all');

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://localhost:3030/bapcsales/posts', { mode: 'cors' });
      const json = await res.json();
      setRedditSubmissions(json);
    }
    fetchData();
  }, [redditSubmissions]);

  const getDealTypes = () => chain(redditSubmissions)
    .uniqBy('dealType')
    .map('dealType')
    .value();

  const dealCheckboxCheck = (deal, checked) => {
    let viewSelection = 'custom';
    if (checked) {
      uncheckedSubmissionTypes.splice(uncheckedSubmissionTypes.indexOf(deal), 1);
    } else {
      uncheckedSubmissionTypes.push(deal);
    }
    if (uncheckedSubmissionTypes.length === 0) {
      viewSelection = 'all';
    }
    if (uncheckedSubmissionTypes.length === getDealTypes().length) {
      viewSelection = 'none';
    }

    setUncheckedSubmissionTypes(uncheckedSubmissionTypes);
    setCurrentBulkViewSelection(viewSelection);
  };

  const dealTypes = (bulkViewSelection) => {
    if (bulkViewSelection === 'all') {
      setUncheckedSubmissionTypes([]);
      setCurrentBulkViewSelection(bulkViewSelection);
    } else if (bulkViewSelection === 'none') {
      setUncheckedSubmissionTypes(getDealTypes());
      setCurrentBulkViewSelection(bulkViewSelection);
    }
  };

  let redditSubmissionsToRender = [];
  if (uncheckedSubmissionTypes.length) {
    redditSubmissionsToRender = filter(redditSubmissions, (submission) => {
      if (uncheckedSubmissionTypes.includes(submission.dealType)) {
        return false;
      }
      return true;
    });
  } else {
    redditSubmissionsToRender = redditSubmissions;
  }

  return (
    <div style={{}}>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <DealTypeToggler
          dealTypes={dealTypes}
          value={currentBulkViewSelection}
        />
      </div>
      <div style={{
        justifyContent: 'center', flexWrap: 'wrap', display: 'flex', flexDirection: 'row',
      }}
      >
        {getDealTypes().map((dealType) => (
          <DealTypeFilter
            key={dealType}
            handleCheck={dealCheckboxCheck}
            checkedState={!uncheckedSubmissionTypes.includes(dealType)}
            dealType={dealType}
          />
        ))}
      </div>
      <div style={{
        justifyContent: 'center',
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
};

export default App;
