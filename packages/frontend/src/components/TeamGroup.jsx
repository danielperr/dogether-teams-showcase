import React from 'react';

import { createUseStyles } from 'react-jss';

import Team from './Team';

export const TEAM_GROUP_ROW_COUNT = 3

const useStyles = createUseStyles({
  container: {
    marginLeft: '200px',
    borderRight: `1px solid lightgray`,
    marginBottom: '16px',
  },
});

function TeamGroup(props) {
  const classes = useStyles();

  // Divide the teams to table row arrays
  const teamRows = [...Array(TEAM_GROUP_ROW_COUNT)].map(() => []);
  props.teams.forEach((team, i) => teamRows[i % TEAM_GROUP_ROW_COUNT].push(team));

  return (
    <div className={classes.container}>
      <table>
        <tbody>
        {teamRows.map((row, i) => (
          <tr key={i}>
            {row.map((team, i) => (
              <td key={i}>
                <Team
                  name={team.name}
                  description={team.description}
                  imageSrc={team.imageSrc}
                />
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default TeamGroup;
