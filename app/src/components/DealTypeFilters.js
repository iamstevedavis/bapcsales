
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

class CheckboxesGroup extends React.Component {
  state = {
    checkStates: {},
    dealTypes: [],
  };

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps, this.props)) {
      this.setState({ dealTypes: this.props.dealTypes });
      const checkStates = {};
      this.props.dealTypes.forEach((dealType) => {
        if (dealType === '') {
          checkStates['unknown'] = true;
        } else {
          checkStates[dealType] = true;
        }
      });
      this.setState({ checkStates: checkStates });
    }
  }

  componentDidMount() {

  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const dealTypes = this.props.dealTypes;
    const checkStates = this.state.checkStates;

    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Deal Types</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name="all"
                checked={true}
                onChange={this.handleChange('all')}
                value="checked"
                color="primary"
              />
            }
            label='All'
          />
          <FormControlLabel
            control={
              <Checkbox
                name='none'
                checked={false}
                onChange={this.handleChange('all')}
                value="checked"
                color="primary"
              />
            }
            label='None'
          />
          {dealTypes.map((dealType) => {
            const checkedState = checkStates[dealType];
            console.log(checkedState);
            return (<FormControlLabel
              control={
                <Checkbox
                  name={dealType}
                  checked={true}
                  onChange={this.handleChange(dealType)}
                  value="checked"
                  color="primary"
                />
              }
              label={dealType === '' ? 'unknown' : dealType}
            />)
          })}
        </FormGroup>
        <FormHelperText>Toggle Different Filters</FormHelperText>
      </FormControl>
    );
  }
}

CheckboxesGroup.propTypes = {
  dealTypes: PropTypes.array.isRequired,
};

export default CheckboxesGroup;
