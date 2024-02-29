"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class LollipopSettings extends FormattingSettingsCard {
    defaultColor = new formattingSettings.ColorPicker({
        name: "defaultColor",
        displayName: "Default color",
        value: { value: "#202020" }
    });

    dataPointColor = new formattingSettings.ColorPicker({
        name: "dataPointColor",
        displayName: "Data Point Color",
        value: { value: "#B6960B" }
    });

    radius = new formattingSettings.NumUpDown({
        name: "radius",
        displayName: "Radius",
        value: 10
    });

    lineWidth = new formattingSettings.NumUpDown({
        name: "lineWidth",
        displayName: "Line Width",
        value: 3
    });


    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Text Size",
        value: 12
    });

    fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font Family",
        value: "Arial, sans-serif"
    });

    name: string = "dataPoint";
    displayName: string = "Data colors";
    slices: Array<FormattingSettingsSlice> = [this.defaultColor,this.dataPointColor,this.radius, this.lineWidth, this.fontSize, this.fontFamily];
}


export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    lollipopSettings = new LollipopSettings();

    cards = [this.lollipopSettings];
}
