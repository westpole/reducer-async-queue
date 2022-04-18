import fetch from 'node-fetch';

import {
  AppState,
  ConverterOptions,
  Queue,
  ErganResponse,
} from './types';

const initState: AppState = {
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
 */
async function queueHandler(
  previousPromise: Promise<AppState>,
  // eslint-disable-next-line no-unused-vars
  taskFn: (newState: AppState) => Promise<AppState>,
): Promise<AppState> {
  const newState = await previousPromise;

  return taskFn(newState);
}

/**
 * Task queue runner
 */
function runner(queue: Queue, state: AppState): void {
  queue.reduce(queueHandler, Promise.resolve(state));
}

/**
 * Factory for response converter
 */
function setResponseConvertion(
  type: string,
  // eslint-disable-next-line no-unused-vars
): (response: ErganResponse) => Promise<ErganResponse> {
  return function convertResponse(
    response: ErganResponse,
  ): Promise<ErganResponse> {
    switch (type) {
      case 'json': {
        return response.json();
      }

      default: {
        return Promise.resolve(response);
      }
    }
  };
}

/**
 * Converts provided object into a POSIX timestamp
 */
function convertDateIntoPosix({ date, time, now }: ConverterOptions): number {
  if (now) {
    return now;
  }

  return (new Date(`${date}T${time}`)).getTime();
}

/**
 * Retrieve current date POSIX timestamp
 */
function getTodayInPosix(appState: AppState): number {
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
function setupF12020Season(appState: AppState): Promise<AppState> {
  const currentYear = new Date().getFullYear();

  return Promise.resolve({
    ...appState,
    baseUrl: 'https://ergast.com/api/f1',
    year: currentYear,
  });
}

/**
 * Retrieves F1 2020 season data
 */
async function getCalendar(appState: AppState): Promise<AppState> {
  const response = await fetch(`${appState.baseUrl}/${appState.year}.json`);
  let jsonData;

  try {
    jsonData = await setResponseConvertion('json')(response as ErganResponse);
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
function displayNextGP(appState: AppState): Promise<AppState> {
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
