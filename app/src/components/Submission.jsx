import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const styles = (theme) => ({
  card: {
    minWidth: 275,
    maxWidth: 300,
  },
  cardContent: {
    height: 200,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  root: {
    margin: 15,
    width: 300,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const Submission = (props) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { classes, submission } = props;

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography className={classes.title} color="textSecondary">
            {submission.listingType}
          </Typography>
          <Typography variant="headline" component="h2">
            {submission.dealType}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {submission.title}
          </Typography>
          <Typography component="p">
            {submission.authorName}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" href={`https://www.reddit.com/${submission.permalink}`} target="_blank" className={classes.button}>
            Reddit
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

Submission.propTypes = {
  classes: PropTypes.object.isRequired,
  submission: PropTypes.object.isRequired,
};

export default withStyles(styles)(Submission);
