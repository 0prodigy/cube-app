import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  PieChart,
  Cell,
  Pie,
  Bar,
} from "recharts";
import moment from "moment";
import numeral from "numeral";
import cubejs from "@cubejs-client/core";
import Chart from "./Chart.js";
import TableRenderer from "./ProductTable.js";

const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: process.env.REACT_APP_API_URL,
});
const numberFormatter = (item) => numeral(item).format("0,0");
const dateFormatter = (item) => moment(item).format("MMM YY");

const renderSingleValue = (resultSet, key) => (
  <h1 height={300}>{numberFormatter(resultSet.chartPivot()[0][key])}</h1>
);

export const COLORS_SERIES = [
  "#5b8ff9",
  "#5ad8a6",
  "#5e7092",
  "#f6bd18",
  "#6f5efa",
  "#6ec8ec",
  "#945fb9",
  "#ff9845",
  "#299796",
  "#fe99c3",
];
export const PALE_COLORS_SERIES = [
  "#d7e3fd",
  "#daf5e9",
  "#d6dbe4",
  "#fdeecd",
  "#dad8fe",
  "#dbf1fa",
  "#e4d7ed",
  "#ffe5d2",
  "#cce5e4",
  "#ffe6f0",
];
export const commonOptions = {
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
  },
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxRotation: 0,
        padding: 12,
        minRotation: 0,
      },
    },
  },
};

class App extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Total Users"
              query={{ measures: ["Users.count"] }}
              render={(resultSet) =>
                renderSingleValue(resultSet, "Users.count")
              }
            />
          </Col>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Total Orders"
              query={{ measures: ["Orders.count"] }}
              render={(resultSet) =>
                renderSingleValue(resultSet, "Orders.count")
              }
            />
          </Col>
          <Col sm="4">
            <Chart
              cubejsApi={cubejsApi}
              title="Shipped Orders"
              query={{
                measures: ["Orders.count"],
                filters: [
                  {
                    dimension: "Orders.status",
                    operator: "equals",
                    values: ["shipped"],
                  },
                ],
              }}
              render={(resultSet) =>
                renderSingleValue(resultSet, "Orders.count")
              }
            />
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col sm="6">
            <Chart
              cubejsApi={cubejsApi}
              title="Total Revenue"
              query={{ measures: ["Orders.totalAmount"] }}
              render={(resultSet) =>
                renderSingleValue(resultSet, "Orders.totalAmount")
              }
            />
            <br />
            <Chart
              cubejsApi={cubejsApi}
              title="Products"
              query={{
                measures: ["Products.count"],
                order: {
                  "Products.count": "desc",
                },
                dimensions: ["ProductCategories.name"],
                timeDimensions: [],
                limit: 5000,
              }}
              render={(resultSet) => {
                return (
                  <TableRenderer
                    resultSet={resultSet}
                    pivotConfig={{
                      x: ["ProductCategories.name"],
                      y: ["measures"],
                      fillMissingDates: true,
                      joinDateRange: false,
                    }}
                  />
                );
              }}
            />
          </Col>
          <Col sm="6">
            <Chart
              cubejsApi={cubejsApi}
              title="Average Order Total"
              query={{
                measures: ["LineItems.totalAmount"],
                timeDimensions: [
                  {
                    dimension: "LineItems.createdAt",
                    dateRange: ["2017-01-01", "2023-12-31"],
                  },
                ],
                order: {
                  "LineItems.totalAmount": "desc",
                },
                dimensions: ["ProductCategories.name"],
              }}
              render={(resultSet) => {
                return (
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        isAnimationActive={false}
                        data={resultSet.chartPivot()}
                        nameKey="x"
                        dataKey={resultSet.seriesNames()[0].key}
                        fill="#8884d8"
                      >
                        {resultSet.chartPivot().map((e, index) => (
                          <Cell
                            key={index}
                            fill={COLORS_SERIES[index % COLORS_SERIES.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                );
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <Chart
              cubejsApi={cubejsApi}
              title="New Users Over Time"
              query={{
                measures: ["Users.count"],
                timeDimensions: [
                  {
                    dimension: "Users.createdAt",
                    dateRange: ["2017-01-01", "2018-12-31"],
                    granularity: "month",
                  },
                ],
              }}
              render={(resultSet) => (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={resultSet.chartPivot()}>
                    <XAxis dataKey="category" tickFormatter={dateFormatter} />
                    <YAxis tickFormatter={numberFormatter} />
                    <Tooltip labelFormatter={dateFormatter} />
                    <Area
                      type="monotone"
                      dataKey="Users.count"
                      name="Users"
                      stroke="rgb(106, 110, 229)"
                      fill="rgba(106, 110, 229, .16)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            />
          </Col>
          <Col sm="6">
            <Chart
              cubejsApi={cubejsApi}
              title="Orders by Status Over time"
              query={{
                measures: ["Orders.count"],
                dimensions: ["Orders.status"],
                timeDimensions: [
                  {
                    dimension: "Orders.createdAt",
                    dateRange: ["2017-01-01", "2023-12-31"],
                    granularity: "month",
                  },
                ],
              }}
              render={(resultSet) => {
                return (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={resultSet.chartPivot()}>
                      <XAxis tickFormatter={dateFormatter} dataKey="x" />
                      <YAxis tickFormatter={numberFormatter} />
                      <Bar
                        stackId="a"
                        dataKey="shipped, Orders.count"
                        name="Shipped"
                        fill="#7DB3FF"
                      />
                      <Bar
                        stackId="a"
                        dataKey="processing, Orders.count"
                        name="Processing"
                        fill="#49457B"
                      />
                      <Bar
                        stackId="a"
                        dataKey="completed, Orders.count"
                        name="Completed"
                        fill="#FF7C78"
                      />
                      <Legend />
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                );
              }}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
