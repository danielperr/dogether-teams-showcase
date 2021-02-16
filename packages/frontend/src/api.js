import axios from 'axios';

import teams from './teams.json';

const {
  REACT_APP_NEXUDUS_API_TOKEN,
} = process.env;

const API_NEXUDUS_TEAMS = 'https://spaces.nexudus.com/api/spaces/teams';

async function fetchAllTeams() {
  const fetchTeamsPage = (pageNumber) => {
    return axios(`${API_NEXUDUS_TEAMS}?page=${pageNumber}`, {
      headers: {
        Authorization: `Basic ${REACT_APP_NEXUDUS_API_TOKEN}`,
      }
    });
  };

  const response = await fetchTeamsPage(1);
  const promises = [...Array(response.data.TotalPages)].map((_, i) => fetchTeamsPage(i + 1));
  const allPromises = await Promise.all(promises);
  const allTeams = allPromises.map(({ data }) => data.Records).reduce((total, current) => [].concat.apply(total, current));
  // Keep only the active teams in the organisation
  const activeTeams = allTeams.filter((team) => team.ActiveContracts);
  console.log(allTeams.filter((team) => !team.ActiveContracts));
  // Save memory and use only the properties we need
  return activeTeams.map(({ Name, Description, Id, ProfileTags }) => ({ Name, Description, Id, ProfileTags }));
}

export async function fetchTeamGroups() {
  // const teams = await fetchAllTeams();
  await new Promise(((resolve) => { setTimeout(resolve, 200); }));

  const tagUses = {};
  teams.forEach(({ ProfileTags }) => {
    if (ProfileTags) {
      ProfileTags.split(',').forEach((tag) => {
        if (!tagUses[tag]) { tagUses[tag] = 0; }
        tagUses[tag] += 1;
      });
    }
  });

  const teamGroups = {};
  teams.forEach((team) => {
    if (team.ProfileTags) {
      const tags = team.ProfileTags.split(',');
      const tagsWithCombinedTags = tags.filter((tag) => tagUses[tag] > 1)
      // Tags which only have 1 team in them, so we combine them into one group tag
      const tagsToCombine = tags.filter((tag) => tagUses[tag] === 1).join(', ');
      if (tagsToCombine) {
        tagsWithCombinedTags.push(tagsToCombine);
      }
      tagsWithCombinedTags.forEach((tag) => {
        if (!teamGroups[tag]) { teamGroups[tag] = []; }
        teamGroups[tag].push({ ...team });
      });
    }
  });

  return teamGroups;
}
