"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     27.11.14
 * Time     1:33
 */

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

function CDrawingButtonBase(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = oDrawing ? oDrawing.Get_GameTree() : null;
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
    this.m_oSelectedBColor = new CColor(0, 0, 0, 77);


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
            oThis.private_ClickTransformIn();
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
        oThis.private_ClickTransformOut();
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
            oThis.private_ClickTransformOut();
        }
    };
    this.private_OnFocus = function()
    {
        // При нажатии на кнопки выставляем фокус на доску, к которой привязаны кнопки.
        if (oThis.m_oGameTree && !(oThis instanceof CDrawingButtonGameInfo))
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
    oCanvasElement.draggable = "false";
    oCanvasElement['ondragstart'] = function(event) { event.preventDefault(); return false; };

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
CDrawingButtonBase.prototype.Hide = function()
{
	if (this.HtmlElement.Control && this.HtmlElement.Control.HtmlElement)
		this.HtmlElement.Control.HtmlElement.style.display = "none";
};
CDrawingButtonBase.prototype.Show = function()
{
	if (this.HtmlElement.Control && this.HtmlElement.Control.HtmlElement)
		this.HtmlElement.Control.HtmlElement.style.display = "block";
};
CDrawingButtonBase.prototype.private_OnResize = function()
{
    var H = this.m_nH;
    var W = this.m_nW;

    if (0 === W || 0 === H)
        return;

    this.m_oImageData.Active   = this.private_Draw(this.m_oActiveBColor,   this.m_oActiveFColor,   W, H);
    this.m_oImageData.Hover    = this.private_Draw(this.m_oHoverBColor,    this.m_oHoverFColor,    W, H, false, true);
    this.m_oImageData.Normal   = this.private_Draw(this.m_oNormaBColor,    this.m_oNormaFColor,    W, H);
    this.m_oImageData.Disabled = this.private_Draw(this.m_oDisabledBColor, this.m_oDisabledFColor, W, H, true);
    this.m_oImageData.Selected = this.private_Draw(this.m_oSelectedBColor, this.m_oHoverFColor,    W, H, false, true);

    this.private_UpdateState();
};
CDrawingButtonBase.prototype.private_Draw = function(BackColor, FillColor, _W, _H, bDisabled, bSelected)
{
    var Canvas = this.HtmlElement.Canvas.Control.HtmlElement.getContext("2d");

    var W = Common.ConvertToRetinaValue(_W);
    var H = Common.ConvertToRetinaValue(_H);

    Canvas.clearRect(0, 0, W, H);

    Canvas.fillStyle = BackColor.ToString();
    Canvas.fillRect(0, 0, W, H);

    Canvas.fillStyle = FillColor.ToString();
    Canvas.strokeStyle = FillColor.ToString();

    // Дополнительные параметры для квадратных кнопок
    var Size  = (Math.min(W, H) * 0.8) | 0;
    var X_off = (W - Size) / 2;
    var Y_off = (H - Size) / 2;

    this.private_DrawOnCanvas(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor);

    if (true === bSelected)
    {
    	this.private_DrawSelectionBounds(Canvas, W, H);
    }

    return Canvas.getImageData(0, 0, W, H);
};
CDrawingButtonBase.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
CDrawingButtonBase.prototype.private_ClickTransformIn = function()
{
    this.HtmlElement.Control.HtmlElement.style.transition = "transform 0.1s ease-out";
    this.HtmlElement.Control.HtmlElement.style.transform  = "scale(0.9)";
};
CDrawingButtonBase.prototype.private_ClickTransformOut = function()
{
    this.HtmlElement.Control.HtmlElement.style.transition = "transform 0.2s ease-out";
    this.HtmlElement.Control.HtmlElement.style.transform  = "scale(1)";
};
CDrawingButtonBase.prototype.private_DrawSelectionBounds = function(Canvas, W, H)
{
	Canvas.beginPath();
	Canvas.lineWidth = 1;
	Canvas.strokeStyle = (new CColor(0, 0, 0, 255)).ToString();
	Canvas.moveTo(0, 0);
	Canvas.lineTo(W, 0);
	Canvas.lineTo(W, H);
	Canvas.lineTo(0, H);
	Canvas.lineTo(0, 0);
	Canvas.stroke();
	Canvas.beginPath();
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка возврата в начало партии
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonBackwardToStart(oDrawing)
{
    CDrawingButtonBackwardToStart.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonBackwardToStart, CDrawingButtonBase);

CDrawingButtonBackwardToStart.prototype.private_DrawOnCanvas = function(oCanvas, nSize, nXoff, nYoff, bDisabled, nW, nH, BackColor, FillColor)
{
    oCanvas.lineWidth = nW / 18;
    oCanvas.moveTo(22 / 36 * nW, 12 / 36 * nW);
    oCanvas.lineTo(16 / 36 * nW, 18 / 36 * nW);
    oCanvas.lineTo(22 / 36 * nW, 24 / 36 * nW);
    oCanvas.stroke();

    oCanvas.moveTo(13 / 36 * nW, 10 / 36 * nW);
    oCanvas.lineTo(13 / 36 * nW, 26 / 36 * nW);
    oCanvas.stroke();
};
CDrawingButtonBackwardToStart.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_BackwardToStart();
};
CDrawingButtonBackwardToStart.prototype.private_GetHint = function()
{
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.backwardStart : "Back to the start")  + " (Ctrl+Shift+Left)";
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
}
CommonExtend(CDrawingButtonBackward5, CDrawingButtonBase);

CDrawingButtonBackward5.prototype.private_DrawOnCanvas = function(oCanvas, nSize, nXoff, nYoff, bDisabled, nW, nH, BackColor, FillColor)
{
    oCanvas.lineWidth = nW / 18;
    oCanvas.moveTo(18 / 36 * nW, 12 / 36 * nW);
    oCanvas.lineTo(12 / 36 * nW, 18 / 36 * nW);
    oCanvas.lineTo(18 / 36 * nW, 24 / 36 * nW);
    oCanvas.stroke();

    oCanvas.moveTo(24 / 36 * nW, 12 / 36 * nW);
    oCanvas.lineTo(18 / 36 * nW, 18 / 36 * nW);
    oCanvas.lineTo(24 / 36 * nW, 24 / 36 * nW);
    oCanvas.stroke();
};
CDrawingButtonBackward5.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_Backward(5);
};
CDrawingButtonBackward5.prototype.private_GetHint = function()
{
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.backward5 : "Back 5 moves") + " (Ctrl+Left)";
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
}
CommonExtend(CDrawingButtonBackward, CDrawingButtonBase);

CDrawingButtonBackward.prototype.private_DrawOnCanvas = function(oCanvas, nSize, nXoff, nYoff, bDisabled, nW, nH, BackColor, FillColor)
{
    oCanvas.lineWidth = nW / 18;
    oCanvas.moveTo(21 / 36 * nW, 12 / 36 * nW);
    oCanvas.lineTo(15 / 36 * nW, 18 / 36 * nW);
    oCanvas.lineTo(21 / 36 * nW, 24 / 36 * nW);
    oCanvas.stroke();
};
CDrawingButtonBackward.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_Backward(1);
};
CDrawingButtonBackward.prototype.private_GetHint = function()
{
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.backward1 : "Back") + " (Left)";
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
}
CommonExtend(CDrawingButtonForward, CDrawingButtonBase);

CDrawingButtonForward.prototype.private_DrawOnCanvas = function(oCanvas, nSize, nXoff, nYoff, bDisabled, nW, nH, BackColor, FillColor)
{
    oCanvas.lineWidth = nW / 18;
    oCanvas.moveTo(15 / 36 * nW, 12 / 36 * nW);
    oCanvas.lineTo(21 / 36 * nW, 18 / 36 * nW);
    oCanvas.lineTo(15 / 36 * nW, 24 / 36 * nW);
    oCanvas.stroke();
};
CDrawingButtonForward.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_Forward(1);
};
CDrawingButtonForward.prototype.private_GetHint = function()
{
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.forward1 : "Forward") + " (Right)";
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
}
CommonExtend(CDrawingButtonForward5, CDrawingButtonBase);

CDrawingButtonForward5.prototype.private_DrawOnCanvas = function(oCanvas, nSize, nXoff, nYoff, bDisabled, nW, nH, BackColor, FillColor)
{
    oCanvas.lineWidth = nW / 18;
    oCanvas.moveTo(12 / 36 * nW, 12 / 36 * nW);
    oCanvas.lineTo(18 / 36 * nW, 18 / 36 * nW);
    oCanvas.lineTo(12 / 36 * nW, 24 / 36 * nW);
    oCanvas.stroke();

    oCanvas.moveTo(18 / 36 * nW, 12 / 36 * nW);
    oCanvas.lineTo(24 / 36 * nW, 18 / 36 * nW);
    oCanvas.lineTo(18 / 36 * nW, 24 / 36 * nW);
    oCanvas.stroke();
};
CDrawingButtonForward5.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_Forward(5);
};
CDrawingButtonForward5.prototype.private_GetHint = function()
{
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.forward5 : "Forward 5 moves") + " (Ctrl+Right)";
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

}
CommonExtend(CDrawingButtonForwardToEnd, CDrawingButtonBase);

CDrawingButtonForwardToEnd.prototype.private_DrawOnCanvas = function(oCanvas, nSize, nXoff, nYoff, bDisabled, nW, nH, BackColor, FillColor)
{
    oCanvas.lineWidth = nW / 18;
    oCanvas.moveTo(14 / 36 * nW, 12 / 36 * nW);
    oCanvas.lineTo(20 / 36 * nW, 18 / 36 * nW);
    oCanvas.lineTo(14 / 36 * nW, 24 / 36 * nW);
    oCanvas.stroke();

    oCanvas.moveTo(23 / 36 * nW, 10 / 36 * nW);
    oCanvas.lineTo(23 / 36 * nW, 26 / 36 * nW);
    oCanvas.stroke();
};
CDrawingButtonForwardToEnd.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Step_ForwardToEnd();
};
CDrawingButtonForwardToEnd.prototype.private_GetHint = function()
{
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.forwardEnd : "Go to the end") + " (Ctrl+Shift+Right)";
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

CDrawingButtonNextVariant.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.nextVariant : "Next variant") + " (Down)";
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

CDrawingButtonPrevVariant.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.prevVariant : "Previous variant") + " (Up)";
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

CDrawingButtonEditModeMove.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editModeMoves : "Moves") + " (F1)";
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

CDrawingButtonEditModeScores.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editModeScores : "Count Scores") + " (F2)";
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

CDrawingButtonEditModeAddRem.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editModeEditor : "Editor") + " (F3)";
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

CDrawingButtonEditModeTr.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editModeTriangles : "Triangles") + " (F4)";
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

CDrawingButtonEditModeSq.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editModeSquares : "Squares") + " (F5)";
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

CDrawingButtonEditModeCr.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editModeCircles : "Circles") + " (F6)";
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

CDrawingButtonEditModeX.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editModeXMarks : "X marks") + " (F7)";
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

CDrawingButtonEditModeText.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editModeText : "Text labels") + " (F8)";
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

CDrawingButtonEditModeNum.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editModeNumbers : "Numeric labels") + " (F9)";
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

CDrawingButtonAutoPlay.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
        return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.startAutoplay : "Start autoplay");
    else
        return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.stopAutoplay : "Stop autoplay");
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

CDrawingButtonClose.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
    var oImageData = Canvas.createImageData(W, H);
    var oBitmap = oImageData.data;

    // TODO: Переделать по-нормальному
    var nT = [];
    for (var nIndex = 0; nIndex <= 8; ++nIndex)
    {
        nT[nIndex] = Common.ConvertToRetinaValue(nIndex);
    }

    var X_off = (W - nT[8]) / 2 | 0;
    var Y_off = (H - nT[8]) / 2 | 0;

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
            if ((nT[0] === y && ((nT[0] <= x && x <= nT[1]) || (nT[6] <= x && x <= nT[7]))) ||
                (nT[1] === y && ((nT[1] <= x && x <= nT[2]) || (nT[5] <= x && x <= nT[6]))) ||
                (nT[2] === y && ((nT[2] <= x && x <= nT[3]) || (nT[4] <= x && x <= nT[5]))) ||
                (nT[3] === y && (nT[3] <= x && x <= nT[4])) ||
                (nT[4] === y && (nT[3] <= x && x <= nT[4])) ||
                (nT[5] === y && ((nT[2] <= x && x <= nT[3]) || (nT[4] <= x && x <= nT[5]))) ||
                (nT[6] === y && ((nT[1] <= x && x <= nT[2]) || (nT[5] <= x && x <= nT[6]))) ||
                (nT[7] === y && ((nT[0] <= x && x <= nT[1]) || (nT[6] <= x && x <= nT[7]))))
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
    return (window.g_oLocalization ? window.g_oLocalization.common.button.close : "Close");
};
CDrawingButtonClose.prototype.private_ClickTransformIn = function()
{
};
CDrawingButtonClose.prototype.private_ClickTransformOut = function()
{
};
CDrawingButtonClose.prototype.private_DrawSelectionBounds = function(Canvas, W, H)
{
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка GameInfo
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonGameInfo(oDrawing)
{
    CDrawingButtonGameInfo.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonGameInfo, CDrawingButtonBase);

CDrawingButtonGameInfo.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.gameInfo : "Game info");
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка OK
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonOK(oDrawing)
{
    CDrawingButtonOK.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonOK, CDrawingButtonBase);

CDrawingButtonOK.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
	var sOK = "OK";
	if (window.g_oLocalization)
		sOK = window.g_oLocalization.common.button.ok;

    Canvas.lineWidth = 1;
    Canvas.moveTo(0, 0);
    Canvas.lineTo(0, H);
    Canvas.lineTo(W, H);
    Canvas.lineTo(W, 0);
    Canvas.lineTo(0, 0);
    Canvas.stroke();

    var Text       = sOK;
    var FontSize   = Size * 0.8;
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
	var sOK = "OK";
	if (window.g_oLocalization)
		sOK = window.g_oLocalization.common.button.ok;

    return sOK;
};
CDrawingButtonOK.prototype.private_ClickTransformIn = function()
{
};
CDrawingButtonOK.prototype.private_ClickTransformOut = function()
{
};
CDrawingButtonOK.prototype.private_DrawSelectionBounds = function(Canvas, W, H)
{
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка Cancel
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonCancel(oDrawing)
{
    CDrawingButtonCancel.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonCancel, CDrawingButtonBase);

CDrawingButtonCancel.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
	var sCancel = "Cancel";
	if (window.g_oLocalization)
		sCancel = window.g_oLocalization.common.button.cancel;

	Canvas.lineWidth = 1;
    Canvas.moveTo(0, 0);
    Canvas.lineTo(0, H);
    Canvas.lineTo(W, H);
    Canvas.lineTo(W, 0);
    Canvas.lineTo(0, 0);
    Canvas.stroke();

    var Text       = sCancel;
    var FontSize   = Size * 0.8;
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
	var sCancel = "Cancel";
	if (window.g_oLocalization)
		sCancel = window.g_oLocalization.common.button.cancel;

    return sCancel;
};
CDrawingButtonCancel.prototype.private_ClickTransformIn = function()
{
};
CDrawingButtonCancel.prototype.private_ClickTransformOut = function()
{
};
CDrawingButtonCancel.prototype.private_DrawSelectionBounds = function(Canvas, W, H)
{
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка Settings
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonSettings(oDrawing)
{
    CDrawingButtonSettings.superclass.constructor.call(this, oDrawing);

    this.m_oTransformCanvas = null;
}
CommonExtend(CDrawingButtonSettings, CDrawingButtonBase);

CDrawingButtonSettings.prototype.Init = function(sDivId, oGameTree)
{
    CDrawingButtonToolbarCustomize.superclass.Init.apply(this, arguments);

    var oDivElement = this.HtmlElement.Control.HtmlElement;
    var oCanvasElement = document.createElement("canvas");
    oCanvasElement.setAttribute("id", sDivId + "_transform");
    oCanvasElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oCanvasElement.setAttribute("oncontextmenu", "return false;");
    oCanvasElement.width  = Common.ConvertToRetinaValue(36);
    oCanvasElement.height = Common.ConvertToRetinaValue(36);

    oCanvasElement.style.width  = "36px";
    oCanvasElement.style.height = "36px";

    oCanvasElement.draggable = "false";
    oCanvasElement['ondragstart'] = function(event) { event.preventDefault(); return false; };
    oDivElement.appendChild(oCanvasElement);

    var oCanvasControl = CreateControlContainer(sDivId + "_canvas");
    oCanvasControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
    oCanvasControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    this.HtmlElement.Control.AddControl(oCanvasControl);

    this.m_oTransformCanvas = oCanvasElement;
};
CDrawingButtonSettings.prototype.private_DrawOnCanvas = function(_Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
    var Canvas = this.m_oTransformCanvas.getContext("2d");

    Canvas.fillStyle   = _Canvas.fillStyle;
    Canvas.strokeStyle = _Canvas.strokeStyle;

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
    if ("rotate(90deg)" !== this.m_oTransformCanvas.style.transform)
    {
        this.m_oTransformCanvas.style.transition = "transform 0.5s linear";
        this.m_oTransformCanvas.style.transform  = "rotate(90deg)";
    }
    else
    {
        this.m_oTransformCanvas.style.transition = "transform 0.5s linear";
        this.m_oTransformCanvas.style.transform  = "rotate(0deg)";
    }
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

CDrawingButtonPass.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
    var Text       = (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.pass : "Pass");
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
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.pass : "Pass");
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка About
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonAbout(oDrawing)
{
    CDrawingButtonAbout.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonAbout, CDrawingButtonBase);

CDrawingButtonAbout.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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

CDrawingButtonTabComments.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
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

CDrawingButtonTabNavigator.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
    var X_0 = X_off + 0;
    var X_1 = X_off +  5 * Size / 20;
    var X_2 = X_off + 15 * Size / 20;
    var X_3 = X_off + Size;

    var Y_1 = Y_off +  6 * Size / 20;
    var Y_2 = Y_off + 16 * Size / 20;

    var R = (Size / 6 + 1) | 0;

    var BoundShift = 2;

    Canvas.lineWidth   = 2;
    Canvas.lineJoin    = "miter";
    Canvas.strokeStyle = 'rgba(0,0,0, 1)';//FillColor.ToString();

    Canvas.beginPath();
    Canvas.moveTo((X_0 - BoundShift) | 0, Y_1 | 0);
    Canvas.lineTo((X_3 + BoundShift) | 0, Y_1 | 0);
    Canvas.stroke();

    Canvas.beginPath();
    Canvas.moveTo(X_1 | 0, Y_1 | 0);
    Canvas.lineTo(X_1 | 0, Y_2 | 0);
    Canvas.lineTo((X_3 + BoundShift) | 0, Y_2 | 0);
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
//----------------------------------------------------------------------------------------------------------------------
// Кнопка выбора режима редактирования
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonBoardMode(oDrawing)
{
    CDrawingButtonBoardMode.superclass.constructor.call(this, oDrawing);

    var oMainDiv = oDrawing.Get_MainDiv();
    var oThis = this;

    var nButtonsCount = 10;
    this.m_nWidth = 4 + 36 * nButtonsCount + (nButtonsCount - 1);
    this.m_nHeight = 40;

    var oToolbarElementWrapper = document.createElement("div");
    oToolbarElementWrapper.id               = oMainDiv.id + "ButtonBoardModeToolbarWrapper";
    oToolbarElementWrapper.style.position   = "absolute";
    oToolbarElementWrapper.style.top        = "100px";
    oToolbarElementWrapper.style.left       = "100px";
    oToolbarElementWrapper.style.width      = this.m_nWidth  + "px";
    oToolbarElementWrapper.style.height     = this.m_nHeight + "px";
    oToolbarElementWrapper.style.background = "rgb(217, 217, 217)";
    oToolbarElementWrapper.style.display    = "block";
    oToolbarElementWrapper.style.border     = "1px solid rgb(166, 166, 166)";
    oToolbarElementWrapper.style.boxShadow  = "0px 1px 15px rgba(0,0,0,0.8)";
    oToolbarElementWrapper.style.opacity    = 0;
    oToolbarElementWrapper.style.overflowY  = "hidden";
    oToolbarElementWrapper.style.boxSizing  = "border-box";
    oToolbarElementWrapper.onclick          = function()
    {
        oThis.Hide_Toolbar();
    };
    oMainDiv.appendChild(oToolbarElementWrapper);

    var oToolbarElement = document.createElement("div");
    oToolbarElement.id               = oMainDiv.id + "ButtonBoardModeToolbar";
    oToolbarElement.style.position   = "absolute";
    oToolbarElement.style.top        = "1px";
    oToolbarElement.style.left       = "1px";
    oToolbarElement.style.right      = "1px";
    oToolbarElement.style.bottom     = "1px";
    oToolbarElementWrapper.appendChild(oToolbarElement);

    this.m_oButtonMove   = new CDrawingButtonEditModeMove(oDrawing);
    this.m_oButtonScores = new CDrawingButtonEditModeScores(oDrawing);
    this.m_oButtonAddRem = new CDrawingButtonEditModeAddRem(oDrawing);
    this.m_oButtonTr     = new CDrawingButtonEditModeTr(oDrawing);
    this.m_oButtonSq     = new CDrawingButtonEditModeSq(oDrawing);
    this.m_oButtonCr     = new CDrawingButtonEditModeCr(oDrawing);
    this.m_oButtonX      = new CDrawingButtonEditModeX(oDrawing);
    this.m_oButtonText   = new CDrawingButtonEditModeText(oDrawing);
    this.m_oButtonNum    = new CDrawingButtonEditModeNum(oDrawing);
    this.m_oButtonColor  = new CDrawingButtonEditModeColor(oDrawing);

    var oDrawingToolbar = new CDrawingToolbar(oDrawing);
    oDrawingToolbar.Add_Control(this.m_oButtonMove, 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(this.m_oButtonScores, 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(this.m_oButtonAddRem, 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(this.m_oButtonTr, 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(this.m_oButtonSq, 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(this.m_oButtonCr, 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(this.m_oButtonX, 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(this.m_oButtonText, 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(this.m_oButtonNum, 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(this.m_oButtonColor, 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Init(oToolbarElement.id, oDrawing.Get_GameTree());
    oDrawingToolbar.Update_Size();

    oToolbarElementWrapper.style.display    = "none";
    this.m_oToolbarElement = oToolbarElementWrapper;
    this.m_nTransitionId   = null;
    this.m_nTop            = 0;

    oToolbarElementWrapper.style.transitionProperty       = "opacity,top,height";
    oToolbarElementWrapper.style.transitionDuration       = "1s";
    oToolbarElementWrapper.style.transitionTimingFunction = "cubic-bezier(0,0,0,1)";
    oToolbarElementWrapper.style.transitionDelay          = "0s";

    this.m_eMode = null;


    this.m_nShowToolbarId = null;
}
CommonExtend(CDrawingButtonBoardMode, CDrawingButtonBase);

CDrawingButtonBoardMode.prototype.Update_Size = function()
{
    CDrawingButtonBoardMode.superclass.Update_Size.apply(this, arguments);
    var oOffset = this.m_oDrawing.Get_ElementOffset(this.HtmlElement.Control.HtmlElement);

    var nLeft = oOffset.X - this.m_nWidth / 2 + 36 / 2;
    var nTop  = oOffset.Y - 50;

    var nOverallW = this.m_oDrawing.Get_Width();
    var nOverallH = this.m_oDrawing.Get_Height();

    var nMinOffset = 5;

    if (nLeft + this.m_nWidth  > nOverallW - nMinOffset)
        nLeft = nOverallW - nMinOffset - this.m_nWidth;

    if (nLeft < nMinOffset)
        nLeft = nMinOffset;

    if (nTop + this.m_nHeight > nOverallH - nMinOffset)
        nTop = nOverallH - nMinOffset - this.m_nHeight;

    if (nTop < nMinOffset)
        nTop = nMinOffset;

    this.m_nTop = nTop;

    this.m_oToolbarElement.style.left = nLeft + "px";
    this.m_oToolbarElement.style.top  = nTop + "px";
};
CDrawingButtonBoardMode.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
};
CDrawingButtonBoardMode.prototype.private_HandleMouseDown = function()
{
    if ("none" === this.m_oToolbarElement.style.display)
    {
        if (null === this.m_nShowToolbarId)
        {
            var oThis = this;
            this.m_nShowToolbarId = setTimeout(function ()
            {
                if (null !== oThis.m_nTransitionId)
                {
                    clearTimeout(oThis.m_nTransitionId);
                    oThis.m_nTransitionId = null;
                }

                oThis.m_oToolbarElement.style.display = "block";
                oThis.m_oToolbarElement.style.opacity = 0;
                oThis.m_oToolbarElement.style.top = (oThis.m_nTop + 50) + "px";
                oThis.m_oToolbarElement.style.height = "0px";

                var oThis2 = oThis;

                oThis.m_nTransitionId = setTimeout(function ()
                {
                    oThis2.m_oToolbarElement.style.opacity = 1;
                    oThis2.m_oToolbarElement.style.top = oThis2.m_nTop + "px";
                    oThis2.m_oToolbarElement.style.height = oThis2.m_nHeight + "px";
                    oThis2.m_nTransitionId = null;
                    oThis2.m_nShowToolbarId = null;
                }, 20);
            }, 20);
        }
    }
    else
    {
        this.Hide_Toolbar();
    }
};
CDrawingButtonBoardMode.prototype.private_GetHint = function()
{
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editMode : "Select Edit mode") + " (F1-F10)";
};
CDrawingButtonBoardMode.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_SelectBoardModeButton(this);
};
CDrawingButtonBoardMode.prototype.On_UpdateBoardMode = function(eBoardMode)
{
    if (this.m_eMode === eBoardMode)
        return;

    this.m_eMode = eBoardMode;

    switch (eBoardMode)
    {
    case EBoardMode.Move         : this.m_oImageData = this.m_oButtonMove.m_oImageData; break;
    case EBoardMode.CountScores  : this.m_oImageData = this.m_oButtonScores.m_oImageData; break;
    case EBoardMode.AddRemove    : this.m_oImageData = this.m_oButtonAddRem.m_oImageData; break;
    case EBoardMode.AddMarkTr    : this.m_oImageData = this.m_oButtonTr.m_oImageData; break;
    case EBoardMode.AddMarkSq    : this.m_oImageData = this.m_oButtonSq.m_oImageData; break;
    case EBoardMode.AddMarkCr    : this.m_oImageData = this.m_oButtonCr.m_oImageData; break;
    case EBoardMode.AddMarkX     : this.m_oImageData = this.m_oButtonX.m_oImageData; break;
    case EBoardMode.AddMarkTx    : this.m_oImageData = this.m_oButtonText.m_oImageData; break;
    case EBoardMode.AddMarkNum   : this.m_oImageData = this.m_oButtonNum.m_oImageData; break;
    case EBoardMode.AddMarkColor : this.m_oImageData = this.m_oButtonColor.m_oImageData; break;
    }

    this.private_UpdateState();
};
CDrawingButtonBoardMode.prototype.private_OnResize = function()
{
    this.private_UpdateState();
};
CDrawingButtonBoardMode.prototype.Hide_Toolbar = function()
{
    if ("none" !== this.m_oToolbarElement.style.display)
    {
        if (null !== this.m_nTransitionId)
        {
            clearTimeout(this.m_nTransitionId);
            this.m_nTransitionId = null;
        }

        this.m_oToolbarElement.style.opacity = 0;
        this.m_oToolbarElement.style.top     = (this.m_nTop + 50) + "px";
        this.m_oToolbarElement.style.height  = "0px";
        var oThis = this;
        this.m_nTransitionId = setTimeout(function()
        {
            oThis.m_oToolbarElement.style.display = "none";
            oThis.m_nTransitionId = null;
        }, 500);
    }
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка выбора режима редактирования
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonEditModeColor(oDrawing)
{
    CDrawingButtonEditModeText.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonEditModeColor, CDrawingButtonBase);

CDrawingButtonEditModeColor.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
    var shift = W / 6, size = W / 3;
    var x1 = W / 6, x12 = x1 + size;
    var y1 = W / 6, y12 = y1 + size;

    var x2 = x1 + shift, x22 = x2 + size;
    var y2 = y1 + shift, y22 = y2 + size;

    var x3 = x2 + shift, x32 = x3 + size;
    var y3 = y2 + shift, y32 = y3 + size;

    Canvas.lineWidth = W / 18;
    Canvas.strokeStyle = "rgb(0, 0, 200)";
    Canvas.beginPath();
    Canvas.moveTo(x12, y2);
    Canvas.lineTo(x12, y1);
    Canvas.lineTo(x1, y1);
    Canvas.lineTo(x1, y12);
    Canvas.lineTo(x2, y12);
    Canvas.stroke();

    Canvas.strokeStyle = "rgb(0, 100, 0)";
    Canvas.beginPath();
    Canvas.moveTo(x22, y3);
    Canvas.lineTo(x22, y2);
    Canvas.lineTo(x2, y2);
    Canvas.lineTo(x2, y22);
    Canvas.lineTo(x3, y22);
    Canvas.stroke();

    Canvas.strokeStyle = "rgb(200, 0, 0)";
    Canvas.beginPath();
    Canvas.moveTo(x32, y32);
    Canvas.lineTo(x32, y3);
    Canvas.lineTo(x3, y3);
    Canvas.lineTo(x3, y32);
    Canvas.closePath();
    Canvas.stroke();
};
CDrawingButtonEditModeColor.prototype.private_HandleMouseDown = function()
{
    this.m_oGameTree.Get_DrawingBoard().Set_Mode(EBoardMode.AddMarkColor);
};
CDrawingButtonEditModeColor.prototype.private_GetHint = function()
{
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.editModeColors : "Color marks") + " (F10)";
};
CDrawingButtonEditModeColor.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_EditModeColorButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка для настройки тулбара
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonToolbarCustomize(oDrawing, oMutliLevelToolbar)
{
    CDrawingButtonEditModeText.superclass.constructor.call(this, oDrawing);

    this.m_oTransformCanvas = null;

    this.m_oMultiLevelToolbar = oMutliLevelToolbar;

    var oMainDiv = oDrawing.Get_MainDiv();

    var sMainNavigation = (window.g_oLocalization ? window.g_oLocalization.gameRoom.toolbarCustomization.mainNavigation : "Main navigation");
    var sTreeNavigation = (window.g_oLocalization ? window.g_oLocalization.gameRoom.toolbarCustomization.treeNavigation : "Tree navigation");
    var sGeneralToolbar = (window.g_oLocalization ? window.g_oLocalization.gameRoom.toolbarCustomization.generalToolbar : "General toolbar");
    var sAutoplay       = (window.g_oLocalization ? window.g_oLocalization.gameRoom.toolbarCustomization.autoplay : "Autoplay toolbar");
    var sTimeline       = (window.g_oLocalization ? window.g_oLocalization.gameRoom.toolbarCustomization.timelinePanel : "Timeline panel");
    var sKifuMode       = (window.g_oLocalization ? window.g_oLocalization.gameRoom.toolbarCustomization.kifuMode : "Kifu mode");

    this.m_nWidth  = 160;
    this.m_nHeight = 14 + 6 * 20;

    if (window.g_oTextMeasurer)
    {
        window.g_oTextMeasurer.SetFont('16px "Times New Roman", Times, serif');

        this.m_nWidth = 10 + 23 + Math.max(
                window.g_oTextMeasurer.Measure(sMainNavigation),
                window.g_oTextMeasurer.Measure(sTreeNavigation),
                window.g_oTextMeasurer.Measure(sGeneralToolbar),
                window.g_oTextMeasurer.Measure(sAutoplay),
                window.g_oTextMeasurer.Measure(sTimeline),
                window.g_oTextMeasurer.Measure(sKifuMode)
            ) + 7;
    }

    var oContextMenuElementWrapper              = document.createElement("div");
    oContextMenuElementWrapper.id               = oMainDiv.id + "ToolbarCustomizeWrapper";
    oContextMenuElementWrapper.style.position   = "absolute";
    oContextMenuElementWrapper.style.top        = "100px";
    oContextMenuElementWrapper.style.left       = "100px";
    oContextMenuElementWrapper.style.width      = this.m_nWidth + "px";
    oContextMenuElementWrapper.style.height     = this.m_nHeight + "px";
    oContextMenuElementWrapper.style.background = "rgb(255, 255, 255)";
    oContextMenuElementWrapper.style.display    = "block";
    oContextMenuElementWrapper.style.border     = "1px solid rgb(166, 166, 166)";
    oContextMenuElementWrapper.style.boxShadow  = "0px 1px 15px rgba(0,0,0,0.8)";
    oContextMenuElementWrapper.style.overflowY  = "hidden";
    oMainDiv.appendChild(oContextMenuElementWrapper);

    oContextMenuElementWrapper.style.transitionProperty = "height";
    oContextMenuElementWrapper.style.transitionDuration = "0.2s";
    oContextMenuElementWrapper.style.transitionDelay    = "0s";
    oContextMenuElementWrapper.style.display            = "none";

    this.m_oContextMenuElement = oContextMenuElementWrapper;
    this.m_nTransitionId       = null;
    this.m_nShowId             = null;

    var oList = document.createElement("ul");

    oList.style.padding        = "5px 0";
    oList.style.margin         = "2px 0 0";
    oList.style.listStyle      = "none";
    oList.style.fontSize       = "16px";
    oList.style.backgroundClip = "padding-box";
    oList.style.lineHeight     = "20px";


    this.m_oMainNavigationCheckElement  = this.private_CreateListItem(oList, sMainNavigation, function(){oDrawing.Toggle_MultiLevelToolbarMainNavigation()}, g_oGlobalSettings.Is_MultiLevelToolbarMainNavigation());
    this.m_oTreeNavigationCheckElement  = this.private_CreateListItem(oList, sTreeNavigation, function(){oDrawing.Toggle_MultiLevelToolbarTreeNavigation()}, g_oGlobalSettings.Is_MultiLevelToolbarTreeNavigation());
    this.m_oGeneralCheckElement  = this.private_CreateListItem(oList, sGeneralToolbar, function(){oDrawing.Toggle_MultiLevelToolbarGeneral()}, g_oGlobalSettings.Is_MultiLevelToolbarGeneral());
    this.m_oAutoPlayCheckElement = this.private_CreateListItem(oList, sAutoplay, function(){oDrawing.Toggle_MultiLevelToolbarAutoPlay()}, g_oGlobalSettings.Is_MultiLevelToolbarAutoPlay());
    this.m_oTimelineCheckElement = this.private_CreateListItem(oList, sTimeline, function(){oDrawing.Toggle_MultiLevelToolbarTimeline()}, g_oGlobalSettings.Is_MultiLevelToolbarTimeline());
    this.m_oKifuModeCheckElement = this.private_CreateListItem(oList, sKifuMode, function(){oDrawing.Toggle_MultiLevelToolbarKifuMode()}, g_oGlobalSettings.Is_MultiLevelToolbarKifuMode());

    oContextMenuElementWrapper.appendChild(oList);
}
CommonExtend(CDrawingButtonToolbarCustomize, CDrawingButtonBase);

CDrawingButtonToolbarCustomize.prototype.Init = function(sDivId, oGameTree)
{
	CDrawingButtonToolbarCustomize.superclass.Init.apply(this, arguments);

	var oDivElement = this.HtmlElement.Control.HtmlElement;
	var oCanvasElement = document.createElement("canvas");
	oCanvasElement.setAttribute("id", sDivId + "_transform");
	oCanvasElement.style.position = "absolute";
	oCanvasElement.style.top = "0px";
	oCanvasElement.style.left = "0px";
	oCanvasElement.style.padding = "0";
	oCanvasElement.style.margin = "0";
	
	oCanvasElement.setAttribute("oncontextmenu", "return false;");
	oCanvasElement.draggable = "false";
	oCanvasElement['ondragstart'] = function(event) { event.preventDefault(); return false; };
	oDivElement.appendChild(oCanvasElement);
	this.m_oTransformCanvas = oCanvasElement;
};
CDrawingButtonToolbarCustomize.prototype.Update_Size = function()
{
    CDrawingButtonToolbarCustomize.superclass.Update_Size.apply(this, arguments);

    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

	if (this.m_oTransformCanvas)
	{
		this.m_oTransformCanvas.style.width = W + "px";
		this.m_oTransformCanvas.style.height = H + "px";
		this.m_oTransformCanvas.width = Common.ConvertToRetinaValue(W);
		this.m_oTransformCanvas.height = Common.ConvertToRetinaValue(H);

		this.private_DrawOnCanvas(null, null, 0, 0, Common.ConvertToRetinaValue(W), Common.ConvertToRetinaValue(H));
	}

    var oOffset = this.m_oDrawing.Get_ElementOffset(this.HtmlElement.Control.HtmlElement);

    var nLeft = oOffset.X + W - this.m_nWidth;
    var nTop  = oOffset.Y + H + 5;

    var nOverallW = this.m_oDrawing.Get_Width();
    var nOverallH = this.m_oDrawing.Get_Height();

    var nMinOffset = 5;

    if (nLeft + this.m_nWidth  > nOverallW - nMinOffset)
        nLeft = nOverallW - nMinOffset - this.m_nWidth;

    if (nLeft < nMinOffset)
        nLeft = nMinOffset;

    if (nTop + this.m_nHeight > nOverallH - nMinOffset)
        nTop = nOverallH - nMinOffset - this.m_nHeight;

    if (nTop < nMinOffset)
        nTop = nMinOffset;

    this.m_nTop = nTop;

    this.m_oContextMenuElement.style.left = nLeft + "px";
    this.m_oContextMenuElement.style.top  = nTop + "px";
};
CDrawingButtonToolbarCustomize.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, nW, nH, BackColor, FillColor)
{
	if (this.m_oTransformCanvas)
	{
		var oCanvas = this.m_oTransformCanvas.getContext("2d");

		oCanvas.fillStyle = this.m_oNormaFColor.ToString();
		oCanvas.strokeStyle = this.m_oNormaFColor.ToString();

		oCanvas.lineWidth = nW / 18;
		oCanvas.moveTo(12 / 36 * nW, 15 / 36 * nW);
		oCanvas.lineTo(18 / 36 * nW, 21 / 36 * nW);
		oCanvas.lineTo(24 / 36 * nW, 15 / 36 * nW);
		oCanvas.stroke();
	}
};
CDrawingButtonToolbarCustomize.prototype.private_HandleMouseDown = function()
{
    if ("none" === this.m_oContextMenuElement.style.display)
    {
        if (null === this.m_nShowId)
        {
            var oThis = this;
            this.m_nShowId = setTimeout(function ()
            {
                if (null !== oThis.m_nTransitionId)
                {
                    clearTimeout(oThis.m_nTransitionId);
                    oThis.m_nTransitionId = null;
                }

                oThis.m_oContextMenuElement.style.display = "block";
                oThis.m_oContextMenuElement.style.height  = "0px";

                oThis.m_nTransitionId = setTimeout(function ()
                {
                    oThis.m_oContextMenuElement.style.height = oThis.m_nHeight + "px";
                    oThis.m_nTransitionId = null;
                    oThis.m_nShowId       = null;
                    oThis.m_oTransformCanvas.style.transition = "transform 0.2s ease";
                    oThis.m_oTransformCanvas.style.transform  = "rotate(180deg)";
                    oThis.Set_Selected(true);
                }, 20);
            }, 20);
        }
    }
    else
    {
        this.Hide_ContextMenu();
    }
};
CDrawingButtonToolbarCustomize.prototype.private_GetHint = function()
{
    return "";
};
CDrawingButtonToolbarCustomize.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_ToolbarCustomizeButton(this);
};
CDrawingButtonToolbarCustomize.prototype.Hide_ContextMenu = function(bFast)
{
    if ("none" !== this.m_oContextMenuElement.style.display)
    {
        if (true === bFast)
        {
            this.m_oContextMenuElement.style.height  = "0px";
            this.m_oContextMenuElement.style.display = "none";

            this.m_oTransformCanvas.style.transition = "transform 0.2s ease";
            this.m_oTransformCanvas.style.transform  = "rotate(0deg)";
            this.Set_Selected(false);
        }
        else
        {

            if (null !== this.m_nTransitionId)
            {
                clearTimeout(this.m_nTransitionId);
                this.m_nTransitionId = null;
            }

            this.m_oContextMenuElement.style.height = "0px";
            var oThis                               = this;
            this.m_nTransitionId                    = setTimeout(function()
            {
                oThis.m_oContextMenuElement.style.display = "none";
                oThis.m_nTransitionId                     = null;
                oThis.m_oTransformCanvas.style.transition = "transform 0.2s ease";
                oThis.m_oTransformCanvas.style.transform  = "rotate(0deg)";
                oThis.Set_Selected(false);
            }, 200);
        }
    }
};
CDrawingButtonToolbarCustomize.prototype.private_CreateListItem = function(oList, sText, pOnClickHandler, bChecked)
{
    var oItem = document.createElement("li");

    oItem.style.fontFamily = '"Times New Roman", Times, serif';
    oItem.style.width      = (this.m_nWidth - 10) + "px";
    oItem.style.height     = "20px";
    oItem.style.color      = "#444444";
    oItem.style.margin     = "0px 5px 0px 5px";
    oItem.style.cursor     = "pointer";

    var oCheckItem               = document.createElement("div");
    oCheckItem.style.paddingLeft = "3px";
    oCheckItem.style.width       = "20px";
    oCheckItem.style.height      = "20px";
    oCheckItem.style['float']    = "left";
    Common.Set_InnerTextToElement(oCheckItem, bChecked ? "✔" : "");
    oItem.appendChild(oCheckItem);

    var oTextItem               = document.createElement("div");
    oTextItem.style.paddingLeft = "5px";
    oTextItem.style.height      = "20px";
    oTextItem.style.width       = (this.m_nWidth - 10 - 20 - 10) + "px";
    oTextItem.style['float']    = "left";
    oTextItem.style.overflow    = "hidden";
    Common.Set_InnerTextToElement(oTextItem, sText);
    oItem.appendChild(oTextItem);

    oItem.onmouseover = function()
    {
        oItem.style.background = "#d8dadc";
        oItem.style.color      = "#373737";
    };

    oItem.onmouseout = function()
    {
        oItem.style.background = "transparent";
        oItem.style.color      = "#444444";
    };

    var oThis = this;
    oItem.onclick = function()
    {
        if (pOnClickHandler)
            pOnClickHandler();

        oThis.Hide_ContextMenu(true);
    };

    oList.appendChild(oItem);

    return oCheckItem;
};
CDrawingButtonToolbarCustomize.prototype.Set_MainNavigation = function(bChecked)
{
    if (this.m_oMultiLevelToolbar)
        this.m_oMultiLevelToolbar.Set_MainNavigation(bChecked);

    this.private_UpdateCheckElement(this.m_oMainNavigationCheckElement, bChecked);
};
CDrawingButtonToolbarCustomize.prototype.Set_TreeNavigation = function(bChecked)
{
    if (this.m_oMultiLevelToolbar)
        this.m_oMultiLevelToolbar.Set_TreeNavigation(bChecked);

    this.private_UpdateCheckElement(this.m_oTreeNavigationCheckElement, bChecked);
};
CDrawingButtonToolbarCustomize.prototype.Set_General = function(bChecked)
{
    if (this.m_oMultiLevelToolbar)
        this.m_oMultiLevelToolbar.Set_General(bChecked);

    this.private_UpdateCheckElement(this.m_oGeneralCheckElement, bChecked);
};
CDrawingButtonToolbarCustomize.prototype.Set_AutoPlay = function(bChecked)
{
    if (this.m_oMultiLevelToolbar)
        this.m_oMultiLevelToolbar.Set_AutoPlay(bChecked);

    this.private_UpdateCheckElement(this.m_oAutoPlayCheckElement, bChecked);
};
CDrawingButtonToolbarCustomize.prototype.Set_Timeline = function(bChecked)
{
    if (this.m_oMultiLevelToolbar)
        this.m_oMultiLevelToolbar.Set_Timeline(bChecked);

    this.private_UpdateCheckElement(this.m_oTimelineCheckElement, bChecked);
};
CDrawingButtonToolbarCustomize.prototype.Set_KifuMode = function(bKifuMode)
{
    if (this.m_oMultiLevelToolbar)
        this.m_oMultiLevelToolbar.Set_KifuMode(bKifuMode);

    this.private_UpdateCheckElement(this.m_oKifuModeCheckElement, bKifuMode);
};
CDrawingButtonToolbarCustomize.prototype.private_UpdateCheckElement = function(oCheckElement, bChecked)
{
    if (oCheckElement)
    {
        if (true === bChecked)
            Common.Set_InnerTextToElement(oCheckElement, "✔");
        else
            Common.Set_InnerTextToElement(oCheckElement, "");
    }
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка меню
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonFileMenu(oDrawing)
{
    CDrawingButtonFileMenu.superclass.constructor.call(this, oDrawing);

    var oMainDiv  = oDrawing.Get_MainDiv();
    var oGameTree = oDrawing.Get_GameTree();

    var oMenuElementWrapper                   = document.createElement("div");
    oMenuElementWrapper.style.position        = "absolute";
    oMenuElementWrapper.style.top             = "40px";
    oMenuElementWrapper.style.width           = "200px";
    oMenuElementWrapper.style.backgroundColor = "white";
    oMenuElementWrapper.style.borderWidth     = "1px";
    oMenuElementWrapper.style.borderColor     = "#b3b3b3";
    oMenuElementWrapper.style.borderStyle     = "solid";
    oMenuElementWrapper.style.padding         = "0px";
    oMenuElementWrapper.style.boxShadow       = "0px 0px 2px 0px rgba(0,0,0,0.3)";
    oMenuElementWrapper.style.opacity         = "1";
    oMenuElementWrapper.style.zIndex          = "10";
    oMenuElementWrapper.style.overflowX       = "hidden";
    oMenuElementWrapper.style.overflowY       = "hidden";
    oMenuElementWrapper.style.maxHeight       = "calc(100vh - 90px)";

    oMenuElementWrapper.style.transitionProperty = "height";
    oMenuElementWrapper.style.transitionDuration = "0.2s";
    oMenuElementWrapper.style.transitionDelay    = "0s";


    this.m_oMainDiv      = oMainDiv;
    this.m_oMenuElement  = oMenuElementWrapper;
    this.m_nHeight       = oMenuElementWrapper.clientHeight;
    this.m_nWidth        = oMenuElementWrapper.clientWidth;
    this.m_nTransitionId = null;
    this.m_nShowId       = null;
    this.m_oGameTree     = oGameTree;

    oMainDiv.appendChild(oMenuElementWrapper);

    this.InitDefaultMenu(false);

    oMenuElementWrapper.style.display = "none";
}
CommonExtend(CDrawingButtonFileMenu, CDrawingButtonBase);

CDrawingButtonFileMenu.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
    var shiftY = Common.ConvertToRetinaValue(9);
    var spaceY = Common.ConvertToRetinaValue(6);
    var shiftX = Common.ConvertToRetinaValue(3);
    var W      = Common.ConvertToRetinaValue(2);

    var x1 = X_off + shiftX;
    var x2 = X_off + Size - shiftX;

    var y1 = Y_off + shiftY;
    var y2 = Y_off + spaceY + shiftY;
    var y3 = Y_off + 2 * spaceY + shiftY;

    Canvas.fillStyle = (true === this.m_oActiveBColor.Compare(BackColor) ? "rgb(167, 167, 167)" : "rgb(217, 217, 217)");
    Canvas.fillRect(0, 0, Size + 2 * X_off, Size + 2 * X_off);

    Canvas.lineWidth = W;
    Canvas.strokeStyle = "rgb(100, 100, 100)";
    Canvas.beginPath();
    Canvas.moveTo(x1, y1);
    Canvas.lineTo(x2, y1);
    Canvas.stroke();

    Canvas.beginPath();
    Canvas.moveTo(x1, y2);
    Canvas.lineTo(x2, y2);
    Canvas.stroke();

    Canvas.beginPath();
    Canvas.moveTo(x1, y3);
    Canvas.lineTo(x2, y3);
    Canvas.stroke();
};
CDrawingButtonFileMenu.prototype.private_CreateMenuItem = function(oMenuElement, sText, pOnClickHandler)
{
    var oItemWrapper           = document.createElement("div");
    oItemWrapper.style.padding = "0px";
    oItemWrapper.style.maring  = "0px";
    oMenuElement.appendChild(oItemWrapper);

    var oItemElement                   = document.createElement("div");
    oItemElement.style.display         = "flex";
    oItemElement.style.alignItems      = "center";
    oItemElement.style.padding         = "0px";
    oItemElement.style.position        = "relative";
    oItemElement.style.cursor          = "pointer";
    oItemElement.style.transition      = "background-color 0.25s ease";
    oItemElement.style.backgroundColor = "#fff";
    oItemElement.style.color           = "#424242";
    oItemElement.style.border          = "1px solid transparent";
    oItemElement.style.outline         = "none";
    oItemWrapper.appendChild(oItemElement);


    var oInnerDiv                = document.createElement("div");
    oInnerDiv.style.padding      = "10px 20px";
    oInnerDiv.style.position     = "relative";
    oInnerDiv.style.cursor       = "pointer";
    oInnerDiv.style.borderBottom = "1px solid #e6e7e8";
    oInnerDiv.style.transition   = "background-color 0.25s ease";
    oInnerDiv.style.outline      = "none";
    oInnerDiv.style.width        = "100%";
    oItemElement.appendChild(oInnerDiv);

    var TextSpan = document.createElement("span");

    TextSpan.style.color         = "#4d4d4d";
    TextSpan.style.fontFamily    = '"Segoe UI Light","Segoe UI Semilight","Segoe UI",Helvetica,Tahoma,Geneva,Verdana,sans-serif';
    TextSpan.style.fontWeight    = 'lighter';
    TextSpan.style.fontSize      = "15px";
    TextSpan.style.userSelect    = "none";
    TextSpan.style.verticalAlign = "middle";
    TextSpan.style.cursor        = "pointer";

    Common.Set_InnerTextToElement(TextSpan, sText);
    oInnerDiv.appendChild(TextSpan);

    oItemElement.onmouseover = function()
    {
        oItemElement.style.backgroundColor = "#e6e6e6";
        oItemElement.style.color           = "#424242";
    };

    oItemElement.onmouseout = function()
    {
        oItemElement.style.background = "transparent";
        oItemElement.style.color      = "#424242";
        oItemElement.style.border     = "1px solid transparent";
    };

    oItemElement.onmousedown = function()
    {
        oItemElement.style.backgroundColor = "#969696";
        oItemElement.style.border          = "1px solid #737373";
        oItemElement.style.color           = "#424242";
    };

    oItemElement.onmouseup = function()
    {
        oItemElement.style.backgroundColor = "#e6e6e6";
        oItemElement.style.color           = "#424242";
        oItemElement.style.border          = "1px solid transparent";
    };

    var oThis = this;
    oItemElement.onclick = function()
    {
        if (pOnClickHandler)
            pOnClickHandler();

        oThis.Hide_Menu(true);
    };

    return oItemWrapper;
};
CDrawingButtonFileMenu.prototype.private_HandleMouseDown = function()
{
    this.Show_Menu();
};
CDrawingButtonFileMenu.prototype.private_GetHint = function()
{
    return window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.hint : "Menu";
};
CDrawingButtonFileMenu.prototype.Show_Menu = function()
{
    if ("none" === this.m_oMenuElement.style.display)
    {
        if (null === this.m_nShowId)
        {
            var oThis = this;
            this.m_nShowId = setTimeout(function ()
            {
                if (null !== oThis.m_nTransitionId)
                {
                    clearTimeout(oThis.m_nTransitionId);
                    oThis.m_nTransitionId = null;
                }

                oThis.m_oMenuElement.style.display = "block";
                oThis.m_oMenuElement.style.height  = "0px";

                oThis.m_nTransitionId = setTimeout(function ()
                {
                    oThis.m_oMenuElement.style.height = oThis.m_nHeight + "px";
                    oThis.m_nTransitionId = null;
                    oThis.m_nShowId       = null;
                    oThis.Set_Selected(true);
                }, 20);
            }, 20);
        }
    }
    else
    {
        this.Hide_Menu();
    }
};
CDrawingButtonFileMenu.prototype.Hide_Menu = function(bFast)
{
    if ("none" !== this.m_oMenuElement.style.display)
    {
        if (true === bFast)
        {
            this.m_oMenuElement.style.height  = "0px";
            this.m_oMenuElement.style.display = "none";
            this.Set_Selected(false);
        }
        else
        {

            if (null !== this.m_nTransitionId)
            {
                clearTimeout(this.m_nTransitionId);
                this.m_nTransitionId = null;
            }

            this.m_oMenuElement.style.height = "0px";
            var oThis                               = this;
            this.m_nTransitionId                    = setTimeout(function()
            {
                oThis.m_oMenuElement.style.display = "none";
                oThis.m_nTransitionId                     = null;
                oThis.Set_Selected(false);
            }, 200);
        }
    }
};
CDrawingButtonFileMenu.prototype.Update_Size = function()
{
    CDrawingButtonFileMenu.superclass.Update_Size.apply(this, arguments);
    var oOffset = this.m_oDrawing.Get_ElementOffset(this.HtmlElement.Control.HtmlElement);

    var nLeft = oOffset.X;
    var nTop  = oOffset.Y + 36 + 5;

    var nOverallW = this.m_oDrawing.Get_Width();
    var nOverallH = this.m_oDrawing.Get_Height();

    var nMinOffset = 5;

    if (nLeft + this.m_nWidth  > nOverallW - nMinOffset)
        nLeft = nOverallW - nMinOffset - this.m_nWidth;

    if (nLeft < nMinOffset)
        nLeft = nMinOffset;

    if (nTop + this.m_nHeight > nOverallH - nMinOffset)
        nTop = nOverallH - nMinOffset - this.m_nHeight;

    if (nTop < nMinOffset)
        nTop = nMinOffset;

    this.m_nTop = nTop;

    this.m_oMenuElement.style.left = nLeft + "px";
    this.m_oMenuElement.style.top  = nTop + "px";
};
CDrawingButtonFileMenu.prototype.private_ClickTransformIn = function()
{
};
CDrawingButtonFileMenu.prototype.private_ClickTransformOut = function()
{
};
CDrawingButtonFileMenu.prototype.InitDefaultMenu = function(bNoLoadFields)
{
	var sCreateNew         = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.createNew : "Create New";
	var sLoadDisk          = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.loadFile : "Load from disk";
	var sLoadClipboard     = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.loadFileFromClipboard : "Load from clipboard";
	var sDownload          = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.downloadSGF : "Download as SGF";
	var sSnapshot          = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.createSnapshot : "Create snapshot";
	var sExportGIF         = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.exportToGif : "Export to GIF";
	var sConvertToASCII    = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.convertToASCIIDiagram : "Convert to ASCII diagram";
	var sScoreEstimator    = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.scoreEstimator : "Score estimator";
	var sToggleCoordinates = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.toggleCoordinates : "Toggle coordinates";
    var sGameInfo          = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.gameInfo : "Game info";
    var sCropBoard         = window.g_oLocalization ? window.g_oLocalization.gameRoom.menu.cropBoard : "Crop the board";

    var oMenuElementWrapper = this.m_oMenuElement;
    var oGameTree           = this.m_oGameTree;
    var oMainDiv            = this.m_oMainDiv;

    oMenuElementWrapper.style.display = "block";
    oMenuElementWrapper.style.opacity = null;
    oMenuElementWrapper.style.height  = null;

    Common.ClearNode(oMenuElementWrapper);

    var oThis = this;
    if (true !== bNoLoadFields)
    {
        this.private_CreateMenuItem(oMenuElementWrapper, sCreateNew, function()
        {
            CreateWindow(oMainDiv.id, EWindowType.CreateNew, {GameTree : oGameTree, Drawing : oThis.m_oDrawing});
        });
        this.private_CreateMenuItem(oMenuElementWrapper, sLoadDisk, function()
        {
            Common.OpenFileDialog(oGameTree);
        });
        this.private_CreateMenuItem(oMenuElementWrapper, sLoadClipboard, function()
        {
            CreateWindow(oMainDiv.id, EWindowType.Clipboard, {GameTree : oGameTree, Drawing : oThis.m_oDrawing});
        });
    }

    this.private_CreateMenuItem(oMenuElementWrapper, sGameInfo, function()
    {
        CreateWindow(oMainDiv.id, EWindowType.GameInfo, {GameTree : oGameTree, Drawing : oThis.m_oDrawing});
    });
    this.private_CreateMenuItem(oMenuElementWrapper, sDownload, function()
    {
        if (FileReader && Blob)
        {
            var sSgf = oGameTree.Save_Sgf();
            var sGameName = oGameTree.Get_MatchName();
            if ("" === sGameName)
                sGameName = "download";

            sGameName += ".sgf";
            var oBlob = new Blob([sSgf], {type: "text/plain;charset=utf-8"});
            Common.SaveAs(oBlob, sGameName, "application/x-go-sgf");
        }
    });
    this.private_CreateMenuItem(oMenuElementWrapper, sSnapshot, function()
    {
        oGameTree.Download_PngBoardScreenShot();
    });
    this.private_CreateMenuItem(oMenuElementWrapper, sExportGIF, function()
    {
        oGameTree.Download_GifForCurVariant();
    });
    this.private_CreateMenuItem(oMenuElementWrapper, sConvertToASCII, function()
    {
        CreateWindow(oMainDiv.id, EWindowType.DiagramSL, {GameTree : oGameTree, Drawing : oThis.m_oDrawing});
    });
    this.private_CreateMenuItem(oMenuElementWrapper, sScoreEstimator, function()
    {
        CreateWindow(oMainDiv.id, EWindowType.ScoreEstimate, {GameTree : oGameTree, Drawing : oThis.m_oDrawing});
    });
	this.private_CreateMenuItem(oMenuElementWrapper, sToggleCoordinates, function()
	{
		oGameTree.Toggle_Rulers();
	});
	this.private_CreateMenuItem(oMenuElementWrapper, sCropBoard, function()
	{
		CreateWindow(oMainDiv.id, EWindowType.ViewPort, {GameTree : oGameTree, Drawing : oThis.m_oDrawing});
	});
    this.m_nHeight = oMenuElementWrapper.clientHeight;
    oMenuElementWrapper.style.display = "none";
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка Kifu
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonKifuWindow(oDrawing)
{
    CDrawingButtonKifuWindow.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonKifuWindow, CDrawingButtonBase);

CDrawingButtonKifuWindow.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
    var X = Math.ceil(X_off + 0.5 * Size - Size / 10 + 0.5);
    var Y = Math.ceil(Y_off + 0.5 * Size - Size / 10 + 0.5);
    var R = Math.ceil(0.35 * Size + 0.5);

    Canvas.fillStyle   = (new CColor(255, 255, 255)).ToString();
    Canvas.strokeStyle = (new CColor(0, 0, 0)).ToString();
    Canvas.beginPath();
    Canvas.arc(X, Y, R, 0, 2 * Math.PI, false);
    Canvas.fill();
    Canvas.stroke();

    var Text       = "白";
    var FontSize   = Size * 0.4 * 1.4;
    var FontFamily = "Times New Roman, Sans serif";
    var sFont      = FontSize + "px " + FontFamily;
    Canvas.font = sFont;
    Canvas.fillStyle = "rgb(0, 0, 0)";
    Y = Y + FontSize / 3;
    X = X + (-Canvas.measureText(Text).width) / 2;
    Canvas.fillText(Text, X, Y);

    Canvas.fillStyle = (new CColor(0, 0, 0)).ToString();
    X = Math.ceil(X_off + 0.5 * Size + Size / 10 + 0.5);
    Y = Math.ceil(Y_off + 0.5 * Size + Size / 10 + 0.5);

    Canvas.beginPath();
    Canvas.arc(X, Y, R, 0, 2 * Math.PI, false);
    Canvas.fill();

    var Text       = "黒";
    Canvas.fillStyle = "rgb(255, 255, 255)";
    Y = Y + FontSize / 3;
    X = X + (-Canvas.measureText(Text).width) / 2;
    Canvas.fillText(Text, X, Y);
};
CDrawingButtonKifuWindow.prototype.private_HandleMouseDown = function()
{
    CreateWindow(this.HtmlElement.Control.HtmlElement.id, EWindowType.Kifu, {GameTree : this.m_oGameTree, Drawing : this.m_oDrawing});
};
CDrawingButtonKifuWindow.prototype.private_GetHint = function()
{
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.showKifu : "Show kifu");
};

//----------------------------------------------------------------------------------------------------------------------
// Кнопка Kifu-Mode
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonKifuMode(oDrawing)
{
    CDrawingButtonKifuWindow.superclass.constructor.call(this, oDrawing);
}
CommonExtend(CDrawingButtonKifuMode, CDrawingButtonBase);

CDrawingButtonKifuMode.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
    X_off = 0, Y_off = 0, Size = Common.ConvertToRetinaValue(36);
    var X1 = (X_off + Common.ConvertToRetinaValue(10)) | 0 + 0.5;
    var X2 = (X_off + Common.ConvertToRetinaValue(25)) | 0 + 0.5;
    var Y1 = (Y_off + Common.ConvertToRetinaValue(10)) | 0 + 0.5;
    var Y2 = (Y_off + Common.ConvertToRetinaValue(25)) | 0 + 0.5;

    Canvas.lineWidth = Common.ConvertToRetinaValue(2);

    Canvas.strokeStyle = "rgb(0, 0, 0)";
    Canvas.beginPath();
    Canvas.moveTo(X_off + 1, Y1);
    Canvas.lineTo(Size / 2 + 1, Y1);
    Canvas.moveTo(X_off + 1, Y2);
    Canvas.lineTo(Size + X_off - 1, Y2);
    Canvas.moveTo(X1, Y_off + 1);
    Canvas.lineTo(X1, Size + Y_off - 1);
    Canvas.moveTo(X2, Size / 2);
    Canvas.lineTo(X2, Size + Y_off - 1);
    Canvas.stroke();

    Canvas.fillStyle = "rgb(255, 255, 255)";
    Canvas.beginPath();
    Canvas.arc(X1, Y1, Common.ConvertToRetinaValue(11 / 2), 0, 2 * Math.PI, false);
    Canvas.stroke();
    Canvas.fill();
    Canvas.beginPath();
    Canvas.arc(X2, Y2, Common.ConvertToRetinaValue(11 / 2), 0, 2 * Math.PI, false);
    Canvas.stroke();
    Canvas.fill();
    Canvas.fillStyle = "rgb(0, 0, 0)";
    Canvas.beginPath();
    Canvas.arc(X1, Y2, Common.ConvertToRetinaValue(11 / 2), 0, 2 * Math.PI, false);
    Canvas.stroke();
    Canvas.fill();

    var Text       = "?";
    var FontSize   = Common.ConvertToRetinaValue(22);
    var FontFamily = "Times New Roman, Sans serif";
    var sFont      = FontSize + "px " + FontFamily;

    Canvas.font = sFont;

    var Y = Y1 + FontSize / 3;
    var X = X2 - Canvas.measureText(Text).width / 2;

    Canvas.fillText(Text, X, Y);

};
CDrawingButtonKifuMode.prototype.private_HandleMouseDown = function()
{
    if (true === this.m_oGameTree.Is_KifuMode())
        this.m_oGameTree.Stop_KifuMode();
    else
        this.m_oGameTree.Start_KifuMode();
};
CDrawingButtonKifuMode.prototype.private_GetHint = function()
{
    return (window.g_oLocalization ? window.g_oLocalization.gameRoom.button.hint.toggleKifuMode : "Toggle kifu mode");
};
CDrawingButtonKifuMode.prototype.private_RegisterButton = function()
{
    this.m_oDrawing.Register_KifuModeButton(this);
};
//----------------------------------------------------------------------------------------------------------------------
// Кнопка SimpleTextButton
//----------------------------------------------------------------------------------------------------------------------
function CDrawingButtonSimpleText(sText, fClickHandler, sHint)
{
    CDrawingButtonSimpleText.superclass.constructor.call(this, null);

	this.m_oNormaBColor    = new CColor(234, 234, 234, 255); // 229,229,229 -> 240,240,240
	this.m_oNormaFColor    = new CColor(172, 172, 172, 255);
	this.m_oHoverBColor    = new CColor(227, 240, 252, 255); // 220,236,252 -> 236,244,252
	this.m_oHoverFColor    = new CColor(126, 180, 234, 255);
	this.m_oActiveBColor   = new CColor(207, 230, 252, 255); // 196,224,252 -> 218,235,252
	this.m_oActiveFColor   = new CColor( 86, 157, 229, 255);
	this.m_oDisabledBColor = new CColor(239, 239, 239, 255);
	this.m_oDisabledFColor = new CColor(217, 217, 217, 255);

    this.m_sText    = sText ? sText : "";
    this.m_sHint    = sHint ? sHint : "";
    this.m_fHandler = fClickHandler ? fClickHandler : null;
}
CommonExtend(CDrawingButtonSimpleText, CDrawingButtonBase);

CDrawingButtonSimpleText.prototype.private_DrawOnCanvas = function(Canvas, Size, X_off, Y_off, bDisabled, W, H, BackColor, FillColor)
{
    Canvas.lineWidth = 1;
    Canvas.moveTo(0, 0);
    Canvas.lineTo(0, H);
    Canvas.lineTo(W, H);
    Canvas.lineTo(W, 0);
    Canvas.lineTo(0, 0);
    Canvas.stroke();

    var Text       = this.m_sText;
    var FontSize   = 16;
    var FontFamily = "'Segoe UI', Helvetica, Tahoma, Geneva, Verdana, sans-serif";
    var sFont      = FontSize + "px " + FontFamily;

    Canvas.fillStyle = (new CColor(0, 0, 0, 255)).ToString();
    Canvas.font = sFont;

    var Y = Y_off + Size / 2 + FontSize / 3;
    var X = X_off + (Size - Canvas.measureText(Text).width) / 2;

    Canvas.fillText(Text, X, Y);
};
CDrawingButtonSimpleText.prototype.private_HandleMouseDown = function()
{
    if (this.m_fHandler)
        return this.m_fHandler();
};
CDrawingButtonSimpleText.prototype.private_GetHint = function()
{
    return this.m_sHint;
};
CDrawingButtonSimpleText.prototype.private_ClickTransformIn = function()
{
};
CDrawingButtonSimpleText.prototype.private_ClickTransformOut = function()
{
};
CDrawingButtonSimpleText.prototype.private_DrawSelectionBounds = function(Canvas, W, H)
{
};