import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {};

class DealTypeFilter extends React.Component {
  state = {
    checked: true,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    this.props.dealTypes(event.target.name, event.target.checked);
  };

  render() {
    const dealType = this.props.dealType;
    const checkedState = this.props.checkedState;

    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              name={dealType}
              checked={checkedState}
              onChange={this.handleChange('checked')}
              value="checked"
              color="primary"
            />
          }
          label={dealType === '' ? 'unknown' : dealType}
        />
      </FormGroup>
    );
  }
}

DealTypeFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  dealType: PropTypes.string.isRequired,
  checkedState: PropTypes.bool.isRequired,
};

export default withStyles(styles)(DealTypeFilter);
