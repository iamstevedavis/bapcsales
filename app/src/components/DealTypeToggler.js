import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
    flexDirection: 'row',
  },
});

class DealTypeToggler extends React.Component {
  state = {
    value: 'all',
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
    this.props.dealTypes(event.target.value)
  };

  render() {
    const { classes } = this.props;
    const value = this.props.isCustom ? 'custom' : 'all';

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Bulk View</FormLabel>
          <RadioGroup
            aria-label="bulkDealType"
            name="bulkDealType"
            className={classes.group}
            value={value}
            onChange={this.handleChange}
          >
            <FormControlLabel value="all" control={<Radio color="primary" />} label="All" />
            <FormControlLabel value="none" control={<Radio color="primary" />} label="None" />
            <FormControlLabel value="custom" control={<Radio color="primary" />} label="Custom" />
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

DealTypeToggler.propTypes = {
  classes: PropTypes.object.isRequired,
  isCustom: PropTypes.bool.isRequired,
};

export default withStyles(styles)(DealTypeToggler);
