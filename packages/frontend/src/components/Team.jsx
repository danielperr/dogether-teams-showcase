import React from 'react';

import { createUseStyles } from 'react-jss';

export const TEAM_WIDTH = 600;
export const TEAM_MARGIN_HORIZONTAL = 32;

const useStyles = createUseStyles((theme) => ({
  container: {
    width: `${TEAM_WIDTH}px`,
    height: '225px',
    display: 'flex',
    margin: `0 ${TEAM_MARGIN_HORIZONTAL}px`,
    background: 'rgba(255,255,255,0.3)',
  },
  left: {
    flexGrow: 1,
    margin: theme.spacing(0, 4),
    display: 'grid',
    gridAutoRows: '1fr',
  },
  leftTop: {
    borderBottom: `1px solid ${theme.secondaryColor}`,
    position: 'relative',
  },
  name: {
    position: 'absolute',
    bottom: 0,
    color: theme.primaryColor,
    fontSize: '1.6rem',
    marginBottom: theme.spacing(2),
  },
  description: {
    color: theme.primaryColor,
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
  },
  image: {
  }
}));

function Team({
  name,
  description,
  imageSrc,
}) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <img alt="team logo" src={imageSrc} className={classes.image} />
      <div className={classes.left}>
        <div className={classes.leftTop}>
          <p className={classes.name}>{name}</p>
        </div>
        <div>
          <p className={classes.description}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default Team;
