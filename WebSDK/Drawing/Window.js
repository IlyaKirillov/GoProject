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

    this.m_oDrawing = null;

    this.m_nW = -1;
    this.m_nH = -1;

    this.m_bVisible = false;

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

CDrawingWindow.prototype.Init = function(sDivId, bResizable)
{
    var oThis = this;

    this.m_bVisible = true;

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var oMainDiv             = this.HtmlElement.Control.HtmlElement;
    var oMainControl         = this.HtmlElement.Control;

    oMainDiv.style.border          = "1px solid " + this.m_oOuterBorderColor.ToString();
    oMainDiv.style.backgroundColor = this.m_oBackColor.ToString();
    oMainDiv.style.boxSizing       = "content-box";

    // InnerDiv
    var sInnerDivId                     = sDivId + "_Inner";
    var oInnerElement                   = this.protected_CreateDivElement(oMainDiv, sInnerDivId);
    var oInnerControl                   = CreateControlContainer(sInnerDivId);
    oInnerControl.Bounds.SetParams(6, 29, 8, 8, true, true, true, true, -1, -1);
    oInnerControl.Anchor                = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    oMainControl.AddControl(oInnerControl);
    oInnerElement.style.border          = "1px solid " + this.m_oInnerBorderColor.ToString();
    oInnerElement.style.backgroundColor = (new CColor(255, 255, 255, 255)).ToString();
    oInnerElement.style.overflow        = "hidden";
    this.HtmlElement.InnerDiv           = oInnerElement;
    this.HtmlElement.InnerControl       = oInnerControl;

    // Caption
    var sCaptionId         = sDivId + "_Caption";
    var oCaptionElement    = this.protected_CreateDivElement(oMainDiv, sCaptionId);
    var oCaptionControl    = CreateControlContainer(sCaptionId);
    oCaptionControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, 30);
    oCaptionControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oCaptionControl);

    // CaptionText
    var sCaptionTextId                            = sCaptionId + "_Text";
    var oCaptionTextElement                       = this.protected_CreateDivElement(oMainDiv, sCaptionTextId);
    var oCaptionTextControl                       = CreateControlContainer(sCaptionTextId);
    oCaptionTextControl.Bounds.SetParams(15, 0, 55, 1000, true, false, true, false, -1, 30);
    oCaptionTextControl.Anchor                    = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oCaptionControl.AddControl(oCaptionTextControl);
    oCaptionTextElement.style.fontFamily          = "Tahoma, Sans serif";
    oCaptionTextElement.style.fontSize            = "13pt";
    oCaptionTextElement.style.textAlign           = "center";
    oCaptionTextElement.style.height              = "29px";
    oCaptionTextElement.style.lineHeight          = "29px";
    oCaptionTextElement.style.overflow            = "hidden";
    oCaptionTextElement.style.textOverflow        = "ellipsis";
    oCaptionTextElement.style['-o-text-overflow'] = "ellipsis";
    oCaptionTextElement.style.cursor              = "default";
    Common.Set_InnerTextToElement(oCaptionTextElement, "Caption");
    this.HtmlElement.CaptionText                  = oCaptionTextElement;

    // Caption
    var sCaptionId2          = sDivId + "_Caption2";
    var oCaptionElement2     = this.protected_CreateDivElement(oMainDiv, sCaptionId2);
    var oCaptionControl2     = CreateControlContainer(sCaptionId2);
    oCaptionControl2.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, 30);
    oCaptionControl2.Anchor  = (g_anchor_top | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oCaptionControl2);
    this.HtmlElement.Caption = oCaptionElement2;

    Common_DragHandler.Init(oCaptionElement2, null);
    oCaptionElement2.onDrag  = function (X, Y)
    {
        var CurLeft = parseInt(oThis.HtmlElement.Control.HtmlElement.style.left);
        var CurTop  = parseInt(oThis.HtmlElement.Control.HtmlElement.style.top);

        var LeftHandler = parseInt(oThis.HtmlElement.Caption.style.left);
        var TopHandler  = parseInt(oThis.HtmlElement.Caption.style.top);

        oThis.HtmlElement.Control.HtmlElement.style.left = CurLeft + LeftHandler + "px";
        oThis.HtmlElement.Control.HtmlElement.style.top  = CurTop + TopHandler + "px";

        oThis.HtmlElement.Caption.style.left = "0px";
        oThis.HtmlElement.Caption.style.top  = "0px";
        oThis.Update_Size();
    };

    if (false !== bResizable)
    {
        // Left Handler
        var sLeftHandlerId               = sDivId + "_LeftHandler";
        var oLeftHandlerElement          = this.protected_CreateDivElement(oMainDiv, sLeftHandlerId);
        var oLeftHandlerControl          = CreateControlContainer(sLeftHandlerId);
        oLeftHandlerControl.Bounds.SetParams(0, 6, 1000, 6, false, true, false, true, 6, -1);
        oLeftHandlerControl.Anchor       = (g_anchor_top | g_anchor_left | g_anchor_bottom);
        oMainControl.AddControl(oLeftHandlerControl);
        oLeftHandlerElement.style.cursor = "w-resize";
        this.HtmlElement.HandlerL        = oLeftHandlerElement;

        // Right Handler
        var sRightHandlerId               = sDivId + "_RightHandler";
        var oRightHandlerElement          = this.protected_CreateDivElement(oMainDiv, sRightHandlerId);
        var oRightHandlerControl          = CreateControlContainer(sRightHandlerId);
        oRightHandlerControl.Bounds.SetParams(0, 6, 0, 6, false, true, true, true, 6, -1);
        oRightHandlerControl.Anchor       = (g_anchor_top | g_anchor_right | g_anchor_bottom);
        oMainControl.AddControl(oRightHandlerControl);
        oRightHandlerElement.style.cursor = "w-resize";
        this.HtmlElement.HandlerR         = oRightHandlerElement;

        // Bottom Handler
        var sBottomHandlerId               = sDivId + "_BottomHandler";
        var oBottomHandlerElement          = this.protected_CreateDivElement(oMainDiv, sBottomHandlerId);
        var oBottomHandlerControl          = CreateControlContainer(sBottomHandlerId);
        oBottomHandlerControl.Bounds.SetParams(6, 0, 6, 0, true, false, true, true, -1, 6);
        oBottomHandlerControl.Anchor       = (g_anchor_bottom | g_anchor_right | g_anchor_left);
        oMainControl.AddControl(oBottomHandlerControl);
        oBottomHandlerElement.style.cursor = "s-resize";
        this.HtmlElement.HandlerB          = oBottomHandlerElement;

        // Top Handler
        var sTopHandlerId               = sDivId + "_TopHandler";
        var oTopHandlerElement          = this.protected_CreateDivElement(oMainDiv, sTopHandlerId);
        var oTopHandlerControl          = CreateControlContainer(sTopHandlerId);
        oTopHandlerControl.Bounds.SetParams(6, 0, 6, 1000, true, true, true, false, -1, 6);
        oTopHandlerControl.Anchor       = (g_anchor_top | g_anchor_right | g_anchor_left);
        oMainControl.AddControl(oTopHandlerControl);
        oTopHandlerElement.style.cursor = "s-resize";
        this.HtmlElement.HandlerT       = oTopHandlerElement;

        // Left-Top Handler
        var sLeftTopHandlerId               = sDivId + "_LeftTopHandler";
        var oLeftTopHandlerElement          = this.protected_CreateDivElement(oMainDiv, sLeftTopHandlerId);
        var oLeftTopHandlerControl          = CreateControlContainer(sLeftTopHandlerId);
        oLeftTopHandlerControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, 6, 6);
        oLeftTopHandlerControl.Anchor       = (g_anchor_top | g_anchor_left);
        oMainControl.AddControl(oLeftTopHandlerControl);
        oLeftTopHandlerElement.style.cursor = "se-resize";
        this.HtmlElement.HandlerLT          = oLeftTopHandlerElement;

        // Right-Top Handler
        var sRightTopHandlerId               = sDivId + "_RightTopHandler";
        var oRightTopHandlerElement          = this.protected_CreateDivElement(oMainDiv, sRightTopHandlerId);
        var oRightTopHandlerControl          = CreateControlContainer(sRightTopHandlerId);
        oRightTopHandlerControl.Bounds.SetParams(0, 0, 0, 1000, false, false, true, false, 6, 6);
        oRightTopHandlerControl.Anchor       = (g_anchor_top | g_anchor_right);
        oMainControl.AddControl(oRightTopHandlerControl);
        oRightTopHandlerElement.style.cursor = "ne-resize";
        this.HtmlElement.HandlerRT           = oRightTopHandlerElement;

        // Left-Bottom Handler
        var sLeftBottomHandlerId               = sDivId + "_LeftBottomHandler";
        var oLeftBottomHandlerElement          = this.protected_CreateDivElement(oMainDiv, sLeftBottomHandlerId);
        var oLeftBottomHandlerControl          = CreateControlContainer(sLeftBottomHandlerId);
        oLeftBottomHandlerControl.Bounds.SetParams(0, 0, 0, 1000, false, false, false, false, 6, 6);
        oLeftBottomHandlerControl.Anchor       = (g_anchor_bottom | g_anchor_left);
        oMainControl.AddControl(oLeftBottomHandlerControl);
        oLeftBottomHandlerElement.style.cursor = "ne-resize";
        this.HtmlElement.HandlerLB             = oLeftBottomHandlerElement;

        // Right-Bottom Handler
        var sRightBottomHandlerId               = sDivId + "_RightBottomHandler";
        var oRightBottomHandlerElement          = this.protected_CreateDivElement(oMainDiv, sRightBottomHandlerId);
        var oRightBottomHandlerControl          = CreateControlContainer(sRightBottomHandlerId);
        oRightBottomHandlerControl.Bounds.SetParams(0, 0, 0, 1000, false, false, true, false, 6, 6);
        oRightBottomHandlerControl.Anchor       = (g_anchor_bottom | g_anchor_right);
        oMainControl.AddControl(oRightBottomHandlerControl);
        oRightBottomHandlerElement.style.cursor = "se-resize";
        this.HtmlElement.HandlerRB              = oRightBottomHandlerElement;

        Common_DragHandler.Init(this.HtmlElement.HandlerL, null, null, null, null, null);
        this.HtmlElement.HandlerL.onDrag        = this.private_OnDragLeftHandler;

        Common_DragHandler.Init(this.HtmlElement.HandlerR, null, null, null, null, null);
        this.HtmlElement.HandlerR.onDrag        = this.private_OnDragRightHandler;

        Common_DragHandler.Init(this.HtmlElement.HandlerT, null, null, null, null, null);
        this.HtmlElement.HandlerT.onDrag        = this.private_OnDragTopHandler;

        Common_DragHandler.Init(this.HtmlElement.HandlerB, null, null, null, null, null);
        this.HtmlElement.HandlerB.onDrag        = this.private_OnDragBottomHandler;

        Common_DragHandler.Init(this.HtmlElement.HandlerLT, null, null, null, null, null);
        this.HtmlElement.HandlerLT.onDrag       = this.private_OnDragLeftTopHandler;

        Common_DragHandler.Init(this.HtmlElement.HandlerRT, null, null, null, null, null);
        this.HtmlElement.HandlerRT.onDrag       = this.private_OnDragRightTopHandler;

        Common_DragHandler.Init(this.HtmlElement.HandlerLB, null, null, null, null, null);
        this.HtmlElement.HandlerLB.onDrag       = this.private_OnDragLeftBottomHandler;

        Common_DragHandler.Init(this.HtmlElement.HandlerRB, null, null, null, null, null);
        this.HtmlElement.HandlerRB.onDrag       = this.private_OnDragRightBottomHandler;
    }

    // CloseButton
    var sCloseButtonId                        = sDivId + "_Close";
    var oCloseButtonElement                   = this.protected_CreateDivElement(oMainDiv, sCloseButtonId);
    var oCloseButtonControl                   = CreateControlContainer(sCloseButtonId);
    oCloseButtonControl.Bounds.SetParams(0, 0, 6, 1000, false, true, true, false, 45, 20);
    oCloseButtonControl.Anchor                = (g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oCloseButtonControl);
    oCloseButtonElement.style.backgroundColor = (new CColor(255, 0, 0, 255)).ToString();

    var oCloseButton             = new CDrawingButtonClose(this.m_oDrawing);
    oCloseButton.Init(sCloseButtonId, this);
    oCloseButton.m_oNormaFColor  = new CColor(199, 80, 80, 255);
    oCloseButton.m_oHoverFColor  = new CColor(224, 67, 67, 255);
    oCloseButton.m_oActiveFColor = new CColor(153, 61, 61, 255);

    this.HtmlElement.CloseButton = oCloseButton;
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
    }
};
CDrawingWindow.prototype.Close = function()
{
    this.m_bVisible = false;

    var oMainDiv = this.HtmlElement.Control.HtmlElement;

    oMainDiv.style.display = "none";

    if (this.m_oGameTree)
        this.m_oGameTree.Focus();
};
CDrawingWindow.prototype.Show = function(oPr)
{
    this.m_bVisible = true;

    var oDiv = this.HtmlElement.Control.HtmlElement;

    oDiv.style.display = "block";

    var nLeft = parseInt(oDiv.style.left);
    var nTop  = parseInt(oDiv.style.top);

    if (oPr.Drawing)
    {
        var oDrawing = oPr.Drawing;
        var DrawingW = oDrawing.Get_Width();
        var DrawingH = oDrawing.Get_Height();

        var nThreshold = 100;

        if (nTop > DrawingH - nThreshold)
            oDiv.style.top = (DrawingH - nThreshold) + "px";

        if (nLeft > DrawingW - nThreshold)
            oDiv.style.left = (DrawingW - nThreshold) + "px";
    }

    if (nLeft < 0)
        oDiv.style.left = "0px";

    if (nTop < 0)
        oDiv.style.top = "0px";
};
CDrawingWindow.prototype.Focus = function()
{

};
CDrawingWindow.prototype.Set_Caption = function(sCaption)
{
    Common.Set_InnerTextToElement(this.HtmlElement.CaptionText, sCaption);
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
CDrawingWindow.prototype.protected_UpdateSizeAndPosition = function(oDrawing)
{
    if (!oDrawing)
        return;

    this.m_oDrawing = oDrawing;
    var oWindowDiv = this.HtmlElement.Control.HtmlElement;

    var oSize = this.Get_DefaultWindowSize();
    if (null !== oSize && undefined !== oSize)
    {
        oWindowDiv.style.width  = oSize.W + "px";
        oWindowDiv.style.height = oSize.H + "px";
    }

    var nWindowW = parseInt(oWindowDiv.style.width);
    var nWindowH = parseInt(oWindowDiv.style.height);

    var nX = Math.max(0, ((this.m_oDrawing.Get_Width()  - nWindowW) / 2));
    var nY = Math.max(0, ((this.m_oDrawing.Get_Height() - nWindowH) / 2));

    oWindowDiv.style.left = nX + "px";
    oWindowDiv.style.top  = nY + "px";
};
CDrawingWindow.prototype.Get_DefaultWindowSize = function()
{
    return null;
};
CDrawingWindow.prototype.Is_Visible = function()
{
    return this.m_bVisible;
};
CDrawingWindow.prototype.Update = function()
{
};

function CDrawingConfirmWindow()
{
    CDrawingConfirmWindow.superclass.constructor.call(this);

    this.HtmlElement.OKButton     = null;
    this.HtmlElement.CancelButton = null;

    this.HtmlElement.ConfirmInnerDiv     = null;
    this.HtmlElement.ConfirmInnerControl = null;
}

CommonExtend(CDrawingConfirmWindow, CDrawingWindow);

CDrawingConfirmWindow.prototype.Init = function(_sDivId, bResizable)
{
    CDrawingConfirmWindow.superclass.Init.call(this, _sDivId, bResizable);

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

    this.HtmlElement.ConfirmInnerControl = oContentControl;
    this.HtmlElement.ConfirmInnerDiv     = oContentDiv;

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
    var oDrawingButttonOK = new CDrawingButtonOK(this.m_oDrawing);
    oDrawingButttonOK.Init(sButtonOk, this);
    this.HtmlElement.OKButton = oDrawingButttonOK;

    oDrawingButttonOK.m_oNormaBColor    = new CColor(234, 234, 234, 255); // 229,229,229 -> 240,240,240
    oDrawingButttonOK.m_oNormaFColor    = new CColor(172, 172, 172, 255);
    oDrawingButttonOK.m_oHoverBColor    = new CColor(227, 240, 252, 255); // 220,236,252 -> 236,244,252
    oDrawingButttonOK.m_oHoverFColor    = new CColor(126, 180, 234, 255);
    oDrawingButttonOK.m_oActiveBColor   = new CColor(207, 230, 252, 255); // 196,224,252 -> 218,235,252
    oDrawingButttonOK.m_oActiveFColor   = new CColor( 86, 157, 229, 255);
    oDrawingButttonOK.m_oDisabledBColor = new CColor(239, 239, 239, 255);
    oDrawingButttonOK.m_oDisabledFColor = new CColor(217, 217, 217, 255);

    var sButtonCancel        = sButtonsDiv + "Cancel";
    var oButtonCancelElement = this.protected_CreateDivElement(oButtonsDiv, sButtonCancel);
    var oButtonCancelControl = CreateControlContainer(sButtonCancel);
    oButtonCancelControl.Bounds.SetParams(0, 9, 11, 1000, false, true, true, false, 66, 21);
    oButtonCancelControl.Anchor = (g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oButtonCancelControl);
    var oDrawingButttonCancel = new CDrawingButtonCancel(this.m_oDrawing);
    oDrawingButttonCancel.Init(sButtonCancel, this);
    this.HtmlElement.CancelButton = oDrawingButttonCancel;

    oDrawingButttonCancel.m_oNormaBColor    = new CColor(234, 234, 234, 255); // 229,229,229 -> 240,240,240
    oDrawingButttonCancel.m_oNormaFColor    = new CColor(172, 172, 172, 255);
    oDrawingButttonCancel.m_oHoverBColor    = new CColor(227, 240, 252, 255); // 220,236,252 -> 236,244,252
    oDrawingButttonCancel.m_oHoverFColor    = new CColor(126, 180, 234, 255);
    oDrawingButttonCancel.m_oActiveBColor   = new CColor(207, 230, 252, 255); // 196,224,252 -> 218,235,252
    oDrawingButttonCancel.m_oActiveFColor   = new CColor( 86, 157, 229, 255);
    oDrawingButttonCancel.m_oDisabledBColor = new CColor(239, 239, 239, 255);
    oDrawingButttonCancel.m_oDisabledFColor = new CColor(217, 217, 217, 255);
};
CDrawingConfirmWindow.prototype.Update_Size = function(bForce)
{
    CDrawingConfirmWindow.superclass.Update_Size.call(this, bForce);

    if (this.HtmlElement.OKButton)
        this.HtmlElement.OKButton.Update_Size();

    if (this.HtmlElement.CancelButton)
        this.HtmlElement.CancelButton.Update_Size();
};
CDrawingConfirmWindow.prototype.Handle_Cancel = function()
{
    this.Close();
};
CDrawingConfirmWindow.prototype.Handle_OK = function()
{
    this.Close();
};

function CDrawingInfoWindow()
{
    CDrawingInfoWindow.superclass.constructor.call(this);

    this.HtmlElement2 = {};
    this.m_oGameTree = null;
    this.m_nBottomOffset = 10;
    this.m_nRowHeight    = 20;
    this.m_nLineSpacing  = 5;
}

CommonExtend(CDrawingInfoWindow, CDrawingConfirmWindow);

CDrawingInfoWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingInfoWindow.superclass.Init.call(this, _sDivId);

    this.protected_UpdateSizeAndPosition(oPr.Drawing);

    var oGameTree = oPr.GameTree;
    this.m_oGameTree = oGameTree;

    if (true !== oGameTree.Can_EditGameInfo())
        this.HtmlElement.OKButton.Set_Enabled(false);

    this.Set_Caption("Game info");

    var oMainControl = this.HtmlElement.ConfirmInnerControl;
    var oMainDiv     = this.HtmlElement.ConfirmInnerDiv;
    var sDivId       = this.HtmlElement.ConfirmInnerDiv.id;

    oMainDiv.style.overflowX = "hidden";
    oMainDiv.style.overflowY = "scroll";

    var RowHeight    = this.m_nRowHeight;
    var TopOffset    = 10;
    var LineSpacing  = this.m_nLineSpacing;
    var BottomOffset = this.m_nBottomOffset;

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

    this.HtmlElement2.Transcriber = this.private_CreateInfoAreaElement(oMainDiv, oMainControl, sDivId, "Game Info", oGameTree.Get_GameInfo(), TopOffset, RowHeight, bCanEdit);
    TopOffset += 3 * RowHeight;

    this.protected_CreateDivElement(oMainDiv, sDivId + "Bottom");
    var BottomControl = CreateControlContainer(sDivId + "Bottom");
    BottomControl.Bounds.SetParams(0, TopOffset, 1000, 1000, true, true, false, false, 0, BottomOffset);
    BottomControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
    oMainControl.AddControl(BottomControl);
};
CDrawingInfoWindow.prototype.Update_Size = function(bForce)
{
    CDrawingInfoWindow.superclass.Update_Size.call(this, bForce);

    if (this.HtmlElement.OKButton)
        this.HtmlElement.OKButton.Update_Size();

    if (this.HtmlElement.CancelButton)
        this.HtmlElement.CancelButton.Update_Size();

    var nOverallHeight  = parseInt(this.HtmlElement.ConfirmInnerDiv.style.height) | 0;
    var nGameInfoY      = parseInt(this.HtmlElement2.GameInfo.style.top) | 0;
    var nGameInfoYLimit = nOverallHeight - this.m_nBottomOffset;

    if (nGameInfoYLimit - nGameInfoY < 3 * this.m_nRowHeight)
        this.HtmlElement2.GameInfo.style.height = 3 * this.m_nRowHeight + "px";
    else
        this.HtmlElement2.GameInfo.style.height = (nGameInfoYLimit - nGameInfoY) + "px";
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
    oElement.style.border      = "1px solid rgb(169,169,169)";

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
    Common.Set_InnerTextToElement(oNameElement, sName);

    var sValueId      = sNameId + "Value";
    var oValueElement = this.private_CreateInputElement(oMainDiv, sValueId, bCanEdit);
    var oValueControl = CreateControlContainer(sValueId);
    oValueControl.Bounds.SetParams(LeftOffset + LeftWidth, TopOffset + 1, RightOffset, 1000, true, true, true, false, -1, RowHeight - 2);
    oValueControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oValueControl);
    oValueElement.value = sValue;

    return oValueElement;
};
CDrawingInfoWindow.prototype.private_CreateInfoAreaElement = function(oMainDiv, oMainControl, sDivId, sName, sValue, TopOffset, RowHeight, bCanEdit)
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
    Common.Set_InnerTextToElement(oNameElement, sName);

    var sValueId      = sNameId + "Value";

    var oValueElement = document.createElement("textarea");
    oValueElement.setAttribute("id", sValueId);
    oValueElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oValueElement.setAttribute("oncontextmenu", "return false;");
    oValueElement.style.fontFamily  = "Tahoma, Sans serif";
    oValueElement.style.fontSize    = "10pt";
    oValueElement.style.resize      = "none";
    oValueElement.style.outline     = "none";
    oValueElement.style.border      = "1px solid rgb(169,169,169)";
    oValueElement.style.height      = 3 * RowHeight + "px";

    this.HtmlElement2.GameInfo = oValueElement;

    if (false === bCanEdit)
        oValueElement.disabled = "disabled";

    oMainDiv.appendChild(oValueElement);

    var oValueControl = CreateControlContainer(sValueId);
    oValueControl.Bounds.SetParams(LeftOffset + LeftWidth, TopOffset + 1, RightOffset, 1000, true, true, true, false, -1, 3 * RowHeight);
    oValueControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oValueControl);
    oValueElement.value = sValue;

    return oValueElement;
};

function CDrawingErrorWindow()
{
    CDrawingErrorWindow.superclass.constructor.call(this);

    this.m_nW = 300;
    this.m_nH = 100;
    this.m_oMainElement = null;
}

CommonExtend(CDrawingErrorWindow, CDrawingWindow);

CDrawingErrorWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingErrorWindow.superclass.Init.call(this, _sDivId, false);

    this.protected_UpdateSizeAndPosition(oPr.Drawing);

    var sText = oPr.ErrorText;

    this.Set_Caption(oPr.Caption ? oPr.Caption : "Error");

    this.m_oGameTree = oPr.GameTree;
    this.m_oDrawing  = oPr.Drawing;

    var oMainDiv     = this.HtmlElement.InnerDiv;
    var oMainControl = this.HtmlElement.InnerControl;

    var sErrorId      = _sDivId + "E";
    var oErrorElement = this.private_CreateDivElement(oMainDiv, sErrorId, 20);
    var oErrorControl = CreateControlContainer(sErrorId);
    oErrorControl.Bounds.SetParams(10, 5, 10, 5, true, true, true, true, -1, -1);
    oErrorControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_bottom  | g_anchor_right);
    oMainControl.AddControl(oErrorControl);
    this.m_oMainElement = oErrorElement;

    this.Show(oPr);
};
CDrawingErrorWindow.prototype.Close = function()
{
    if (this.m_oDrawing)
        this.m_oDrawing.Enable();

    CDrawingInfoWindow.superclass.Close.call(this);
};
CDrawingErrorWindow.prototype.Show = function(oPr)
{
    CDrawingErrorWindow.superclass.Show.call(this, oPr);

    this.m_nW = oPr.W;
    this.m_nH = oPr.H;
    Common.Set_InnerTextToElement(this.m_oMainElement, oPr.ErrorText);

    if (this.m_oDrawing)
    {
        this.m_oDrawing.Disable();
        this.protected_UpdateSizeAndPosition(this.m_oDrawing);
        this.Update_Size(true);
    }
};
CDrawingErrorWindow.prototype.private_CreateDivElement = function(oParentElement, sName, Height)
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
CDrawingErrorWindow.prototype.Get_DefaultWindowSize = function()
{
    return { W : this.m_nW, H : this.m_nH };
};

function CDrawingSettingsWindow()
{
    CDrawingSettingsWindow.superclass.constructor.call(this);

    this.m_oGameTree = null;

    this.HtmlElement2 =
    {
        Theme :
        {
            TrueColor   : null,
            SimpleColor : null,
            BookStyle   : null,
            Dark        : null
        },

        Sound                : null,
        LoadUnfinishedSgf    : null,
        NavigatorLabel       : null,
        CycleThroughVariants : null,
        LoadShowVariants     : null,
        ShowTarget           : null
    };
}

CommonExtend(CDrawingSettingsWindow, CDrawingConfirmWindow);

CDrawingSettingsWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingSettingsWindow.superclass.Init.call(this, _sDivId, false);
    this.protected_UpdateSizeAndPosition(oPr.Drawing);

    this.m_oGameTree = oPr.GameTree;

    this.Set_Caption("Settings");

    var oTabs = new CDrawingVerticalTabs();
    oTabs.Init(this.HtmlElement.ConfirmInnerDiv.id, ["Appearance", "Color Scheme", "Loading Settings"], 0, 150);

    this.private_CreateAppearancePage(oTabs.Get_TabContent(0), oPr);
    this.private_CreateColorSchemePage(oTabs.Get_TabContent(1), oPr);
    this.private_CreateLoadingSettingsPage(oTabs.Get_TabContent(2), oPr);
};
CDrawingSettingsWindow.prototype.Get_DefaultWindowSize = function()
{
    return {W : 400, H : 210};
};
CDrawingSettingsWindow.prototype.Show = function(oPr)
{
    CDrawingSettingsWindow.superclass.Show.call(this, oPr);

    // Appearance
    this.HtmlElement2.CycleThroughVariants.checked = this.m_oGameTree.Is_CycleThroughVariants();
    this.HtmlElement2.Sound.checked                = this.m_oGameTree.Is_SoundOn();
    this.HtmlElement2.NavigatorLabel.selectedIndex = this.m_oGameTree.Get_NavigatorLabel();

    // ColorScheme
    this.private_CheckColorTheme();

    // LoadingSettings
    this.HtmlElement2.LoadUnfinishedSgf.checked      = this.m_oGameTree.Is_LoadUnfinishedFilesOnLastNode();
    this.HtmlElement2.LoadShowVariants.selectedIndex = this.m_oGameTree.Get_LoadShowVariants();
};
CDrawingSettingsWindow.prototype.private_CreatePage = function(oDiv)
{
    var oDivMainPart = document.createElement("div");
    oDiv.appendChild(oDivMainPart);
    oDivMainPart.style.margin  = "0";
    oDivMainPart.style.padding = "10px 20px";

    oDivMainPart.style.fontFamily = "Tahoma, Arial, Verdana";
    oDivMainPart.style.fontSize   = "10px";
    oDivMainPart.style.color      = "#666";
    oDivMainPart.style.background = "#fff";

    return oDivMainPart;
};
CDrawingSettingsWindow.prototype.private_CreateAppearancePage = function(oDiv, oPr)
{
    var oDivMainPart = this.private_CreatePage(oDiv);
    var sDivId       = this.HtmlElement.ConfirmInnerDiv.id + "A";

    this.HtmlElement2.ShowTarget           = this.private_CreateCheckBox(oDivMainPart, sDivId + "T", this.m_oGameTree.Is_ShowTarget(), "Show Target");
    this.HtmlElement2.CycleThroughVariants = this.private_CreateCheckBox(oDivMainPart, sDivId + "C", this.m_oGameTree.Is_CycleThroughVariants(), "Cycle through variants");
    this.HtmlElement2.Sound                = this.private_CreateCheckBox(oDivMainPart, sDivId + "S", this.m_oGameTree.Is_SoundOn(), "Sound");
    this.HtmlElement2.NavigatorLabel       = this.private_CreateSelect(oDivMainPart, sDivId + "N", this.m_oGameTree.Get_NavigatorLabel(), ["No labels", "Move numbers", "Move numbers current variant only", "Move coordinates"], "Labels in navigator");
};
CDrawingSettingsWindow.prototype.private_CreateColorSchemePage = function(oDiv, oPr)
{
    var oDivMainPart = this.private_CreatePage(oDiv);
    var sDivId       = this.HtmlElement.ConfirmInnerDiv.id + "CS";

    var sThemeId = "ThemeId";

    this.HtmlElement2.Theme.TrueColor   = this.private_CreateRadioButton(oDivMainPart, sDivId + "TC", sThemeId, "TrueColor");
    this.HtmlElement2.Theme.SimpleColor = this.private_CreateRadioButton(oDivMainPart, sDivId + "SC", sThemeId, "SimpleColor");
    this.HtmlElement2.Theme.BookStyle   = this.private_CreateRadioButton(oDivMainPart, sDivId + "BS", sThemeId, "BookStyle");
    this.HtmlElement2.Theme.Dark        = this.private_CreateRadioButton(oDivMainPart, sDivId + "D",  sThemeId, "Dark");

    this.private_CheckColorTheme();
};
CDrawingSettingsWindow.prototype.private_CreateLoadingSettingsPage = function(oDiv, oPr)
{
    var oDivMainPart = this.private_CreatePage(oDiv);
    var sDivId       = this.HtmlElement.ConfirmInnerDiv.id + "LS";

    this.HtmlElement2.LoadUnfinishedSgf = this.private_CreateCheckBox(oDivMainPart, sDivId + "U", this.m_oGameTree.Is_LoadUnfinishedFilesOnLastNode(), "Load unfinished files on the last node");
    this.HtmlElement2.LoadShowVariants  = this.private_CreateSelect(oDivMainPart, sDivId + "V", this.m_oGameTree.Get_LoadShowVariants(), ["Don't show variants", "Show variations of current node   (siblings)", "Show variations of successor node (children)", "Load option from file"], "Show variants");
};
CDrawingSettingsWindow.prototype.Handle_OK = function()
{
    var eColorScheme = EColorScheme.TrueColor;
    if (this.HtmlElement2.Theme.SimpleColor.checked)
        eColorScheme = EColorScheme.SimpleColor;
    else if (this.HtmlElement2.Theme.BookStyle.checked)
        eColorScheme = EColorScheme.BookStyle;
    else if (this.HtmlElement2.Theme.Dark.checked)
        eColorScheme = EColorScheme.Dark;
    else // TrueColor
        eColorScheme = EColorScheme.TrueColor;

    var oSchemeChange = g_oGlobalSettings.Set_ColorScheme(eColorScheme);

    this.m_oGameTree.Toggle_Sound(this.HtmlElement2.Sound.checked ? true : false, false);
    this.m_oGameTree.Set_ShowTarget(this.HtmlElement2.ShowTarget.checked ? true : false);
    this.m_oGameTree.Set_LoadUnfinishedFilesOnLastNode(this.HtmlElement2.LoadUnfinishedSgf.checked ? true : false);
    this.m_oGameTree.Set_NavigatorLabel(this.HtmlElement2.NavigatorLabel.selectedIndex);
    this.m_oGameTree.Set_CycleThroughVariants(this.HtmlElement2.CycleThroughVariants.checked ? true : false);
    this.m_oGameTree.Set_LoadShowVariants(this.HtmlElement2.LoadShowVariants.selectedIndex);

    var oBoard     = this.m_oGameTree.Get_DrawingBoard();
    var oNavigator = this.m_oGameTree.Get_DrawingNavigator();

    if (oBoard && true === oSchemeChange.Board)
        oBoard.Update_Size(true);

    if (oNavigator && true === oSchemeChange.Navigator)
        oNavigator.Update_All();

    this.Close();
};
CDrawingSettingsWindow.prototype.private_CreateRadioButton = function(oParentElement, sName, sRadioIs, sRadioValue)
{
    var oMainElement = document.createElement("div");
    oMainElement.style.paddingLeft   = "10px";
    oMainElement.style.paddingBottom = "5px";
    oParentElement.appendChild(oMainElement);

    var oElement = document.createElement("input");
    oElement.type  = "radio";
    oElement.name  = sRadioIs;
    oElement.value = sRadioValue;
    oElement.setAttribute("id", sName);

    oMainElement.appendChild(oElement);

    var oSpan = document.createElement("span");
    oSpan.setAttribute("oncontextmenu", "return false;");
    oSpan.style.fontFamily  = "Tahoma, Sans serif";
    Common.Set_InnerTextToElement(oSpan, sRadioValue);
    oSpan.style.fontFamily          = "Tahoma, Sans serif";
    oSpan.style.fontSize            = "12pt";
    oSpan.style.height              = "15px";
    oSpan.style.lineHeight          = "15px";
    oSpan.style.cursor = "default";



    oMainElement.appendChild(oSpan);

    oSpan.addEventListener("click", function()
    {
        oElement.checked = true;
    }, false);

    return oElement;
};
CDrawingSettingsWindow.prototype.private_CreateCheckBox = function(oParentElement, sName, bChecked, sCheckboxName)
{
    var oMainElement = document.createElement("div");
    oMainElement.style.paddingLeft   = "10px";
    oMainElement.style.paddingBottom = "5px";
    oParentElement.appendChild(oMainElement);

    var oElement = document.createElement("input");
    oElement.type    = "checkbox";
    oElement.checked = bChecked;
    oElement.setAttribute("id", sName);

    oMainElement.appendChild(oElement);

    var oSpan = document.createElement("span");
    oSpan.setAttribute("oncontextmenu", "return false;");
    oSpan.style.fontFamily  = "Tahoma, Sans serif";
    Common.Set_InnerTextToElement(oSpan, sCheckboxName);
    oSpan.style.fontFamily          = "Tahoma, Sans serif";
    oSpan.style.fontSize            = "12pt";
    oSpan.style.height              = "15px";
    oSpan.style.lineHeight          = "15px";
    oSpan.style.cursor = "default";

    oMainElement.appendChild(oSpan);

    oSpan.addEventListener("click", function()
    {
        oElement.checked = !oElement.checked;
    }, false);

    return oElement;
};
CDrawingSettingsWindow.prototype.private_CreateSelect = function(oParentElement, sName, nSelectedIndex, aElements, sLabelText)
{
    var oMainElement = document.createElement("div");
    oMainElement.style.paddingLeft   = "10px";
    oMainElement.style.paddingBottom = "5px";

    oMainElement.style.fontFamily          = "Tahoma, Sans serif";
    oMainElement.style.fontSize            = "9pt";
    oMainElement.style.height              = "12px";
    oMainElement.style.lineHeight          = "12px";

    oParentElement.appendChild(oMainElement);

    var oLabel = document.createElement("div");
    Common.Set_InnerTextToElement(oLabel, sLabelText);
    oLabel.style.paddingBottom = "5px";
    oMainElement.appendChild(oLabel);

    var oSelect = document.createElement("select");
    oSelect.style.width = "170px";
    for (var nIndex = 0, nCount = aElements.length; nIndex < nCount; nIndex++)
    {
        var oOption = document.createElement("option");
        oOption.value = aElements[nIndex];
        Common.Set_InnerTextToElement(oOption, aElements[nIndex]);
        oSelect.appendChild(oOption);
    }
    oSelect.selectedIndex = nSelectedIndex;
    oMainElement.appendChild(oSelect);

    return oSelect;
};
CDrawingSettingsWindow.prototype.private_CheckColorTheme = function()
{
    var oBoardColorR = g_oGlobalSettings.m_oBoardPr.oBoardColor.r;

    if (231 === oBoardColorR)
    {
        // Simple or TrueColor
        if (g_oGlobalSettings.m_oBoardPr.bTrueColorBoard)
            this.HtmlElement2.Theme.TrueColor.checked = true;
        else
            this.HtmlElement2.Theme.SimpleColor.checked = true;
    }
    else if (255 === oBoardColorR)
    {
        this.HtmlElement2.Theme.BookStyle.checked = true;
    }
    else if (30 === oBoardColorR)
    {
        this.HtmlElement2.Theme.Dark.checked = true;
    }
    else
    {
        this.HtmlElement2.Theme.TrueColor.checked = true;
    }
};

function CDrawingScoreEstimateWindow()
{
    CDrawingScoreEstimateWindow.superclass.constructor.call(this);

    this.m_oDrawingBoard = null;
}

CommonExtend(CDrawingScoreEstimateWindow, CDrawingWindow);

CDrawingScoreEstimateWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingScoreEstimateWindow.superclass.Init.call(this, _sDivId, true);

    this.protected_UpdateSizeAndPosition(oPr.Drawing);

    this.m_oGameTree = oPr.GameTree;

    this.Set_Caption("Score estimate");

    var oMainDiv     = this.HtmlElement.InnerDiv;
    var oMainControl = this.HtmlElement.InnerControl;
    var sMainId      = this.HtmlElement.InnerDiv.id;

    oMainDiv.style.background = "url(\'" + g_sBackground + "\')";
    var oDrawingBoard = new CDrawingBoard();
    oMainControl.Set_Type(2, oDrawingBoard);

    var sBoard = sMainId + "B";
    var oBoardElement = this.protected_CreateDivElement(oMainDiv, sBoard);
    var oBoardControl = CreateControlContainer(sBoard);
    oBoardControl.Bounds.SetParams(0, 0, 1000, 1000, true, true, false, false, -1, -1);
    oBoardControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    oMainControl.AddControl(oBoardControl);

    this.m_oBoardDiv = oBoardElement;
    this.m_oBoardControl = oBoardControl;

    oDrawingBoard.Init(sBoard, this.m_oGameTree.Copy_ForScoreEstimate());
    oDrawingBoard.Set_EstimateMode(this);

    this.m_oDrawingBoard = oDrawingBoard;
};
CDrawingScoreEstimateWindow.prototype.Update_Size = function(bForce)
{
    CDrawingScoreEstimateWindow.superclass.Update_Size.call(this, bForce);

    if (this.m_oDrawingBoard)
        this.m_oDrawingBoard.Update_Size(bForce);
};
CDrawingScoreEstimateWindow.prototype.On_EstimateEnd = function(BlackReal, WhiteReal, BlackPotential, WhitePotential, nResult)
{
    var sCaption = "B " + BlackReal + "(" + BlackPotential + ") W " + WhiteReal + "(" + WhitePotential + ") " + (nResult > 0 ? "B+" + nResult : (nResult < 0 ? "W+" + Math.abs(nResult) : "Even"));
    this.Set_Caption(sCaption);
};
CDrawingScoreEstimateWindow.prototype.Show = function(oPr)
{
    while (this.m_oBoardDiv.firstChild)
        this.m_oBoardDiv.removeChild(this.m_oBoardDiv.firstChild);

    if (this.m_oBoardControl)
        this.m_oBoardControl.Clear();

    var oDrawingBoard = new CDrawingBoard();
    oDrawingBoard.Init(this.m_oBoardDiv.id, oPr.GameTree.Copy_ForScoreEstimate());
    oDrawingBoard.Set_EstimateMode(this);

    this.m_oDrawingBoard = oDrawingBoard;

    CDrawingScoreEstimateWindow.superclass.Show.apply(this, arguments);
    // Для перерисовки позиции
    this.Update_Size(true);
};

function CDrawingCountColorsWindow()
{
    CDrawingCountColorsWindow.superclass.constructor.call(this);
}

CommonExtend(CDrawingCountColorsWindow, CDrawingWindow);

CDrawingCountColorsWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingCountColorsWindow.superclass.Init.call(this, _sDivId, false);

    this.m_oGameTree     = oPr.GameTree;
    this.m_oDrawingBoard = oPr.DrawingBoard;

    this.protected_UpdateSizeAndPosition(oPr.Drawing);

    this.Set_Caption("Colors counter");

    var oMainDiv     = this.HtmlElement.InnerDiv;
    var oMainControl = this.HtmlElement.InnerControl;
    var sDivId       = this.HtmlElement.InnerDiv.id;

    oMainDiv.style.overflowX = "hidden";
    oMainDiv.style.overflowY = "scroll";

    var RowHeight   = 20;
    var TopOffset   = 10;
    var LineSpacing = 5;
    var BottomOffset = 10;

    var oColorsMap = oPr.DrawingBoard.m_oColorMarks;

    var Red = [0, 0, 0, 0], Green = [0, 0, 0, 0], Blue = [0, 0, 0, 0], Gray = [0, 0, 0, 0];
    var bRed = false, bGreen = false, bBlue = false, bGray = false;

    for (var oPos in oColorsMap)
    {
        var oColor = oColorsMap[oPos];
        var nNum = -1;

        if (0 !== oColor.r && 0 !== oColor.g && 0 !== oColor.b)
        {
            bGray = true;
            nNum = 3;
        }
        else if (0 !== oColor.r)
        {
            bRed = true;
            nNum = 0;
        }
        else if (0 !== oColor.g)
        {
            bGreen = true;
            nNum = 1;
        }
        else if (0 !== oColor.b)
        {
            bBlue = true;
            nNum = 2;
        }

        var Index = 0;
        if (oColor.a <= 50)
            Index = 0;
        else if (oColor.a <= 100)
            Index = 1;
        else if (oColor.a <= 150)
            Index = 2;
        else
            Index = 3;

        switch (nNum)
        {
            case 0: Red[Index]++; break;
            case 1: Green[Index]++; break;
            case 2: Blue[Index]++; break;
            case 3: Gray[Index]++; break;
        }
    }

    this.Red = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Red", "4 x " + Red[3] + "+ 3 x " + Red[2] + " + 2 x " + Red[1] + " + 1 x " + Red[0] + " =" + (4 * Red[3] + 3 * Red[2] + 2 * Red[1] + Red[0]), TopOffset, RowHeight);
    TopOffset += RowHeight + LineSpacing;
    this.Green = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Green", "4 x " + Green[3] + "+ 3 x " + Green[2] + " + 2 x " + Green[1] + " + 1 x " + Green[0] + " =" + (4 * Green[3] + 3 * Green[2] + 2 * Green[1] + Green[0]), TopOffset, RowHeight);
    TopOffset += RowHeight + LineSpacing;
    this.Blue = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Blue", "4 x " + Blue[3] + "+ 3 x " + Blue[2] + " + 2 x " + Blue[1] + " + 1 x " + Blue[0] + " =" + (4 * Blue[3] + 3 * Blue[2] + 2 * Blue[1] + Blue[0]), TopOffset, RowHeight);
    TopOffset += RowHeight + LineSpacing;
    this.Gray = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Gray", "4 x " + Gray[3] + "+ 3 x " + Gray[2] + " + 2 x " + Gray[1] + " + 1 x " + Gray[0] + " =" + (4 * Gray[3] + 3 * Gray[2] + 2 * Gray[1] + Gray[0]), TopOffset, RowHeight);
    TopOffset += RowHeight + LineSpacing;

    this.protected_CreateDivElement(oMainDiv, sDivId + "Bottom");
    var BottomControl = CreateControlContainer(sDivId + "Bottom");
    BottomControl.Bounds.SetParams(0, TopOffset, 1000, 1000, true, true, false, false, 0, BottomOffset);
    BottomControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
    oMainControl.AddControl(BottomControl);
};
CDrawingCountColorsWindow.prototype.private_CreateDivElement = function(oParentElement, sName, Height)
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
CDrawingCountColorsWindow.prototype.private_CreateInputElement = function(oParentElement, sName)
{
    var oElement = document.createElement("input");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oElement.setAttribute("type", "text");
    oElement.style.fontFamily  = "Tahoma, Sans serif";
    oElement.style.fontSize    = "10pt";
    oElement.style.outline     = "none";
    oElement.disabled = "disabled";

    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingCountColorsWindow.prototype.private_CreateInfoElement = function(oMainDiv, oMainControl, sDivId, sName, sValue, TopOffset, RowHeight, bCanEdit)
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
    Common.Set_InnerTextToElement(oNameElement, sName);

    var sValueId      = sNameId + "Value";
    var oValueElement = this.private_CreateInputElement(oMainDiv, sValueId, bCanEdit);
    var oValueControl = CreateControlContainer(sValueId);
    oValueControl.Bounds.SetParams(LeftOffset + LeftWidth, TopOffset + 1, RightOffset, 1000, true, true, true, false, -1, RowHeight - 2);
    oValueControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oValueControl);
    oValueElement.value = sValue;

    return oValueElement;
};
CDrawingCountColorsWindow.prototype.Show = function(oPr)
{
    CDrawingCountColorsWindow.superclass.Show.call(this, oPr);

    this.m_oGameTree     = oPr.GameTree;
    this.m_oDrawingBoard = oPr.DrawingBoard;

    this.Update();
};
CDrawingCountColorsWindow.prototype.Update = function(oPr)
{
    if (!this.Is_Visible())
        return;

    if (!this.m_oDrawingBoard)
        return;

    var oColorsMap = this.m_oDrawingBoard.m_oColorMarks;

    var Red = [0, 0, 0, 0], Green = [0, 0, 0, 0], Blue = [0, 0, 0, 0], Gray = [0, 0, 0, 0];
    var bRed = false, bGreen = false, bBlue = false, bGray = false;

    for (var oPos in oColorsMap)
    {
        var oColor = oColorsMap[oPos];
        var nNum = -1;

        if (0 !== oColor.r && 0 !== oColor.g && 0 !== oColor.b)
        {
            bGray = true;
            nNum = 3;
        }
        else if (0 !== oColor.r)
        {
            bRed = true;
            nNum = 0;
        }
        else if (0 !== oColor.g)
        {
            bGreen = true;
            nNum = 1;
        }
        else if (0 !== oColor.b)
        {
            bBlue = true;
            nNum = 2;
        }

        var Index = 0;
        if (oColor.a <= 50)
            Index = 0;
        else if (oColor.a <= 100)
            Index = 1;
        else if (oColor.a <= 150)
            Index = 2;
        else
            Index = 3;

        switch (nNum)
        {
        case 0: Red[Index]++; break;
        case 1: Green[Index]++; break;
        case 2: Blue[Index]++; break;
        case 3: Gray[Index]++; break;
        }
    }

    this.Red.value   = "4 x " + Red[3] + "+ 3 x " + Red[2] + " + 2 x " + Red[1] + " + 1 x " + Red[0] + " =" + (4 * Red[3] + 3 * Red[2] + 2 * Red[1] + Red[0]);
    this.Green.value = "4 x " + Green[3] + "+ 3 x " + Green[2] + " + 2 x " + Green[1] + " + 1 x " + Green[0] + " =" + (4 * Green[3] + 3 * Green[2] + 2 * Green[1] + Green[0]);
    this.Blue.value  = "4 x " + Blue[3] + "+ 3 x " + Blue[2] + " + 2 x " + Blue[1] + " + 1 x " + Blue[0] + " =" + (4 * Blue[3] + 3 * Blue[2] + 2 * Blue[1] + Blue[0]);
    this.Gray.value  = "4 x " + Gray[3] + "+ 3 x " + Gray[2] + " + 2 x " + Gray[1] + " + 1 x " + Gray[0] + " =" + (4 * Gray[3] + 3 * Gray[2] + 2 * Gray[1] + Gray[0]);
};
CDrawingCountColorsWindow.prototype.Get_DefaultWindowSize = function()
{
    return {W : 410, H : 160};
};

function CDrawingGifWriterWindow()
{
    CDrawingGifWriterWindow.superclass.constructor.call(this);

    this.m_oProgressSliderElement = null;
    this.m_oProgressValueElement  = null;
    this.m_oDrawing               = null;
    this.m_oGameTree              = null;
}

CommonExtend(CDrawingGifWriterWindow, CDrawingWindow);

CDrawingGifWriterWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingGifWriterWindow.superclass.Init.call(this, _sDivId, false);
    this.protected_UpdateSizeAndPosition(oPr.Drawing);

    this.Set_Caption("Creating Gif file...");

    if (oPr.GameTree)
        this.m_oGameTree = oPr.GameTree;

    var oMainDiv     = this.HtmlElement.InnerDiv;
    var oMainControl = this.HtmlElement.InnerControl;
    var sDivId       = this.HtmlElement.InnerDiv.id;

    var sProgressBack = sDivId + "PB";
    var oProgressBackElement = this.protected_CreateDivElement(oMainDiv, sProgressBack);
    var oProgressBackControl = CreateControlContainer(sProgressBack);
    oProgressBackControl.Bounds.SetParams(6, 30, 8, 8, true, true, true, true, -1,-1);
    oProgressBackControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    oMainControl.AddControl(oProgressBackControl);
    oProgressBackElement.style.border = "1px solid rgb(221,221,221)";
    oProgressBackElement.style.backgroundColor = "rgb(140, 140, 140)";

    var sProgress = sDivId + "P";
    var oProgressElement = this.protected_CreateDivElement(oMainDiv, sProgress);
    var oProgressControl = CreateControlContainer(sProgress);
    oProgressControl.Bounds.SetParams(7, 31, 0, 7, true, true, false, true, 10,-1);
    oProgressControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom);
    oMainControl.AddControl(oProgressControl);
    oProgressElement.style.backgroundColor = "rgb(54, 101, 179)";

    this.m_oProgressSliderElement = oProgressElement;

    var sDigitProgress = sDivId + "PV";
    var oDigitProgressElement = this.protected_CreateDivElement(oMainDiv, sDigitProgress);
    var oDigitProgressControl = CreateControlContainer(sDigitProgress);
    oDigitProgressControl.Bounds.SetParams(0, 7, 1000, 32, false, false, false, true, -1, -1);
    oDigitProgressControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom);
    oMainControl.AddControl(oDigitProgressControl);
    oDigitProgressElement.style.fontFamily  = "Tahoma, Sans serif";
    oDigitProgressElement.style.fontSize    = 20 * 15 / 20 + "px";
    oDigitProgressElement.style.lineHeight  = 20 + "px";
    oDigitProgressElement.style.height      = 20 + "px";
    oDigitProgressElement.style.color       = "rgb(0, 0, 0)";
    oDigitProgressElement.style.textAlign   = "center";

    this.m_oProgressValueElement = oDigitProgressElement;
};
CDrawingGifWriterWindow.prototype.Get_DefaultWindowSize = function()
{
    return {W : 240, H : 100};
};
CDrawingGifWriterWindow.prototype.On_Progress = function(Progress)
{
    var dWidth = 214;
    this.m_oProgressSliderElement.style.width = (Progress / 100 * dWidth) + "px";

    var dValue = (Progress * 100 | 0) / 100;
    Common.Set_InnerTextToElement(this.m_oProgressValueElement, dValue + "%");
};
CDrawingGifWriterWindow.prototype.On_Start = function()
{
    this.On_Progress(0);

    if (this.m_oDrawing)
        this.m_oDrawing.Disable();
};
CDrawingGifWriterWindow.prototype.On_End = function()
{
    this.On_Progress(100);

    var oThis = this;
    function Close()
    {
        oThis.Close(true);
    }

    // Закрываем окно не сразу, чтобы показать 100%
    setTimeout(Close, 300);
};
CDrawingGifWriterWindow.prototype.Close = function(bEnd)
{
    if (true !== bEnd)
    {
        if (this.m_oGameTree)
            this.m_oGameTree.Abort_DownloadGid();
    }

    if (this.m_oDrawing)
        this.m_oDrawing.Enable();

    CDrawingGifWriterWindow.superclass.Close.apply(this);
};

function CDrawingAboutWindow()
{
    CDrawingAboutWindow.superclass.constructor.call(this);

    this.m_oDrawingBoard = null;
}

CommonExtend(CDrawingAboutWindow, CDrawingWindow);

CDrawingAboutWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingGifWriterWindow.superclass.Init.call(this, _sDivId, true);
    this.protected_UpdateSizeAndPosition(oPr.Drawing);

    this.Set_Caption("About");

    this.m_oGameTree = oPr.GameTree;

    var oTabs = new CDrawingVerticalTabs();
    oTabs.Init(this.HtmlElement.InnerDiv.id, ["About Web Go Board", "Keyboard Shortcuts"], 0);

    this.private_InitAboutPage(oTabs.Get_TabContent(0));
    this.private_InitKeyBoardShortcutsPage(oTabs.Get_TabContent(1), oPr);
};
CDrawingAboutWindow.prototype.Get_DefaultWindowSize = function()
{
    if (this.m_oDrawing)
    {
        var nDrawingW = this.m_oDrawing.Get_Width();
        var nDrawingH = this.m_oDrawing.Get_Height();

        var nWindowW = Math.max(100, Math.min(700, nDrawingW * 0.9));
        var nWindowH = Math.max(100, Math.min(600, nDrawingH * 0.9));

        return {W : nWindowW, H : nWindowH};
    }

    return null;
};
CDrawingAboutWindow.prototype.private_InitAboutPage = function(oDiv)
{
    var oDivMainPart           = document.createElement("div");
    oDiv.appendChild(oDivMainPart);

    oDiv.style.overflowX  = "hidden";
    oDiv.style.overflowY  = "scroll";

    oDivMainPart.style.margin  = "0";
    oDivMainPart.style.padding = "10px 20px";

    oDivMainPart.style.fontFamily = "Tahoma, Arial, Verdana";
    oDivMainPart.style.fontSize   = "12px";
    oDivMainPart.style.color      = "#666";
    oDivMainPart.style.background = "#fff";

    var oLogo            = document.createElement("img");
    oLogo.src            = g_sLogo100;
    oLogo.width          = 100;
    oLogo.height         = 100;
    oLogo.style['float'] = "left";
    oDivMainPart.appendChild(oLogo);

    var oMargin            = document.createElement("div");
    oMargin.style.width    = "10px";
    oMargin.style.height   = "100px";
    oMargin.style['float'] = "left";
    oDivMainPart.appendChild(oMargin);

    var oHeading = document.createElement("h1");
    oDivMainPart.appendChild(oHeading);
    Common.Set_InnerTextToElement(oHeading, "Web Go/Baduk Board");

    var oVersion = document.createElement("div");
    oDivMainPart.appendChild(oVersion);
    Common.Set_InnerTextToElement(oVersion, "Version " + GoBoardApi.Get_Version());

    var oString              = document.createElement("div");
    oString.style.paddingTop = "40px";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "Visit our Github project for feedback and issue reports:");
    oString                  = document.createElement("a");
    oString.target           = "_blank";
    oString.href             = "https://github.com/IlyaKirillov/GoProject";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "https://github.com/IlyaKirillov/GoProject");

    oString                  = document.createElement("div");
    oString.style.paddingTop = "20px";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "Our site:");
    oString                  = document.createElement("a");
    oString.target           = "_blank";
    oString.href             = "http://webgoboard.org/";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "http://webgoboard.org/");

    oString                  = document.createElement("div");
    oString.style.paddingTop = "20px";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "Discussions:");
    oString                  = document.createElement("a");
    oString.target           = "_blank";
    oString.href             = "http://www.lifein19x19.com/forum/viewtopic.php?f=18&t=11239";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "http://www.lifein19x19.com/");
    oDivMainPart.appendChild(document.createElement("br"));
    oString                  = document.createElement("a");
    oString.target           = "_blank";
    oString.href             = "http://kido.com.ru/253-web-go-doska";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "http://kido.com.ru/");

    oString                  = document.createElement("div");
    oString.style.paddingTop = "20px";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "Browsers extension:");
    oString                  = document.createElement("a");
    oString.target           = "_blank";
    oString.href             = "https://chrome.google.com/webstore/detail/web-go-board/cdmhoehokaoghadonjfdbhieajggfbmd";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "Chrome and OperaNext");
    oDivMainPart.appendChild(document.createElement("br"));
    oString                  = document.createElement("a");
    oString.target           = "_blank";
    oString.href             = "https://addons.mozilla.org/ru/firefox/addon/web-gobaduk-board/";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "FireFox");

    oString                  = document.createElement("div");
    oString.style.paddingTop = "30px";
    oDivMainPart.appendChild(oString);
    Common.Set_InnerTextToElement(oString, "© Ilya Kirillov, 2014-2015. All rights reserved.");
};
CDrawingAboutWindow.prototype.private_InitKeyBoardShortcutsPage = function(oDiv, oPr)
{
    var oMainDiv = oDiv;
    oMainDiv.style.overflowX = "hidden";
    oMainDiv.style.overflowY = "scroll";

    var oDivMainPart = document.createElement("div");
    oMainDiv.appendChild(oDivMainPart);
    oDivMainPart.style.margin  = "0";
    oDivMainPart.style.padding = "10px 20px";

    oDivMainPart.style.fontFamily = "Tahoma, Arial, Verdana";
    oDivMainPart.style.fontSize   = "12px";
    oDivMainPart.style.color      = "#666";
    oDivMainPart.style.background = "#fff";

    var oHeading = document.createElement("h1");
    oDivMainPart.appendChild(oHeading);
    Common.Set_InnerTextToElement(oHeading, "Keyboard Shortcuts");
    oHeading.style.fontSize   = "16px";
    oHeading.style.fontWeight = "bold";

    var oTable = document.createElement("table");
    oDivMainPart.appendChild(oTable);
    oTable.style.margin = "20px 0";
    oTable.style.width  = "100%";

    var oTBody = document.createElement("tbody");
    oTable.appendChild(oTBody);

    this.m_oDrawingBoard = null;
    if (oPr.GameTree)
        this.m_oDrawingBoard = oPr.GameTree.Get_DrawingBoard();

    this.private_AppendTableHeading1(oTBody,     "Working with Files");

    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 79, ShiftKey : false}, "Open Sgf/Gib/Ngf",                  "Ctrl+O",                                        "Open the Sgf/Gib/Ngf file from disk. (Not in color mode, see below)");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 79, ShiftKey : true }, "Open Sgf",                          "Ctrl+Shift+O",                                  "Open the Sgf file from source. (Not in color mode, see below)");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 67, ShiftKey : false}, "Create new",                        "Ctrl+C",                                        "Create new empty board. (not in color mode see below)");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 83, ShiftKey : false}, "Save Sgf",                          "Ctrl+S",                                        "Save Sgf file.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 72, ShiftKey : false}, "Save png shot",                     "Ctrl+H",                                        "Save board shot in png format.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 72, ShiftKey : true }, "Save gif shot",                     "Ctrl+Shift+H",                                  "Save board shot in gif format.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 73, ShiftKey : false}, "Save multipage gif file.",          "Ctrl+I",                                        "Save gif file for current variant.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 73, ShiftKey : true }, "Save multipage gif file.",          "Ctrl+Shift+I",                                  "Save gif file for all branches with comment RIGHT (for problem mode).");

    this.private_AppendTableHeading1(oTBody,     "Navigation");

    this.private_AppendTableCommonString(oTBody, {CtrlKey : false, KeyCode : 39, ShiftKey : false}, "Next node",                         "Right arrow",                                   "Jump to next node.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 39, ShiftKey : false}, "Next 5 node",                       "Ctrl+Right arrow",                              "Jump over 5 nodes.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 39, ShiftKey : true }, "End of the variant",                "Ctrl+Shift+Right arrow",                        "Jump to the end of the current variant.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : false, KeyCode : 37, ShiftKey : false}, "Previous node",                     "Left arrow",                                    "Jump to previous node.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 37, ShiftKey : false}, "Previous 5 node",                   "Shift+Left arrow",                              "Jump back over 5 nodes.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 37, ShiftKey : true }, "Start of the file",                 "Ctrl+Shift+Right arrow",                        "Jump to the start of the file.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : false, KeyCode : 38, ShiftKey : false}, "Previous variant",                  "Up arrow",                                      "Jump to previous variant.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : false, KeyCode : 40, ShiftKey : false}, "Next variant",                      "Down arrow",                                    "Jump to next variant.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey :  true, KeyCode : 36, ShiftKey :  true}, "Start node",                        "Ctrl+Shift+Home",                               "Jump to the start node of the file. This node can be different from the first node. See \"load unfinished files\" checkbox in settings.");

    this.private_AppendTableHeading2(oTBody, {CtrlKey : false, KeyCode : 112, ShiftKey : false},    "Play mode", "F1");

    this.private_AppendTableCommonString(oTBody, {},                                                "Add move",                          "Left mouse click",                              "Set sequentially stones.");
    this.private_AppendTableCommonString(oTBody, {},                                                "Add alternative move",              "Right mouse click",                             "Create new brunch and add alternative move.");
    this.private_AppendTableCommonString(oTBody, {},                                                "Go to the point",                   "Shift+Left mouse click onto a board position",  "Teleports you to the moment of the game forth or back, when the stone on this position has been played.");
    this.private_AppendTableCommonString(oTBody, {},                                                "Change move order",                 "Ctrl+Shift+Left mouse click",                   "When sequentially stones are entered: changes the colour of the next stone to be set. What stone will appear on the board is shown by the tools field (useful e.g. after a problem has been set up).");
    this.private_AppendTableCommonString(oTBody, {},                                                "Add comment with coordinates",      "Ctrl+Left mouse click",                         "Add comment with coordinates.");

    this.private_AppendTableHeading2(oTBody, {CtrlKey : false, KeyCode : 113, ShiftKey : false},    "Count scores", "F2");

    this.private_AppendTableCommonString(oTBody, {},                                                "Mark dead groups",                  "Left mouse click",                              "Mark dead groups.");
    this.private_AppendTableCommonString(oTBody, {},                                                "End count scores",                  "Ctrl+Left mouse click onto board",              "Return to play mode.");

    this.private_AppendTableHeading2(oTBody, {CtrlKey : false, KeyCode : 114, ShiftKey : false},    "Set up a board position", "F3");

    this.private_AppendTableCommonString(oTBody, {},                                                "Add black stone or remove stone",   "Left mouse click",                              "Add black stone or remove stone.");
    this.private_AppendTableCommonString(oTBody, {},                                                "Add white stone or remove stone",   "Shift+Left mouse click",                        "Add white stone or remove stone.");

    this.private_AppendTableHeading3(oTBody, {CtrlKey : false, KeyCode : 115, ShiftKey : false},    "Triangles",                         "F4",                                           "Add triangles.");
    this.private_AppendTableHeading3(oTBody, {CtrlKey : false, KeyCode : 116, ShiftKey : false},    "Squares",                           "F5",                                           "Add squares.");
    this.private_AppendTableHeading3(oTBody, {CtrlKey : false, KeyCode : 117, ShiftKey : false},    "Circles",                           "F6",                                           "Add circles.");
    this.private_AppendTableHeading3(oTBody, {CtrlKey : false, KeyCode : 118, ShiftKey : false},    "X mark",                            "F7",                                           "Add \"X\" mark.");

    this.private_AppendTableHeading2(oTBody, {CtrlKey : false, KeyCode : 119, ShiftKey : false},    "Text label", "F8");
    this.private_AppendTableCommonString(oTBody, {},                                                "Letter",                            "Left mouse click",                             "Add letter.");
    this.private_AppendTableCommonString(oTBody, {},                                                "Text",                              "Shift+Left mouse click",                       "Add text entered by the user.");
    this.private_AppendTableHeading2(oTBody, {CtrlKey : false, KeyCode : 120, ShiftKey : false},    "Numeric label", "F9");
    this.private_AppendTableCommonString(oTBody, {},                                                "Number",                            "Left mouse click",                             "Add the smallest positive number.");
    this.private_AppendTableCommonString(oTBody, {},                                                "Move number",                       "Shift+Left mouse click",                       "Add number of the first move which was played here.");
    this.private_AppendTableHeading2(oTBody, {CtrlKey : false, KeyCode : 121, ShiftKey : false},    "Color mode", "F10");
    this.private_AppendTableCommonString(oTBody, {},                                                "Blue region",                       "Left mouse click",                             "Add blue region.");
    this.private_AppendTableCommonString(oTBody, {},                                                "Green region",                      "Shift+Left mouse click",                       "Add green region.");
    this.private_AppendTableCommonString(oTBody, {},                                                "Red region",                        "Ctrl+Left mouse click",                        "Add red region.");
    this.private_AppendTableCommonString(oTBody, {},                                                "Gray region",                       "Ctrl+Shift+Left mouse click",                  "Add gray region.");
    this.private_AppendTableCommonString(oTBody, {},                                                "Clear region",                      "Right mouse click",                            "Clear region.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true, KeyCode : 67, ShiftKey : false},  "Continue",                          "Ctrl+C",                                       "Copy all colors from previous node.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true, KeyCode : 79, ShiftKey : false},  "Count colors",                      "Ctrl+O",                                       "Count all colors with depth.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true, KeyCode : 82, ShiftKey : false},  "Clear colors",                      "Ctrl+R",                                       "Clear all colors in the current node.");
    this.private_AppendTableHeading1(oTBody, "Miscellaneous");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : false, KeyCode :  8, ShiftKey : false}, "Remove node",                       "Backspace/Delete",                             "Deletes the current node and all of the following brunches.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 69, ShiftKey : false}, "Score estimator",                   "Ctrl+E",                                       "Show window with score estimator (you can mark dead groups by click on them).");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 86, ShiftKey : false}, "View mode change of the next move", "Ctrl+V",                                       "There are 3 mods: Show all next move variants, show all alternative variants of the current move, show nothing.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 82, ShiftKey : false}, "Show/Hide coordinates",             "Ctrl+R",                                       "Show/Hide coordinates. (Not in color mode, see above)");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 77, ShiftKey : true }, "Make the current variant mainly",   "Ctrl+Shift+M",                                 "Make the current variant mainly by uplifting it to the root of the game tree.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 85, ShiftKey : true }, "Lift up the current variant",       "Ctrl+Shift+U",                                 "Lift up the current variant.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 68, ShiftKey : true }, "Lower down the current variant",    "Ctrl+Shift+D",                                 "Lower down the current variant.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 86, ShiftKey : true }, "Setting up view port",              "Ctrl+Shift+V",                                 "Setting up visible part of the board.");
    this.private_AppendTableCommonString(oTBody, {CtrlKey : true,  KeyCode : 68, ShiftKey : false}, "Ascii Diagram",                     "Ctrl+D",                                       "Make ascii diagram by current position.");
};
CDrawingAboutWindow.prototype.private_AppendTR = function(oTBody)
{
    var oTr = document.createElement("tr");
    oTBody.appendChild(oTr);

    oTr.style.borderLeft     = "0";
    oTr.style.borderRight    = "0";
    oTr.style.borderBottom   = "solid 1px #E4E4E4";
    oTr.style.borderCollapse = "collapse";
    oTr.style.padding        = "8px";
    oTr.style.fontSize       = "12px";
    oTr.style.textAlign      = "left";
    oTr.style.cursor         = "default";

    return oTr;
};
CDrawingAboutWindow.prototype.private_AppendTD = function(oTR, sText)
{
    var oTd = document.createElement("td");
    oTR.appendChild(oTd);
    Common.Set_InnerTextToElement(oTd, sText);

    oTd.style.borderLeft     = "0";
    oTd.style.borderRight    = "0";
    oTd.style.borderBottom   = "solid 1px #E4E4E4";
    oTd.style.borderCollapse = "collapse";
    oTd.style.padding        = "8px";
    oTd.style.fontSize       = "12px";
    oTd.style.textAlign      = "left";
    oTd.style.cursor         = "default";

    return oTd;
};
CDrawingAboutWindow.prototype.private_SetEventListener = function(oElement, oEventPr)
{
    var oDrawingBoard = this.m_oDrawingBoard;
    if (oDrawingBoard && oEventPr.KeyCode)
    {
        oElement.title = "Click to do it";
        oElement.style.cursor = "pointer";
        oElement.style.textDecoration = "underline";
        oElement.addEventListener("click", function()
        {
            oDrawingBoard.private_HandleKeyDown(oEventPr);
        }, false);
    }
};
CDrawingAboutWindow.prototype.private_AppendTableHeading1 = function(oTBody, sText)
{
    var oTr = this.private_AppendTR(oTBody);
    var oTd = this.private_AppendTD(oTr, sText);
    oTd.colSpan = "3";

    oTd.style.fontSize   = "14px";
    oTd.style.fontWeight = "bold";
    oTd.style.paddingTop = "20px";
};
CDrawingAboutWindow.prototype.private_AppendTableHeading2 = function(oTBody, oEventPr, sText1, sText2)
{
    var oTr = this.private_AppendTR(oTBody);
    var oTd1 = this.private_AppendTD(oTr, sText1);
    oTd1.style.fontWeight = "bold";
    var oTd2 = this.private_AppendTD(oTr, sText2);
    this.private_SetEventListener(oTd2, oEventPr);
    oTd2.colSpan = "2";
};
CDrawingAboutWindow.prototype.private_AppendTableHeading3 = function(oTBody, oEventPr, sText1, sText2, sText3)
{
    var oTr = this.private_AppendTR(oTBody);
    this.private_AppendTD(oTr, sText1).style.fontWeight = "bold";
    var oTd = this.private_AppendTD(oTr, sText2);
    this.private_SetEventListener(oTd, oEventPr);
    this.private_AppendTD(oTr, sText3);
};
CDrawingAboutWindow.prototype.private_AppendTableCommonString = function(oTBody, oEventPr, sText1, sText2, sText3)
{
    var oTr = this.private_AppendTR(oTBody);
    this.private_AppendTD(oTr, sText1).style.width = "35%";
    var oTd = this.private_AppendTD(oTr, sText2);
    oTd.style.width = "15%";
    this.private_SetEventListener(oTd, oEventPr);
    this.private_AppendTD(oTr, sText3).style.width = "50%";
};

function CDrawingDiagramSLWindow()
{
    CDrawingDiagramSLWindow.superclass.constructor.call(this);

    this.m_oTextArea = null;
}

CommonExtend(CDrawingDiagramSLWindow, CDrawingWindow);

CDrawingDiagramSLWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingDiagramSLWindow.superclass.Init.call(this, _sDivId, true);

    this.Set_Caption("Ascii Diagram");

    var oMainDiv     = this.HtmlElement.InnerDiv;
    var oMainControl = this.HtmlElement.InnerControl;
    var sDivId       = this.HtmlElement.InnerDiv.id;

    this.m_oGameTree = oPr.GameTree;

    this.private_CreateInfoAreaElement(oMainDiv, oMainControl, sDivId);
    this.private_FillTextArea(oPr.GameTree);
    this.m_oTextArea.select();
};
CDrawingDiagramSLWindow.prototype.Show = function(oPr)
{
    CDrawingDiagramSLWindow.superclass.Show.call(this, oPr);
    this.private_FillTextArea(oPr.GameTree);
    this.m_oTextArea.select();
};
CDrawingDiagramSLWindow.prototype.private_CreateInfoAreaElement = function(oMainDiv, oMainControl, sDivId)
{
    var oElement   = document.createElement("textarea");
    var sElementId = sDivId + "TA";
    oElement.setAttribute("id", sElementId);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oElement.style.fontFamily  = "Courier New, monospacef";
    oElement.style.fontSize    = "10pt";
    oElement.style.resize      = "none";
    oElement.style.outline     = "none";
    oElement.style.border      = "1px solid rgb(169,169,169)";
    oElement.style.height      = "100%";
    oElement.style.width       = "100%";
    this.m_oTextArea = oElement;

    oMainDiv.appendChild(oElement);

    var oControl = CreateControlContainer(sElementId);
    oControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
    oControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
    oMainControl.AddControl(oControl);

    return oElement;
};
CDrawingDiagramSLWindow.prototype.private_FillTextArea = function(oGameTree)
{
    this.m_oTextArea.value = "";

    if (undefined === oGameTree)
        return;

    var oDrawingBoard = oGameTree.Get_DrawingBoard();
    var oLogicBoard   = oGameTree.Get_Board();

    if (!oDrawingBoard || !oLogicBoard)
        return;

    var sDiagram = "";

    var nSizeX = oLogicBoard.Get_Size().X;
    var nSizeY = oLogicBoard.Get_Size().Y;
    var oViewPort = oDrawingBoard.Get_ViewPort();
    var X0 = oViewPort.X0;
    var Y0 = oViewPort.Y0;
    var X1 = oViewPort.X1;
    var Y1 = oViewPort.Y1;

    // Определяем какие границы нам нужны
    var bLeft   = (0 == X0 ? true : false);
    var bRight  = (nSizeX - 1 == X1 ? true : false);
    var bTop    = (0 == Y0 ? true : false);
    var bBottom = (nSizeY - 1 == Y1 ? true : false);

    // Определяем очередность хода и нумерацию

    var arrNumbers = [];
    for (var nY = Y0; nY < Y1; nY++)
    {
        for (var nX = X0; nX < X1; nX++)
        {
            var Mark  = oDrawingBoard.Get_Mark(nX + 1, nY + 1);
            var MarkType = (null != Mark ? Mark.Get_Type() : EDrawingMark.Lm);
            var MarkText = (null != Mark ? Mark.Get_Text() : "");

            if (MarkType == EDrawingMark.Tx && Common_IsInt(MarkText))
            {
                var nValue = parseInt(MarkText);
                var oElement =
                {
                    Number : nValue,
                    Value  : oLogicBoard.Get(nX + 1, nY + 1)
                };

                if (BOARD_EMPTY != oElement.Value)
                    arrNumbers.push(oElement);
            }
        }
    }

    var bBlackFirst  = true;
    var bCoordinates = oDrawingBoard.Get_Rulers();
    var nFirstMove = -1;
    if (arrNumbers.length > 0)
    {
        var nMin = -1, nMinValue = BOARD_EMPTY;
        var nMax = -1;
        for (var nIndex = 0, nCount = arrNumbers.length; nIndex < nCount; nIndex++)
        {
            var oElement = arrNumbers[nIndex];

            if (-1 == nMin || oElement.Number < nMin)
            {
                nMin      = oElement.Number;
                nMinValue = oElement.Value;
            }

            if (-1 == nMax || oElement.Number > nMax)
                nMax      = oElement.Number;
        }

        if (nMax - nMin < 10)
        {
            var bValid = true;
            for (var nIndex = 0, nCount = arrNumbers.length; nIndex < nCount; nIndex++)
            {
                var oElement = arrNumbers[nIndex];

                var nOst = (oElement.Number - nMin) % 2;
                if ((0 == nOst && nMinValue != oElement.Value) ||
                    (1 == nOst && nMinValue == oElement.Value))
                {
                    bValid = false;
                    break;
                }
            }

            if (true === bValid)
            {
                nFirstMove = nMin;
                if (BOARD_BLACK === nMinValue)
                    bBlackFirst = true;
                else
                    bBlackFirst = false;
            }
        }
    }

    var sVerticalLine = bLeft ? "$$  --" : "$$ -";
    for (var nX = X0 + 1; nX <= X1; nX++)
        sVerticalLine += "--";
    sVerticalLine += bRight ? "- \n" : "\n";

    var sLineStart = bLeft ? "$$ |" : "$$";
    var sLineEnd   = bRight ? " |\n" : "\n";

    // Header
    if (bBlackFirst)
        sDiagram += "$$B";
    else
        sDiagram += "$$W";

    if (bCoordinates)
        sDiagram += "c";

    if (-1 != nFirstMove)
        sDiagram += "m" + nFirstMove;

    sDiagram += '\n';

    // enf of header

    if (bTop)
        sDiagram += sVerticalLine;

    for (var nY = Y0; nY <= Y1; nY++)
    {
        sDiagram += sLineStart;
        for (var nX = X0; nX <= X1; nX++)
        {
            var Mark  = oDrawingBoard.Get_Mark(nX + 1, nY + 1);
            var MarkType = (null != Mark ? Mark.Get_Type() : EDrawingMark.Lm);
            var MarkText = (null != Mark ? Mark.Get_Text() : "");
            var Value = oLogicBoard.Get(nX + 1, nY + 1);

            if (BOARD_EMPTY == Value)
            {
                if (EDrawingMark.Tr === MarkType)
                    sDiagram += " T";
                else if (EDrawingMark.Cr === MarkType)
                    sDiagram += " C";
                else if (EDrawingMark.Sq === MarkType)
                    sDiagram += " S";
                else if (EDrawingMark.X === MarkType)
                    sDiagram += " M";
                else if (EDrawingMark.Tx === MarkType && 1 === MarkText.length && 97 <= MarkText.charCodeAt(0) && MarkText.charCodeAt(0) <= 122)
                    sDiagram += String.fromCharCode(0x20, MarkText.charCodeAt(0));
                else if (EDrawingMark.Tx === MarkType && 1 === MarkText.length && 65 <= MarkText.charCodeAt(0) && MarkText.charCodeAt(0) <= 90)
                    sDiagram += String.fromCharCode(0x20, MarkText.charCodeAt(0) + 0x20);
                else
                {
                    if (oLogicBoard.Is_HandiPoint(nX + 1, nY + 1))
                        sDiagram += " ,";
                    else
                        sDiagram += " .";
                }
            }
            else
            {
                if (-1 !== nFirstMove && MarkType == EDrawingMark.Tx && Common_IsInt(MarkText))
                {
                    var nValue = parseInt(MarkText) - nFirstMove + 1;

                    if (10 == nValue)
                        sDiagram += ' 0';
                    else
                        sDiagram += ' ' + nValue;
                }
                else if (BOARD_BLACK == Value)
                {
                    if (EDrawingMark.Tr === MarkType)
                        sDiagram += " Y";
                    else if (EDrawingMark.Cr === MarkType)
                        sDiagram += " B";
                    else if (EDrawingMark.Sq === MarkType)
                        sDiagram += " #";
                    else if (EDrawingMark.X === MarkType)
                        sDiagram += " Z";
                    else
                        sDiagram += " X";
                }
                else if (BOARD_WHITE == Value)
                {
                    if (EDrawingMark.Tr === MarkType)
                        sDiagram += " Q";
                    else if (EDrawingMark.Cr === MarkType)
                        sDiagram += " W";
                    else if (EDrawingMark.Sq === MarkType)
                        sDiagram += " @";
                    else if (EDrawingMark.X === MarkType)
                        sDiagram += " P";
                    else
                        sDiagram += " O";
                }
            }
        }
        sDiagram += sLineEnd;
    }

    if (bBottom)
        sDiagram += sVerticalLine;

    this.m_oTextArea.value = sDiagram;
};

function CDrawingViewPortWindow()
{
    CDrawingViewPortWindow.superclass.constructor.call(this);
}

CommonExtend(CDrawingViewPortWindow, CDrawingConfirmWindow);

CDrawingViewPortWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingViewPortWindow.superclass.Init.call(this, _sDivId, true);

    this.protected_UpdateSizeAndPosition(oPr.Drawing);

    this.m_oGameTree = oPr.GameTree;
    this.m_oDrawing  = oPr.Drawing;

    this.Set_Caption("Setting up view port...");

    var oMainDiv     = this.HtmlElement.ConfirmInnerDiv;
    var oMainControl = this.HtmlElement.ConfirmInnerControl;
    var sMainId      = this.HtmlElement.ConfirmInnerDiv.id;

    oMainDiv.style.background = "url(\'" + g_sBackground + "\')";
    var oDrawingBoard = new CDrawingBoard();
    oMainControl.Set_Type(2, oDrawingBoard);

    var sBoard = sMainId + "B";
    var oBoardElement = this.protected_CreateDivElement(oMainDiv, sBoard);
    var oBoardControl = CreateControlContainer(sBoard);
    oBoardControl.Bounds.SetParams(0, 0, 1000, 1000, true, true, false, false, -1, -1);
    oBoardControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    oMainControl.AddControl(oBoardControl);

    this.m_oBoardDiv = oBoardElement;
    this.m_oBoardControl = oBoardControl;

    oDrawingBoard.Init(sBoard, this.m_oGameTree.Copy_ForScoreEstimate());
    oDrawingBoard.Set_ViewPortMode(this);

    this.m_oDrawingBoard = oDrawingBoard;
};
CDrawingViewPortWindow.prototype.Update_Size = function(bForce)
{
    CDrawingViewPortWindow.superclass.Update_Size.call(this, bForce);

    if (this.m_oDrawingBoard)
        this.m_oDrawingBoard.Update_Size(bForce);
};
CDrawingViewPortWindow.prototype.Show = function(oPr)
{
    while (this.m_oBoardDiv.firstChild)
        this.m_oBoardDiv.removeChild(this.m_oBoardDiv.firstChild);

    if (this.m_oBoardControl)
        this.m_oBoardControl.Clear();

    var oDrawingBoard = new CDrawingBoard();
    oDrawingBoard.Init(this.m_oBoardDiv.id, oPr.GameTree.Copy_ForScoreEstimate());
    oDrawingBoard.Set_ViewPortMode(this);

    this.m_oDrawingBoard = oDrawingBoard;

    CDrawingViewPortWindow.superclass.Show.apply(this, arguments);
    // Для перерисовки позиции
    this.Update_Size(true);
};
CDrawingViewPortWindow.prototype.Handle_OK = function()
{
    if (this.m_oGameTree)
    {
        var oDrawingBoard = this.m_oGameTree.Get_DrawingBoard();
        if (oDrawingBoard)
        {
            var oViewPort = this.m_oDrawingBoard.Get_SelectedViewPort();

            if (oViewPort.X1 === oViewPort.X0 && oViewPort.Y1 === oViewPort.Y0)
                oDrawingBoard.Reset_ViewPort();
            else if (oViewPort.X1 - oViewPort.X0 < 3 || oViewPort.Y1 - oViewPort.Y0 < 3)
            {
                var oGameTree = this.m_oGameTree;
                var oDrawing  = this.m_oDrawing;
                if (oDrawing)
                    CreateWindow(oDrawing.Get_MainDiv().id, EWindowType.Error, {GameTree : oGameTree, Drawing : oDrawing, ErrorText : "Sorry, viewport can't be so small.", W : 270, H : 80});

                return;
            }
            else
                oDrawingBoard.Set_ViewPort(oViewPort.X0 - 1, oViewPort.Y0 - 1, oViewPort.X1 - 1, oViewPort.Y1 - 1);

            this.m_oDrawing.Update_Size(true);
        }
    }

    this.Close();
};

function CDrawingCreateNewWindow()
{
    CDrawingCreateNewWindow.superclass.constructor.call(this);
}

CommonExtend(CDrawingCreateNewWindow, CDrawingConfirmWindow);

CDrawingCreateNewWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingViewPortWindow.superclass.Init.call(this, _sDivId, false);

    this.protected_UpdateSizeAndPosition(oPr.Drawing);

    this.m_oGameTree = oPr.GameTree;
    this.m_oDrawing  = oPr.Drawing;

    this.Set_Caption("Create new");

    var oMainDiv     = this.HtmlElement.ConfirmInnerDiv;
    var oMainControl = this.HtmlElement.ConfirmInnerControl;
    var sDivId       = this.HtmlElement.ConfirmInnerDiv.id;

    var RowHeight   = 20;
    var LineSpacing = 5;
    var TopOffset   = 5;

    this.BlackPlayer = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Black", "Black", TopOffset, RowHeight);
    TopOffset += 2 * (RowHeight + LineSpacing);
    this.WhitePlayer = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "White", "White", TopOffset, RowHeight);
    TopOffset += 2 * (RowHeight + LineSpacing);
    this.BoardSize = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Board size", "19", TopOffset, RowHeight);
    TopOffset += 2 * (RowHeight + LineSpacing);
    this.Handicap = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Handicap", "0", TopOffset, RowHeight);
    TopOffset += 2 * (RowHeight + LineSpacing);
    this.Komi = this.private_CreateInfoElement(oMainDiv, oMainControl, sDivId, "Komi", "6.5", TopOffset, RowHeight);
};
CDrawingCreateNewWindow.prototype.private_CreateDivElement = function(oParentElement, sName, Height)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oElement.style.fontFamily  = "Tahoma, Sans serif";
    oElement.style.fontSize    = Height * 15 / 20 + "px";
    oElement.style.lineHeight  = Height + "px";
    oElement.style.height      = Height + "px";
    oElement.style.fontWeight  = 550;

    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingCreateNewWindow.prototype.private_CreateInputElement = function(oParentElement, sName)
{
    var oElement = document.createElement("input");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oElement.setAttribute("type", "text");
    oElement.style.fontFamily  = "Tahoma, Sans serif";
    oElement.style.fontSize    = "10pt";
    oElement.style.outline     = "none";
    oElement.style.border      = "1px solid rgb(169,169,169)";

    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingCreateNewWindow.prototype.private_CreateInfoElement = function(oMainDiv, oMainControl, sDivId, sName, sValue, TopOffset, RowHeight)
{
    var LeftOffset = 10;
    var RightOffset = 10;

    var sNameId      = sDivId + sName;
    var oNameElement = this.private_CreateDivElement(oMainDiv, sNameId, RowHeight);
    var oNameControl = CreateControlContainer(sNameId);
    oNameControl.Bounds.SetParams(LeftOffset + 10, TopOffset, RightOffset, 1000, true, true, false, false, -1, RowHeight);
    oNameControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oNameControl);
    Common.Set_InnerTextToElement(oNameElement, sName);

    TopOffset += RowHeight;

    var sValueId      = sNameId + "Value";
    var oValueElement = this.private_CreateInputElement(oMainDiv, sValueId);
    var oValueControl = CreateControlContainer(sValueId);
    oValueControl.Bounds.SetParams(LeftOffset, TopOffset + 1, RightOffset, 1000, true, true, true, false, -1, RowHeight - 2);
    oValueControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
    oMainControl.AddControl(oValueControl);
    oValueElement.value = sValue;

    return oValueElement;
};
CDrawingCreateNewWindow.prototype.Get_DefaultWindowSize = function()
{
    return {W : 195, H : 340};
};
CDrawingCreateNewWindow.prototype.Handle_OK = function()
{
    var sSize = this.BoardSize.value;
    var nSizeX = 19;
    var nSizeY = 19;
    var nPos = -1;
    if (-1 == (nPos = sSize.indexOf(":")))
    {
        nSizeX = Math.min(52, Math.max(parseInt(sSize), 2));
        nSizeY = nSizeX;
    }
    else
    {
        nSizeX = parseInt(sSize.substr(0, nPos));
        nSizeY = parseInt(sSize.substr(nPos + 1, sSize.length - nPos - 1));
    }

    if (isNaN(nSizeX) || nSizeX < 2 || nSizeX > 52
        || isNaN(nSizeY) || nSizeY < 2 || nSizeY > 52)
    {
        CreateWindow(this.m_oDrawing.Get_MainDiv().id, EWindowType.Error, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing, ErrorText : "Size value must be an integer number from 2 to 52, or pair of such numbers separated by ':' character.", W : 300, H : 115});
        return;
    }

    var nHandi = parseInt(this.Handicap.value);
    if (isNaN(nHandi) || nHandi < 0 || nHandi > 9)
    {
        CreateWindow(this.m_oDrawing.Get_MainDiv().id, EWindowType.Error, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing, ErrorText : "Handicap value must be an integer number from 0 to 9.", W : 300, H : 95});
        return;
    }

    if (0 != nHandi && (nSizeY <= 6 || nSizeX <= 6 || nSizeX !== nSizeY))
    {
        CreateWindow(this.m_oDrawing.Get_MainDiv().id, EWindowType.Error, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing, ErrorText : "Handicap value must be 0 for this board size.", W : 300, H : 95});
        return;
    }

    if (nHandi > 5 && (nSizeX <= 10 || nSizeY <= 10))
    {
        CreateWindow(this.m_oDrawing.Get_MainDiv().id, EWindowType.Error, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing, ErrorText : "Handicap value must be an integer number from 0 to 5 for this board size.", W : 300, H : 95});
        return;
    }

    var fKomi = parseFloat(this.Komi.value);
    if (isNaN(fKomi) || Math.abs((2 * fKomi) - (2 * fKomi | 0)) > 0.001)
    {
        CreateWindow(this.m_oDrawing.Get_MainDiv().id, EWindowType.Error, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing, ErrorText : "Invalid komi value.", W : 175, H : 85});
        return;
    }

    if (this.m_oGameTree)
    {
        var sSGF = "(;FF[4]";
        sSGF += "SZ[" + (nSizeX === nSizeY ? nSizeX : nSizeX + ":" + nSizeY) + "]";
        sSGF += "KM[" + fKomi + "]";
        sSGF += "PB[" + this.BlackPlayer.value + "]";
        sSGF += "PW[" + this.WhitePlayer.value + "]";
        sSGF += "HA[" + nHandi + "]";

        var aHandiPoints = [];

        if (nSizeX === nSizeY)
        {
            var nSize = nSizeX;
            var nVal0 = (nSize < 10 ? 2 : 3);
            var nVal1 = ((nSize + 1) / 2 | 0) - 1;
            var nVal2 = (nSize < 10 ? nSize - 3 : nSize - 4);

            switch (nHandi)
            {
            case 2:
            {
                aHandiPoints.push([nVal2, nVal0]);
                aHandiPoints.push([nVal0, nVal2]);
                break;
            }
            case 3:
            {
                aHandiPoints.push([nVal2, nVal2]);
                aHandiPoints.push([nVal0, nVal2]);
                aHandiPoints.push([nVal2, nVal0]);
                break;
            }
            case 4:
            {
                aHandiPoints.push([nVal0, nVal0]);
                aHandiPoints.push([nVal2, nVal2]);
                aHandiPoints.push([nVal0, nVal2]);
                aHandiPoints.push([nVal2, nVal0]);
                break;
            }
            case 5:
            {
                aHandiPoints.push([nVal0, nVal0]);
                aHandiPoints.push([nVal0, nVal2]);
                aHandiPoints.push([nVal2, nVal0]);
                aHandiPoints.push([nVal2, nVal2]);
                aHandiPoints.push([nVal1, nVal1]);
                break;
            }
            case 6:
            {
                aHandiPoints.push([nVal0, nVal0]);
                aHandiPoints.push([nVal0, nVal2]);
                aHandiPoints.push([nVal2, nVal0]);
                aHandiPoints.push([nVal2, nVal2]);
                aHandiPoints.push([nVal0, nVal1]);
                aHandiPoints.push([nVal2, nVal1]);
                break;
            }
            case 7:
            {
                aHandiPoints.push([nVal0, nVal0]);
                aHandiPoints.push([nVal0, nVal2]);
                aHandiPoints.push([nVal2, nVal0]);
                aHandiPoints.push([nVal2, nVal2]);
                aHandiPoints.push([nVal0, nVal1]);
                aHandiPoints.push([nVal2, nVal1]);
                aHandiPoints.push([nVal1, nVal1]);
                break;
            }
            case 8:
            {
                aHandiPoints.push([nVal0, nVal0]);
                aHandiPoints.push([nVal0, nVal2]);
                aHandiPoints.push([nVal2, nVal0]);
                aHandiPoints.push([nVal2, nVal2]);
                aHandiPoints.push([nVal0, nVal1]);
                aHandiPoints.push([nVal2, nVal1]);
                aHandiPoints.push([nVal1, nVal0]);
                aHandiPoints.push([nVal1, nVal2]);
                break;
            }
            case 9:
            {
                aHandiPoints.push([nVal0, nVal0]);
                aHandiPoints.push([nVal0, nVal2]);
                aHandiPoints.push([nVal2, nVal0]);
                aHandiPoints.push([nVal2, nVal2]);
                aHandiPoints.push([nVal0, nVal1]);
                aHandiPoints.push([nVal2, nVal1]);
                aHandiPoints.push([nVal1, nVal0]);
                aHandiPoints.push([nVal1, nVal2]);
                aHandiPoints.push([nVal1, nVal1]);
                break;
            }
            }
        }

        var nCharCodeOffsetLo = 'a'.charCodeAt(0);
        var nCharCodeOffsetHi = 'A'.charCodeAt(0);

        if (aHandiPoints.length > 0)
        {
            sSGF += "AB";
            for (var nIndex = 0, nCount = aHandiPoints.length; nIndex < nCount; nIndex++)
            {
                var nX = aHandiPoints[nIndex][0];
                var nY = aHandiPoints[nIndex][1];

                nX += (nX <= 25 ? nCharCodeOffsetLo : nCharCodeOffsetHi - 26);
                nY += (nY <= 25 ? nCharCodeOffsetLo : nCharCodeOffsetHi - 26);

                sSGF += String.fromCharCode(91, nX, nY, 93);
            }
        }

        sSGF += ")";
        this.m_oGameTree.Load_Sgf(sSGF, null, null, "sgf");
    }

    this.Close();
};

function CDrawingClipboardWindow()
{
    CDrawingClipboardWindow.superclass.constructor.call(this);

    this.m_oTextArea = null;
}

CommonExtend(CDrawingClipboardWindow, CDrawingConfirmWindow);

CDrawingClipboardWindow.prototype.Init = function(_sDivId, oPr)
{
    CDrawingClipboardWindow.superclass.Init.call(this, _sDivId, true);

    this.protected_UpdateSizeAndPosition(oPr.Drawing);

    this.Set_Caption("Load file from clipboard");

    var oMainDiv     = this.HtmlElement.ConfirmInnerDiv;
    var oMainControl = this.HtmlElement.ConfirmInnerControl;
    var sDivId       = this.HtmlElement.ConfirmInnerDiv.id;

    this.m_oGameTree = oPr.GameTree;

    this.private_CreateInfoAreaElement(oMainDiv, oMainControl, sDivId);
    this.private_FillTextArea(oPr.GameTree);
    this.m_oTextArea.select();
};
CDrawingClipboardWindow.prototype.Show = function(oPr)
{
    CDrawingClipboardWindow.superclass.Show.call(this, oPr);
    this.private_FillTextArea();
    this.m_oTextArea.select();
};
CDrawingClipboardWindow.prototype.private_CreateInfoAreaElement = function(oMainDiv, oMainControl, sDivId)
{
    var oElement   = document.createElement("textarea");
    var sElementId = sDivId + "TA";
    oElement.setAttribute("id", sElementId);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oElement.style.fontFamily  = "Courier New, monospacef";
    oElement.style.fontSize    = "10pt";
    oElement.style.resize      = "none";
    oElement.style.outline     = "none";
    oElement.style.border      = "1px solid rgb(169,169,169)";
    oElement.style.height      = "100%";
    oElement.style.width       = "100%";
    this.m_oTextArea = oElement;

    oMainDiv.appendChild(oElement);

    var oControl = CreateControlContainer(sElementId);
    oControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
    oControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
    oMainControl.AddControl(oControl);

    return oElement;
};
CDrawingClipboardWindow.prototype.private_FillTextArea = function(oGameTree)
{
    this.m_oTextArea.value = "";

    if (window.clipboardData)
        this.m_oTextArea.value = window.clipboardData.getData('Text');
};
CDrawingClipboardWindow.prototype.Handle_OK = function()
{
    var sFile = this.m_oTextArea.value;
    if (sFile && "" !== sFile)
        this.m_oGameTree.Load_Sgf(sFile, null, null, null);

    this.Close();
};
CDrawingClipboardWindow.prototype.Get_DefaultWindowSize = function()
{
    return {W : 300, H : 200};
};

function CDrawingKifuWindow()
{
    CDrawingKifuWindow.superclass.constructor.call(this);

    this.m_nKifuW = -1;
    this.m_nKifuH = -1;
}
CommonExtend(CDrawingKifuWindow, CDrawingWindow);
CDrawingKifuWindow.prototype.Init = function(sDivId, oPr)
{
    CDrawingKifuWindow.superclass.Init.call(this, sDivId, oPr);
    this.protected_UpdateSizeAndPosition(oPr.Drawing);
    this.Set_Caption("Kifu");

    var oMainDiv     = this.HtmlElement.InnerDiv;
    var oMainControl = this.HtmlElement.InnerControl;

    this.HtmlElement.Canvas = this.private_CreateCanvasElement(oMainDiv, oMainControl, sDivId);

    this.m_oGameTree = oPr.GameTree;
    this.m_oDrawing  = oPr.Drawing;

    if (this.m_oDrawing && this.m_oDrawing.Register_KifuWindow)
        this.m_oDrawing.Register_KifuWindow(this);
};
CDrawingKifuWindow.prototype.Get_DefaultWindowSize = function()
{
    return {W : 650, H : 730};
};
CDrawingKifuWindow.prototype.private_CreateCanvasElement = function(oMainDiv, oMainControl, sDivId)
{
    var oElement   = document.createElement("canvas");
    var sElementId = sDivId + "C";
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.id = sElementId;
    oMainDiv.appendChild(oElement);

    var oControl = CreateControlContainer(sElementId);
    oControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
    oControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
    oMainControl.AddControl(oControl);
    return oElement;
};
CDrawingKifuWindow.prototype.private_DrawLogicBoard = function(oContext, nWidth, nHeight, oLogicBoard)
{
    oContext.clearRect(0, 0, nWidth, nHeight);

    oContext.strokeStyle = "rgba(0, 0, 0, 1)";
    oContext.fillStyle   = "rgba(0, 0, 0, 1)";

    var nSize = 30;
    var nTopSize = 30;
    var nRepetitionHeight = this.private_DrawRepetitions(oContext, 0, nWidth, oLogicBoard, nSize, false);
    var nMinSize = Math.max(50, Math.min(nWidth, nHeight - nTopSize - nRepetitionHeight));
    var nBoardX = (nWidth - nMinSize) / 2 | 0;
    var nBoardY = nTopSize;

    var oResult = this.private_DrawBoard(oContext, oLogicBoard, nBoardX, nBoardY, nMinSize);
    this.private_DrawKifuCaption(oContext, nWidth, "(" + oResult.Min + " ~ " + oResult.Max + ")");
    this.private_DrawRepetitions(oContext, nHeight - nRepetitionHeight, nWidth, oLogicBoard, nSize, true);
    this.private_DrawNextMove(oContext, 25);
};
CDrawingKifuWindow.prototype.Show = function(oPr)
{
    CDrawingKifuWindow.superclass.Show.call(this, oPr);
    var W = this.HtmlElement.InnerDiv.clientWidth;
    var H = this.HtmlElement.InnerDiv.clientHeight;
    this.private_DrawLogicBoard(this.HtmlElement.Canvas.getContext("2d"), W, H, this.m_oGameTree.Get_LogicBoardForKifu());
};
CDrawingKifuWindow.prototype.Update_Size = function(bForce)
{
    CDrawingKifuWindow.superclass.Update_Size.call(this, bForce);

    var W = this.HtmlElement.InnerDiv.clientWidth;
    var H = this.HtmlElement.InnerDiv.clientHeight;
    if (true === bForce || Math.abs(W - this.m_nKifuW) > 0.001 || Math.abs(H - this.m_nKifuH) > 0.001)
    {
        this.m_nKifuW = W;
        this.m_nKifuH = H;
        this.private_DrawLogicBoard(this.HtmlElement.Canvas.getContext("2d"), W, H, this.m_oGameTree.Get_LogicBoardForKifu());
    }
};
CDrawingKifuWindow.prototype.private_DrawStone = function(oContext, nValue, nX, nY, nRad)
{
    if (BOARD_BLACK === nValue)
    {
        oContext.fillStyle = "rgb(0, 0, 0)";
        oContext.beginPath();
        oContext.arc(nX, nY, nRad, 0, 2 * Math.PI);
        oContext.fill();
    }
    else if (BOARD_WHITE === nValue)
    {
        oContext.fillStyle = "rgb(255, 255, 255)";
        oContext.beginPath();
        oContext.arc(nX, nY, nRad, 0, 2 * Math.PI);
        oContext.fill();
        oContext.stroke();
    }
};
CDrawingKifuWindow.prototype.private_DrawMoveNumber = function(oContext, nValue, nX, nY, nRad, nMoveNumber)
{
    if (-1 === nMoveNumber)
        return;

    var Text       = "" + nMoveNumber;
    var FontSize   = nRad;
    var FontFamily = (Common_IsInt(Text) ? "Arial" : "Helvetica, Arial, Verdana");
    var sFont      = FontSize + "px " + FontFamily;

    oContext.fillStyle = nValue === BOARD_WHITE ? "rgb(0,0,0)" : "rgb(255,255,255)";
    oContext.font      = sFont;

    var y_offset = FontSize / 3 + 0.15 * FontSize;
    var x_offset = Text.length > 2 ? (2 * nRad - oContext.measureText(Text).width) / 2 - nRad : (2 * nRad - 1.4 * oContext.measureText(Text).width) / 2 - nRad;

    if (Text.length > 2)
        oContext.setTransform(1, 0, 0, 1.4, nX + x_offset, nY + y_offset);
    else
        oContext.setTransform(1.4, 0, 0, 1.4, nX + x_offset, nY + y_offset);

    oContext.fillText(Text, 0, 0);
    oContext.setTransform(1, 0, 0, 1, 0, 0);
};
CDrawingKifuWindow.prototype.private_DrawBoard = function(oContext, oLogicBoard, nStartX, nStartY, nRealSize)
{
    var oSize = oLogicBoard.Get_Size();

    var nAbsBoardSize = (oSize.X - 1) * g_dBoardCellW + 2 * g_dBoardHorOffset;
    var dOffset       = (nRealSize / nAbsBoardSize * g_dBoardHorOffset) | 0;
    var nCellSize     = (nRealSize / nAbsBoardSize * g_dBoardCellW) | 0;

    var dOffsetX = dOffset + nStartX;
    var dOffsetY = dOffset + nStartY;

    oContext.lineWidth = 2;

    oContext.beginPath();
    oContext.moveTo(dOffsetX, dOffsetY);
    oContext.lineTo(dOffsetX + (oSize.X - 1) * nCellSize, dOffsetY);
    oContext.lineTo(dOffsetX + (oSize.X - 1) * nCellSize, dOffsetY + (oSize.Y - 1) * nCellSize);
    oContext.lineTo(dOffsetX, dOffsetY + (oSize.Y - 1) * nCellSize);
    oContext.closePath();
    oContext.stroke();

    oContext.lineWidth = 1;
    oContext.beginPath();
    for (var nX = 0; nX < oSize.X; ++nX)
    {
        oContext.moveTo(dOffsetX + nX * nCellSize + 0.5, dOffsetY + 0.5);
        oContext.lineTo(dOffsetX + nX * nCellSize + 0.5, dOffsetY + (oSize.Y - 1) * nCellSize + 0.5);
    }
    for (var nY = 0; nY < oSize.Y; ++nY)
    {
        oContext.moveTo(dOffsetX + 0.5, dOffsetY + nY * nCellSize + 0.5);
        oContext.lineTo(dOffsetX + (oSize.X - 1) * nCellSize + 0.5, dOffsetY + nY * nCellSize + 0.5);
    }
    oContext.stroke();

    oContext.beginPath();
    var oHandiPoints = oLogicBoard.Get_HandiPoints();
    for (var nIndex = 0, nCount = oHandiPoints.length; nIndex < nCount; ++nIndex)
    {
        var X = oHandiPoints[nIndex][0] * nCellSize + dOffsetX;
        var Y = oHandiPoints[nIndex][1] * nCellSize + dOffsetY;
        oContext.rect(X - 3, Y - 3, 7, 7);
    }
    oContext.fill();
    var dRad = nCellSize / 2 | 0;

    var nMinMove = -1;
    var nMaxMove = -1;

    for (var nY = 0; nY < oSize.Y; ++nY)
    {
        for (var nX = 0; nX < oSize.X; ++nX)
        {
            var Value       = oLogicBoard.Get(nX + 1, nY + 1);
            var nMoveNumber = oLogicBoard.Get_Num(nX + 1, nY + 1);

            var x = nX * nCellSize + dOffsetX;
            var y = nY * nCellSize + dOffsetY;

            this.private_DrawStone(oContext, Value, x, y, dRad);

            if (-1 !== nMoveNumber)
            {
                this.private_DrawMoveNumber(oContext, Value, x, y, dRad, nMoveNumber);

                if (-1 === nMinMove || nMinMove > nMoveNumber)
                    nMinMove = nMoveNumber;

                if (-1 === nMaxMove || nMaxMove < nMoveNumber)
                    nMaxMove = nMoveNumber;
            }
        }
    }

    return {Min : nMinMove, Max : nMaxMove};
};
CDrawingKifuWindow.prototype.private_DrawKifuCaption = function(oContext, nWidth, sText)
{
    oContext.fillStyle = "rgb(0,0,0)";
    oContext.font      = "16px Arial";
    var dMovesOffsetY  = 20;
    var dMovesOffsetX  = (nWidth - oContext.measureText(sText).width) / 2;
    oContext.fillText(sText, dMovesOffsetX, dMovesOffsetY);
};
CDrawingKifuWindow.prototype.private_DrawRepetitions = function(oContext, nStartY, nWidth, oLogicBoard, nSize, bDraw)
{
    // Под место с точками используем целое nSize, отступы справа, слева расстояние между элементами nSize / 2
    // Расстояние между строками 5px.

    var nHorMargin = (nSize / 2) | 0;
    var nLineGap   = 5;
    var nSpace     = (nSize / 2) | 0;
    var nDotsSize  = nSize | 0;
    var nVerMargin = 5;
    var nLimitX    = nWidth - nHorMargin;
    var nY         = nVerMargin + nStartY;
    var nRad       = (nSize / 2) | 0;
    var nX         = nHorMargin;

    function privateCheckSize(nCheckSize)
    {
        if (nX + nCheckSize < nLimitX || true === bFirstOnLine)
        {
            bFirstOnLine = false;
            return true;
        }
        else
        {
            nX = nHorMargin;
            bFirstOnLine = false;
            nY += nSize + nLineGap;
            return false;
        }
    }

    if (oLogicBoard.m_aRepetitions)
    {
        nY += (nSize / 2) | 0;
        var bFirstOnLine = true;
        for (var nIndex = 0, nCount = oLogicBoard.m_aRepetitions.length; nIndex < nCount; ++nIndex)
        {
            var oRepetition = oLogicBoard.m_aRepetitions[nIndex];
            if (oRepetition.aReps.length <= 0)
                continue;

            for (var nRepIndex = 0, nRepsCount = oRepetition.aReps.length; nRepIndex < nRepsCount; ++nRepIndex)
            {
                var oRep = oRepetition.aReps[nRepIndex];
                privateCheckSize(nSize);

                if (true === bDraw)
                {
                    this.private_DrawStone(oContext, oRep.nValue, nX + nRad , nY, nRad);
                    this.private_DrawMoveNumber(oContext, oRep.nValue, nX + nRad, nY, nRad, oRep.nMoveNumber);
                }
                nX += nSize;
            }

            privateCheckSize(nDotsSize);
            if (true === bDraw)
            {
                this.private_DrawDots(oContext, nX + nRad, nY, nSize);
            }
            nX += nDotsSize;

            privateCheckSize(nSize);
            if (true === bDraw)
            {
                this.private_DrawStone(oContext, oRepetition.nValue, nX + nRad, nY, nRad);
                this.private_DrawMoveNumber(oContext, oRepetition.nValue, nX + nRad, nY, nRad, oRepetition.nMoveNumber);
            }
            nX += nSize + nSpace;
        }
        nY += (nSize / 2) | 0;
    }

    nY += nVerMargin;

    return nY;
};
CDrawingKifuWindow.prototype.private_DrawDots = function(oContext, nX, nY, nSize)
{
    var nDotsX      = (nX - nSize / 2) | 0;
    var nDotsRad    = (nSize / 15) | 0;
    var nDotsSpace  = (nSize / 10 * 3) | 0;
    var nDotsMargin = (nSize / 5) | 0;
    oContext.fillStyle = "rgb(0,0,0)";
    oContext.beginPath();
    oContext.arc(nDotsX + nDotsMargin, nY, nDotsRad, 0, 2 * Math.PI);
    oContext.arc(nDotsX + nDotsMargin + nDotsSpace, nY, nDotsRad, 0, 2 * Math.PI);
    oContext.arc(nDotsX + nDotsMargin + 2 * nDotsSpace, nY, nDotsRad, 0, 2 * Math.PI);
    oContext.fill();
};
CDrawingKifuWindow.prototype.private_DrawNextMove = function(oContext, nSize)
{
    if (!this.m_oGameTree)
        return;

    var nNextMoveNumber = this.m_oGameTree.Get_MovesCount() + 1;
    var nValue          = this.m_oGameTree.Get_NextMove();

    var nRad = nSize / 2 | 0;
    oContext.clearRect(0, 0, 70 + nRad + 2, 28 + 2);
    if (nNextMoveNumber > 0)
    {
        var sText          = "Next";
        oContext.fillStyle = "rgb(0,0,0)";
        oContext.font      = "16px Arial";
        var dOffsetY       = 20;
        var dOffsetX       = 20;
        oContext.fillText(sText, dOffsetX, dOffsetY);

        this.private_DrawStone(oContext, nValue, 70, 28 - nRad, nRad);
        this.private_DrawMoveNumber(oContext, nValue, 70, 28 - nRad, nRad, nNextMoveNumber);
    }
};
CDrawingKifuWindow.prototype.Update_NextMove = function()
{
    this.private_DrawNextMove(this.HtmlElement.Canvas.getContext("2d"), 25);
};

var EWindowType =
{
    Common        : 0,
    Confirm       : 1,
    Error         : 2,
    GameInfo      : 3,
    Settings      : 4,
    ScoreEstimate : 5,
    CountColors   : 6,
    GifWriter     : 7,
    About         : 8,
    DiagramSL     : 9,
    ViewPort      : 10,
    CreateNew     : 11,
    Clipboard     : 12,
    Kifu          : 13
};

var g_aWindows = {};
function CreateWindow(sDrawingId, nWindowType, oPr)
{
    if (!g_aWindows[sDrawingId])
        g_aWindows[sDrawingId] = {};

    var oWindows = g_aWindows[sDrawingId];
    if (oWindows[nWindowType])
    {
        var oWindow = oWindows[nWindowType];
        oWindow.Show(oPr);
        return oWindow;
    }
    else
    {
        var sApp = "unknownwindow";
        switch (nWindowType)
        {
        case EWindowType.GameInfo      : sApp = "Info"; break;
        case EWindowType.Settings      : sApp = "Settings"; break;
        case EWindowType.Error         : sApp = "Error"; break;
        case EWindowType.ScoreEstimate : sApp = "ScoreEstimate"; break;
        case EWindowType.CountColors   : sApp = "CountColors"; break;
        case EWindowType.GifWriter     : sApp = "GifWriter"; break;
        case EWindowType.About         : sApp = "About"; break;
        case EWindowType.DiagramSL     : sApp = "DiagramSL"; break;
        case EWindowType.ViewPort      : sApp = "ViewPort"; break;
        case EWindowType.CreateNew     : sApp = "CreateNew"; break;
        case EWindowType.Clipboard     : sApp = "Clipboard"; break;
        case EWindowType.Kifu          : sApp = "Kifu"; break;
        }
        var sId = sDrawingId + sApp + GoBoardApi.Get_Version();

        var oDiv = document.createElement("div");
        oDiv.setAttribute("id", sId);
        oDiv.setAttribute("style", "position:absolute;padding:0;margin:0;width:500px;height:500px;left:300px;top:300px;");
        oDiv.setAttribute("oncontextmenu", "return false;");

        if (oPr.Drawing)
        {
            var oDrawingDiv = oPr.Drawing.Get_MainDiv();
            oDrawingDiv.appendChild(oDiv);

            var oWindow = null;

            switch (nWindowType)
            {
            case EWindowType.GameInfo      : oWindow = new CDrawingInfoWindow(); break;
            case EWindowType.Settings      : oWindow = new CDrawingSettingsWindow(); break;
            case EWindowType.Error         : oWindow = new CDrawingErrorWindow(); break;
            case EWindowType.ScoreEstimate : oWindow = new CDrawingScoreEstimateWindow(); break;
            case EWindowType.CountColors   : oWindow = new CDrawingCountColorsWindow(); break;
            case EWindowType.GifWriter     : oWindow = new CDrawingGifWriterWindow(); break;
            case EWindowType.About         : oWindow = new CDrawingAboutWindow(); break;
            case EWindowType.DiagramSL     : oWindow = new CDrawingDiagramSLWindow(); break;
            case EWindowType.ViewPort      : oWindow = new CDrawingViewPortWindow(); break;
            case EWindowType.CreateNew     : oWindow = new CDrawingCreateNewWindow(); break;
            case EWindowType.Clipboard     : oWindow = new CDrawingClipboardWindow(); break;
            case EWindowType.Kifu          : oWindow = new CDrawingKifuWindow(); break;
            }

            oWindows[nWindowType] = oWindow;

            if (null !== oWindow)
            {
                oWindow.Init(sId, oPr);
                oWindow.Update_Size(true);
            }

            return oWindow;
        }
    }

    return null;
}