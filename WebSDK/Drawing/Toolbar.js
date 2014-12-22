"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     27.11.14
 * Time     1:27
 */

function CDrawingToolbar(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;

    this.HtmlElement =
    {
        Control : null
    };

    this.m_oBColor = new CColor(217, 217, 217, 255);

    this.m_aControls = [];
}

CDrawingToolbar.prototype.Init = function(sDivId, oGameTree, oSettings)
{
    this.m_oGameTree = oGameTree;

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var  oMainElement = this.HtmlElement.Control.HtmlElement;
    var  oMainControl = this.HtmlElement.Control;

    oMainElement.style.backgroundColor = this.m_oBColor.ToString();

    for (var Index = 0, Count = oSettings.Controls.length; Index < Count; Index++)
    {
        var ControlType = oSettings.Controls[Index];
        var oControl     = null;

        switch (ControlType)
        {
            case EDrawingButtonType.BackwardToStart:
            case EDrawingButtonType.Backward_5:
            case EDrawingButtonType.Backward:
            case EDrawingButtonType.Forward:
            case EDrawingButtonType.Forward_5:
            case EDrawingButtonType.ForwardToEnd:
            case EDrawingButtonType.NextVariant:
            case EDrawingButtonType.PrevVariant:
            case EDrawingButtonType.EditModeMove   :
            case EDrawingButtonType.EditModeScores :
            case EDrawingButtonType.EditModeAddRem :
            case EDrawingButtonType.EditModeTr     :
            case EDrawingButtonType.EditModeSq     :
            case EDrawingButtonType.EditModeCr     :
            case EDrawingButtonType.EditModeX      :
            case EDrawingButtonType.EditModeText   :
            case EDrawingButtonType.EditModeNum    :
            case EDrawingButtonType.AutoPlay       :
            case EDrawingButtonType.GameInfo       :
            case EDrawingButtonType.Settings       :
                oControl = new CDrawingButton(this.m_oDrawing);
                break;
        }

        if (null !== oControl)
        {
            var sElementName = sDivId + Index;
            this.private_CreateDivElement(oMainElement, sElementName);
            this.private_FillHtmlElement(oMainControl, sElementName, Index / Count, (Index + 1) / Count);

            oControl.Init(sElementName, oGameTree, ControlType);

            this.m_aControls.push(oControl);
        }
    }

    this.Update_Size();
};
CDrawingToolbar.prototype.Update_Size = function()
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    this.HtmlElement.Control.Resize(W, H);
    for (var Index = 0, Count = this.m_aControls.length; Index < Count; Index++)
    {
        this.m_aControls[Index].Update_Size();
    }
};
CDrawingToolbar.prototype.private_CreateDivElement = function(oParentElement, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingToolbar.prototype.private_FillHtmlElement = function(oParentControl, sName, nStart, nEnd)
{
    var oControl = CreateControlContainer(sName);
    oControl.Bounds.SetParams(nStart * 1000, 0, nEnd * 1000, 1000, false, false, false, false, -1,-1);
    oControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    oParentControl.AddControl(oControl);
};