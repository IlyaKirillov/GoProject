"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     27.11.14
 * Time     1:33
 */

var EDrawingButtonType =
{
    Unknown         : 0,
    BackwardToStart : 1,
    Backward_5      : 2,
    Backward        : 3,
    Forward         : 4,
    Forward_5       : 5,
    ForwardToEnd    : 6
};

var EDrawingButtonState =
{
    Normal : 0,
    Active : 1,
    Hover  : 2
};

function CDrawingButton()
{
    this.m_oGameTree = null;
    this.m_nType     = EDrawingButtonType.Unknown;
    this.m_nState    = EDrawingButtonState.Normal;

    this.m_oImageData =
    {
        Normal : null,
        Hover  : null,
        Active : null
    };

    this.HtmlElement =
    {
        Control : null,
        Canvas  : {Control : null}
    };

    this.m_oNormaBColor = new CColor(217, 217, 217, 255);
    this.m_oNormaFColor = new CColor(  0,   0,   0, 255);
    this.m_oHoverBColor = new CColor( 54, 101, 179, 255);
    this.m_oHoverFColor = new CColor(255, 255, 255, 255);

    this.m_nW = 0;
    this.m_nH = 0;

    var oThis = this;

    this.private_OnMouseDown = function(e)
    {
        oThis.m_nState = EDrawingButtonState.Active;
        oThis.private_UpdateState();
        oThis.private_HandleMouseDown();
    };

    this.private_OnMouseUp = function(e)
    {
        oThis.m_nState = EDrawingButtonState.Hover;
        oThis.private_UpdateState();
    };

    this.private_OnMouseOver = function(e)
    {
        if (EDrawingButtonState.Active !== oThis.m_nState)
            oThis.m_nState = EDrawingButtonState.Hover;

        oThis.private_UpdateState();
    };

    this.private_OnMouseOut = function(e)
    {
        oThis.m_nState = EDrawingButtonState.Normal;
        oThis.private_UpdateState();
    };
    this.private_OnFocus = function()
    {
        // При нажатии на кнопки выставляем фокус на доску, к которой привязаны кнопки.
        if (oThis.m_oGameTree)
            oThis.m_oGameTree.Focus_DrawingBoard();
    };
}
CDrawingButton.prototype.Init = function(sDivId, oGameTree, nButtonType)
{
    this.m_oGameTree = oGameTree;
    this.m_nType     = nButtonType;

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var oDivElement = this.HtmlElement.Control.HtmlElement;

    var oCanvasElement = document.createElement("canvas");
    oCanvasElement.setAttribute("id", sDivId + "_canvas");
    oCanvasElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oCanvasElement.setAttribute("oncontextmenu", "return false;");
    oDivElement.appendChild(oCanvasElement);

    this.HtmlElement.Canvas.Control = CreateControlContainer(sDivId + "_canvas");
    var oCanvasControl = this.HtmlElement.Canvas.Control;
    oCanvasControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1,-1);
    oCanvasControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    this.HtmlElement.Control.AddControl(oCanvasControl);

    oDivElement.onmousedown = this.private_OnMouseDown;
    oDivElement.onmouseup   = this.private_OnMouseUp;
    oDivElement.onmouseover = this.private_OnMouseOver;
    oDivElement.onmouseout  = this.private_OnMouseOut;
    oDivElement.onfocus     = this.private_OnFocus;
    oDivElement.tabIndex    = -1;

    this.Update_Size();
};
CDrawingButton.prototype.Update_Size = function()
{
    this.m_nW = this.HtmlElement.Control.HtmlElement.clientWidth;
    this.m_nH = this.HtmlElement.Control.HtmlElement.clientHeight;

    this.HtmlElement.Control.Resize(this.m_nW, this.m_nH);

    this.private_OnResize();
};
CDrawingButton.prototype.private_OnResize = function()
{
    var H = this.m_nH;
    var W = this.m_nW;

    if (0 === W || 0 === H)
        return;

    this.m_oImageData.Active = this.private_Draw(this.m_oHoverBColor, this.m_oHoverFColor, W, H);
    this.m_oImageData.Hover  = this.private_Draw(this.m_oHoverBColor, this.m_oHoverFColor, W, H);
    this.m_oImageData.Normal = this.private_Draw(this.m_oNormaBColor, this.m_oNormaFColor, W, H);
};
CDrawingButton.prototype.private_Draw = function(BackColor, FillColor, W, H)
{
    var Canvas = this.HtmlElement.Canvas.Control.HtmlElement.getContext("2d");
    Canvas.fillStyle = BackColor.ToString();
    Canvas.fillRect(0, 0, W, H);

    Canvas.fillStyle = FillColor.ToString();

    // Дополнительные параметры для квадратных кнопок
    var Size  = Math.min(W, H);
    var X_off = (W - Size) / 2;
    var Y_off = (H - Size) / 2;

    switch(this.m_nType)
    {
        case EDrawingButtonType.BackwardToStart:
        {
            this.private_DrawTriangle(Size, X_off, Y_off, Canvas, -1);
            var X_1_10 = Math.ceil(X_off + Size / 10 + 0.5);
            var Y_1_5  = Math.ceil(Y_off + Size / 5 + 0.5);
            var _W = Math.floor(Size / 10 + 0.5);
            var _H = Math.floor(3 * Size / 5 + 0.5);
            Canvas.fillRect(X_1_10, Y_1_5, _W, _H);

            break;
        }
        case EDrawingButtonType.Backward_5:
        {
            this.private_DrawTriangle(Size, X_off - Size / 10, Y_off, Canvas, -1);
            var X_8_10 = Math.ceil(X_off + 8 * Size / 10 + 0.5);
            var Y_1_5  = Math.ceil(Y_off + Size / 5 + 0.5);
            var _W = Math.floor(Size / 10 + 0.5);
            var _H = Math.floor(3 * Size / 5 + 0.5);
            Canvas.fillRect(X_8_10, Y_1_5, _W, _H);

            break;
        }
        case EDrawingButtonType.Backward:
        {
            this.private_DrawTriangle(Size, X_off - Size / 10, Y_off, Canvas, -1);
            break;
        }
        case EDrawingButtonType.Forward:
        {
            this.private_DrawTriangle(Size, X_off - Size / 10, Y_off, Canvas, 1);
            break;
        }
        case EDrawingButtonType.Forward_5:
        {
            this.private_DrawTriangle(Size, X_off + Size / 10, Y_off, Canvas, 1);
            var X_1_10 = Math.ceil(X_off + Size / 10 + 0.5);
            var Y_1_5  = Math.ceil(Y_off + Size / 5 + 0.5);
            var _W = Math.floor(Size / 10 + 0.5);
            var _H = Math.floor(3 * Size / 5 + 0.5);
            Canvas.fillRect(X_1_10, Y_1_5, _W, _H);

            break;
        }
        case EDrawingButtonType.ForwardToEnd:
        {
            this.private_DrawTriangle(Size, X_off, Y_off, Canvas, 1);
            var X_8_10 = Math.ceil(X_off + 8 * Size / 10 + 0.5);
            var Y_1_5  = Math.ceil(Y_off + Size / 5 + 0.5);
            var _W = Math.floor(Size / 10 + 0.5);
            var _H = Math.floor(3 * Size / 5 + 0.5);
            Canvas.fillRect(X_8_10, Y_1_5, _W, _H);

            break;
        }
    };

    return Canvas.getImageData(0, 0, W, H);
};
CDrawingButton.prototype.private_DrawTriangle = function(Size, X_off, Y_off, Canvas, Direction)
{
    var X_1_5 = Math.ceil(X_off +     Size / 5 + 0.5);
    var X_4_5 = Math.ceil(X_off + 4 * Size / 5 + 0.5);
    var Y_1_5 = Math.ceil(Y_off +     Size / 5 + 0.5);
    var Y_1_2 = Math.ceil(Y_off +     Size / 2 + 0.5);
    var Y_4_5 = Math.ceil(Y_off + 4 * Size / 5 + 0.5);

    if (Direction < 0)
    {
        Canvas.beginPath();
        Canvas.moveTo(X_1_5, Y_1_2);
        Canvas.lineTo(X_4_5, Y_1_5);
        Canvas.lineTo(X_4_5, Y_4_5);
        Canvas.closePath();
        Canvas.fill();
    }
    else
    {
        Canvas.beginPath();
        Canvas.moveTo(X_1_5, Y_1_5);
        Canvas.lineTo(X_4_5, Y_1_2);
        Canvas.lineTo(X_1_5, Y_4_5);
        Canvas.closePath();
        Canvas.fill();
    }
};
CDrawingButton.prototype.private_UpdateState = function()
{
    var Canvas = this.HtmlElement.Canvas.Control.HtmlElement.getContext("2d");

    var ImageData = null;
    switch(this.m_nState)
    {
        case EDrawingButtonState.Hover:  ImageData = this.m_oImageData.Hover; break;
        case EDrawingButtonState.Active: ImageData = this.m_oImageData.Active; break;
        default:
        case EDrawingButtonState.Normal: ImageData = this.m_oImageData.Normal; break;
    }

    Canvas.putImageData(ImageData, 0, 0);
};
CDrawingButton.prototype.private_HandleMouseDown = function()
{
    if (!this.m_oGameTree)
        return;

    switch(this.m_nType)
    {
        case EDrawingButtonType.BackwardToStart: this.m_oGameTree.Step_BackwardToStart(); break;
        case EDrawingButtonType.Backward_5     : this.m_oGameTree.Step_Backward(5); break;
        case EDrawingButtonType.Backward       : this.m_oGameTree.Step_Backward(1); break;
        case EDrawingButtonType.Forward        : this.m_oGameTree.Step_Forward(1); break;
        case EDrawingButtonType.Forward_5      : this.m_oGameTree.Step_Forward(5); break;
        case EDrawingButtonType.ForwardToEnd   : this.m_oGameTree.Step_ForwardToEnd(); break;
    };
};
