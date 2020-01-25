# Async request queue via Array.reducer

Application retrieves data for a next Formula-1 GP for 2020 season.
Data provided by [Ergast Developer API](https://ergast.com/mrd/).

## Run application

This is a Node application. You could run it from Bash/Terminal.

#### Clone Application

Git repository:

#### Install dependencies

```shell
npm i
```

#### Run Application

```shell
npm start
```

#### Output example

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