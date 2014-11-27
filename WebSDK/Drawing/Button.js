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
    Forward_5       : 4,
    ForwardToEnd    : 5
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

    this.m_oImageData = null;

    this.HtmlElement =
    {
        Control : null,
        Canvas  : {Control : null}
    };

    this.m_oBackColor = new CColor(255, 255, 255);

    this.m_nW = 0;
    this.m_nH = 0;

    var oThis = this;

    this.private_OnMouseDown = function(e)
    {

    };

    this.private_OnMouseUp = function(e)
    {

    };

    this.private_OnMouseOver = function(e)
    {

    };

    this.private_OnMouseOut = function(e)
    {

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

    var Canvas = this.HtmlElement.Canvas.Control.HtmlElement.getContext("2d");
    Canvas.fillStyle = this.m_oBackColor.ToString();
    Canvas.fillRect(0, 0, W, H);

    Canvas.fillStyle = (new CColor(0, 0, 0, 255)).ToString();
    switch(this.m_nType)
    {
        case EDrawingButtonType.BackwardToStart:
        {
            var X0 = Math.ceil(W / 4 + 0.5);
            var X1 = Math.ceil(3 * W / 4 - W / 16 + 0.5);
            var Y_1_3 = Math.ceil(H / 5 + 0.5);
            var Y_1_2 = Math.ceil(H / 2 + 0.5);
            var Y_2_3 = Math.ceil(4 * H / 5 + 0.5);

            Canvas.beginPath();
            Canvas.moveTo(X0, Y_1_2);
            Canvas.lineTo(X1, Y_1_3);
            Canvas.lineTo(X1, Y_2_3);
            Canvas.closePath();
            Canvas.fill();

            var X = Math.ceil(W / 8 + 0.5);
            var Y = Math.ceil(H / 5 + 0.5);
            var _W = Math.ceil(W / 8 + 0.5);
            var _H = Math.ceil(3  * H / 5 + 0.5);
            Canvas.fillRect(X, Y, _W, _H);

            break;
        }
        case EDrawingButtonType.Backward_5:
        {
            Canvas.beginPath();
            Canvas.moveTo(W / 4, H / 2);
            Canvas.lineTo(3 * W / 4 - W / 16, H / 3);
            Canvas.lineTo(3 * W / 4 - W / 16, 2 * H / 3);
            Canvas.closePath();
            Canvas.fill();

            Canvas.fillRect(3 * W / 4, H / 3, W / 8, H / 3 );
            break;
        }
        case EDrawingButtonType.Backward:
        {
            Canvas.beginPath();
            Canvas.moveTo(W / 4, H / 2);
            Canvas.lineTo(3 * W / 4 - W / 16, H / 3);
            Canvas.lineTo(3 * W / 4 - W / 16, 2 * H / 3);
            Canvas.closePath();
            Canvas.fill();
            break;
        }
    };
};
