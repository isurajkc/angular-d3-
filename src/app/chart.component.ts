import {Component, ViewEncapsulation} from '@angular/core';
import {Http, Response} from '@angular/http';
import  {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import * as d3TimeFormat from "d3-time-format";
import * as d3Format from "d3-format";

import {Stocks} from './data';

@Component({
  selector: 'app-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  title = 'app works!';

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;
  private dot: any;


  constructor() {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawLine();
    this.drawDot();
    this.addToolTip();
  }

  private initSvg() {
    this.svg = d3.select("svg")
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private initAxis() {
    Stocks.map((d) => d.xValue = new Date('"' + d.xValue + '"'));
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(Stocks, (d) => d.xValue));
    this.y.domain(d3Array.extent(Stocks, (d) => d.chart2));
  }

  private drawAxis() {

    this.svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x).ticks(Stocks.length).tickFormat(d3TimeFormat.timeFormat("%Y")));

    this.svg.append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y).tickSizeInner(-this.width))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  }

  private drawLine() {
    this.line = d3Shape.line()
      .x((d: any) => this.x(d.xValue))
      .y((d: any) => this.y(d.chart2));

    this.svg.append("path")
      .datum(Stocks)
      .attr("class", "line")
      .attr("d", this.line)
      .attr("stroke", "#1d1a1a")
      .style("stroke-width", 2);
  }

  private drawDot() {

    // Add the scatterplot
    this.dot = this.svg.append("g").selectAll(".dot")
      .data(Stocks)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", (d: any) => this.x(d.xValue))
      .attr("cy", (d: any) => this.y(d.chart2))
      .attr("stroke", "red")
      .attr("fill", "red");

  }

  private addToolTip() {

    // Define the div for the tooltip
    let div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    this.dot.on("mouseover", (d) => {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(d.chart2)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
      .on("mouseout", (d) => {
        div.transition()
          .duration(100)
          .style("opacity", 0);
      });

    this.dot.append("text")
      .attr("x", (d: any) => this.x(d.xValue))
      .attr("y", (d: any) => this.y(d.chart2))
      .attr("font-siz", 10)
      .attr("text-anchor", "start")
      .attr("transform", null)
      .text(function (d) {
        return d.chart2;
      });
  }

}
