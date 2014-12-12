"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     13.12.14
 * Time     1:13
 */

function CDrawingWindow()
{
    this.HtmlElement =
    {
        Control     : null,
        InnerDiv    : null,
        CloseButton : null,
        Caption     : null,
        CaptionText : null,

        HandlerL    : null,
        HandlerR    : null,
        HandlerB    : null,
        HandlerT    : null,
        HandlerLT   : null,
        HandlerRT   : null,
        HandlerLB   : null,
        HandlerRB   : null
    };

    this.m_oOuterBorderColor = new CColor(166, 166, 166, 255);
    this.m_oInnerBorderColor = new CColor(185, 185, 185, 255);
    this.m_oBackColor        = new CColor(217, 217, 217, 255);

    var oThis = this;

    this.private_OnDragLeftHandler = function()
    {
        var CurLeft     = parseInt(oThis.HtmlElement.Control.HtmlElement.style.left);
        var CurWidth    = parseInt(oThis.HtmlElement.Control.HtmlElement.style.width);
        var LeftHandler = parseInt(oThis.HtmlElement.HandlerL.style.left);

        if (CurWidth - LeftHandler < 60)
        {
            oThis.HtmlElement.HandlerL.style.left = "0px";
        }
        else
        {
            oThis.HtmlElement.Control.HtmlElement.style.left = CurLeft + LeftHandler + "px";
            oThis.HtmlElement.Control.HtmlElement.style.width = CurWidth - LeftHandler + "px";
            oThis.HtmlElement.HandlerL.style.left = "0px";
        }
        oThis.Update_Size();
    };
    this.private_OnDragRightHandler = function()
    {
        var CurWidth    = parseInt(oThis.HtmlElement.Control.HtmlElement.style.width);
        var LeftHandler = parseInt(oThis.HtmlElement.HandlerR.style.left);

        var Diff = (LeftHandler + 6 - CurWidth);

        if (CurWidth + Diff < 60)
        {
            oThis.HtmlElement.HandlerR.style.left = CurWidth - 6 + "px";
            return;
        }

        oThis.HtmlElement.Control.HtmlElement.style.width = CurWidth + Diff + "px";
        oThis.HtmlElement.HandlerR.style.left = CurWidth + Diff - 6 + "px";
        oThis.Update_Size();
    };
    this.private_OnDragBottomHandler = function()
    {
        var CurHeight    = parseInt(oThis.HtmlElement.Control.HtmlElement.style.height);
        var TopHandler = parseInt(oThis.HtmlElement.HandlerB.style.top);

        var Diff = (TopHandler + 6 - CurHeight);

        if (CurHeight + Diff < 60)
        {
            oThis.HtmlElement.HandlerB.style.top = CurHeight - 6 + "px";
            return;
        }

        oThis.HtmlElement.Control.HtmlElement.style.height = CurHeight + Diff + "px";
        oThis.HtmlElement.HandlerB.style.top = CurHeight + Diff - 6 + "px";
        oThis.Update_Size();
    };
    this.private_OnDragTopHandler = function()
    {
        var CurTop     = parseInt(oThis.HtmlElement.Control.HtmlElement.style.top);
        var CurHeight  = parseInt(oThis.HtmlElement.Control.HtmlElement.style.height);
        var TopHandler = parseInt(oThis.HtmlElement.HandlerT.style.top);

        if (CurHeight - TopHandler < 60)
        {
            oThis.HtmlElement.HandlerT.style.top = "0px";
            return;
        }

        oThis.HtmlElement.Control.HtmlElement.style.top    = CurTop  + TopHandler + "px";
        oThis.HtmlElement.Control.HtmlElement.style.height = CurHeight - TopHandler + "px";
        oThis.HtmlElement.HandlerT.style.top = "0px";
        oThis.Update_Size();
    };
    this.private_OnDragLeftTopHandler = function()
    {
        var CurTop     = parseInt(oThis.HtmlElement.Control.HtmlElement.style.top);
        var CurHeight  = parseInt(oThis.HtmlElement.Control.HtmlElement.style.height);
        var TopHandler = parseInt(oThis.HtmlElement.HandlerLT.style.top);

        if (CurHeight - TopHandler < 60)
        {
            oThis.HtmlElement.HandlerLT.style.top = "0px";
        }
        else
        {
            oThis.HtmlElement.Control.HtmlElement.style.top = CurTop + TopHandler + "px";
            oThis.HtmlElement.Control.HtmlElement.style.height = CurHeight - TopHandler + "px";
            oThis.HtmlElement.HandlerLT.style.top = "0px";
        }

        var CurLeft     = parseInt(oThis.HtmlElement.Control.HtmlElement.style.left);
        var CurWidth    = parseInt(oThis.HtmlElement.Control.HtmlElement.style.width);
        var LeftHandler = parseInt(oThis.HtmlElement.HandlerLT.style.left);

        if (CurWidth - LeftHandler < 60)
        {
            oThis.HtmlElement.HandlerLT.style.left = "0px";
        }
        else
        {
            oThis.HtmlElement.Control.HtmlElement.style.left = CurLeft + LeftHandler + "px";
            oThis.HtmlElement.Control.HtmlElement.style.width = CurWidth - LeftHandler + "px";
            oThis.HtmlElement.HandlerLT.style.left = "0px";
        }

        oThis.Update_Size();
    };
    this.private_OnDragRightTopHandler  = function()
    {
        var CurTop     = parseInt(oThis.HtmlElement.Control.HtmlElement.style.top);
        var CurHeight  = parseInt(oThis.HtmlElement.Control.HtmlElement.style.height);
        var TopHandler = parseInt(oThis.HtmlElement.HandlerRT.style.top);

        if (CurHeight - TopHandler < 60)
        {
            oThis.HtmlElement.HandlerRT.style.top = "0px";
        }
        else
        {
            oThis.HtmlElement.Control.HtmlElement.style.top = CurTop + TopHandler + "px";
            oThis.HtmlElement.Control.HtmlElement.style.height = CurHeight - TopHandler + "px";
            oThis.HtmlElement.HandlerRT.style.top = "0px";
        }

        var CurWidth    = parseInt(oThis.HtmlElement.Control.HtmlElement.style.width);
        var LeftHandler = parseInt(oThis.HtmlElement.HandlerRT.style.left);

        var Diff = (LeftHandler + 6 - CurWidth);

        if (CurWidth + Diff < 60)
        {
            oThis.HtmlElement.HandlerRT.style.left = CurWidth - 6 + "px";
        }
        else
        {
            oThis.HtmlElement.Control.HtmlElement.style.width = CurWidth + Diff + "px";
            oThis.HtmlElement.HandlerRT.style.left = CurWidth + Diff - 6 + "px";
        }

        oThis.Update_Size();
    };
    this.private_OnDragLeftBottomHandler = function()
    {
        var CurLeft     = parseInt(oThis.HtmlElement.Control.HtmlElement.style.left);
        var CurWidth    = parseInt(oThis.HtmlElement.Control.HtmlElement.style.width);
        var LeftHandler = parseInt(oThis.HtmlElement.HandlerLB.style.left);

        if (CurWidth - LeftHandler < 60)
        {
            oThis.HtmlElement.HandlerLB.style.left = "0px";
        }
        else
        {
            oThis.HtmlElement.Control.HtmlElement.style.left = CurLeft + LeftHandler + "px";
            oThis.HtmlElement.Control.HtmlElement.style.width = CurWidth - LeftHandler + "px";
            oThis.HtmlElement.HandlerLB.style.left = "0px";
        }

        var CurHeight    = parseInt(oThis.HtmlElement.Control.HtmlElement.style.height);
        var TopHandler = parseInt(oThis.HtmlElement.HandlerLB.style.top);

        var Diff = (TopHandler + 6 - CurHeight);

        if (CurHeight + Diff < 60)
        {
            oThis.HtmlElement.HandlerLB.style.top = CurHeight - 6 + "px";
        }
        else
        {
            oThis.HtmlElement.Control.HtmlElement.style.height = CurHeight + Diff + "px";
            oThis.HtmlElement.HandlerLB.style.top = CurHeight + Diff - 6 + "px";
        }

        oThis.Update_Size();
    };
    this.private_OnDragRightBottomHandler = function()
    {
        var CurWidth    = parseInt(oThis.HtmlElement.Control.HtmlElement.style.width);
        var LeftHandler = parseInt(oThis.HtmlElement.HandlerRB.style.left);

        var Diff = (LeftHandler + 6 - CurWidth);

        if (CurWidth + Diff < 60)
        {
            oThis.HtmlElement.HandlerRB.style.left = CurWidth - 6 + "px";
        }
        else
        {
            oThis.HtmlElement.Control.HtmlElement.style.width = CurWidth + Diff + "px";
            oThis.HtmlElement.HandlerRB.style.left = CurWidth + Diff - 6 + "px";
        }

        var CurHeight    = parseInt(oThis.HtmlElement.Control.HtmlElement.style.height);
        var TopHandler = parseInt(oThis.HtmlElement.HandlerRB.style.top);

        var Diff = (TopHandler + 6 - CurHeight);

        if (CurHeight + Diff < 60)
        {
            oThis.HtmlElement.HandlerRB.style.top = CurHeight - 6 + "px";
        }
        else
        {
            oThis.HtmlElement.Control.HtmlElement.style.height = CurHeight + Diff + "px";
            oThis.HtmlElement.HandlerRB.style.top = CurHeight + Diff - 6 + "px";
        }

        oThis.Update_Size();
    };
}

CDrawingWindow.prototype.Init = function(sDivId)
{
    var oThis = this;

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var oMainDiv = this.HtmlElement.Control.HtmlElement;
    var oMainControl = this.HtmlElement.Control;

    oMainDiv.style.border = "1px solid " + this.m_oOuterBorderColor.ToString();
    oMainDiv.style.backgroundColor = this.m_oBackColor.ToString();

    // InnerDiv
    var sInnerDivId   = sDivId  + "_Inner";
    var oInnerElement = this.protected_CreateDivElement(oMainDiv, sInnerDivId);
    var oInnerControl = CreateControlContainer(sInnerDivId);
    oInnerControl.Bounds.SetParams(6, 29, 8, 8, true, true, true, true, -1,-1);
    oInnerControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    oMainControl.AddControl(oInnerControl);
    oInnerElement.style.border = "1px solid " + this.m_oInnerBorderColor.ToString();
    oInnerElement.style.backgroundColor = (new CColor(255,255,255,255)).ToString();

    // Caption
    var sCaptionId      = sDivId + "_Caption";
    var oCaptionElement = this.protected_CreateDivElement(oMainDiv, sCaptionId);
    var oCaptionControl = CreateControlContainer(sCaptionId);
    oCaptionControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, 30);
    oCaptionControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oCaptionControl);

    // CaptionText
    var sCaptionTextId = sCaptionId + "_Text";
    var oCaptionTextElement = this.protected_CreateDivElement(oMainDiv, sCaptionTextId);
    var oCaptionTextControl = CreateControlContainer(sCaptionTextId);
    oCaptionTextControl.Bounds.SetParams(15, 0, 55, 1000, true, false, true, false, -1, 30);
    oCaptionTextControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oCaptionControl.AddControl(oCaptionTextControl);
    oCaptionTextElement.innerText = "Captiofrt uwieutowei urt";
    oCaptionTextElement.style.fontFamily          = "Tahoma, Sans serif";
    oCaptionTextElement.style.fontSize            = "13pt";
    oCaptionTextElement.style.textAlign           = "center";
    oCaptionTextElement.style.height              = "29px";
    oCaptionTextElement.style.lineHeight          = "29px";
    oCaptionTextElement.style.overflow            = "hidden";
    oCaptionTextElement.style.textOverflow        = "ellipsis";
    oCaptionTextElement.style['-o-text-overflow'] = "ellipsis";
    oCaptionTextElement.style.cursor              = "default";

    // Caption
    var sCaptionId2      = sDivId + "_Caption2";
    var oCaptionElement2 = this.protected_CreateDivElement(oMainDiv, sCaptionId2);
    var oCaptionControl2 = CreateControlContainer(sCaptionId2);
    oCaptionControl2.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, 30);
    oCaptionControl2.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oCaptionControl2);
    this.HtmlElement.Caption = oCaptionElement2;

    Common_DragHandler.Init(oCaptionElement2, null);
    oCaptionElement2['onDrag'] = function(X, Y)
    {
        var CurLeft     = parseInt(oThis.HtmlElement.Control.HtmlElement.style.left);
        var CurTop      = parseInt(oThis.HtmlElement.Control.HtmlElement.style.top);

        var LeftHandler = parseInt(oThis.HtmlElement.Caption.style.left);
        var TopHandler  = parseInt(oThis.HtmlElement.Caption.style.top);

        oThis.HtmlElement.Control.HtmlElement.style.left = CurLeft + LeftHandler + "px";
        oThis.HtmlElement.Control.HtmlElement.style.top  = CurTop  + TopHandler + "px";

        oThis.HtmlElement.Caption.style.left = "0px";
        oThis.HtmlElement.Caption.style.top  = "0px";
        oThis.Update_Size();
    };

    // Left Handler
    var sLeftHandlerId      = sDivId + "_LeftHandler";
    var oLeftHandlerElement = this.protected_CreateDivElement(oMainDiv, sLeftHandlerId);
    var oLeftHandlerControl = CreateControlContainer(sLeftHandlerId);
    oLeftHandlerControl.Bounds.SetParams(0, 6, 1000, 6, false, true, false, true, 6, -1);
    oLeftHandlerControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom);
    oMainControl.AddControl(oLeftHandlerControl);
    oLeftHandlerElement.style.cursor = "w-resize";
    this.HtmlElement.HandlerL = oLeftHandlerElement;

    // Right Handler
    var sRightHandlerId      = sDivId + "_RightHandler";
    var oRightHandlerElement = this.protected_CreateDivElement(oMainDiv, sRightHandlerId);
    var oRightHandlerControl = CreateControlContainer(sRightHandlerId);
    oRightHandlerControl.Bounds.SetParams(0, 6, 0, 6, false, true, true, true, 6, -1);
    oRightHandlerControl.Anchor = (g_anchor_top | g_anchor_right | g_anchor_bottom);
    oMainControl.AddControl(oRightHandlerControl);
    oRightHandlerElement.style.cursor = "w-resize";
    this.HtmlElement.HandlerR = oRightHandlerElement;

    // Bottom Handler
    var sBottomHandlerId      = sDivId + "_BottomHandler";
    var oBottomHandlerElement = this.protected_CreateDivElement(oMainDiv, sBottomHandlerId);
    var oBottomHandlerControl = CreateControlContainer(sBottomHandlerId);
    oBottomHandlerControl.Bounds.SetParams(6, 0, 6, 0, true, false, true, true, -1, 6);
    oBottomHandlerControl.Anchor = (g_anchor_bottom | g_anchor_right | g_anchor_left);
    oMainControl.AddControl(oBottomHandlerControl);
    oBottomHandlerElement.style.cursor = "s-resize";
    this.HtmlElement.HandlerB = oBottomHandlerElement;

    // Top Handler
    var sTopHandlerId      = sDivId + "_TopHandler";
    var oTopHandlerElement = this.protected_CreateDivElement(oMainDiv, sTopHandlerId);
    var oTopHandlerControl = CreateControlContainer(sTopHandlerId);
    oTopHandlerControl.Bounds.SetParams(6, 0, 6, 1000, true, true, true, false, -1, 6);
    oTopHandlerControl.Anchor = (g_anchor_top | g_anchor_right | g_anchor_left);
    oMainControl.AddControl(oTopHandlerControl);
    oTopHandlerElement.style.cursor = "s-resize";
    this.HtmlElement.HandlerT = oTopHandlerElement;

    // Left-Top Handler
    var sLeftTopHandlerId      = sDivId + "_LeftTopHandler";
    var oLeftTopHandlerElement = this.protected_CreateDivElement(oMainDiv, sLeftTopHandlerId);
    var oLeftTopHandlerControl = CreateControlContainer(sLeftTopHandlerId);
    oLeftTopHandlerControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, 6, 6);
    oLeftTopHandlerControl.Anchor = (g_anchor_top | g_anchor_left);
    oMainControl.AddControl(oLeftTopHandlerControl);
    oLeftTopHandlerElement.style.cursor = "se-resize";
    this.HtmlElement.HandlerLT = oLeftTopHandlerElement;

    // Right-Top Handler
    var sRightTopHandlerId      = sDivId + "_RightTopHandler";
    var oRightTopHandlerElement = this.protected_CreateDivElement(oMainDiv, sRightTopHandlerId);
    var oRightTopHandlerControl = CreateControlContainer(sRightTopHandlerId);
    oRightTopHandlerControl.Bounds.SetParams(0, 0, 0, 1000, false, false, true, false, 6, 6);
    oRightTopHandlerControl.Anchor = (g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oRightTopHandlerControl);
    oRightTopHandlerElement.style.cursor = "ne-resize";
    this.HtmlElement.HandlerRT = oRightTopHandlerElement;

    // Left-Bottom Handler
    var sLeftBottomHandlerId      = sDivId + "_LeftBottomHandler";
    var oLeftBottomHandlerElement = this.protected_CreateDivElement(oMainDiv, sLeftBottomHandlerId);
    var oLeftBottomHandlerControl = CreateControlContainer(sLeftBottomHandlerId);
    oLeftBottomHandlerControl.Bounds.SetParams(0, 0, 0, 1000, false, false, false, false, 6, 6);
    oLeftBottomHandlerControl.Anchor = (g_anchor_bottom | g_anchor_left);
    oMainControl.AddControl(oLeftBottomHandlerControl);
    oLeftBottomHandlerElement.style.cursor = "ne-resize";
    this.HtmlElement.HandlerLB = oLeftBottomHandlerElement;

    // Right-Bottom Handler
    var sRightBottomHandlerId      = sDivId + "_RightBottomHandler";
    var oRightBottomHandlerElement = this.protected_CreateDivElement(oMainDiv, sRightBottomHandlerId);
    var oRightBottomHandlerControl = CreateControlContainer(sRightBottomHandlerId);
    oRightBottomHandlerControl.Bounds.SetParams(0, 0, 0, 1000, false, false, true, false, 6, 6);
    oRightBottomHandlerControl.Anchor = (g_anchor_bottom | g_anchor_right);
    oMainControl.AddControl(oRightBottomHandlerControl);
    oRightBottomHandlerElement.style.cursor = "se-resize";
    this.HtmlElement.HandlerRB = oRightBottomHandlerElement;

    // CloseButton
    var sCloseButtonId      = sDivId + "_Close";
    var oCloseButtonElement = this.protected_CreateDivElement(oMainDiv, sCloseButtonId);
    var oCloseButtonControl = CreateControlContainer(sCloseButtonId);
    oCloseButtonControl.Bounds.SetParams(0, 0, 6, 1000, false, true, true, false, 45, 20);
    oCloseButtonControl.Anchor = (g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oCloseButtonControl);
    oCloseButtonElement.style.backgroundColor = (new CColor(255, 0, 0, 255)).ToString();

    var oCloseButton = new CDrawingButton(this.m_oDrawing);
    oCloseButton.Init(sCloseButtonId, this, EDrawingButtonType.WindowClose);
    oCloseButton.m_oNormaFColor  = new CColor(199,  80,  80, 255);
    oCloseButton.m_oHoverFColor  = new CColor(224,  67,  67, 255);
    oCloseButton.m_oActiveFColor = new CColor(153,  61,  61, 255);

    this.HtmlElement.CloseButton = oCloseButton;

    this.Update_Size();
};
CDrawingWindow.prototype.Update_Size = function()
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;
    this.HtmlElement.Control.Resize(W, H);

    this.HtmlElement.CloseButton.Update_Size();

    Common_DragHandler.Init(this.HtmlElement.HandlerL,  null, null, (W < 59 ? 0 : null), null, null);
    this.HtmlElement.HandlerL['onDrag'] = this.private_OnDragLeftHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerR,  null, null, null, null, null);
    this.HtmlElement.HandlerR['onDrag'] = this.private_OnDragRightHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerT,  null, null, null, null, null);
    this.HtmlElement.HandlerT['onDrag'] = this.private_OnDragTopHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerB,  null, null, null, null, null);
    this.HtmlElement.HandlerB['onDrag'] = this.private_OnDragBottomHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerLT, null, null, null, null, null);
    this.HtmlElement.HandlerLT['onDrag'] = this.private_OnDragLeftTopHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerRT, null, null, null, null, null);
    this.HtmlElement.HandlerRT['onDrag'] = this.private_OnDragRightTopHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerLB, null, null, null, null, null);
    this.HtmlElement.HandlerLB['onDrag'] = this.private_OnDragLeftBottomHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerRB, null, null, null, null, null);
    this.HtmlElement.HandlerRB['onDrag'] = this.private_OnDragRightBottomHandler;
};
CDrawingWindow.prototype.Close = function()
{
    var oMainDiv = this.HtmlElement.Control.HtmlElement;
    oMainDiv.parentNode.removeChild(oMainDiv);
};
CDrawingWindow.prototype.Focus = function()
{

};
CDrawingWindow.prototype.protected_CreateDivElement = function(oParentElement, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParentElement.appendChild(oElement);
    return oElement;
};