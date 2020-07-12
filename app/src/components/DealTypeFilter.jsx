import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {};

const DealTypeFilter = (props) => {
  const { dealType, handleCheck, checkedState } = props;

  return (
    <FormGroup row>
      <FormControlLabel
        control={(
          <Checkbox
            name={dealType}
            checked={checkedState}
            onChange={(event) => handleCheck(event.target.name, event.target.checked)}
            value="checked"
            color="primary"
          />
          )}
        label={dealType === '' ? 'unknown' : dealType}
      />
    </FormGroup>
  );
};

DealTypeFilter.propTypes = {
  dealType: PropTypes.string.isRequired,
  checkedState: PropTypes.bool.isRequired,
  handleCheck: PropTypes.func.isRequired,
};

export default withStyles(styles)(DealTypeFilter);
