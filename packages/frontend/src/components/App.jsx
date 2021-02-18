import React, { useEffect, useState, useRef } from 'react';

import { ThemeProvider, createUseStyles } from 'react-jss';

import { fetchTeamGroups } from '../api';
import TeamGroup from './TeamGroup';

const API_NEXUDUS_TEAM_IMAGE = 'https://dogether.spaces.nexudus.com/en/team/getavatar';

const SPACING_AMOUNT = 8;
const SPACING_UNIT = 'px';

const ANIMATION_PIXELS_PER_SECOND = 50;

const theme = {
  spacing: (...amounts) => amounts.map((amount) => `${amount * SPACING_AMOUNT}${SPACING_UNIT}`).join(' '),
  primaryColor: '#333',
  secondaryColor: '#EFBE00',
};

const useStyles = createUseStyles({
  teamGroupTitle: {
    margin: theme.spacing(4, 8),
    color: theme.primaryColor,
    fontSize: '2.5rem',
  },
  bottomBar: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50px',
    padding: '8px',
    backgroundColor: '#facd00',
  },
  dogetherLogo: {
    height: '100%',
  },
});

function App() {
  const [teamGroups, setTeamGroups] = useState([]);
  const [totalWidth, setTotalWidth] = useState(document.body.scrollWidth);

  const containerRef = useRef(null);

  const fetchAndUpdateTeamGroups = () => {
    fetchTeamGroups()
      .then((result) => {
        setTeamGroups(Object.entries(result).map(([title, teams]) => ({
          title,
          teams: teams.map((team) => ({
            name: team.Name,
            description: team.Description,
            imageSrc: `${API_NEXUDUS_TEAM_IMAGE}/${team.Id}?w=192&h=192&mode=pad`,
          })),
        })));
      })
      .catch((error) => {
        console.error(error);
        console.warn('Couldn\'t fetch teams from nexudus due to the error/s above.');
      });
  };

  useEffect(() => {
    fetchAndUpdateTeamGroups();
    const interval = setInterval(fetchAndUpdateTeamGroups, 1000 * 60 * 60);
    return () => { clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setTotalWidth(containerRef.current.scrollWidth);
      console.log(containerRef.current.scrollWidth);
    }
  }, [teamGroups]);

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      {Boolean(teamGroups.length) && (
        <div
          style={{
            width: `${totalWidth}px`,
            height: '100%',
            display: 'grid',
            gridTemplateRows: 'minmax(80px, 1fr) 4fr 66px',
            gridTemplateColumns: `repeat(${teamGroups.length}, 1fr)`,
            animationName: 'horizontal-motion',
            animationDuration: `${totalWidth / ANIMATION_PIXELS_PER_SECOND}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
          ref={containerRef}
        >
          {teamGroups.map(({ title }) => (
            <div key={`${title}-Title`}>
              <h1 className={classes.teamGroupTitle}>{title}</h1>
            </div>
          ))}
          {teamGroups.map(({ title, teams }) => (
            <TeamGroup key={`${title}-TeamGroup`} teams={teams} />
          ))}
          <div />
        </div>
      )}
      <div className={classes.bottomBar}>
        <img
          src={`${process.env.PUBLIC_URL}/dogether-logo.png`}
          alt="dogether logo"
          className={classes.dogetherLogo}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
