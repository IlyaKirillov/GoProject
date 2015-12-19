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
    WindowCancel    : 22,
    Settings        : 23,
    Pass            : 24,
    About           : 25,
    TabComments     : 26,
    TabNavigator    : 27
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

    //this.m_oNormaBColor    = new CColor(217, 217, 217, 255);
    //this.m_oNormaFColor    = new CColor(  0,   0,   0, 255);
    //this.m_oHoverBColor    = new CColor( 54, 101, 179, 255);
    //this.m_oHoverFColor    = new CColor(255, 255, 255, 255);
    //this.m_oActiveBColor   = new CColor( 54, 101, 179, 255);
    //this.m_oActiveFColor   = new CColor(255, 255, 255, 255);
    //this.m_oDisabledBColor = new CColor(217, 217, 217, 255);
    //this.m_oDisabledFColor = new CColor(140, 140, 140, 255);

    this.m_oNormaBColor    = new CColor(0, 0, 0, 51);
    this.m_oNormaFColor    = new CColor(255, 255, 255, 255);
    this.m_oHoverBColor    = new CColor(0, 0, 0, 102);
    this.m_oHoverFColor    = new CColor(255, 255, 255, 255);
    this.m_oActiveBColor   = new CColor(0, 0, 0, 153);
    this.m_oActiveFColor   = new CColor(255, 255, 255, 255);
    this.m_oDisabledBColor = new CColor(0, 0, 0, 0);
    this.m_oDisabledFColor = new CColor(140, 140, 140, 255);
    this.m_oSelectedBColor = new CColor(  0, 175, 240, 255);

    this.m_nW = 0;
    this.m_nH = 0;

    var oThis = this;

    this.private_OnMouseDown = function(e)
    {
        if (EDrawingButtonState.Disabled !== oThis.m_nState)
        {
            check_MouseDownEvent(e, true);
            oThis.m_nState = EDrawingButtonState.Active;
            oThis.private_UpdateState();
            e.stopImmediatePropagation();

            oThis.HtmlElement.Control.HtmlElement.style.transition = "transform 0.1s ease-out";
            oThis.HtmlElement.Control.HtmlElement.style.transform = "scale(0.9)";
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

        oThis.private_OnFocus();
        oThis.HtmlElement.Control.HtmlElement.style.transition = "transform 0.2s ease-out";
        oThis.HtmlElement.Control.HtmlElement.style.transform = "scale(1)";
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

            oThis.HtmlElement.Control.HtmlElement.style.transition = "transform 0.2s ease-out";
            oThis.HtmlElement.Control.HtmlElement.style.transform = "scale(1)";
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
    oDivElement.style.backgroundColor = 'rgba(217,217,217,1)';

    var oCanvasElement = document.createElement("canvas");
    oCanvasElement.setAttribute("id", sDivId + "_canvas");
    oCanvasElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oCanvasElement.setAttribute("oncontextmenu", "return false;");

    oCanvasElement.style['-webkit-transition'] = "background 2s";
    oCanvasElement.style['transition']         = "background 2s";

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
    this.m_oImageData.Disabled = this.private_Draw(this.m_oDisabledBColor, this.m_oDisabledFColor, W, H, true);
    this.m_oImageData.Selected = this.private_Draw(this.m_oHoverBColor,    this.m_oHoverFColor,    W, H);

    var oDivElement = this.HtmlElement.Control.HtmlElement;

    var oHead  = document.getElementsByTagName('head')[0];
    var oStyle = document.createElement('style');
    var oRules = document.createTextNode('a#my_link:hover{color:#ff0000 !important;}');

    oStyle.type = 'text/css';
    if (oStyle.styleSheet)
        oStyle.styleSheet.cssText = oRules.nodeValue;
    else
        oStyle.appendChild(oRules);

    oHead.appendChild(oStyle);

    this.private_UpdateState();
};
CDrawingButton.prototype.private_Draw = function(BackColor, FillColor, W, H, bDisabled)
{
    var Canvas = this.HtmlElement.Canvas.Control.HtmlElement.getContext("2d");

    Canvas.clearRect(0, 0, W, H);

    Canvas.fillStyle = BackColor.ToString();
    Canvas.fillRect(0, 0, W, H);

    Canvas.fillStyle = FillColor.ToString();
    Canvas.strokeStyle = FillColor.ToString();

    // Дополнительные параметры для квадратных кнопок
    var Size  = (Math.min(W, H) * 0.8) | 0;
    var X_off = (W - Size) / 2;
    var Y_off = (H - Size) / 2;

    switch(this.m_nType)
    {
        case EDrawingButtonType.BackwardToStart:
        {
            var Img = document.getElementById(bDisabled ? "imgBackSDisabled" : "imgBackS");
            Canvas.drawImage(Img, 0, 0);

            //this.private_DrawTriangle(Size, X_off, Y_off, Canvas, -1);
            //var X_1_10 = Math.ceil(X_off + Size / 10 + 0.5);
            //var Y_1_5  = Math.ceil(Y_off + Size / 5 + 0.5);
            //var _W = Math.floor(Size / 10 + 0.5);
            //var _H = Math.floor(3 * Size / 5 + 0.5);
            //Canvas.fillRect(X_1_10, Y_1_5, _W, _H);

            break;
        }
        case EDrawingButtonType.Backward_5:
        {
            var Img = document.getElementById(bDisabled ? "imgBack5Disabled" : "imgBack5");
            Canvas.drawImage(Img, 0, 0);

            //this.private_DrawTriangle(Size, X_off - Size / 10, Y_off, Canvas, -1);
            //var X_8_10 = Math.ceil(X_off + 8 * Size / 10 + 0.5);
            //var Y_1_5  = Math.ceil(Y_off + Size / 5 + 0.5);
            //var _W = Math.floor(Size / 10 + 0.5);
            //var _H = Math.floor(3 * Size / 5 + 0.5);
            //Canvas.fillRect(X_8_10, Y_1_5, _W, _H);

            break;
        }
        case EDrawingButtonType.Backward:
        {
            var Img = document.getElementById(bDisabled ? "imgBackDisabled" : "imgBack");
            Canvas.drawImage(Img, 0, 0);
            //this.private_DrawTriangle(Size, X_off - Size / 10, Y_off, Canvas, -1);
            break;
        }
        case EDrawingButtonType.Forward:
        {
            var Img = document.getElementById(bDisabled ? "imgForwDisabled" : "imgForw");
            Canvas.drawImage(Img, 0, 0);
            //this.private_DrawTriangle(Size, X_off - Size / 10, Y_off, Canvas, 1);
            break;
        }
        case EDrawingButtonType.Forward_5:
        {
            var Img = document.getElementById(bDisabled ? "imgForw5Disabled" : "imgForw5");
            Canvas.drawImage(Img, 0, 0);

            //this.private_DrawTriangle(Size, X_off + Size / 10, Y_off, Canvas, 1);
            //var X_1_10 = Math.ceil(X_off + Size / 10 + 0.5);
            //var Y_1_5  = Math.ceil(Y_off + Size / 5 + 0.5);
            //var _W = Math.floor(Size / 10 + 0.5);
            //var _H = Math.floor(3 * Size / 5 + 0.5);
            //Canvas.fillRect(X_1_10, Y_1_5, _W, _H);

            break;
        }
        case EDrawingButtonType.ForwardToEnd:
        {
            var Img = document.getElementById(bDisabled ? "imgForwEDisabled" : "imgForwE");
            Canvas.drawImage(Img, 0, 0);

            //this.private_DrawTriangle(Size, X_off, Y_off, Canvas, 1);
            //var X_8_10 = Math.ceil(X_off + 8 * Size / 10 + 0.5);
            //var Y_1_5  = Math.ceil(Y_off + Size / 5 + 0.5);
            //var _W = Math.floor(Size / 10 + 0.5);
            //var _H = Math.floor(3 * Size / 5 + 0.5);
            //Canvas.fillRect(X_8_10, Y_1_5, _W, _H);

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
            Canvas.lineTo(X2, Y2);
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
            var D1 = (Size * 4 / 5) | 0;
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
                        oImageData.data[Index + 3] = BackColor.a;
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
            Canvas.moveTo(0, 0);
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
            Canvas.moveTo(0, 0);
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
        case EDrawingButtonType.Settings:
        {

            var PenWidth = 0.02 * Size;
            var r2    = Size / 2 - Size / 30;
            var shift = PenWidth * 4;
            var r     = Size / 4;// - shift;


            Canvas.lineWidth = Math.ceil(PenWidth * 7 + 0.5);
            Canvas.beginPath();
            Canvas.arc(X_off + Size / 2, Y_off + Size / 2, r, 0, 2 * Math.PI, false);
            Canvas.stroke();

            Canvas.lineWidth = Math.ceil(PenWidth * 5 + 0.5);

            for (var Index = 0, Count = 9; Index < Count; Index++)
            {
                Canvas.beginPath();
                var nAngle = (360 / Count * Index)  * Math.PI / 180;
                Canvas.lineTo(X_off + r  * Math.cos(nAngle) + Size / 2, Y_off - r  * Math.sin(nAngle) + Size / 2);
                Canvas.lineTo(X_off + r2 * Math.cos(nAngle) + Size / 2, Y_off - r2 * Math.sin(nAngle) + Size / 2);
                Canvas.stroke();
            }

            break;
        }
        case EDrawingButtonType.Pass:
        {
            var Text       = "Pass";
            var FontSize   = Size * 0.9;
            var FontFamily = "Times New Roman, Sans serif";
            var sFont      = FontSize + "px " + FontFamily;


            Canvas.font = sFont;

            var Y = Y_off + Size / 2 + FontSize / 3;
            var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

            Canvas.fillText(Text, X, Y);

            break;
        }
        case EDrawingButtonType.About:
        {
            var PenWidth = 0.02 * Size;
            var r     = Size / 2;
            var shift = PenWidth * 4;

            Canvas.lineWidth = Math.ceil(PenWidth + 0.5);
            Canvas.beginPath();
            Canvas.arc(X_off + Size / 2, Y_off + Size / 2, r - shift, 0, 2 * Math.PI, false);
            Canvas.stroke();

            var Text       = "?";
            var FontSize   = Size * 0.9;
            var FontFamily = "Times New Roman, Sans serif";
            var sFont      = FontSize + "px " + FontFamily;


            Canvas.font = sFont;

            var Y = Y_off + Size / 2 + FontSize / 3;
            var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

            Canvas.fillText(Text, X, Y);

            break;
        }
        case EDrawingButtonType.TabComments:
        {
            var X_0 = Math.ceil(X_off +  3 * Size / 20 + 0.5);
            var X_1 = Math.ceil(X_off + 16 * Size / 20 + 0.5);
            var X_2 = Math.ceil(X_off + 14 * Size / 20 + 0.5);
            var X_3 = Math.ceil(X_off + 11 * Size / 20 + 0.5);
            var Y_0 = Math.ceil(Y_off +  5 * Size / 20 + 0.5);
            var Y_1 = Math.ceil(Y_off + 14 * Size / 20 + 0.5);
            var Y_2 = Math.ceil(Y_off + 18 * Size / 20 + 0.5);

            Canvas.lineWidth = 2;

            Canvas.beginPath();
            Canvas.moveTo(X_0, Y_0);
            Canvas.lineTo(X_1, Y_0);
            Canvas.lineTo(X_1, Y_1);
            Canvas.lineTo(X_2, Y_1);
            Canvas.lineTo(X_2, Y_2);
            Canvas.lineTo(X_3, Y_1);
            Canvas.lineTo(X_0, Y_1);
            Canvas.closePath();
            Canvas.stroke();

            break;
        }
        case EDrawingButtonType.TabNavigator:
        {
            var X_0 = X_off + 0;
            var X_1 = X_off +  6 * Size / 20;
            var X_2 = X_off + 14 * Size / 20;
            var X_3 = X_off + Size;

            var Y_1 = Y_off +  6 * Size / 20;
            var Y_2 = Y_off + 14 * Size / 20;

            var R = Size / 7;

            Canvas.lineWidth = 1;
            Canvas.lineJoin = "miter";
            Canvas.strokeStyle = 'rgba(0,0,0, 1)';//FillColor.ToString();

            Canvas.beginPath();
            Canvas.moveTo(X_0 | 0, Y_1 | 0);
            Canvas.lineTo(X_3 | 0, Y_1 | 0);
            Canvas.stroke();

            Canvas.beginPath();
            Canvas.moveTo(X_1 | 0, Y_1 | 0);
            Canvas.lineTo(X_1 | 0, Y_2 | 0);
            Canvas.lineTo(X_3 | 0, Y_2 | 0);
            Canvas.stroke();

            Canvas.lineWidth = 1;
            Canvas.strokeStyle = (new CColor(0, 0, 0)).ToString();
            Canvas.fillStyle   = (new CColor(255, 255, 255)).ToString();
            Canvas.beginPath();
            Canvas.arc(X_2, Y_1, R, 0, 2 * Math.PI, false);
            Canvas.fill();
            Canvas.stroke();

            Canvas.beginPath();
            Canvas.arc(X_2, Y_2, R, 0, 2 * Math.PI, false);
            Canvas.fill();
            Canvas.stroke();

            Canvas.fillStyle = (new CColor(0, 0, 0)).ToString();
            Canvas.beginPath();
            Canvas.arc(X_1, Y_1, R, 0, 2 * Math.PI, false);
            Canvas.fill();

            break;
        }
    }

    //return Canvas.toDataURL();
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
            CreateWindow(this.HtmlElement.Control.HtmlElement.id, EWindowType.GameInfo, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing});
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
        case EDrawingButtonType.Settings:
        {
            CreateWindow(this.HtmlElement.Control.HtmlElement.id, EWindowType.Settings, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing});
            break;
        }
        case EDrawingButtonType.Pass:
        {
            this.m_oGameTree.Pass();
            break;
        }
        case EDrawingButtonType.About:
        {
            CreateWindow(this.HtmlElement.Control.HtmlElement.id, EWindowType.About, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing});
            break;
        }
        case EDrawingButtonType.TabComments:
        case EDrawingButtonType.TabNavigator:
        {
            this.m_oParent.Select(this);
            break;
        }
    };
};
CDrawingButton.prototype.private_GetHint = function()
{
    switch(this.m_nType)
    {
        case EDrawingButtonType.BackwardToStart: return "Back to the start (Ctrl+Shift+Left)";
        case EDrawingButtonType.Backward_5     : return "Back 5 moves (Ctrl+Left)";
        case EDrawingButtonType.Backward       : return "Back (Left)";
        case EDrawingButtonType.Forward        : return "Forward (Right)";
        case EDrawingButtonType.Forward_5      : return "Forward 5 moves (Ctrl+Right)";
        case EDrawingButtonType.ForwardToEnd   : return "Go to the end (Ctrl+Shift+Right)";
        case EDrawingButtonType.NextVariant    : return "Next variant (Down)";
        case EDrawingButtonType.PrevVariant    : return "Previous variant (Up)";
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
        case EDrawingButtonType.Settings       : return "Settings";
        case EDrawingButtonType.Pass           : return "Pass";
        case EDrawingButtonType.About          : return "About";
        case EDrawingButtonType.TabComments    : return "Comments";
        case EDrawingButtonType.TabNavigator   : return "Navigator";
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
        }
    }
};

function CDrawingButtonBase(oDrawing)
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

    this.m_oNormaBColor    = new CColor(0, 0, 0, 51);
    this.m_oNormaFColor    = new CColor(255, 255, 255, 255);
    this.m_oHoverBColor    = new CColor(0, 0, 0, 102);
    this.m_oHoverFColor    = new CColor(255, 255, 255, 255);
    this.m_oActiveBColor   = new CColor(0, 0, 0, 153);
    this.m_oActiveFColor   = new CColor(255, 255, 255, 255);
    this.m_oDisabledBColor = new CColor(0, 0, 0, 0);
    this.m_oDisabledFColor = new CColor(140, 140, 140, 255);
    this.m_oSelectedBColor = new CColor(  0, 175, 240, 255);

    this.m_nW = 0;
    this.m_nH = 0;

    this.m_nLoadReady = 0;

    var oThis = this;

    this.private_OnMouseDown = function(e)
    {
        if (EDrawingButtonState.Disabled !== oThis.m_nState)
        {
            check_MouseDownEvent(e, true);
            oThis.m_nState = EDrawingButtonState.Active;
            oThis.private_UpdateState();
            e.stopImmediatePropagation();

            oThis.HtmlElement.Control.HtmlElement.style.transition = "transform 0.1s ease-out";
            oThis.HtmlElement.Control.HtmlElement.style.transform = "scale(0.9)";
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

        oThis.private_OnFocus();
        oThis.HtmlElement.Control.HtmlElement.style.transition = "transform 0.2s ease-out";
        oThis.HtmlElement.Control.HtmlElement.style.transform = "scale(1)";
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

            oThis.HtmlElement.Control.HtmlElement.style.transition = "transform 0.2s ease-out";
            oThis.HtmlElement.Control.HtmlElement.style.transform = "scale(1)";
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
CDrawingButtonBase.prototype.Init = function(sDivId, oGameTree)
{
    this.m_oGameTree = oGameTree;

    this.private_RegisterButton();
    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var oDivElement          = this.HtmlElement.Control.HtmlElement;

    var sHint = this.private_GetHint();
    oDivElement.setAttribute("title", sHint);
    oDivElement.style.backgroundColor = 'rgba(217,217,217,1)';

    var oCanvasElement = document.createElement("canvas");
    oCanvasElement.setAttribute("id", sDivId + "_canvas");
    oCanvasElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oCanvasElement.setAttribute("oncontextmenu", "return false;");

    oCanvasElement.style['-webkit-transition'] = "background 2s";
    oCanvasElement.style['transition']         = "background 2s";

    oDivElement.appendChild(oCanvasElement);

    this.HtmlElement.Canvas.Control = CreateControlContainer(sDivId + "_canvas");
    var oCanvasControl              = this.HtmlElement.Canvas.Control;
    oCanvasControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
    oCanvasControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    this.HtmlElement.Control.AddControl(oCanvasControl);

    oDivElement.onmousedown   = this.private_OnMouseDown;
    oDivElement.onmouseup     = this.private_OnMouseUp;
    oDivElement.onmouseover   = this.private_OnMouseOver;
    oDivElement.onmouseout    = this.private_OnMouseOut;
    oDivElement.onfocus       = this.private_OnFocus;
    oDivElement.tabIndex      = -1;
    oDivElement.style.outline = "none";
    oDivElement.draggable     = "true";
    oDivElement.ondragstart   = this.private_OnDragStart;

    this.Update_Size();
};
CDrawingButtonBase.prototype.Update_Size = function(bForce)
{
    if (true !== this.private_IsReady())
        return;

    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    if (W !== this.m_nW || H !== this.m_nH || true === bForce)
    {
        this.m_nW = W;
        this.m_nH = H;

        this.HtmlElement.Control.Resize(this.m_nW, this.m_nH);

        this.private_OnResize();
    }
};
CDrawingButtonBase.prototype.Set_Enabled = function(Value)
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
CDrawingButtonBase.prototype.Set_State2 = function(State2)
{
    if (this.m_nState2 !== State2)
    {
        this.m_nState2 = State2;
        this.private_OnResize();
        this.HtmlElement.Control.HtmlElement.setAttribute("title", this.private_GetHint());
    }
};
CDrawingButtonBase.prototype.Set_Selected = function(Value)
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
CDrawingButtonBase.prototype.private_OnResize = function()
{
    var H = this.m_nH;
    var W = this.m_nW;

    if (0 === W || 0 === H)
        return;

    this.m_oImageData.Active   = this.private_Draw(this.m_oActiveBColor,   this.m_oActiveFColor,   W, H);
    this.m_oImageData.Hover    = this.private_Draw(this.m_oHoverBColor,    this.m_oHoverFColor,    W, H);
    this.m_oImageData.Normal   = this.private_Draw(this.m_oNormaBColor,    this.m_oNormaFColor,    W, H);
    this.m_oImageData.Disabled = this.private_Draw(this.m_oDisabledBColor, this.m_oDisabledFColor, W, H, true);
    this.m_oImageData.Selected = this.private_Draw(this.m_oHoverBColor,    this.m_oHoverFColor,    W, H);

    var oDivElement = this.HtmlElement.Control.HtmlElement;

    var oHead  = document.getElementsByTagName('head')[0];
    var oStyle = document.createElement('style');
    var oRules = document.createTextNode('a#my_link:hover{color:#ff0000 !important;}');

    oStyle.type = 'text/css';
    if (oStyle.styleSheet)
        oStyle.styleSheet.cssText = oRules.nodeValue;
    else
        oStyle.appendChild(oRules);

    oHead.appendChild(oStyle);

    this.private_UpdateState();
};
CDrawingButtonBase.prototype.private_Draw = function(BackColor, FillColor, W, H, bDisabled)
{
    var Canvas = this.HtmlElement.Canvas.Control.HtmlElement.getContext("2d");

    Canvas.clearRect(0, 0, W, H);

    Canvas.fillStyle = BackColor.ToString();
    Canvas.fillRect(0, 0, W, H);

    Canvas.fillStyle = FillColor.ToString();
    Canvas.strokeStyle = FillColor.ToString();

    // Дополнительные параметры для квадратных кнопок
    var Size  = (Math.min(W, H) * 0.8) | 0;
    var X_off = (W - Size) / 2;
    var Y_off = (H - Size) / 2;

    this.private_DrawOnCanvas(Canvas, Size, X_off, Y_off, bDisabled, W, H);

    return Canvas.getImageData(0, 0, W, H);
};
CDrawingButtonBase.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
};
CDrawingButtonBase.prototype.private_DrawTriangle = function(Size, X_off, Y_off, Canvas, Direction)
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
CDrawingButtonBase.prototype.private_UpdateState = function()
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
CDrawingButtonBase.prototype.private_HandleMouseDown = function()
{
};
CDrawingButtonBase.prototype.private_GetHint = function()
{
    return "";
};
CDrawingButtonBase.prototype.private_RegisterButton = function()
{
};
CDrawingButtonBase.prototype.private_AddImageToLoad = function(sBase64)
{
    this.m_nLoadReady--;
    var oImage = new Image();
    var oThis = this;
    oImage.onload = function()
    {
        oThis.private_OnImageReady();
    };
    oImage.src = sBase64;
    return oImage;
};
CDrawingButtonBase.prototype.private_IsReady = function()
{
    return this.m_nLoadReady < 0 ? false : true;
};
CDrawingButtonBase.prototype.private_OnImageReady = function()
{
    this.m_nLoadReady++;

    if (this.m_nLoadReady >= 0)
        this.Update_Size(true);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка возврата в начало партии
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonBackwardToStart(oDrawing)
{
    CDrawingButtonBackwardToStart.superclass.constructor.call(this, oDrawing);

    this.m_oImage         = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDRIczM2u5QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAA80lEQVRYw+3XMYqFMBQF0JshlYgg8hqXIELERrfgAmaVA65DYQrTuASbIIKIVSBTDQy/m59A/od3+8AhvNxHBACM44hXyQdeLAxiEIMY9HYgIvoehsG1beve4oaklOi6ztV17aKDpJTo+96VZYk8z5GmaTzQL4aIsO87tNbiuq44oEfMsiziPM84MxQS4w0KjfEGKaUcEeG+b6zr+uWL8QZprYUxBkmSoKqqzyzL4oKstZimSRhjUBQFmqZxvijvoQ6NCvLsQ6KCFeMjSinlojb1X9S2bTiOA880tQy9XK21mOdZPHte8EeRQQxiEIMY9L/8AMSPglq/uMNKAAAAAElFTkSuQmCC");
    this.m_oImageDisabled = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDRcMrA1KxAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAA6UlEQVRYw+3XPQqEMBAF4Jdgr52VYBpvIlZWoodUUll5Ae+gjYKVnb1gttrFakGdJYGd1Al8+XvDAI4NAQDDMDgDkq6dEIMYxKC/A3lXF+z7bvq+h1IKaZqKb3PvBK73i122bWt83/9UAqtXprU24zhiXVccx2H3DWmtzTzPiKIIZVkKKaU90BlTVZWw+suoMCQgSsxjUNd1ZpomBEFAgnkMyrJMKKWwbRvqujZOJHVRFCKOYyzLQoIiedSUKLJvT4UiDcYzqmkaYz2p36gkSRCGIe4k9U+Ka57nt9sr7ssYxCAGMYhBF8cLoc5sGgK/ZxQAAAAASUVORK5CYII=");
}
CommonExtend(CDrawingButtonBackwardToStart, CDrawingButtonBase);

CDrawingButtonBackwardToStart.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var oImage = (bDisabled ? this.m_oImageDisabled : this.m_oImage);

    if (oImage)
        Canvas.drawImage(oImage, 0, 0);
};
CDrawingButtonBackwardToStart.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_BackwardToStart();
};
CDrawingButtonBackwardToStart.prototype.private_GetHint = function()
{
    return "Back to the start (Ctrl+Shift+Left)";
};
CDrawingButtonBackwardToStart.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_BackwardToStartButton(this);
};

//----------------------------------------------------------------------------------------------------------------------
// Кнопка перехода на 5 ходов назад
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonBackward5(oDrawing)
{
    CDrawingButtonBackward5.superclass.constructor.call(this, oDrawing);

    this.m_oImage         = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDRwVK5I7zwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAcUlEQVRYw+3VwQnAIAyFYVu6UJbqDB0vh9xFcA7xHALpCAptpbXvO77TDwENAQAAfkBECjPvvfujYoyuql5r9Z59SIyqekrJW/uwmJyzt3bETBuzfv7NedXJEDVV1F1fx3Y1iIgWESlmdvTsAAAAszsB2vBQahKN40YAAAAASUVORK5CYII=");
    this.m_oImageDisabled = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDSMBaZbFjgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAA80lEQVRYw+3XvQqDMBQF4HNtcBOsc0fBB9DB53dScHB1cepWcMkWxNulFilU1Cb9457xLPlIokkIt7Rti08mSRIAgIcvi4AEJCAB/QXIGMPDMPCsOj7pn+VkDaS15qIo0DQNmO9jH+b9ipytgLTWXFUVmBlxHIOIpv4y79+yZBNmHEekaYowDGmpXxu1F1OWJZgZWZYhiiJa6p3OkEvMZpBrzO//h4IgoDzPQUSo6xp93/NS/5YZco3atWQuUbv3kCvUS5t6PnjXdfej47HfErLxDDLGsOd5UErRmn7pGaRsfKq+79OWXi5oAhKQgAQkIIu5AvJV2EqdOHDMAAAAAElFTkSuQmCC");
}
CommonExtend(CDrawingButtonBackward5, CDrawingButtonBase);

CDrawingButtonBackward5.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var oImage = (bDisabled ? this.m_oImageDisabled : this.m_oImage);

    if (oImage)
        Canvas.drawImage(oImage, 0, 0);
};
CDrawingButtonBackward5.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_Backward(5);
};
CDrawingButtonBackward5.prototype.private_GetHint = function()
{
    return "Back 5 moves (Ctrl+Left)";
};
CDrawingButtonBackward5.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_Backward_5Button(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка перехода на 1 ход назад
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonBackward(oDrawing)
{
    CDrawingButtonBackward.superclass.constructor.call(this, oDrawing);

    this.m_oImage         = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDSUz9xsziAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAxUlEQVRYw+3VIQ7DMAwF0J+ppHABQSEhISVBPdLOsKvsEr1NSKQoKi0oq0IqdbQabN0lquwTPNnfthiGATXVA5UVgxjEIAbdDqSUmqWUrypAxpit7/unc+7Ttm1ZkDFm67oOADCOI3LO5UB7TAgBMUZRbGS/mBCCKBZqaswp0BWYe92hlJLw3gMArLWw1m7FO3QF6vTIqFEkGaJEkYV6j9Ja4+jraCg3JKUklmWZ13V9H30dDfXaTtMk+Q4xiEEMYhCD/lhfy3RcBznfWwkAAAAASUVORK5CYII=");
    this.m_oImageDisabled = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDSgeB2oRsAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAx0lEQVRYw+3XMQqEMBAF0D8h2AniGbyBFp7fSiGFrY1HsEkXxL/VwtY6bkTmHyA8kskPEQBYlgVPicPDYiADGchArwOllLjvOx8BijFyGAbM8wySeUExRk7TBJJomgYikg/0xRzHgbZtUVWVnF3La2DGcQRJdF2Huq4l21BrYy6B7sC8q4fKspS+7yEiCCFg2zZm36E7UJePTBulMkOaKLWh/kWt63r66RDtb1BKic45eO9P1YDXvrZFUYj1kIEMZCADGeiP+QAy+XDf76BlKwAAAABJRU5ErkJggg==");
}
CommonExtend(CDrawingButtonBackward, CDrawingButtonBase);

CDrawingButtonBackward.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var oImage = (bDisabled ? this.m_oImageDisabled : this.m_oImage);

    if (oImage)
        Canvas.drawImage(oImage, 0, 0);
};
CDrawingButtonBackward.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_Backward(1);
};
CDrawingButtonBackward.prototype.private_GetHint = function()
{
    return "Back (Left)";
};
CDrawingButtonBackward.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_BackwardButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка перехода на 1 ход вперед
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonForward(oDrawing)
{
    CDrawingButtonForward.superclass.constructor.call(this, oDrawing);

    this.m_oImage         = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDSkJnaKlNgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAxUlEQVRYw+3WIQ7DIBQG4L8NBiQCVVODqeFU21V6he0QPUsNhqQh2AossrsDvKVseb8n+QL8D4Zt29BTRnQWBjGIQQz6WZDW+mGMydQgUbNISgnn3EspBe/9FWMcbt2hUgpSSgCAZVkwz/N1+5EdxzGEEMhRTZc6hECOam4ZNYqk9pSo/xyM1trLWgsA8N6jZQyMPWGaQdSYJtA3MNUgKSWmaSLHVL9lpRTs+/4UQqzneeouWpZzflNj+IPGIAYxiEEMqsgHyjhf9O2e3l4AAAAASUVORK5CYII=");
    this.m_oImageDisabled = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDSgxrLss6QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAyUlEQVRYw+3VsQqDUAwF0JvycBPEbxBcBR38ficFB1cXP8HFTSS3U3/Al9LXNtkDB5KbyLquSKXqusYDiZWDHOQgB30t6LounufJJEAksSwLhmHAcRz8OEhEUFUVSGKaJlPU7ZEVRSFt20JVTVFRS12WpXRdB1XFOI4mqOiUvVAkTVAmsbdE/eZh3Ped8zxDRND3PfI8l4+BLDHRIGtMFOgdmKjXsW2bOQYAwt3X0TQNVBVZlollysLtxhAk2dg7yEEOcpCD/gn0BPdVbmFsgto0AAAAAElFTkSuQmCC");
}
CommonExtend(CDrawingButtonForward, CDrawingButtonBase);

CDrawingButtonForward.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var oImage = (bDisabled ? this.m_oImageDisabled : this.m_oImage);

    if (oImage)
        Canvas.drawImage(oImage, 0, 0);
};
CDrawingButtonForward.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_Forward(1);
};
CDrawingButtonForward.prototype.private_GetHint = function()
{
    return "Forward (Right)";
};
CDrawingButtonForward.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_ForwardButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка перехода на 5 ходов вперед
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonForward5(oDrawing)
{
    CDrawingButtonForward5.superclass.constructor.call(this, oDrawing);

    this.m_oImage         = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDSQ2nmr2RgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAZUlEQVRYw+3VMQrAIAyFYelhe84M7kHwHMU5S3qAVnCxpOH/xrfkQdCUAgBIRETOWuu1mm83xnAzc1X1lXy71pqb2WP4LP9E7/11+CynVPpSR5o/KdTKKPOblxXudIQ7rgAABHQDS2dNsnKXx6sAAAAASUVORK5CYII=");
    this.m_oImageDisabled = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDSQYQrz7iQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAxElEQVRYw+2VPQuDMBCG30j/QIduHQP5AQr6/5cQyBAQBxenbl0C2b0uOhQSxI8ULfdM4eXgHnJHAjAMwzAXoe/751JN13XUti1N9fdYvpfbfFBKvZaKnXPw3sNaSwAesbyqKrFHqFhTLKUEEcEYgxDCO5ZPsr8RqutalGWJcRy/mqfyLWy6Xq01WWshhEDTNJjHlMqzC+WU2rWAOaSKsz0//zGyUy11TpnVQrllVi/1MAzRpqk8O6lP9MjPlWEYhmGuzgcvy8ThfV4IDQAAAABJRU5ErkJggg==");
}
CommonExtend(CDrawingButtonForward5, CDrawingButtonBase);

CDrawingButtonForward5.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var oImage = (bDisabled ? this.m_oImageDisabled : this.m_oImage);

    if (oImage)
        Canvas.drawImage(oImage, 0, 0);
};
CDrawingButtonForward5.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_Forward(5);
};
CDrawingButtonForward5.prototype.private_GetHint = function()
{
    return "Forward 5 moves (Ctrl+Right)";
};
CDrawingButtonForward5.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_Forward_5Button(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка перехода в конец текущего варианта
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonForwardToEnd(oDrawing)
{
    CDrawingButtonForwardToEnd.superclass.constructor.call(this, oDrawing);

    this.m_oImage         = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDRAjSJ3hWgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABBElEQVRYw+3WwYmFMBAG4D8PvUgIiKYJERQv2oJXYatcsA4Pqxh42EQQIQQPImRr2DyzesgUMHyZyUwCPCxI3/ePwXRdh9fTKuRBHuRBHnRFVFVl2rY1nPOffwHleW7qujZBEFx+mD9npJQijmOkaYowDM0wDOQ8z/taprWGEIKs6wrOOZqmubRSVi1TSmGeZyco60vtCvXRlLlAfTz2Siksy/K97zs45yiKwtwKYowhy7KvKIogpYQQgtwGYoyhLEuTJAmklLhiBbyehLEGucJYgSilKIrCCcbq6dBaY9s2HMeBcRwvxViBAOD9fhM4isBF0mmayG17yP8YPciDPMiDHMcvBCGFxBHbK9gAAAAASUVORK5CYII=");
    this.m_oImageDisabled = this.private_AddImageToLoad("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwTDQ4kArhLJgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAA9UlEQVRYw+3WsY6FIBAF0CtQWNjTEWw0Uf+/9x/URBsNVnQmdhqZ1+wPLMo+s2H6S85MYALwskrGcXwNpixLsLdNKIIiKIIi6IkyxlDbtnSe59+ArLU0TROFaEb8NuCcg7UWxhgcx0FN0yRfBTHGUNd1QkS0LAsAPIoSPiHOOX4Qj6OEbzAUStwJh0CJux1xzlFVVbLvO83zjCzLiDH2vT10XReGYaBt25DnObTWtybE7mK6rqN1XaG1xhN3iL0J4w0KhfECOefQ930QjPemllIiTVMURfEoxvvZSykTKWWQ74cIcahSKlFKxQ9aBEVQBEXQv6wPn1Z3S2AlDhEAAAAASUVORK5CYII=");
}
CommonExtend(CDrawingButtonForwardToEnd, CDrawingButtonBase);

CDrawingButtonForwardToEnd.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var oImage = (bDisabled ? this.m_oImageDisabled : this.m_oImage);

    if (oImage)
        Canvas.drawImage(oImage, 0, 0);
};
CDrawingButtonForwardToEnd.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_ForwardToEnd();
};
CDrawingButtonForwardToEnd.prototype.private_GetHint = function()
{
    return "Go to the end (Ctrl+Shift+Right)";
};
CDrawingButtonForwardToEnd.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_ForwardToEndButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка перехода на следующую ветку
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonNextVariant(oDrawing)
{
    CDrawingButtonNextVariant.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonNextVariant, CDrawingButtonBase);

CDrawingButtonNextVariant.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
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
    Canvas.lineTo(X2, Y2);
    Canvas.lineTo(X2, Y1);
    Canvas.lineTo(X3, Y3);
    Canvas.lineTo(X2, Y5);
    Canvas.lineTo(X2, Y4);
    Canvas.lineTo(X0, Y4);
    Canvas.closePath();
    Canvas.fill();
};
CDrawingButtonNextVariant.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.GoTo_NextVariant();
};
CDrawingButtonNextVariant.prototype.private_GetHint = function()
{
    return "Next variant (Down)";
};
CDrawingButtonNextVariant.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_NextVariantButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка перехода на предыдущую ветку
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonPrevVariant(oDrawing)
{
    CDrawingButtonPrevVariant.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonPrevVariant, CDrawingButtonBase);

CDrawingButtonPrevVariant.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
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
    Canvas.lineTo(X2, Y2);
    Canvas.lineTo(X2, Y1);
    Canvas.lineTo(X3, Y3);
    Canvas.lineTo(X2, Y5);
    Canvas.lineTo(X2, Y4);
    Canvas.lineTo(X0, Y4);
    Canvas.closePath();
    Canvas.fill();
};
CDrawingButtonPrevVariant.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.GoTo_PrevVariant();
};
CDrawingButtonPrevVariant.prototype.private_GetHint = function()
{
    return "Previous variant (Up)";
};
CDrawingButtonPrevVariant.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_PrevVariantButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка включения режима ходов
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonEditModeMove(oDrawing)
{
    CDrawingButtonEditModeMove.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonEditModeMove, CDrawingButtonBase);

CDrawingButtonEditModeMove.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
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
};
CDrawingButtonEditModeMove.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.Move);
};
CDrawingButtonEditModeMove.prototype.private_GetHint = function()
{
    return "Moves (F1)";
};
CDrawingButtonEditModeMove.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_EditModeMoveButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка включения режима подсчета очков
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonEditModeScores(oDrawing)
{
    CDrawingButtonEditModeScores.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonEditModeScores, CDrawingButtonBase);

CDrawingButtonEditModeScores.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var oImageData = Canvas.createImageData(Size, Size);
    var D0 = (Size / 5) | 0;
    var D1 = (Size * 4 / 5) | 0;
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
                oImageData.data[Index + 3] = BackColor.a;
            }
        }
    }

    Canvas.putImageData(oImageData, X_off, Y_off);
};
CDrawingButtonEditModeScores.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.CountScores);
};
CDrawingButtonEditModeScores.prototype.private_GetHint = function()
{
    return "Count Scores (F2)";
};
CDrawingButtonEditModeScores.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_EditModeScoresButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка включения режима редактирования ноды
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonEditModeAddRem(oDrawing)
{
    CDrawingButtonEditModeAddRem.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonEditModeAddRem, CDrawingButtonBase);

CDrawingButtonEditModeAddRem.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var X = Math.ceil(X_off + 0.75 * Size + 0.5);
    var Y = Math.ceil(Y_off + 0.125 * Size + 0.5);
    var _W = Math.ceil(0.25 * Size + 0.5);
    var _H = Math.ceil(0.02 * Size + 0.5);
    var R;
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
};
CDrawingButtonEditModeAddRem.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddRemove);
};
CDrawingButtonEditModeAddRem.prototype.private_GetHint = function()
{
    return "Editor (F3)";
};
CDrawingButtonEditModeAddRem.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_EditModeAddRemButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка включения режима добавления треугольников
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonEditModeTr(oDrawing)
{
    CDrawingButtonEditModeTr.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonEditModeTr, CDrawingButtonBase);

CDrawingButtonEditModeTr.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
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
};
CDrawingButtonEditModeTr.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkTr);
};
CDrawingButtonEditModeTr.prototype.private_GetHint = function()
{
    return "Triangles (F4)";
};
CDrawingButtonEditModeTr.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_EditModeTrButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка включения режима добавления квадратов
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonEditModeSq(oDrawing)
{
    CDrawingButtonEditModeSq.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonEditModeSq, CDrawingButtonBase);

CDrawingButtonEditModeSq.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
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
};
CDrawingButtonEditModeSq.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkSq);
};
CDrawingButtonEditModeSq.prototype.private_GetHint = function()
{
    return "Squares (F5)";
};
CDrawingButtonEditModeSq.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_EditModeSqButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка включения режима добавления окружностей
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonEditModeCr(oDrawing)
{
    CDrawingButtonEditModeCr.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonEditModeCr, CDrawingButtonBase);

CDrawingButtonEditModeCr.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var PenWidth = 0.05 * Size;
    var r     = Size / 2;
    var shift = PenWidth * 4;

    Canvas.lineWidth = Math.ceil(PenWidth + 0.5);
    Canvas.beginPath();
    Canvas.arc(X_off + Size / 2, Y_off + Size / 2, r - shift, 0, 2 * Math.PI, false);
    Canvas.stroke();
};
CDrawingButtonEditModeCr.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkCr);
};
CDrawingButtonEditModeCr.prototype.private_GetHint = function()
{
    return "Circles (F6)";
};
CDrawingButtonEditModeCr.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_EditModeCrButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка включения режима добавления крестиков
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonEditModeX(oDrawing)
{
    CDrawingButtonEditModeX.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonEditModeX, CDrawingButtonBase);

CDrawingButtonEditModeX.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
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
};
CDrawingButtonEditModeX.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkX);
};
CDrawingButtonEditModeX.prototype.private_GetHint = function()
{
    return "X marks (F7)";
};
CDrawingButtonEditModeX.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_EditModeXButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка включения режима добавления текстовых меток
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonEditModeText(oDrawing)
{
    CDrawingButtonEditModeText.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonEditModeText, CDrawingButtonBase);

CDrawingButtonEditModeText.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var Text       = "A";
    var FontSize   = Size * 0.8;
    var FontFamily = "Arial";
    var sFont      = FontSize + "px " + FontFamily;

    Canvas.font = sFont;

    var Y = Y_off + Size / 2 + FontSize / 3;
    var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

    Canvas.fillText(Text, X, Y);
};
CDrawingButtonEditModeText.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkTx);
};
CDrawingButtonEditModeText.prototype.private_GetHint = function()
{
    return "Text labels (F8)";
};
CDrawingButtonEditModeText.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_EditModeTextButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка включения режима добавления числовых меток
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonEditModeNum(oDrawing)
{
    CDrawingButtonEditModeNum.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonEditModeNum, CDrawingButtonBase);

CDrawingButtonEditModeNum.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    var Text       = "1";
    var FontSize   = Size * 0.8;
    var FontFamily = "Helvetica, Arial, Verdana";
    var sFont      = FontSize + "px " + FontFamily;

    Canvas.font = sFont;

    var Y = Y_off + Size / 2 + FontSize / 3;
    var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

    Canvas.fillText(Text, X, Y);
};
CDrawingButtonEditModeNum.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkNum);
};
CDrawingButtonEditModeNum.prototype.private_GetHint = function()
{
    return "Numeric labels (F9)";
};
CDrawingButtonEditModeNum.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_EditModeNumButton    (this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка автопроигрывания
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonAutoPlay(oDrawing)
{
    CDrawingButtonAutoPlay.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonAutoPlay, CDrawingButtonBase);

CDrawingButtonAutoPlay.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled)
{
    if (EDrawingButtonState2.AutoPlayStopped === this.m_nState2)
    {
        this.private_DrawTriangle(Size, X_off, Y_off, Canvas, 1);
    }
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
};
CDrawingButtonAutoPlay.prototype.private_HandleMouseDown = function()
{
    if (EDrawingButtonState2.AutoPlayStopped === this.m_nState2)
        this.m_oGameTree.Start_AutoPlay();
    else
        this.m_oGameTree.Stop_AutoPlay();
};
CDrawingButtonAutoPlay.prototype.private_GetHint = function()
{
    if (EDrawingButtonState2.AutoPlayStopped === this.m_nState2)
        return "Autoplay start";
    else
        return "Autoplay stop";
};
CDrawingButtonAutoPlay.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_AutoPlayButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка Close
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonClose(oDrawing)
{
    CDrawingButtonClose.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonClose, CDrawingButtonBase);

CDrawingButtonClose.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H)
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

    Canvas.putImageData(oImageData, 0, 0);
};
CDrawingButtonClose.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Close();
};
CDrawingButtonClose.prototype.private_GetHint = function()
{
    return "Close";
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка GameInfo
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonGameInfo(oDrawing)
{
    CDrawingButtonGameInfo.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonGameInfo, CDrawingButtonBase);

CDrawingButtonGameInfo.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H)
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
};
CDrawingButtonGameInfo.prototype.private_HandleMouseDown = function()
{
    CreateWindow(this.HtmlElement.Control.HtmlElement.id, EWindowType.GameInfo, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing});
};
CDrawingButtonGameInfo.prototype.private_GetHint = function()
{
    return "Game info";
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка OK
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonOK(oDrawing)
{
    CDrawingButtonOK.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonOK, CDrawingButtonBase);

CDrawingButtonOK.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H)
{
    Canvas.lineWidth = 1;
    Canvas.moveTo(0, 0);
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
};
CDrawingButtonOK.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Handle_OK();
};
CDrawingButtonOK.prototype.private_GetHint = function()
{
    return "OK";
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка Cancel
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonCancel(oDrawing)
{
    CDrawingButtonCancel.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonCancel, CDrawingButtonBase);

CDrawingButtonCancel.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H)
{
    Canvas.lineWidth = 1;
    Canvas.moveTo(0, 0);
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
};
CDrawingButtonCancel.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Handle_Cancel();
};
CDrawingButtonCancel.prototype.private_GetHint = function()
{
    return "Cancel";
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка Settings
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonSettings(oDrawing)
{
    CDrawingButtonSettings.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonSettings, CDrawingButtonBase);

CDrawingButtonSettings.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H)
{
    var PenWidth = 0.02 * Size;
    var r2    = Size / 2 - Size / 30;
    var shift = PenWidth * 4;
    var r     = Size / 4;// - shift;


    Canvas.lineWidth = Math.ceil(PenWidth * 7 + 0.5);
    Canvas.beginPath();
    Canvas.arc(X_off + Size / 2, Y_off + Size / 2, r, 0, 2 * Math.PI, false);
    Canvas.stroke();

    Canvas.lineWidth = Math.ceil(PenWidth * 5 + 0.5);

    for (var Index = 0, Count = 9; Index < Count; Index++)
    {
        Canvas.beginPath();
        var nAngle = (360 / Count * Index)  * Math.PI / 180;
        Canvas.lineTo(X_off + r  * Math.cos(nAngle) + Size / 2, Y_off - r  * Math.sin(nAngle) + Size / 2);
        Canvas.lineTo(X_off + r2 * Math.cos(nAngle) + Size / 2, Y_off - r2 * Math.sin(nAngle) + Size / 2);
        Canvas.stroke();
    }
};
CDrawingButtonSettings.prototype.private_HandleMouseDown = function()
{
    CreateWindow(this.HtmlElement.Control.HtmlElement.id, EWindowType.Settings, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing});
};
CDrawingButtonSettings.prototype.private_GetHint = function()
{
    return "Settings";
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка Pass
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonPass(oDrawing)
{
    CDrawingButtonPass.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonPass, CDrawingButtonBase);

CDrawingButtonPass.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H)
{
    var Text       = "Pass";
    var FontSize   = Size * 0.9;
    var FontFamily = "Times New Roman, Sans serif";
    var sFont      = FontSize + "px " + FontFamily;

    Canvas.font = sFont;

    var Y = Y_off + Size / 2 + FontSize / 3;
    var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

    Canvas.fillText(Text, X, Y);
};
CDrawingButtonPass.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Pass();
};
CDrawingButtonPass.prototype.private_GetHint = function()
{
    return "Pass";
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка About
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonAbout(oDrawing)
{
    CDrawingButtonAbout.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonAbout, CDrawingButtonBase);

CDrawingButtonAbout.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H)
{
    var PenWidth = 0.02 * Size;
    var r     = Size / 2;
    var shift = PenWidth * 4;

    Canvas.lineWidth = Math.ceil(PenWidth + 0.5);
    Canvas.beginPath();
    Canvas.arc(X_off + Size / 2, Y_off + Size / 2, r - shift, 0, 2 * Math.PI, false);
    Canvas.stroke();

    var Text       = "?";
    var FontSize   = Size * 0.9;
    var FontFamily = "Times New Roman, Sans serif";
    var sFont      = FontSize + "px " + FontFamily;


    Canvas.font = sFont;

    var Y = Y_off + Size / 2 + FontSize / 3;
    var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

    Canvas.fillText(Text, X, Y);
};
CDrawingButtonAbout.prototype.private_HandleMouseDown = function()
{
    CreateWindow(this.HtmlElement.Control.HtmlElement.id, EWindowType.About, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing});
};
CDrawingButtonAbout.prototype.private_GetHint = function()
{
    return "About";
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка TabComments
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonTabComments(oDrawing)
{
    CDrawingButtonTabComments.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonTabComments, CDrawingButtonBase);

CDrawingButtonTabComments.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H)
{
    var X_0 = Math.ceil(X_off +  3 * Size / 20 + 0.5);
    var X_1 = Math.ceil(X_off + 16 * Size / 20 + 0.5);
    var X_2 = Math.ceil(X_off + 14 * Size / 20 + 0.5);
    var X_3 = Math.ceil(X_off + 11 * Size / 20 + 0.5);
    var Y_0 = Math.ceil(Y_off +  5 * Size / 20 + 0.5);
    var Y_1 = Math.ceil(Y_off + 14 * Size / 20 + 0.5);
    var Y_2 = Math.ceil(Y_off + 18 * Size / 20 + 0.5);

    Canvas.lineWidth = 2;

    Canvas.beginPath();
    Canvas.moveTo(X_0, Y_0);
    Canvas.lineTo(X_1, Y_0);
    Canvas.lineTo(X_1, Y_1);
    Canvas.lineTo(X_2, Y_1);
    Canvas.lineTo(X_2, Y_2);
    Canvas.lineTo(X_3, Y_1);
    Canvas.lineTo(X_0, Y_1);
    Canvas.closePath();
    Canvas.stroke();
};
CDrawingButtonTabComments.prototype.private_HandleMouseDown = function()
{
    this.m_oParent.Select(this);
};
CDrawingButtonTabComments.prototype.private_GetHint = function()
{
    return "Comments";
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка TabNavigator
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonTabNavigator(oDrawing)
{
    CDrawingButtonTabNavigator.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonTabNavigator, CDrawingButtonBase);

CDrawingButtonTabNavigator.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H)
{
    var X_0 = X_off + 0;
    var X_1 = X_off +  6 * Size / 20;
    var X_2 = X_off + 14 * Size / 20;
    var X_3 = X_off + Size;

    var Y_1 = Y_off +  6 * Size / 20;
    var Y_2 = Y_off + 14 * Size / 20;

    var R = Size / 7;

    Canvas.lineWidth = 1;
    Canvas.lineJoin = "miter";
    Canvas.strokeStyle = 'rgba(0,0,0, 1)';//FillColor.ToString();

    Canvas.beginPath();
    Canvas.moveTo(X_0 | 0, Y_1 | 0);
    Canvas.lineTo(X_3 | 0, Y_1 | 0);
    Canvas.stroke();

    Canvas.beginPath();
    Canvas.moveTo(X_1 | 0, Y_1 | 0);
    Canvas.lineTo(X_1 | 0, Y_2 | 0);
    Canvas.lineTo(X_3 | 0, Y_2 | 0);
    Canvas.stroke();

    Canvas.lineWidth = 1;
    Canvas.strokeStyle = (new CColor(0, 0, 0)).ToString();
    Canvas.fillStyle   = (new CColor(255, 255, 255)).ToString();
    Canvas.beginPath();
    Canvas.arc(X_2, Y_1, R, 0, 2 * Math.PI, false);
    Canvas.fill();
    Canvas.stroke();

    Canvas.beginPath();
    Canvas.arc(X_2, Y_2, R, 0, 2 * Math.PI, false);
    Canvas.fill();
    Canvas.stroke();

    Canvas.fillStyle = (new CColor(0, 0, 0)).ToString();
    Canvas.beginPath();
    Canvas.arc(X_1, Y_1, R, 0, 2 * Math.PI, false);
    Canvas.fill();

};
CDrawingButtonTabNavigator.prototype.private_HandleMouseDown = function()
{
    this.m_oParent.Select(this);
};
CDrawingButtonTabNavigator.prototype.private_GetHint = function()
{
    return "Navigator";
};