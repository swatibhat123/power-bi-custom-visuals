'use strict'

import {VisualFormattingSettingsModel} from './settings'
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";


export function setStyle(formattingSettings: VisualFormattingSettingsModel): void {
    const style = document.documentElement.style
    style.setProperty('--default-color', formattingSettings.slicerSettings.defaultColor.value.value )
    style.setProperty('--selected-color', formattingSettings.slicerSettings.selectedColor.value.value)
    style.setProperty('--text-align', formattingSettings.slicerSettings.textAlign.value)
    style.setProperty('--padding-bottom', `${formattingSettings.slicerSettings.paddingBottom.value}px`)
    style.setProperty('--margin-bottom', `${formattingSettings.slicerSettings.marginBottom.value}px`)
    style.setProperty('--font-family', formattingSettings.slicerSettings.fontFamily.value)
    style.setProperty('--font-size', `${formattingSettings.slicerSettings.fontSize.value}pt`)
    style.setProperty('--underline-width', `${formattingSettings.slicerSettings.underlineWidth.value}px`)
}