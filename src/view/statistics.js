import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./smart.js";
import {StatsType, BASE_COLOR, GENRES} from "../const.js";

const BAR_HEIGHT = 50;
const MINUTES_IN_HOUR = 60;

const getDurationTemplate = (time) => {
  const hours = time / MINUTES_IN_HOUR ^ 0;
  if (hours) {
    let minutes = time % MINUTES_IN_HOUR;

    if (minutes < 10) {
      minutes = `0` + minutes;
    }
    time = hours + `<span class="statistic__item-description">h</span>` + minutes + `<span class="statistic__item-description">m</span>`;
  } else {
    time = time + `<span class="statistic__item-description">m</span>`;
  }
  return time;
};

const renderChart = (ctx, genresCount) => {

  ctx.height = BAR_HEIGHT * GENRES.length;

  const chart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: GENRES,
      datasets: [{
        data: genresCount,
        backgroundColor: BASE_COLOR,
        hoverBackgroundColor: BASE_COLOR,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
  return chart;
};

const createStatisticTemplate = (filmStats, currentStat) => {
  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${filmStats.rank}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentStat === StatsType.ALL ? `checked` : ``}>
    <label for="statistic-all-time" class="statistic__filters-label" id="${StatsType.ALL}">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentStat === StatsType.TODAY ? `checked` : ``}>
    <label for="statistic-today" class="statistic__filters-label" id="${StatsType.TODAY}">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentStat === StatsType.WEEK ? `checked` : ``}>
    <label for="statistic-week" class="statistic__filters-label" id="${StatsType.WEEK}">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentStat === StatsType.MONTH ? `checked` : ``}>
    <label for="statistic-month" class="statistic__filters-label" id="${StatsType.MONTH}">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentStat === StatsType.YEAR ? `checked` : ``}>
    <label for="statistic-year" class="statistic__filters-label" id="${StatsType.YEAR}">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${filmStats.watchedFilms.length} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${getDurationTemplate(filmStats.totalDuration)}</p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${filmStats.topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Statistic extends SmartView {
  constructor(filmStats, currentStat) {
    super();

    this._filmStats = filmStats;
    this._currentStat = currentStat;

    this._changePeriodClickHandler = this._changePeriodClickHandler.bind(this);

    this._setCharts(this._filmStats.genresCount);
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticTemplate(this._filmStats, this._currentStat);
  }

  restoreHandlers() {
    this._setCharts(this._genresCount);
  }

  _setCharts(genresCount) {
    const ctx = this.getElement().querySelector(`.statistic__chart`);
    renderChart(ctx, genresCount);
  }

  _changePeriodClickHandler(evt) {
    this._callback.changePeriodClick(evt.target.id);
  }

  setChangePeriodClickHandler(callback) {
    this._callback.changePeriodClick = callback;
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, this._changePeriodClickHandler);
  }
}
