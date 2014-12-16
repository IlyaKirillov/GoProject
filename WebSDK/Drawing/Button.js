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
    ForwardToEnd    : 6,
    NextVariant     : 7,
    PrevVariant     : 8,
    EditModeMove    : 9,
    EditModeScores  : 10,
    EditModeAddRem  : 11,
    EditModeTr      : 12,
    EditModeSq      : 13,
    EditModeCr      : 14,
    EditModeX       : 15,
    EditModeText    : 16,
    EditModeNum     : 17,
    AutoPlay        : 18,
    WindowClose     : 19,
    GameInfo        : 20,
    WindowOK        : 21,
    WindowCancel    : 22
};

var EDrawingButtonState =
{
    Normal   : 0x0,
    Active   : 0x1,
    Hover    : 0x2,
    Disabled : 0x4,
    Selected : 0x8
};

var EDrawingButtonState2 =
{
    AutoPlayPlaying : 0x00,
    AutoPlayStopped : 0x10
};

function CDrawingButton(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;
    this.m_nType     = EDrawingButtonType.Unknown;
    this.m_nState    = EDrawingButtonState.Normal;
    this.m_nState2   = EDrawingButtonState2.AutoPlayStopped;

    this.m_bSelected = false;

    this.m_oImageData =
    {
        Disabled : null,
        Normal   : null,
        Hover    : null,
        Active   : null,
        Selected : null
    };

    this.HtmlElement =
    {
        Control : null,
        Canvas  : {Control : null}
    };

    this.m_oNormaBColor    = new CColor(217, 217, 217, 255);
    this.m_oNormaFColor    = new CColor(  0,   0,   0, 255);
    this.m_oHoverBColor    = new CColor( 54, 101, 179, 255);
    this.m_oHoverFColor    = new CColor(255, 255, 255, 255);
    this.m_oActiveBColor   = new CColor( 54, 101, 179, 255);
    this.m_oActiveFColor   = new CColor(255, 255, 255, 255);
    this.m_oDisabledBColor = new CColor(217, 217, 217, 255);
    this.m_oDisabledFColor = new CColor(140, 140, 140, 255);
    this.m_oSelectedBColor = new CColor(  0, 175, 240, 255);

    this.m_nW = 0;
    this.m_nH = 0;

    var oThis = this;

    this.private_OnMouseDown = function(e)
    {
        oThis.private_OnFocus();
        if (EDrawingButtonState.Disabled !== oThis.m_nState)
        {
            check_MouseDownEvent(e, true);
            oThis.m_nState = EDrawingButtonState.Active;
            oThis.private_UpdateState();
            //oThis.private_HandleMouseDown();
            e.stopImmediatePropagation();
        }
    };

    this.private_OnMouseUp = function(e)
    {
        if (EDrawingButtonState.Disabled !== oThis.m_nState)
        {
            if (global_mouseEvent.Sender !== e.target)
                return;

            oThis.m_nState = EDrawingButtonState.Hover;
            oThis.private_UpdateState();
            oThis.private_HandleMouseDown();
            e.stopImmediatePropagation();
        }
    };

    this.private_OnMouseOver = function(e)
    {
        if (EDrawingButtonState.Disabled !== oThis.m_nState)
        {
            if (EDrawingButtonState.Active !== oThis.m_nState)
                oThis.m_nState = EDrawingButtonState.Hover;

            oThis.private_UpdateState();
        }
    };

    this.private_OnMouseOut = function(e)
    {
        if (EDrawingButtonState.Disabled !== oThis.m_nState)
        {
            oThis.m_nState = oThis.m_bSelected ? EDrawingButtonState.Selected : EDrawingButtonState.Normal;
            oThis.private_UpdateState();
        }
    };
    this.private_OnFocus = function()
    {
        // При нажатии на кнопки выставляем фокус на доску, к которой привязаны кнопки.
        if (oThis.m_oGameTree && oThis.m_nType !== EDrawingButtonType.GameInfo)
            oThis.m_oGameTree.Focus();
    };
    this.private_OnDragStart = function(e)
    {
        e.dataTransfer.effectAllowed = "all";
        e.dataTransfer.setData("text/sgf", "(;SZ[19];)");
    };
}
CDrawingButton.prototype.Init = function(sDivId, oGameTree, nButtonType)
{
    this.m_oGameTree = oGameTree;
    this.m_nType     = nButtonType;

    this.private_RegisterButton();
    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var oDivElement = this.HtmlElement.Control.HtmlElement;

    var sHint = this.private_GetHint();
    oDivElement.setAttribute("title", sHint);

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
    oDivElement.style.outline = "none";
    oDivElement.draggable   = "true";
    oDivElement.ondragstart = this.private_OnDragStart;

    this.Update_Size();
};
CDrawingButton.prototype.Update_Size = function()
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    if (W !== this.m_nW || H !== this.m_nH)
    {
        this.m_nW = W;
        this.m_nH = H;

        this.HtmlElement.Control.Resize(this.m_nW, this.m_nH);

        this.private_OnResize();
    }
};
CDrawingButton.prototype.Set_Enabled = function(Value)
{
    if (true === Value && this.m_nState === EDrawingButtonState.Disabled)
    {
        this.m_nState = EDrawingButtonState.Normal;
        this.private_UpdateState();
    }
    else if (false === Value && this.m_nState !== EDrawingButtonState.Disabled)
    {
        this.m_nState = EDrawingButtonState.Disabled;
        this.private_UpdateState();
    }
};
CDrawingButton.prototype.Set_State2 = function(State2)
{
    if (this.m_nState2 !== State2)
    {
        this.m_nState2 = State2;
        this.private_OnResize();
        this.HtmlElement.Control.HtmlElement.setAttribute("title", this.private_GetHint());
    }
};
CDrawingButton.prototype.Set_Selected = function(Value)
{
    if (this.m_bSelected !== Value)
    {
        this.m_bSelected = Value;

        if (true === Value && EDrawingButtonState.Normal === this.m_nState)
        {
            this.m_nState = EDrawingButtonState.Selected;
            this.private_UpdateState();
        }
        else if (false === Value && EDrawingButtonState.Selected === this.m_nState)
        {
            this.m_nState = EDrawingButtonState.Normal;
            this.private_UpdateState();
        }
    }
};
CDrawingButton.prototype.private_OnResize = function()
{
    var H = this.m_nH;
    var W = this.m_nW;

    if (0 === W || 0 === H)
        return;

    this.m_oImageData.Active   = this.private_Draw(this.m_oActiveBColor,   this.m_oActiveFColor,   W, H);
    this.m_oImageData.Hover    = this.private_Draw(this.m_oHoverBColor,    this.m_oHoverFColor,    W, H);
    this.m_oImageData.Normal   = this.private_Draw(this.m_oNormaBColor,    this.m_oNormaFColor,    W, H);
    this.m_oImageData.Disabled = this.private_Draw(this.m_oDisabledBColor, this.m_oDisabledFColor, W, H);
    this.m_oImageData.Selected = this.private_Draw(this.m_oHoverBColor,    this.m_oHoverFColor,    W, H);

    this.private_UpdateState();
};
CDrawingButton.prototype.private_Draw = function(BackColor, FillColor, W, H, bSelected)
{
    var Canvas = this.HtmlElement.Canvas.Control.HtmlElement.getContext("2d");
    Canvas.fillStyle = BackColor.ToString();

    Canvas.fillStyle = BackColor.ToString();
    Canvas.fillRect(0, 0, W, H);

    Canvas.fillStyle = FillColor.ToString();
    Canvas.strokeStyle = FillColor.ToString();

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
        case EDrawingButtonType.NextVariant:
        {
            var X0 = Math.ceil(X_off + 0.20 * Size + 0.5);
            var X1 = Math.ceil(X_off + 0.35 * Size + 0.5);
            var X2 = Math.ceil(X_off + 0.57 * Size + 0.5);
            var X3 = Math.ceil(X_off + 0.92 * Size + 0.5);

            var Y0 = Math.ceil(Y_off + 0.20 * Size + 0.5);
            var Y1 = Math.ceil(Y_off + 0.38 * Size + 0.5);
            var Y2 = Math.ceil(Y_off + 0.52 * Size + 0.5);
            var Y3 = Math.ceil(Y_off + 0.60 * Size + 0.5);
            var Y4 = Math.ceil(Y_off + 0.68 * Size + 0.5);
            var Y5 = Math.ceil(Y_off + 0.84 * Size + 0.5);

            Canvas.beginPath();
            Canvas.moveTo(X0, Y0);
            Canvas.lineTo(X1, Y0);
            Canvas.lineTo(X1, Y2);
            Canvas.lineTo(X2, Y2)
            Canvas.lineTo(X2, Y1);
            Canvas.lineTo(X3, Y3);
            Canvas.lineTo(X2, Y5);
            Canvas.lineTo(X2, Y4);
            Canvas.lineTo(X0, Y4);
            Canvas.closePath();
            Canvas.fill();

            break;
        }
        case EDrawingButtonType.PrevVariant:
        {
            var X0 = Math.ceil(X_off + 0.20 * Size + 0.5);
            var X1 = Math.ceil(X_off + 0.35 * Size + 0.5);
            var X2 = Math.ceil(X_off + 0.57 * Size + 0.5);
            var X3 = Math.ceil(X_off + 0.92 * Size + 0.5);

            var Y0 = Math.ceil(Y_off + (1 - 0.20) * Size + 0.5);
            var Y1 = Math.ceil(Y_off + (1 - 0.38) * Size + 0.5);
            var Y2 = Math.ceil(Y_off + (1 - 0.52) * Size + 0.5);
            var Y3 = Math.ceil(Y_off + (1 - 0.60) * Size + 0.5);
            var Y4 = Math.ceil(Y_off + (1 - 0.68) * Size + 0.5);
            var Y5 = Math.ceil(Y_off + (1 - 0.84) * Size + 0.5);

            Canvas.beginPath();
            Canvas.moveTo(X0, Y0);
            Canvas.lineTo(X1, Y0);
            Canvas.lineTo(X1, Y2);
            Canvas.lineTo(X2, Y2)
            Canvas.lineTo(X2, Y1);
            Canvas.lineTo(X3, Y3);
            Canvas.lineTo(X2, Y5);
            Canvas.lineTo(X2, Y4);
            Canvas.lineTo(X0, Y4);
            Canvas.closePath();
            Canvas.fill();

            break;
        }
        case EDrawingButtonType.EditModeMove:
        {
            var X = Math.ceil(X_off + 0.5 * Size - Size / 10 + 0.5);
            var Y = Math.ceil(Y_off + 0.5 * Size - Size / 10 + 0.5);
            var R = Math.ceil(0.25 * Size + 0.5);

            Canvas.fillStyle   = (new CColor(255, 255, 255)).ToString();
            Canvas.strokeStyle = (new CColor(0, 0, 0)).ToString();
            Canvas.beginPath();
            Canvas.arc(X, Y, R, 0, 2 * Math.PI, false);
            Canvas.fill();
            Canvas.stroke();

            Canvas.fillStyle = (new CColor(0, 0, 0)).ToString();
            X = Math.ceil(X_off + 0.5 * Size + Size / 10 + 0.5);
            Y = Math.ceil(Y_off + 0.5 * Size + Size / 10 + 0.5);
            R = Math.ceil(0.25 * Size + 0.5);

            Canvas.beginPath();
            Canvas.arc(X, Y, R, 0, 2 * Math.PI, false);
            Canvas.fill();

            break;
        }
        case EDrawingButtonType.EditModeScores:
        {
            var oImageData = Canvas.createImageData(Size, Size);
            var D0 = (Size / 5) | 0;
            var D1 = (Size * 4 / 5) | 0
            for (var i = 0; i < Size; i++)
            {
                for (var j = 0; j < Size; j++)
                {
                    var Index = (i * Size + j) * 4;

                    if (i >= D0 && i <= D1 && j >= D0 && j <= D1)
                    {
                        if ((Size - i) >= j || i === D0 || i === D1 || j === D0 || j === D1)
                        {
                            oImageData.data[Index + 0] = 0;
                            oImageData.data[Index + 1] = 0;
                            oImageData.data[Index + 2] = 0;
                            oImageData.data[Index + 3] = 255;
                        }
                        else
                        {
                            oImageData.data[Index + 0] = 255;
                            oImageData.data[Index + 1] = 255;
                            oImageData.data[Index + 2] = 255;
                            oImageData.data[Index + 3] = 255;
                        }
                    }
                    else
                    {
                        oImageData.data[Index + 0] = BackColor.r;
                        oImageData.data[Index + 1] = BackColor.g;
                        oImageData.data[Index + 2] = BackColor.b;
                        oImageData.data[Index + 3] = 255;
                    }
                }
            }

            Canvas.putImageData(oImageData, X_off, Y_off);

            break;
        }
        case EDrawingButtonType.EditModeAddRem:
        {
            var X = Math.ceil(X_off + 0.75 * Size + 0.5);
            var Y = Math.ceil(Y_off + 0.125 * Size + 0.5);
            var _W = Math.ceil(0.25 * Size + 0.5);
            var _H = Math.ceil(0.02 * Size + 0.5);
            Canvas.fillRect(X, Y, _W, _H);

            X = Math.ceil(X_off + 0.875 * Size + 0.5);
            Y = Math.ceil(Y_off + 0.5);
            _W = Math.ceil(0.02 * Size + 0.5);
            _H = Math.ceil(0.25 * Size + 0.5);
            Canvas.fillRect(X, Y, _W, _H);

            X = Math.ceil(X_off + 0.5);
            Y = Math.ceil(Y_off + 0.875 * Size + 0.5);
            _W = Math.ceil(0.25 * Size + 0.5);
            _H = Math.ceil(0.02 * Size + 0.5);
            Canvas.fillRect(X, Y, _W, _H);

            X = Math.ceil(X_off + 0.5 * Size - Size / 10 + 0.5);
            Y = Math.ceil(Y_off + 0.5 * Size - Size / 10 + 0.5);
            R = Math.ceil(0.25 * Size + 0.5);

            Canvas.fillStyle   = (new CColor(255, 255, 255)).ToString();
            Canvas.strokeStyle = (new CColor(0, 0, 0)).ToString();
            Canvas.beginPath();
            Canvas.arc(X, Y, R, 0, 2 * Math.PI, false);
            Canvas.fill();
            Canvas.stroke();

            Canvas.fillStyle = (new CColor(0, 0, 0)).ToString();
            X = Math.ceil(X_off + 0.5 * Size + Size / 10 + 0.5);
            Y = Math.ceil(Y_off + 0.5 * Size + Size / 10 + 0.5);
            R = Math.ceil(0.25 * Size + 0.5);

            Canvas.beginPath();
            Canvas.arc(X, Y, R, 0, 2 * Math.PI, false);
            Canvas.fill();

            break;
        }
        case EDrawingButtonType.EditModeTr:
        {
            var r     = Size/ 2;
            var _y    = Size * 3 / 4;
            var shift = Size * 0.1;

            var _x1 =  Math.sqrt(r * r - (_y - r) * (_y - r)) + r;
            var _x2 = -Math.sqrt(r * r - (_y - r) * (_y - r)) + r;

            Canvas.lineWidth = Math.ceil(0.05 * Size + 0.5);

            Canvas.beginPath();
            Canvas.moveTo(X_off + Size/ 2, Y_off + 2 * shift);
            Canvas.lineTo(X_off + _x1 - shift, Y_off + _y + shift);
            Canvas.lineTo(X_off + _x2 + shift, Y_off + _y + shift);
            Canvas.closePath();
            Canvas.stroke();

            break;
        }
        case EDrawingButtonType.EditModeSq:
        {
            var r     = Size / 2;
            var shift = 0.05 * Size ;

            var _y1  = -Size / 2 * Math.sqrt(2) / 2 + Size / 2;
            var _y2  =  Size / 2 * Math.sqrt(2) / 2 + Size / 2;

            var _x1 =  Math.sqrt(r * r - (_y1 - r) * (_y1 - r)) + r;
            var _x2 = -Math.sqrt(r * r - (_y1 - r) * (_y1 - r)) + r;

            var x1 = Math.floor(X_off + _x1 - shift);
            var x2 = Math.ceil(X_off + _x2 + shift);
            var y1 = Math.ceil(Y_off + _y1 + shift);
            var y2 = Math.floor(Y_off + _y2 - shift);

            Canvas.lineWidth = Math.ceil(0.05 * Size + 0.5);

            Canvas.beginPath();
            Canvas.moveTo(x1, y1);
            Canvas.lineTo(x2, y1);
            Canvas.lineTo(x2, y2);
            Canvas.lineTo(x1, y2);
            Canvas.closePath();
            Canvas.stroke();

            break;
        }
        case EDrawingButtonType.EditModeCr:
        {
            var PenWidth = 0.05 * Size;
            var r     = Size / 2;
            var shift = PenWidth * 4;

            Canvas.lineWidth = Math.ceil(PenWidth + 0.5);
            Canvas.beginPath();
            Canvas.arc(X_off + Size / 2, Y_off + Size / 2, r - shift, 0, 2 * Math.PI, false);
            Canvas.stroke();

            break;
        }
        case EDrawingButtonType.EditModeX:
        {
            var X0 = X_off + 0.25 * Size;
            var X1 = X_off + 0.75 * Size;
            var Y0 = Y_off + 0.25 * Size;
            var Y1 = Y_off + 0.75 * Size;

            var PenWidth = 0.05 * Size;
            Canvas.lineWidth = Math.ceil(PenWidth + 0.5);

            Canvas.beginPath();
            Canvas.moveTo(X0, Y0);
            Canvas.lineTo(X1, Y1);
            Canvas.moveTo(X1, Y0);
            Canvas.lineTo(X0, Y1);
            Canvas.stroke();

            break;
        }
        case EDrawingButtonType.EditModeText:
        {
            var Text       = "A";
            var FontSize   = Size * 0.8;
            var FontFamily = "Arial";
            var sFont      = FontSize + "px " + FontFamily;

            Canvas.font = sFont;

            var Y = Y_off + Size / 2 + FontSize / 3;
            var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

            Canvas.fillText(Text, X, Y);

            break;
        }
        case EDrawingButtonType.EditModeNum:
        {
            var Text       = "1";
            var FontSize   = Size * 0.8;
            var FontFamily = "Helvetica, Arial, Verdana";
            var sFont      = FontSize + "px " + FontFamily;

            Canvas.font = sFont;

            var Y = Y_off + Size / 2 + FontSize / 3;
            var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

            Canvas.fillText(Text, X, Y);
            break;
        }
        case EDrawingButtonType.AutoPlay:
        {
            if (EDrawingButtonState2.AutoPlayStopped === this.m_nState2)
                this.private_DrawTriangle(Size, X_off, Y_off, Canvas, 1);
            else
            {
                var X_1_5 = Math.floor(X_off +   Size / 5   + Size / 20 + 0.5);
                var X_4_5 = Math.ceil(X_off + 4 * Size / 5 - Size / 20 + 0.5);
                var Y_1_5 = Math.ceil(Y_off +     Size / 5 + 0.5);
                var Y_4_5 = Math.ceil(Y_off + 4 * Size / 5 + 0.5);

                var X_1_5_S = Math.ceil(X_1_5 + Size / 5);
                var X_4_5_S = Math.floor(X_4_5 - Size / 5);

                Canvas.beginPath();
                Canvas.moveTo(X_1_5, Y_1_5);
                Canvas.lineTo(X_1_5_S, Y_1_5);
                Canvas.lineTo(X_1_5_S, Y_4_5);
                Canvas.lineTo(X_1_5, Y_4_5);
                Canvas.closePath();
                Canvas.fill();

                Canvas.beginPath();
                Canvas.moveTo(X_4_5, Y_1_5);
                Canvas.lineTo(X_4_5_S, Y_1_5);
                Canvas.lineTo(X_4_5_S, Y_4_5);
                Canvas.lineTo(X_4_5, Y_4_5);
                Canvas.closePath();
                Canvas.fill();
            }

            break;
        }
        case EDrawingButtonType.WindowClose:
        {
            var oImageData = Canvas.createImageData(W, H);
            var oBitmap = oImageData.data;

            var X_off = (W - 8) / 2 | 0;
            var Y_off = (H - 8) / 2 | 0;

            for (var Y = 0; Y < H; Y++)
            {
                for (var X = 0; X < W; X++)
                {
                    var Index = (X + Y * W) * 4;

                    var r = FillColor.r;
                    var g = FillColor.g;
                    var b = FillColor.b;

                    var y = Y - Y_off;
                    var x = X - X_off;
                    if ((0 === y && (0 === x || 1 === x || 6 === x || 7 === x)) ||
                        (1 === y && (1 === x || 2 === x || 5 === x || 6 === x)) ||
                        (2 === y && (2 === x || 3 === x || 4 === x || 5 === x)) ||
                        (3 === y && (3 === x || 4 === x)) ||
                        (4 === y && (3 === x || 4 === x)) ||
                        (5 === y && (2 === x || 3 === x || 4 === x || 5 === x)) ||
                        (6 === y && (1 === x || 2 === x || 5 === x || 6 === x)) ||
                        (7 === y && (0 === x || 1 === x || 6 === x || 7 === x)))
                    {
                        r = 255;
                        g = 255;
                        b = 255;
                    }

                    oBitmap[Index + 0] = r;
                    oBitmap[Index + 1] = g;
                    oBitmap[Index + 2] = b;
                    oBitmap[Index + 3] = 255;
                }
            }

            return oImageData;
        }
        case EDrawingButtonType.GameInfo:
        {
            var PenWidth = 0.02 * Size;
            var r     = Size / 2;
            var shift = PenWidth * 4;

            Canvas.lineWidth = Math.ceil(PenWidth + 0.5);
            Canvas.beginPath();
            Canvas.arc(X_off + Size / 2, Y_off + Size / 2, r - shift, 0, 2 * Math.PI, false);
            Canvas.stroke();

            var Text       = "i";
            var FontSize   = Size * 0.9;
            var FontFamily = "Times New Roman, Sans serif";
            var sFont      = FontSize + "px " + FontFamily;


            Canvas.font = sFont;

            var Y = Y_off + Size / 2 + FontSize / 3;
            var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

            Canvas.fillText(Text, X, Y);

            break;
        }
        case EDrawingButtonType.WindowOK:
        {
            Canvas.lineWidth = 1;
            Canvas.moveTo(0, 0)
            Canvas.lineTo(0, H);
            Canvas.lineTo(W, H);
            Canvas.lineTo(W, 0);
            Canvas.lineTo(0, 0);
            Canvas.stroke();

            var Text       = "OK";
            var FontSize   = Size * 0.6;
            var FontFamily = "Tahoma, Sans serif";
            var sFont      = FontSize + "px " + FontFamily;

            Canvas.fillStyle = (new CColor(0, 0, 0, 255)).ToString();
            Canvas.font = sFont;

            var Y = Y_off + Size / 2 + FontSize / 3;
            var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

            Canvas.fillText(Text, X, Y);

            break;
        }
        case EDrawingButtonType.WindowCancel:
        {
            Canvas.lineWidth = 1;
            Canvas.moveTo(0, 0)
            Canvas.lineTo(0, H);
            Canvas.lineTo(W, H);
            Canvas.lineTo(W, 0);
            Canvas.lineTo(0, 0);
            Canvas.stroke();

            var Text       = "Cancel";
            var FontSize   = Size * 0.6;
            var FontFamily = "Tahoma, Sans serif";
            var sFont      = FontSize + "px " + FontFamily;

            Canvas.fillStyle = (new CColor(0, 0, 0, 255)).ToString();
            Canvas.font = sFont;

            var Y = Y_off + Size / 2 + FontSize / 3;
            var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

            Canvas.fillText(Text, X, Y);

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
        case EDrawingButtonState.Hover   : ImageData = this.m_oImageData.Hover; break;
        case EDrawingButtonState.Active  : ImageData = this.m_oImageData.Active; break;
        case EDrawingButtonState.Disabled: ImageData = this.m_oImageData.Disabled; break;
        case EDrawingButtonState.Selected: ImageData = this.m_oImageData.Selected; break;
        default:
        case EDrawingButtonState.Normal  : ImageData = this.m_oImageData.Normal; break;
    }

    if (ImageData)
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
        case EDrawingButtonType.NextVariant    : this.m_oGameTree.GoTo_NextVariant(); break;
        case EDrawingButtonType.PrevVariant    : this.m_oGameTree.GoTo_PrevVariant(); break;
        case EDrawingButtonType.EditModeMove   : this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.Move); break;
        case EDrawingButtonType.EditModeScores : this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.CountScores); break;
        case EDrawingButtonType.EditModeAddRem : this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddRemove); break;
        case EDrawingButtonType.EditModeTr     : this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkTr); break;
        case EDrawingButtonType.EditModeSq     : this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkSq); break;
        case EDrawingButtonType.EditModeCr     : this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkCr); break;
        case EDrawingButtonType.EditModeX      : this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkX); break;
        case EDrawingButtonType.EditModeText   : this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkTx); break;
        case EDrawingButtonType.EditModeNum    : this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkNum); break;
        case EDrawingButtonType.AutoPlay       : if (EDrawingButtonState2.AutoPlayStopped === this.m_nState2) this.m_oGameTree.Start_AutoPlay(); else this.m_oGameTree.Stop_AutoPlay(); break;
        case EDrawingButtonType.WindowClose    : this.m_oGameTree.Close(); break;
        case EDrawingButtonType.GameInfo       :
        {
            var sId = this.HtmlElement.Control.HtmlElement.id + "GameInfo";

            var oDiv = document.getElementById(sId);
            if (oDiv)
            {
                oDiv.style.left = "100px";
                oDiv.style.top  = "100px";
            }
            else
            {
                oDiv = document.createElement("div");
                oDiv.setAttribute("id", sId);
                oDiv.setAttribute("style", "position:absolute;padding:0;margin:0;width:500px;height: 500px; left : 100px; top:100px;");
                oDiv.setAttribute("oncontextmenu", "return false;");
                var aBody = document.getElementsByTagName('body');

                if (aBody.length > 0)
                {
                    var oBody = aBody[0];
                    oBody.appendChild(oDiv);

                    var oWindow = new CDrawingInfoWindow();
                    oWindow.Init(sId, this.m_oGameTree);
                }
            }

            break;
        }
        case EDrawingButtonType.WindowOK:
        {
            if (this.m_oGameTree)
                this.m_oGameTree.Handle_OK();

            break;
        }
        case EDrawingButtonType.WindowCancel:
        {
            if (this.m_oGameTree)
                this.m_oGameTree.Handle_Cancel();

            break;
        }
    };
};
CDrawingButton.prototype.private_GetHint = function()
{
    switch(this.m_nType)
    {
        case EDrawingButtonType.BackwardToStart: return "Back to the start";
        case EDrawingButtonType.Backward_5     : return "Back 5 moves";
        case EDrawingButtonType.Backward       : return "Back";
        case EDrawingButtonType.Forward        : return "Forward";
        case EDrawingButtonType.Forward_5      : return "Forward 5 moves";
        case EDrawingButtonType.ForwardToEnd   : return "Go to the end";
        case EDrawingButtonType.NextVariant    : return "Next variant";
        case EDrawingButtonType.PrevVariant    : return "Previous variant";
        case EDrawingButtonType.EditModeMove   : return "Moves (F1)";
        case EDrawingButtonType.EditModeScores : return "Count Scores (F2)";
        case EDrawingButtonType.EditModeAddRem : return "Editor (F3)";
        case EDrawingButtonType.EditModeTr     : return "Triangles (F4)";
        case EDrawingButtonType.EditModeSq     : return "Squares (F5)";
        case EDrawingButtonType.EditModeCr     : return "Circles (F6)";
        case EDrawingButtonType.EditModeX      : return "X marks (F7)";
        case EDrawingButtonType.EditModeText   : return "Text labels (F8)";
        case EDrawingButtonType.EditModeNum    : return "Numeric labels (F9)";
        case EDrawingButtonType.AutoPlay       : if (EDrawingButtonState2.AutoPlayStopped === this.m_nState2) return "Autoplay start"; else return "Autoplay stop";
        case EDrawingButtonType.WindowClose    : return "Close";
        case EDrawingButtonType.GameInfo       : return "Game info";
        case EDrawingButtonType.WindowCancel   : return "Cancel";
        case EDrawingButtonType.WindowOK       : return "OK";
    };
};
CDrawingButton.prototype.private_RegisterButton = function()
{
    if (this.m_oDrawing)
    {
        switch(this.m_nType)
        {
            case EDrawingButtonType.BackwardToStart: this.m_oDrawing.Register_BackwardToStartButton(this); break;
            case EDrawingButtonType.Backward_5     : this.m_oDrawing.Register_Backward_5Button     (this); break;
            case EDrawingButtonType.Backward       : this.m_oDrawing.Register_BackwardButton       (this); break;
            case EDrawingButtonType.Forward        : this.m_oDrawing.Register_ForwardButton        (this); break;
            case EDrawingButtonType.Forward_5      : this.m_oDrawing.Register_Forward_5Button      (this); break;
            case EDrawingButtonType.ForwardToEnd   : this.m_oDrawing.Register_ForwardToEndButton   (this); break;
            case EDrawingButtonType.NextVariant    : this.m_oDrawing.Register_NextVariantButton    (this); break;
            case EDrawingButtonType.PrevVariant    : this.m_oDrawing.Register_PrevVariantButton    (this); break;
            case EDrawingButtonType.EditModeMove   : this.m_oDrawing.Register_EditModeMoveButton   (this); break;
            case EDrawingButtonType.EditModeScores : this.m_oDrawing.Register_EditModeScoresButton (this); break;
            case EDrawingButtonType.EditModeAddRem : this.m_oDrawing.Register_EditModeAddRemButton (this); break;
            case EDrawingButtonType.EditModeTr     : this.m_oDrawing.Register_EditModeTrButton     (this); break;
            case EDrawingButtonType.EditModeSq     : this.m_oDrawing.Register_EditModeSqButton     (this); break;
            case EDrawingButtonType.EditModeCr     : this.m_oDrawing.Register_EditModeCrButton     (this); break;
            case EDrawingButtonType.EditModeX      : this.m_oDrawing.Register_EditModeXButton      (this); break;
            case EDrawingButtonType.EditModeText   : this.m_oDrawing.Register_EditModeTextButton   (this); break;
            case EDrawingButtonType.EditModeNum    : this.m_oDrawing.Register_EditModeNumButton    (this); break;
            case EDrawingButtonType.AutoPlay       : this.m_oDrawing.Register_AutoPlayButton       (this); break;
        };
    }
};

