
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
import {VData, transformData} from './transformData';
import {setStyle} from './setStyles'

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import { IBasicFilter, FilterType } from "powerbi-models";

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private container: HTMLElement;
    private slicerItems: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private data: VData;
    private host: IVisualHost;
    private basicFilter: IBasicFilter;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.host = options.host;
        this.basicFilter = null;

        if (document) {
            this.container = document.createElement("div");
            this.container.classList.add('slicer-container');
            this.slicerItems = document.createElement("ul");
            this.container.appendChild(this.slicerItems);
            this.target.appendChild(this.container);
        }
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);
        this.data = transformData(options);
        console.log('Visual update', options);
        setStyle(this.formattingSettings);

        this.basicFilter = {
            $schema: "https://powerbi.com/product/schema#basic",
            target: {
                table: this.data.table,
                column: this.data.column
            },
            operator: "In",
            values: null,
            filterType: FilterType.Basic
        }

        while(this.slicerItems.firstChild) {
            this.slicerItems.remove();
        }

        this.addItem("All regions");

        for(let value of this.data.values) {
            this.addItem(<string>value);
        }

        this.styleSelected(options);
    }

    private addItem(txt: string): void {
        let slicerItem = document.createElement('li')
        let itemContainer = document.createElement('span')
        itemContainer.innerText = txt;
        if(txt !== this.formattingSettings.slicerSettings.allSelectedLabel.value) {
            itemContainer.onclick = () => {
                this.basicFilter.values = [txt];
                this.host.applyJsonFilter(this.basicFilter, 'general', 'filter', powerbi.FilterAction.merge);
            } 
        }else {
            this.basicFilter.values = [txt];
            this.host.applyJsonFilter(this.basicFilter, 'general', 'filter', powerbi.FilterAction.remove);
        }
        itemContainer.innerText = txt;
        slicerItem.appendChild(itemContainer);
        this.slicerItems.appendChild(slicerItem);
    }

    private styleSelected(opt: VisualUpdateOptions) {
        const slicerItems = this.slicerItems.children
        const f = opt.jsonFilters
        if (f.length === 0) {
            slicerItems[0].children[0].classList.add('selected')
        } else {
            const selected = (<IBasicFilter>f[0]).values[0]
            for (let i = 0; i < slicerItems.length; i++) {
                const item = <HTMLElement>slicerItems[i].children[0]
                if (item.innerText === selected) {
                    slicerItems[i].children[0].classList.add('selected')
                }
            }
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}