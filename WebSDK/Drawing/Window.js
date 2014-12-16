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
        Control      : null,
        InnerDiv     : null,
        InnerControl : null,
        CloseButton  : null,
        Caption      : null,
        CaptionText  : null,

        HandlerL     : null,
        HandlerR     : null,
        HandlerB     : null,
        HandlerT     : null,
        HandlerLT    : null,
        HandlerRT    : null,
        HandlerLB    : null,
        HandlerRB    : null
    };

    this.m_oOuterBorderColor = new CColor(166, 166, 166, 255);
    this.m_oInnerBorderColor = new CColor(185, 185, 185, 255);
    this.m_oBackColor        = new CColor(217, 217, 217, 255);

    this.m_nW = -1;
    this.m_nH = -1;

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
    oInnerElement.style.overflow = "hidden";
    this.HtmlElement.InnerDiv     = oInnerElement;
    this.HtmlElement.InnerControl = oInnerControl;

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
    oCaptionTextElement.innerText = "Caption";
    oCaptionTextElement.style.fontFamily          = "Tahoma, Sans serif";
    oCaptionTextElement.style.fontSize            = "13pt";
    oCaptionTextElement.style.textAlign           = "center";
    oCaptionTextElement.style.height              = "29px";
    oCaptionTextElement.style.lineHeight          = "29px";
    oCaptionTextElement.style.overflow            = "hidden";
    oCaptionTextElement.style.textOverflow        = "ellipsis";
    oCaptionTextElement.style['-o-text-overflow'] = "ellipsis";
    oCaptionTextElement.style.cursor              = "default";
    this.HtmlElement.CaptionText = oCaptionTextElement;

    // Caption
    var sCaptionId2      = sDivId + "_Caption2";
    var oCaptionElement2 = this.protected_CreateDivElement(oMainDiv, sCaptionId2);
    var oCaptionControl2 = CreateControlContainer(sCaptionId2);
    oCaptionControl2.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, 30);
    oCaptionControl2.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oCaptionControl2);
    this.HtmlElement.Caption = oCaptionElement2;

    Common_DragHandler.Init(oCaptionElement2, null);
    oCaptionElement2.onDrag = function(X, Y)
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

    Common_DragHandler.Init(this.HtmlElement.HandlerL, null, null, null, null, null);
    this.HtmlElement.HandlerL.onDrag = this.private_OnDragLeftHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerR, null, null, null, null, null);
    this.HtmlElement.HandlerR.onDrag = this.private_OnDragRightHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerT, null, null, null, null, null);
    this.HtmlElement.HandlerT.onDrag = this.private_OnDragTopHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerB, null, null, null, null, null);
    this.HtmlElement.HandlerB.onDrag = this.private_OnDragBottomHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerLT, null, null, null, null, null);
    this.HtmlElement.HandlerLT.onDrag = this.private_OnDragLeftTopHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerRT, null, null, null, null, null);
    this.HtmlElement.HandlerRT.onDrag = this.private_OnDragRightTopHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerLB, null, null, null, null, null);
    this.HtmlElement.HandlerLB.onDrag = this.private_OnDragLeftBottomHandler;

    Common_DragHandler.Init(this.HtmlElement.HandlerRB, null, null, null, null, null);
    this.HtmlElement.HandlerRB.onDrag = this.private_OnDragRightBottomHandler;

    this.Update_Size(true);
};
CDrawingWindow.prototype.Update_Size = function(bForce)
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    if (W !== this.m_nW || H !== this.m_nH || true === bForce)
    {
        this.m_nW = W;
        this.m_nH = H;

        this.HtmlElement.Control.Resize(W, H);
        this.HtmlElement.CloseButton.Update_Size();

//        Common_DragHandler.Init(this.HtmlElement.HandlerL, null, null, null, null, null);
//        this.HtmlElement.HandlerL.onDrag = this.private_OnDragLeftHandler;
//
//        Common_DragHandler.Init(this.HtmlElement.HandlerR, null, null, null, null, null);
//        this.HtmlElement.HandlerR.onDrag = this.private_OnDragRightHandler;
//
//        Common_DragHandler.Init(this.HtmlElement.HandlerT, null, null, null, null, null);
//        this.HtmlElement.HandlerT.onDrag = this.private_OnDragTopHandler;
//
//        Common_DragHandler.Init(this.HtmlElement.HandlerB, null, null, null, null, null);
//        this.HtmlElement.HandlerB.onDrag = this.private_OnDragBottomHandler;
//
//        Common_DragHandler.Init(this.HtmlElement.HandlerLT, null, null, null, null, null);
//        this.HtmlElement.HandlerLT.onDrag = this.private_OnDragLeftTopHandler;
//
//        Common_DragHandler.Init(this.HtmlElement.HandlerRT, null, null, null, null, null);
//        this.HtmlElement.HandlerRT.onDrag = this.private_OnDragRightTopHandler;
//
//        Common_DragHandler.Init(this.HtmlElement.HandlerLB, null, null, null, null, null);
//        this.HtmlElement.HandlerLB.onDrag = this.private_OnDragLeftBottomHandler;
//
//        Common_DragHandler.Init(this.HtmlElement.HandlerRB, null, null, null, null, null);
//        this.HtmlElement.HandlerRB.onDrag = this.private_OnDragRightBottomHandler;
    }
};
CDrawingWindow.prototype.Close = function()
{
    var oMainDiv = this.HtmlElement.Control.HtmlElement;
    oMainDiv.parentNode.removeChild(oMainDiv);
};
CDrawingWindow.prototype.Focus = function()
{

};
CDrawingWindow.prototype.Set_Caption = function(sCaption)
{
    this.HtmlElement.CaptionText.innerText = sCaption;
    this.HtmlElement.CaptionText.innerHTML = sCaption;
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

function CDrawingInfoWindow()
{
    CDrawingInfoWindow.superclass.constructor.call(this);

    this.HtmlElement.OKButton     = null;
    this.HtmlElement.CancelButton = null;

    this.HtmlElement2 = {};
    this.m_oGameTree = null;
}

CommonExtend(CDrawingInfoWindow, CDrawingWindow);

CDrawingInfoWindow.prototype.Init = function(_sDivId, oGameTree)
{
    CDrawingInfoWindow.superclass.Init.call(this, _sDivId);

    this.m_oGameTree = oGameTree;

    this.Set_Caption("Game info");

    var oMainDiv     = this.HtmlElement.InnerDiv;
    var oMainControl = this.HtmlElement.InnerControl;
    var sDivId = oMainDiv.id;


    var sContentDiv = sDivId + "Content";
    var sButtonsDiv = sDivId + "Buttons";

    var oContentDiv = this.protected_CreateDivElement(oMainDiv, sContentDiv);
    var oButtonsDiv = this.protected_CreateDivElement(oMainDiv, sButtonsDiv);

    var oContentControl = CreateControlContainer(sContentDiv);
    oContentControl.Bounds.SetParams(0, 0, 0, 40, true, true, true, true, -1, -1);
    oContentControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_bottom | g_anchor_right);
    oMainControl.AddControl(oContentControl);

    var oButtonsControl = CreateControlContainer(sButtonsDiv);
    oButtonsControl.Bounds.SetParams(0, 0, 0, 0, true, false, true, true, -1, 40);
    oButtonsControl.Anchor = (g_anchor_left |g_anchor_bottom | g_anchor_right);
    oMainControl.AddControl(oButtonsControl);

    // TODO: Цвета должны быть из темы
    oButtonsDiv.style.borderTop = "1px solid rgb(172,172,172)";
    oButtonsDiv.style.backgroundColor = "rgb(240,240,240)";

    // Butttons OK Cancel

    var sButtonOk        = sButtonsDiv + "OK";
    var oButtonOkElement = this.protected_CreateDivElement(oButtonsDiv, sButtonOk);
    var oButtonOkControl = CreateControlContainer(sButtonOk);
    oButtonOkControl.Bounds.SetParams(0, 9, 85, 1000, false, true, true, false, 66, 21);
    oButtonOkControl.Anchor = (g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oButtonOkControl);
    var oDrawingButttonOK = new CDrawingButton(this.m_oDrawing);
    oDrawingButttonOK.Init(sButtonOk, this, EDrawingButtonType.WindowOK);
    this.HtmlElement.OKButton = oDrawingButttonOK;

    oDrawingButttonOK.m_oNormaBColor    = new CColor(234, 234, 234, 255); // 229,229,229 -> 240,240,240
    oDrawingButttonOK.m_oNormaFColor    = new CColor(172, 172, 172, 255);
    oDrawingButttonOK.m_oHoverBColor    = new CColor(227, 240, 252, 255); // 220,236,252 -> 236,244,252
    oDrawingButttonOK.m_oHoverFColor    = new CColor(126, 180, 234, 255);
    oDrawingButttonOK.m_oActiveBColor   = new CColor(207, 230, 252, 255); // 196,224,252 -> 218,235,252
    oDrawingButttonOK.m_oActiveFColor   = new CColor( 86, 157, 229, 255);
    oDrawingButttonOK.m_oDisabledBColor = new CColor(239, 239, 239, 255);
    oDrawingButttonOK.m_oDisabledFColor = new CColor(217, 217, 217, 255);

    if (true !== oGameTree.Can_EditGameInfo())
        oDrawingButttonOK.Set_Enabled(false);

    var sButtonCancel        = sButtonsDiv + "Cancel";
    var oButtonCancelElement = this.protected_CreateDivElement(oButtonsDiv, sButtonCancel);
    var oButtonCancelControl = CreateControlContainer(sButtonCancel);
    oButtonCancelControl.Bounds.SetParams(0, 9, 11, 1000, false, true, true, false, 66, 21);
    oButtonCancelControl.Anchor = (g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oButtonCancelControl);
    var oDrawingButttonCancel = new CDrawingButton(this.m_oDrawing);
    oDrawingButttonCancel.Init(sButtonCancel, this, EDrawingButtonType.WindowCancel);
    this.HtmlElement.CancelButton = oDrawingButttonCancel;

    oDrawingButttonCancel.m_oNormaBColor    = new CColor(234, 234, 234, 255); // 229,229,229 -> 240,240,240
    oDrawingButttonCancel.m_oNormaFColor    = new CColor(172, 172, 172, 255);
    oDrawingButttonCancel.m_oHoverBColor    = new CColor(227, 240, 252, 255); // 220,236,252 -> 236,244,252
    oDrawingButttonCancel.m_oHoverFColor    = new CColor(126, 180, 234, 255);
    oDrawingButttonCancel.m_oActiveBColor   = new CColor(207, 230, 252, 255); // 196,224,252 -> 218,235,252
    oDrawingButttonCancel.m_oActiveFColor   = new CColor( 86, 157, 229, 255);
    oDrawingButttonCancel.m_oDisabledBColor = new CColor(239, 239, 239, 255);
    oDrawingButttonCancel.m_oDisabledFColor = new CColor(217, 217, 217, 255);

    //-----


    oMainControl = oContentControl;
    oMainDiv     = oContentDiv;
    sDivId       = sContentDiv;

    oMainDiv.style.overflowX = "hidden";
    oMainDiv.style.overflowY = "scroll";

    var RowHeight   = 20;
    var TopOffset   = 10;
    var LineSpacing = 5;
    var BottomOffset = 10;

    var bCanEdit = oGameTree.Can_EditGameInfo();
    this.HtmlElement2.GameName = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Game name", oGameTree.Get_GameName(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Result = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Result", oGameTree.Get_Result(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Rules = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Rules", oGameTree.Get_Rules(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Komi = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Komi", oGameTree.Get_Komi(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Handicap = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Handicap", oGameTree.Get_Handicap(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.TimeSettings = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Time settings", oGameTree.Get_TimeLimit() + (oGameTree.Get_OverTime() === "" ? "" : " + " + oGameTree.Get_OverTime()), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;

    this.HtmlElement2.BlackName = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Black", oGameTree.Get_BlackName(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.BlackRank = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Black rank", oGameTree.Get_BlackRating(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.WhiteName = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "White", oGameTree.Get_WhiteName(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.WhiteRank = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "White rank", oGameTree.Get_WhiteRating(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;

    this.HtmlElement2.Copyright = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Copyright", oGameTree.Get_Copyright(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.GameInfo = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Game info", oGameTree.Get_GameInfo(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Date = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Date", oGameTree.Get_DateTime(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Event = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Event", oGameTree.Get_GameEvent(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Round = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Round", oGameTree.Get_GameRound(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Place = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Place", oGameTree.Get_GamePlace(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;

    this.HtmlElement2.Annotator = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Annotator", oGameTree.Get_GameAnnotator(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Fuseki = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Fuseki", oGameTree.Get_GameFuseki(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Source = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Source", oGameTree.Get_GameSource(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.HtmlElement2.Transcriber = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Transcriber", oGameTree.Get_GameTranscriber(), TopOffset, RowHeight, bCanEdit);
    TopOffset += RowHeight + LineSpacing;
    this.protected_CreateDivElement(oMainDiv, sDivId + "Bottom");
    var BottomControl = CreateControlContainer(sDivId + "Bottom");
    BottomControl.Bounds.SetParams(0, TopOffset, 1000, 1000, true, true, false, false, 0, BottomOffset);
    BottomControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
    oMainControl.AddControl(BottomControl);

    this.Update_Size(true);
};
CDrawingInfoWindow.prototype.Update_Size = function(bForce)
{
    CDrawingInfoWindow.superclass.Update_Size.call(this, bForce);

    if (this.HtmlElement.OKButton)
        this.HtmlElement.OKButton.Update_Size();

    if (this.HtmlElement.CancelButton)
        this.HtmlElement.CancelButton.Update_Size();
};
CDrawingInfoWindow.prototype.Handle_Cancel = function()
{
    this.Close();
};
CDrawingInfoWindow.prototype.Handle_OK = function()
{
    if (this.m_oGameTree)
    {
        this.m_oGameTree.Set_GameName(this.HtmlElement2.GameName.value);
        this.m_oGameTree.Set_Result(this.HtmlElement2.Result.value);
        this.m_oGameTree.Set_Rules(this.HtmlElement2.Rules.value);
        this.m_oGameTree.Set_Komi(parseFloat(this.HtmlElement2.Komi.value));
        this.m_oGameTree.Set_Handicap(this.HtmlElement2.Handicap.value);

        // TODO: разбить на TimeLimit и Overtime
        this.m_oGameTree.Set_TimeLimit(this.HtmlElement2.TimeSettings.value);

        this.m_oGameTree.Set_Black(this.HtmlElement2.BlackName.value);
        this.m_oGameTree.Set_BlackRating(this.HtmlElement2.BlackRank.value);
        this.m_oGameTree.Set_White(this.HtmlElement2.WhiteName.value);
        this.m_oGameTree.Set_WhiteRating(this.HtmlElement2.WhiteRank.value);
        this.m_oGameTree.Set_Copyright(this.HtmlElement2.Copyright.value);
        this.m_oGameTree.Set_GameInfo(this.HtmlElement2.GameInfo.value);
        this.m_oGameTree.Set_DateTime(this.HtmlElement2.Date.value);
        this.m_oGameTree.Set_GameEvent(this.HtmlElement2.Event.value);
        this.m_oGameTree.Set_GameRound(this.HtmlElement2.Round.value);
        this.m_oGameTree.Set_GamePlace(this.HtmlElement2.Place.value);
        this.m_oGameTree.Set_GameAnnotator(this.HtmlElement2.Annotator.value);
        this.m_oGameTree.Set_GameFuseki(this.HtmlElement2.Fuseki.value);
        this.m_oGameTree.Set_GameSource(this.HtmlElement2.Source.value);
        this.m_oGameTree.Set_GameTranscriber(this.HtmlElement2.Transcriber.value);
    }

    this.Close();
};
CDrawingInfoWindow.prototype.private_CreateDivElement = function(oParentElement, sName, Height)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oElement.style.fontFamily  = "Tahoma, Sans serif";
    oElement.style.fontSize    = Height * 15 / 20 + "px";
    oElement.style.lineHeight  = Height + "px";
    oElement.style.height      = Height + "px";

    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingInfoWindow.prototype.private_CreateInputElement = function(oParentElement, sName, bCanEdit)
{
    var oElement = document.createElement("input");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oElement.setAttribute("type", "text");
    oElement.style.fontFamily  = "Tahoma, Sans serif";
    oElement.style.fontSize    = "10pt";
    oElement.style.outline     = "none";

    if (false === bCanEdit)
        oElement.disabled = "disabled";

    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingInfoWindow.prototype.private_CreateInfoElement = function(oMainDiv, oMainControl, sDivId, sName, sValue, TopOffset, RowHeight, bCanEdit)
{
    var LeftWidth  = 100;
    var LeftOffset = 10;
    var RightOffset = 10;

    RightOffset += 20; // Scroll

    var sNameId      = sDivId + sName;
    var oNameElement = this.private_CreateDivElement(oMainDiv, sNameId, RowHeight);
    var oNameControl = CreateControlContainer(sNameId);
    oNameControl.Bounds.SetParams(LeftOffset, TopOffset, 1000, 1000, true, true, false, false, LeftWidth, RowHeight);
    oNameControl.Anchor = (g_anchor_left | g_anchor_top);
    oMainControl.AddControl(oNameControl);
    oNameElement.innerText = sName;
    oNameElement.innerHTML = sName;

    var sValueId      = sNameId + "Value";
    var oValueElement = this.private_CreateInputElement(oMainDiv, sValueId, bCanEdit);
    var oValueControl = CreateControlContainer(sValueId);
    oValueControl.Bounds.SetParams(LeftOffset + LeftWidth, TopOffset + 1, RightOffset, 1000, true, true, true, false, -1, RowHeight - 2);
    oValueControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oValueControl);
    oValueElement.value = sValue;

    return oValueElement;
};

function CDrawingErrorWindow()
{
    CDrawingErrorWindow.superclass.constructor.call(this);
}

CommonExtend(CDrawingErrorWindow, CDrawingWindow);

CDrawingErrorWindow.prototype.Init = function(_sDivId, sText)
{
    CDrawingInfoWindow.superclass.Init.call(this, _sDivId);

    var oMainDiv     = this.HtmlElement.InnerDiv;
    var oMainControl = this.HtmlElement.InnerControl;

    oMainDiv.style.fontFamily = "Tahoma, Sans serif";
    oMainDiv.style.fontSize   = 16 + "px";

    oMainDiv.innerHTML = sText;
    oMainDiv.innerText = sText;
};
