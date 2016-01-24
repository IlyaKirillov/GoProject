"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     10.12.14
 * Time     2:14
 */

var EDrawingSliderType =
{
    Unknown       : 0,
    AutoPlaySpeed : 0,
    Timeline      : 1
};

function CDrawingSlider(oDrawing, nSliderType)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;
    this.m_nType     = nSliderType ? nSliderType : EDrawingSliderType.Unknown;

    this.HtmlElement =
    {
        Control : null,
        Left    : null,
        Right   : null,
        Slider  : null
    };

    this.m_oBackColor        = new CColor(217, 217, 217, 255);
    this.m_oLeftColor        = new CColor( 80,  80,  80, 255);
    this.m_oRightColor       = new CColor(190, 190, 190, 255);
    this.m_oSliderColor      = new CColor( 80,  80,  80, 255);
    this.m_oSliderFocusColor = new CColor(130, 130, 130, 255);

    this.m_nW    = 0;
    this.m_dPos  = 0;
    this.m_nSize = 0;

    this.m_nOffsetY = 17;
    this.m_nOffsetX = 17;

    this.m_bPosLock = false;

    var oThis = this;

    this.private_OnDrag = function(X, Y)
    {
        var W = oThis.m_nW - oThis.m_nSize;
        if (0 === W)
            return;

        oThis.private_UpdatePos((X - oThis.m_nOffsetX) / W, false);
        oThis.private_HandleOnChange(false);
    };

    this.private_OnDragStart = function(X, Y)
    {
        oThis.m_bPosLock = true;
        oThis.private_HandleOnChange(false);
    };

    this.private_OnDragEnd = function(X, Y)
    {
        oThis.m_bPosLock = false;

        var W = oThis.m_nW - oThis.m_nSize;
        if (0 === W)
            return;

        oThis.private_UpdatePos((X - oThis.m_nOffsetX) / W, false);
        oThis.private_HandleOnChange(true);
    };
}

CDrawingSlider.prototype.Init = function(sDivId)
{
    this.m_oGameTree = (this.m_oDrawing ? this.m_oDrawing.Get_GameTree() : null);

    switch(this.m_nType)
    {
        case EDrawingSliderType.AutoPlaySpeed: this.m_oDrawing.Register_AutoPlaySpeed(this); break;
        case EDrawingSliderType.Timeline     : this.m_oDrawing.Register_TimeLine(this); break;
    }

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var oDivElement = this.HtmlElement.Control.HtmlElement;
    oDivElement.style.backgroundColor = this.m_oBackColor.ToString();
    oDivElement.style.textDecorationColor = new CColor(255, 255, 255, 255).ToString();

    var sLeftId   = sDivId + "_Left";
    var sRightId  = sDivId + "_Right";
    var sSliderId = sDivId + "_Slider";

    this.HtmlElement.Right  = this.private_CreateDivElement(oDivElement, sRightId);
    this.HtmlElement.Left   = this.private_CreateDivElement(oDivElement, sLeftId);
    this.HtmlElement.Slider = this.private_CreateDivElement(oDivElement, sSliderId);

    var oThis = this;
    this.HtmlElement.Slider.onmouseover = function()
    {
        this.style.backgroundColor = oThis.m_oSliderFocusColor.ToString();
    };
    this.HtmlElement.Slider.onmouseout = function()
    {
        this.style.backgroundColor = oThis.m_oSliderColor.ToString();
    };

    var oRightControl = CreateControlContainer(sRightId);
    oRightControl.Bounds.SetParams(this.m_nOffsetX, this.m_nOffsetY - 1, this.m_nOffsetX, this.m_nOffsetY - 1, true, true, true, true, -1,-1);
    oRightControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    this.HtmlElement.Control.AddControl(oRightControl);
    oRightControl.HtmlElement.style.background = this.m_oRightColor.ToString();

    var oLeftControl = CreateControlContainer(sLeftId);
    oLeftControl.Bounds.SetParams(this.m_nOffsetX, this.m_nOffsetY, 500, this.m_nOffsetY, true, true, false, true, -1, -1);
    oLeftControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    this.HtmlElement.Control.AddControl(oLeftControl);
    oLeftControl.HtmlElement.style.background = this.m_oLeftColor.ToString();

    this.Update_Size();
    this.private_UpdatePos(0);
};
CDrawingSlider.prototype.Update_Size = function()
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    this.m_nW = W - 2 * this.m_nOffsetX;

    this.HtmlElement.Control.Resize(W, H);

    this.private_OnResize(W, H);
    this.private_UpdatePos(this.m_dPos, true);
};
CDrawingSlider.prototype.Update_Pos = function(dPos)
{
    if (true === this.m_bPosLock)
        return;

    this.private_UpdatePos(dPos, true);
};
CDrawingSlider.prototype.private_OnResize = function(W, H)
{
    var nSizeH = 12;
    var nSizeW = 32;

    switch (this.m_nType)
    {
    case EDrawingSliderType.AutoPlaySpeed:
    {
        nSizeW = 45;
        break;
    }
    case EDrawingSliderType.Timeline     :
    {
        nSizeW = 32;
        break;
    }
    }

    this.m_nSize = nSizeW;

    var oSlider = this.HtmlElement.Slider;

    oSlider.style.width           = nSizeW + "px";
    oSlider.style.height          = nSizeH + "px";
    oSlider.style.display         = "block";
    oSlider.style.position        = "absolute";
    oSlider.style.backgroundColor = this.m_oSliderColor.ToString();
    oSlider.style.top             = (this.m_nOffsetY - 5) + "px";
    oSlider.style.left            = this.m_nOffsetX + "px";
    oSlider.style.borderRadius    = "5px";

    Common_DragHandler.Init(oSlider, null, this.m_nOffsetX, W - this.m_nOffsetX - nSizeW, this.m_nOffsetY - 5, this.m_nOffsetY - 5);

    oSlider.onDrag      = this.private_OnDrag;
    oSlider.onDragStart = this.private_OnDragStart;
    oSlider.onDragEnd   = this.private_OnDragEnd;

    oSlider.style.fontSize           = nSizeH + "px";
    oSlider.style.lineHeight         = nSizeH + "px";
    oSlider.style.color              = "rgb(255,255,255)";
    oSlider.style.textOverflow       = "clip";
    oSlider.style.overflow           = "hidden";
    oSlider.style.textAlign          = "center";
    oSlider.style.cursor             = "default";
    oSlider.style.transitionProperty = "background";
    oSlider.style.transitionDuration = "0.25s";
    oSlider.style.fontFamily         = '"Times New Roman", Times, serif';
};
CDrawingSlider.prototype.private_CreateDivElement = function(oParentElement, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingSlider.prototype.private_UpdatePos = function(dPos, bUpdateSliderPos)
{
    this.m_dPos = Math.min(1, Math.max(dPos, 0));

    var X = this.m_dPos * this.m_nW;
    this.HtmlElement.Left.style.width  = X + "px";

    if (false !== bUpdateSliderPos)
    {
        var _X = this.m_dPos * (this.m_nW - this.m_nSize);
        this.HtmlElement.Slider.style.left = _X + this.m_nOffsetX + "px";
    }
};
CDrawingSlider.prototype.private_HandleOnChange = function(bEnd)
{
    if (!this.m_oGameTree)
        return;

    switch(this.m_nType)
    {
        case EDrawingSliderType.AutoPlaySpeed:
        {
            this.m_oGameTree.Set_AutoPlaySpeed(this.m_dPos);

            if (!bEnd)
            {
                var dSeconds = (((this.m_oGameTree.Get_AutoPlayInterval() / 1000) * 1000) | 0) / 1000;
                Common.Set_InnerTextToElement(this.HtmlElement.Slider, dSeconds + " s");
            }
            else
            {
                Common.Set_InnerTextToElement(this.HtmlElement.Slider, "");
            }

            break;
        }
        case EDrawingSliderType.Timeline     :
        {
            this.m_oGameTree.GoTo_NodeByTimeLine(this.m_dPos);
            break;
        }
    }
};