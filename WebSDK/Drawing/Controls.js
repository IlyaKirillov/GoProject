"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     18.11.14
 * Time     21:22
 */

function CControlBounds()
{
    this.L      = 0;
    this.T      = 0;
    this.R      = 0;
    this.B      = 0;

    this.isAbsL = false;
    this.isAbsT = false;
    this.isAbsR = false;
    this.isAbsB = false;

    this.AbsW   = -1;
    this.AbsH   = -1;
}

CControlBounds.prototype.SetParams = function(_l,_t,_r,_b,abs_l,abs_t,abs_r,abs_b,absW,absH)
{
    this.L = _l;
    this.T = _t;
    this.R = _r;
    this.B = _b;

    this.isAbsL = abs_l;
    this.isAbsT = abs_t;
    this.isAbsR = abs_r;
    this.isAbsB = abs_b;

    this.AbsW   = absW;
    this.AbsH   = absH;
};

var g_anchor_left       = 1;
var g_anchor_top        = 2;
var g_anchor_right      = 4;
var g_anchor_bottom     = 8;

function CControlContainer()
{
    this.Bounds         = new CControlBounds();
    this.Anchor         = g_anchor_left | g_anchor_top;

    this.Name           = null;
    this.Parent         = null;
    this.TabIndex       = null;

    this.HtmlElement    = null;

    this.AbsolutePosition = new CControlBounds();

    this.Controls       = new Array();
    this.width          = 0;
    this.height         = 0;

    this.Type           = 0;
    this.DrawingElement = null;
    this.RMin           = 400;
}
CControlContainer.prototype.Set_Type = function(Type, DrawingElement, Pr)
{
    this.Type = Type;
    this.DrawingElement = DrawingElement;

    if (DrawingElement && DrawingElement.Add_LinkedControl)
        DrawingElement.Add_LinkedControl(this);

    if (Pr && undefined !== Pr.RMin)
        this.RMin = Pr.RMin;
};
CControlContainer.prototype.AddControl = function(ctrl)
{
    ctrl.Parent = this;
    this.Controls[this.Controls.length] = ctrl;
};
CControlContainer.prototype.Resize = function(_width,_height)
{
    this.width  = _width;
    this.height = _height;

    if (null == this.Parent)
    {
        this.AbsolutePosition.L = 0;
        this.AbsolutePosition.T = 0;
        this.AbsolutePosition.R = _width;
        this.AbsolutePosition.B = _height;

        if (null !== this.HtmlElement)
        {
            this.private_ResizeControls(_width, _height);
        }
        return;
    }

    var _x = 0;
    var _y = 0;
    var _r = 0;
    var _b = 0;

    var hor_anchor = (this.Anchor & 0x05);
    var ver_anchor = (this.Anchor & 0x0A);

    if (g_anchor_left == hor_anchor)
    {
        if (this.Bounds.isAbsL)
            _x = this.Bounds.L;
        else
            _x = (this.Bounds.L * _width / 1000);

        if (-1 != this.Bounds.AbsW)
            _r = _x + this.Bounds.AbsW;
        else
        {
            if (this.Bounds.isAbsR)
                _r = (_width - this.Bounds.R);
            else
                _r = this.Bounds.R * _width / 1000;
        }
    }
    else if (g_anchor_right == hor_anchor)
    {
        if (this.Bounds.isAbsR)
            _r = (_width - this.Bounds.R);
        else
            _r = (this.Bounds.R * _width / 1000);

        if (-1 != this.Bounds.AbsW)
            _x = _r - this.Bounds.AbsW;
        else
        {
            if (this.Bounds.isAbsL)
                _x = this.Bounds.L;
            else
                _x = this.Bounds.L * _width / 1000;
        }
    }
    else if ((g_anchor_left | g_anchor_right) == hor_anchor)
    {
        if (this.Bounds.isAbsL)
            _x = this.Bounds.L;
        else
            _x = (this.Bounds.L * _width / 1000);

        if (this.Bounds.isAbsR)
            _r = (_width - this.Bounds.R);
        else
            _r = (this.Bounds.R * _width / 1000);
    }
    else
    {
        _x = this.Bounds.L;
        _r = this.Bounds.R;
    }

    if (g_anchor_top == ver_anchor)
    {
        if (this.Bounds.isAbsT)
            _y = this.Bounds.T;
        else
            _y = (this.Bounds.T * _height / 1000);

        if (-1 != this.Bounds.AbsH)
            _b = _y + this.Bounds.AbsH;
        else
        {
            if (this.Bounds.isAbsB)
                _b = (_height - this.Bounds.B);
            else
                _b = this.Bounds.B * _height / 1000;
        }
    }
    else if (g_anchor_bottom == ver_anchor)
    {
        if (this.Bounds.isAbsB)
            _b = (_height - this.Bounds.B);
        else
            _b = (this.Bounds.B * _height / 1000);

        if (-1 != this.Bounds.AbsH)
            _y = _b - this.Bounds.AbsH;
        else
        {
            if (this.Bounds.isAbsT)
                _y = this.Bounds.T;
            else
                _y = this.Bounds.T * _height / 1000;
        }
    }
    else if ((g_anchor_top | g_anchor_bottom) == ver_anchor)
    {
        if (this.Bounds.isAbsT)
            _y = this.Bounds.T;
        else
            _y = (this.Bounds.T * _height / 1000);

        if (this.Bounds.isAbsB)
            _b = (_height - this.Bounds.B);
        else
            _b = (this.Bounds.B * _height / 1000);
    }
    else
    {
        _y = this.Bounds.T;
        _b = this.Bounds.B;
    }

    if (_r < _x)
        _r = _x;
    if (_b < _y)
        _b = _y;

    if ( -2 === this.Bounds.AbsW )
        _r = _x + ( _b - _y ) * 1;//g_dKoef_Board_W_to_H;
    else if ( -3 === this.Bounds.AbsW )
        _x = ( _b - _y ) * 1;//g_dKoef_Board_W_to_H;

    this.AbsolutePosition.L = _x;
    this.AbsolutePosition.T = _y;
    this.AbsolutePosition.R = _r;
    this.AbsolutePosition.B = _b;

    this.HtmlElement.style.left 	= ((_x + 0.5) | 0) + "px";
    this.HtmlElement.style.top 		= ((_y + 0.5) | 0) + "px";
    this.HtmlElement.style.width 	= (((_r - _x) + 0.5) | 0) + "px";
    this.HtmlElement.style.height 	= (((_b - _y) + 0.5) | 0) + "px";

    this.HtmlElement.width 	= ((_r - _x) + 0.5) | 0;
    this.HtmlElement.height = ((_b - _y) + 0.5) | 0;

    this.private_ResizeControls(_r - _x, _b - _y);
};
CControlContainer.prototype.private_ResizeControls = function(_w, _h)
{
    var lCount = this.Controls.length;
    if (1 === this.Type && 2 === lCount)
    {
        var dKoef = (this.DrawingElement ? this.DrawingElement.Get_AspectRatio() : 1);

        // Специальный случай, слева место под доску, справа что останется с заданным минимумом.
        var ControlL = this.Controls[0];
        var ControlR = this.Controls[1];

        var _rMin = this.RMin;

        var W = _w;
        var H = _h;

        W -= _rMin;

        var __w = H * dKoef;
        var __h = W / dKoef;

        var w, h, x, y;
        if (__w <= W)
        {
            h = H;
            w = __w;

            y = 0;
            x = 0;
        }
        else
        {
            w = W;
            h = __h;

            x = 0;
            y = (H - h) / 2;
        }

        ControlL.Bounds.SetParams(x, y, 1000, 1000, true, true, false, false, w, h);
        ControlL.Anchor = (g_anchor_left | g_anchor_top);
        ControlR.Bounds.SetParams(w, 0, 1000, 1000, true, false, false, false, -1, -1);
        ControlR.Anchor = (g_anchor_right | g_anchor_bottom | g_anchor_top);
    }
    else if (2 === this.Type && 1 === lCount)
    {
        // Если не задан элемент, который мы должны расположить, тогда считаем, что он должен быть квадратным
        if (!this.DrawingElement)
        {
            var Control = this.Controls[0];

            var min = Math.min(_w, _h);
            var _x = (_w - min) / 2;
            var _y = (_h - min) / 2;

            Control.Bounds.SetParams(_x, _y, 1000, 1000, true, true, true, false, min, min);
            Control.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_top);
        }
        else
        {
            var dKoef = this.DrawingElement.Get_AspectRatio();

            var Control = this.Controls[0];

            var __w = _h * dKoef;
            var __h = _w / dKoef;

            var w, h, x, y;
            if (__w <= _w)
            {
                h = _h;
                w = __w;

                y = 0;
                x = (_w - w) / 2;
            }
            else
            {
                w = _w;
                h = __h;

                x = 0;
                y = (_h - h) / 2;
            }

            Control.Bounds.SetParams(x, y, 1000, 1000, true, true, false, false, w, h);
            Control.Anchor = (g_anchor_left | g_anchor_top);

        }
    }
    else if (3 === this.Type && 2 === lCount)
    {
        // Случай, когда сверху место под доску, а внизу сколько останется, но не меньше определенного значения

        var dKoef = (this.DrawingElement ? this.DrawingElement.Get_AspectRatio() : 1);

        // Специальный случай, слева место под доску, справа что останется с заданным минимумом.
        var ControlT = this.Controls[0];
        var ControlB = this.Controls[1];

        var nMin = this.RMin;

        var W = _w;
        var H = _h;

        H -= nMin;

        var __w = H * dKoef;
        var __h = W / dKoef;

        var w, h, x, y;
        if (__w <= W)
        {
            h = H;
            w = __w;

            y = 0;
            x = (W - w) / 2;
        }
        else
        {
            w = W;
            h = __h;

            x = 0;
            y = 0;
        }

        ControlT.Bounds.SetParams(x, y, 1000, 1000, true, true, false, false, w, h);
        ControlT.Anchor = (g_anchor_left | g_anchor_top);
        ControlB.Bounds.SetParams(0, h, 1000, 1000, false, true, false, false, -1, -1);
        ControlB.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
    }

    for (var i = 0; i < lCount; i++)
    {
        this.Controls[i].Resize(_w, _h);
    }
};
CControlContainer.prototype.Clear = function()
{
    this.Controls       = [];
    this.Type           = 0;
    this.DrawingElement = null;
    this.RMin           = 400;
};

function CreateControlContainer(name)
{
    var ctrl = new CControlContainer();
    ctrl.Name = name;
    ctrl.HtmlElement = document.getElementById(name);
    return ctrl;
}
function CControlContainerBoardAndBottomButtons()
{
    this.Parent         = null;
    this.HtmlElement    = null;

    this.H              = 0;

    this.Controls       = new Array();
}
CControlContainerBoardAndBottomButtons.prototype.Set = function(H)
{
    // Задается высота панели с кнопками
    this.H = H;
};
CControlContainerBoardAndBottomButtons.prototype.AddControl = function(ctrl)
{
    ctrl.Parent = this;
    this.Controls[this.Controls.length] = ctrl;
};
CControlContainerBoardAndBottomButtons.prototype.Resize = function(_width,_height)
{
    var BoardH = _height - this.H;
    var BoardW = _width;

    if (BoardW !== BoardH)
    {
        BoardW = Math.min(BoardW, BoardH);
        BoardH = BoardW;
    }

    var X_off = (_width - BoardW) / 2;
    var Y_off = (_height - this.H - BoardH) / 2;



    this.HtmlElement.style.left 	= parseInt(X_off + 0.5) + "px";
    this.HtmlElement.style.top 		= parseInt(Y_off + 0.5) + "px";
    this.HtmlElement.style.width 	= parseInt(BoardW + 0.5) + "px";
    this.HtmlElement.style.height 	= parseInt(BoardH + this.H + 0.5) + "px";

    this.HtmlElement.width 	= parseInt(BoardW + 0.5);
    this.HtmlElement.height = parseInt(BoardH + this.H + 0.5);

    var lCount = this.Controls.length;
    for (var i = 0; i < lCount; i++)
    {
        this.Controls[i].Resize(BoardW, BoardH + this.H);
    }
};
CControlContainerBoardAndBottomButtons.Create = function(sName)
{
    var ctrl = new CControlContainerBoardAndBottomButtons();
    ctrl.Name = sName;
    ctrl.HtmlElement = document.getElementById(sName);
    return ctrl;
};