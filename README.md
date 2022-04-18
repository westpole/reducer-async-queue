# Async request queue via Array.reducer

Application retrieves data for a next Formula-1 GP for 2020 season.

Data provided by [Ergast Developer API](https://ergast.com/mrd/).

## Run application

This is a Node application. You could run it from Bash/Terminal.
Application was created in Javascript and Typescript language which are located in respective the folders.

#### 1. Clone Application

Git repository: https://github.com/westpole/reducer-async-queue

#### 2. Install dependencies

```shell
npm i
```

#### 3. Run Application

```shell
npm start
```

Alternatively you can run TypeScript version:

```shell
npm run start:ts
```

#### 3.1 Output example

```shell
> node app.js

The next Formula-1 GP:
{
  "season": "2020",
  "round": "1",
  "url": "https://en.wikipedia.org/wiki/2020_Australian_Grand_Prix",
  "raceName": "Australian Grand Prix",
  "Circuit": {
    "circuitId": "albert_park",
    "url": "http://en.wikipedia.org/wiki/Melbourne_Grand_Prix_Circuit",
    "circuitName": "Albert Park Grand Prix Circuit",
    "Location": {
      "lat": "-37.8497",
      "long": "144.968",
      "locality": "Melbourne",
      "country": "Australia"
    }
  },
  "date": "2020-03-15",
  "time": "05:10:00Z"
}
```

Get more details JSON example could be found here: [https://ergast.com/api/f1/results.json](https://ergast.com/api/f1/results.json)

## Development

#### Lint code base

```shell
# javascript application
npm run lint:js

# typescript application
npm run lint:ts
```