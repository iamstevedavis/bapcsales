import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const styles = (theme) => ({
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
  render() {
    const { classes, value } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Bulk View</FormLabel>
          <RadioGroup
            aria-label="bulkDealType"
            name="bulkDealType"
            className={classes.group}
            value={value}
            onChange={(event) => this.props.dealTypes(event.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="none" control={<Radio />} label="None" />
            <FormControlLabel value="custom" control={<Radio />} label="Custom" />
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

DealTypeToggler.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DealTypeToggler);
