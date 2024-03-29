"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
import { transformData, VData } from "./transformData";
import { Selection, select } from "d3-selection";
import { ScaleLinear, scaleLinear, ScalePoint, scalePoint } from "d3-scale";
import {
  valueFormatter,
  textMeasurementService,
} from "powerbi-visuals-utils-formattingutils";
import measureSvgTextWidth = textMeasurementService.measureSvgTextWidth;
import { transition, Transition } from "d3-transition";
import { easeLinear } from "d3-ease";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
  private target: HTMLElement;
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  private data: VData;
  private svg: Selection<SVGAElement, any, HTMLElement, any>;
  private dim: [number, number];
  private scaleX: ScalePoint<string>;
  private scaleY: ScaleLinear<number, number>;

  constructor(options: VisualConstructorOptions) {
    console.log("Visual constructor", options);
    this.formattingSettingsService = new FormattingSettingsService();
    this.target = options.element;

    if (document) {
      this.svg = select(this.target).append("svg");
    }
  }

  public update(options: VisualUpdateOptions) {
    this.formattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        options.dataViews
      );
    this.data = transformData(options);
    console.log("Visual update", options);

    this.dim = [options.viewport.width, options.viewport.height];
    this.svg.attr("width", this.dim[0]);
    this.svg.attr("height", this.dim[1]);

    const targetLabelWidth = this.getTextWidth(
      this.formatMeasure(this.data.target, this.data.formatString)
    );

    this.scaleX = scalePoint()
      .domain(Array.from(this.data.items, (data) => data.category))
      .range([
        0,
        this.dim[0] -
          targetLabelWidth -
          this.formattingSettings.lollipopSettings.fontSize.value / 2,
      ])
      .padding(0.5);

    this.scaleY = scaleLinear()
      .domain([this.data.minValue, this.data.maxValue])
      .range([this.dim[1] - this.formattingSettings.lollipopSettings.radius.value, 0]);

    //transition
    this.transition = transition().duration(500).ease(easeLinear);

    this.drawTarget();
    this.drawTargetLabel();
    this.drawDataPoints();
  }

  private drawTarget() {
    const targetLine = this.svg
      .selectAll("line.target-line")
      .data([this.data.target]);

    targetLine
      .enter()
      .append("line")
      .classed("target-line", true)
      .attr("x1", 0)
      .attr("y1", this.scaleY(this.data.target))
      .attr("x2", this.scaleX.range()[1])
      .attr("y2", this.scaleY(this.data.target));

    targetLine
      .attr("y1", this.scaleY(this.data.target))
      .attr("x2", this.scaleX.range()[1])
      .attr("y2", this.scaleY(this.data.target));

    targetLine.exit().remove();
  }

  private drawTargetLabel() {
    const targetLabel = this.svg
      .selectAll("text.target-label")
      .data([this.data.target]);

    targetLabel
      .enter()
      .append("text")
      .classed("target-label", true)
      .attr(
        "x",
        this.scaleX.range()[1] +
          this.formattingSettings.lollipopSettings.fontSize.value / 2
      )
      .attr("y", this.scaleY(this.data.target))
      .attr(
        "font-size",
        `${this.formattingSettings.lollipopSettings.fontSize.value}pt`
      )
      .attr(
        "font-family",
        this.formattingSettings.lollipopSettings.fontFamily.value
      )
      .text(this.formatMeasure(this.data.target, this.data.formatString));

    targetLabel
      .transition(this.transition)
      .attr(
        "x",
        this.scaleX.range()[1] +
          this.formattingSettings.lollipopSettings.fontSize.value / 2
      )
      .attr("y", this.scaleY(this.data.target))
      .attr(
        "font-size",
        `${this.formattingSettings.lollipopSettings.fontSize.value}pt`
      )
      .attr(
        "font-family",
        this.formattingSettings.lollipopSettings.fontFamily.value
      )
      .text(this.formatMeasure(this.data.target, this.data.formatString));

    targetLabel.exit().remove();
  }

  private drawDataPoints() {
    const dataPoints = this.svg
      .selectAll("circle.data-point")
      .data(this.data.items);

    dataPoints
      .enter()
      .append("circle")
      .classed("data-point", true)
      .attr("ix", (d, i) => i)
      .attr("cx", (d) => this.scaleX(d.category))
      .attr("cy", (d) => this.scaleY(d.value))
      .attr("r", this.formattingSettings.lollipopSettings.radius.value);

    dataPoints
      .transition(this.transition)
      .attr("cx", (d) => this.scaleX(d.category))
      .attr("cy", (d) => this.scaleY(d.value))
      .attr("r", this.settings.lollipopSettings.radius);

    dataPoints.exit().remove();
    return dataPoints;
  }

  private formatMeasure(measure: number, fs: string): string {
    const formatter = valueFormatter.create({ format: fs });
    return formatter.format(measure);
  }

  private getTextWidth(txt: string): number {
    const textProperities = {
      text: txt,
      fontFamily: this.formattingSettings.lollipopSettings.fontFamily.value,
      fontSize: `${this.formattingSettings.lollipopSettings.fontSize.value}pt`,
    };
    return measureSvgTextWidth(textProperities);
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }
}
