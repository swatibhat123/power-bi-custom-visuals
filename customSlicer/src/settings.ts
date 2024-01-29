
"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Data Point Formatting Card
 */
class SlicerSettings extends FormattingSettingsCard {
    allSelectedLabel = new formattingSettings.TextInput({
        name: 'allSelectedLabel',
        placeholder: "Label",
        value: 'All'
    });
    
    defaultColor = new formattingSettings.ColorPicker({
        name: "defaultColor",
        displayName: "Default color",
        value: { value: "#181818" }
    });

    selectedColor = new formattingSettings.ColorPicker({
        name: "selectedColor",
        displayName: "Selected color",
        value: { value: "#000000" }
    });

    fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font Family",
        value: "Arial, sans-serif"
    })

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Text Size",
        value: 16
    });

    textAlign = new formattingSettings.AlignmentGroup({
        name:'textAlign',
        displayName: 'Text alignment',
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
        value: "center"
    });

    paddingBottom = new formattingSettings.NumUpDown({
        name: "paddingBottom",
        displayName: "Padding (bottom)",
        value: 2
    });

    marginBottom = new formattingSettings.NumUpDown({
        name: "marginBottom",
        displayName: "Margin (bottom)",
        value: 2
    });

    underlineWidth = new formattingSettings.NumUpDown({
        name: "underlineWidth",
        displayName: "Undeline width",
        value: 2
    });

    name: string = "slicerSettings";
    displayName: string = "Slicer Settings";
    slices: Array<FormattingSettingsSlice> = [this.allSelectedLabel,this.defaultColor, this.selectedColor,this.fontFamily, 
        this.fontSize, this.textAlign, this.paddingBottom, this.marginBottom, this.underlineWidth];
}

/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    slicerSettings = new SlicerSettings();

    cards = [this.slicerSettings];
}
