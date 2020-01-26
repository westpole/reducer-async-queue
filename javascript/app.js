const fetch = require('node-fetch');

/**
 * @typedef {object} CalendarEntity
 * @property {string} season Year, Format DDDD
 * @property {string} round Format DD
 * @property {string} url GP wiki page
 * @property {string} raceName
 * @property {string} date Format YYYY-MM-DD
 * @property {string} time Format HH:MM:SSZ
 * @property {object} Circuit
 * @property {string} Circuit.circuitId
 * @property {string} Circuit.url Circuit wiki page
 * @property {string} Circuit.circuitName
 * @property {object} Circuit.Location
 * @property {string} Circuit.Location.lat
 * @property {string} Circuit.Location.long
 * @property {string} Circuit.Location.locality
 * @property {string} Circuit.Location.country
 */

/**
 * @typedef  {object} AppState
 * @property {string} baseUrl API endpoint URL
 * @property {number} year
 * @property {CalendarEntity} calendar API response calendar entity
 * @property {object} current
 * @property {string} current.date Format YYYY-MM-DD
 * @property {string} current.time Format HH:MM:SSZ
 */
const initState = {
  baseUrl: null,
  year: null,
  calendar: null,
  current: {
    date: null,
    time: null,
  },
};

/**
 * Application core
 */

/**
 * Queue reducer
 *
 * @param {object} previousPromise
 * @param {function} taskFn Task from queue
 * @returns {object} Promise
 */
async function queueHandler(previousPromise, taskFn) {
  const newState = await previousPromise;

  return taskFn(newState);
}

/**
 * Task queue
 *
 * @param {function[]} queue List of tasks
 * @param {AppState} state Application state
 */
function runner(queue, state) {
  queue.reduce(queueHandler, Promise.resolve(state));
}

/**
 * Factory for response converter
 *
 * @param {string} type Type of response data
 * @returns {any} Converted response data by provided type
 */
function setResponseConvertion(type) {
  return function convertResponse(response) {
    switch (type) {
      case 'json': {
        return response.json();
      }

      default: {
        return response;
      }
    }
  };
}

/**
 * Converts provided object into a POSIX timestamp
 *
 * @param {object} param
 * @property {string} param.date Format YYYY-MM-DD
 * @property {string} param.time Format HH:MM:SSZ
 * @property {number} param.now POSIX timestamp
 * @returns {number} POSIX timestamp
 */
function convertDateIntoPosix({ date, time, now }) {
  if (now) {
    return now;
  }

  return (new Date(`${date}T${time}`)).getTime();
}

/**
 * Retrieve current date POSIX timestamp
 *
 * @param {AppState} appState
 * @return {number} POSIX timestamp
 */
function getTodayInPosix(appState) {
  if (appState.current.date) {
    return convertDateIntoPosix({
      date: appState.current.date,
      time: appState.current.time || '00:00:00Z',
    });
  }

  return convertDateIntoPosix({
    now: Date.now(),
  });
}

/**
 * Application stages
 */

/**
  * Initialize App state for GP data of F1 2020 season
  *
  * @param {AppState} appState
  * @returns {object} Promise
  */
function setupF12020Season(appState) {
  return Promise.resolve({
    ...appState,
    baseUrl: 'https://ergast.com/api/f1',
    year: '2020',
  });
}

/**
 * Retrieves F1 2020 season data
 *
 * @param {AppState} appState
 * @returns {object} Promise
 */
async function getCalendar(appState) {
  const response = await fetch(`${appState.baseUrl}/${appState.year}.json`);
  let jsonData;

  try {
    jsonData = await setResponseConvertion('json')(response);
  } catch (error) {
    /* eslint-disable */
    console.error(`Cannot get calendar from ${appState.baseUrl}`);
    console.error(error);
    /* eslint-enable */

    process.exit();
  }

  return {
    ...appState,
    calendar: jsonData.MRData.RaceTable.Races,
  };
}

/**
 * Display data of a next GP based on current date
 *
 * @param {AppState} appState
 * @returns {object} Promise
 */
function displayNextGP(appState) {
  return new Promise((resolve) => {
    const gpInfo = appState.calendar
      .find((gp) => (getTodayInPosix(appState) <= convertDateIntoPosix(gp)));

    /* eslint-disable */
    console.log('The next Formula-1 GP:');
    console.log(JSON.stringify(gpInfo, null, 2));
    /* eslint-enable */

    resolve(appState);
  });
}

/**
 * Application body
 */

runner(
  [
    setupF12020Season,
    getCalendar,
    displayNextGP,
  ],
  initState,
);
