"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     30.11.14
 * Time     0:52
 */

function CDrawingNavigator(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;
    this.m_oMap      = new CNavigatorMap();

    this.m_bNeedRedrawCurrent     = true;
    this.m_bNeedRedrawMap         = true;
    this.m_bNeedRedrawGameCurrent = true;

    this.m_nTile_24  = Common.ConvertToRetinaValue(24);
    this.m_nTile_20  = Common.ConvertToRetinaValue(20);
    this.m_nTile_10  = Common.ConvertToRetinaValue(10);
    this.m_nTile_11  = Common.ConvertToRetinaValue(11);
    this.m_nTile_12  = Common.ConvertToRetinaValue(12);
    this.m_nTile_2   = Common.ConvertToRetinaValue(2);
    this.m_nTile_3   = Common.ConvertToRetinaValue(3);
    this.m_nTile_18  = Common.ConvertToRetinaValue(18);
    this.m_nFontSize = Common.ConvertToRetinaValue(10);

    this.HtmlElement = {
        Control     : null,

        Board       : {Control : null},
        Selection   : {Control : null},
        Current     : {Control : null},
        Lines       : {Control : null},
        Shadows     : {Control : null},
        Nodes       : {Control : null},
        Events      : {Control : null},
        HorScroll   : null,
        VerScroll   : null,
        HorScrollBG : null,
        VerScrollBG : null,
        ScrollW     : 0,
        ScrollH     : 0
    };

    this.m_oCreateWoodyId = null;
    
    this.m_oImageData = {
        W             : 0,
        H             : 0,
        Board         : null,
        Black         : null,
        White         : null,
        BlackT        : null,
        WhiteT        : null,
        Hor_Start     : null,
        Hor_Start2    : null,
        Hor           : null,
        Hor2          : null,
        Hor_End       : null,
        Ver           : null,
        Ver2          : null,
        Ver3          : null,
        Hor_Start_T   : null,
        Hor_Start2_T  : null,
        Hor_Start2_T_2: null,
        Hor_Start2_T_3: null,
        Hor_T         : null,
        Hor2_T        : null,
        Hor2_T_2      : null,
        Hor2_T_3      : null,
        Hor_End_T     : null,
        Ver_T         : null,
        Ver2_T        : null,
        Ver2_T_2      : null,
        Ver2_T_3      : null,
        Ver3_T        : null,
        Triangle      : null,
        Triangle_T    : null,
        Triangle_B    : null,
        Triangle_W    : null,
        Triangle_BT   : null,
        Triangle_WT   : null,
        Target        : null,
        Current       : null,
        GameCurrent   : null,
        Shadow        : null,
        ShadowOff     : 0
    };

    this.m_oOffset          = {X : 0, Y : 0};
    this.m_bMouseLock       = false;
    this.m_bNavigatorScroll = true;

    this.m_oLastDrawMap = {
        W : 0,
        H : 0,
        X : 0,
        Y : 0
    };

    this.m_nHorScrollTimerId = null;
    this.m_nVerScrollTimerId = null;

    this.m_nHorScrollBlurTimerId = null;
    this.m_nVerScrollBlurTimerId = null;

    var oThis = this;

    var dBlurSpeed = 0.01;
    function HorScrollBlur()
    {
        if (oThis.m_bMouseLock)
        {
            oThis.m_nHorScrollBlurTimerId = null;
            return;
        }

        var dScrollOpacity   = parseFloat(oThis.HtmlElement.HorScroll.style.opacity);
        var dScrollBgOpacity = parseFloat(oThis.HtmlElement.HorScrollBG.style.opacity);

        dScrollOpacity   = Math.max(dScrollOpacity - dBlurSpeed, 0);
        dScrollBgOpacity = Math.max(dScrollBgOpacity - dBlurSpeed, 0);

        oThis.HtmlElement.HorScroll.style.opacity   = dScrollOpacity;
        oThis.HtmlElement.HorScrollBG.style.opacity = dScrollBgOpacity;

        if (dScrollOpacity > 0.001)
            oThis.m_nHorScrollBlurTimerId = setTimeout(HorScrollBlur, 10);
        else
            oThis.m_nHorScrollBlurTimerId = null;
    }

    function VerScrollBlur()
    {
        if (oThis.m_bMouseLock)
        {
            oThis.m_nHorScrollBlurTimerId = null;
            return;
        }

        var dScrollOpacity   = parseFloat(oThis.HtmlElement.VerScroll.style.opacity);
        var dScrollBgOpacity = parseFloat(oThis.HtmlElement.VerScrollBG.style.opacity);

        dScrollOpacity   = Math.max(dScrollOpacity - dBlurSpeed, 0);
        dScrollBgOpacity = Math.max(dScrollBgOpacity - dBlurSpeed, 0);

        oThis.HtmlElement.VerScroll.style.opacity   = dScrollOpacity;
        oThis.HtmlElement.VerScrollBG.style.opacity = dScrollBgOpacity;

        if (dScrollOpacity > 0.001)
            oThis.m_nVerScrollBlurTimerId = setTimeout(VerScrollBlur, 10);
        else
            oThis.m_nVerScrollBlurTimerId = null;
    }

    this.private_StartDrawingTimer = function()
    {
        return setTimeout(function()
        {
            oThis.private_CreateTrueColorBoard();
        }, 20);
    };

    this.private_OnMouseDown = function(e)
    {
        if (oThis.m_bMouseLock)
            return;

        if (oThis.m_oGameTree)
            oThis.m_oGameTree.Focus();

        check_MouseDownEvent(e, true);
        var oPos = oThis.private_UpdateMousePos(global_mouseEvent.X, global_mouseEvent.Y);

        var Value = oThis.m_oMap.Get(oPos.X, oPos.Y);
        if (Value.Is_Node() && oThis.m_oGameTree)
            oThis.m_oGameTree.GoTo_Node(Value);
    };

    this.private_OnMouseMove = function(e)
    {
        if (oThis.m_bMouseLock)
            return;

        check_MouseMoveEvent(e);
        var oPos = oThis.private_UpdateMousePos(global_mouseEvent.X, global_mouseEvent.Y);
        oThis.private_UpdateTarget(oPos.X, oPos.Y);
    };

    this.private_OnMouseOut = function(e)
    {
        if (oThis.m_bMouseLock)
            return;

        oThis.private_UpdateTarget(-1, -1);
    };

    this.private_OnMouseWheel = function(Event)
    {
        if (oThis.m_bMouseLock)
            return false;

        var delta = 0;

        if (undefined != Event.wheelDelta)
            delta = (Event.wheelDelta > 0) ? -45 : 45;
        else
            delta = (Event.detail > 0) ? 45 : -45;

        if (Event.preventDefault)
            Event.preventDefault();

        var YOffset = delta;

        var LogicYMax  = oThis.m_oMap.Get_Height() + 1;
        var NavH       = oThis.HtmlElement.Board.Control.HtmlElement.height;
        var YMaxOffset = (this.m_nTile_20 + LogicYMax * this.m_nTile_24 - NavH);

        oThis.m_oOffset.Y -= YOffset;
        oThis.m_oOffset.Y = Math.min(0, Math.max(oThis.m_oOffset.Y, -YMaxOffset));

        oThis.private_DrawMap();
        oThis.private_OnMouseMove(Event);
        oThis.private_UpdateScrollsPos();

        oThis.private_ClearVerScrollBlurTimer();
        oThis.HtmlElement.VerScrollBG.style.opacity = 0.3;
        oThis.HtmlElement.VerScroll.style.opacity   = 0.5;
        oThis.m_nVerScrollBlurTimerId = setTimeout(VerScrollBlur, 500);

        return false;
    };

    this.private_OnFocus = function()
    {
        if (oThis.m_oGameTree)
            oThis.m_oGameTree.Focus();
    };

    this.private_ClearHorScrollTimer = function()
    {
        if (null !== oThis.m_nHorScrollTimerId)
        {
            clearTimeout(oThis.m_nHorScrollTimerId);
            oThis.m_nHorScrollTimerId = null;
        }
    };

    this.private_ClearHorScrollBlurTimer = function()
    {
        if (null !== oThis.m_nHorScrollBlurTimerId)
        {
            clearTimeout(oThis.m_nHorScrollBlurTimerId);
            oThis.m_nHorScrollBlurTimerId = null;
        }
    };

    this.private_OnMouseDownHorScrollBG = function(e)
    {
        oThis.private_ClearHorScrollTimer();

        check_MouseDownEvent(e, true);

        var oPos = Common_FindPosition(oThis.HtmlElement.HorScrollBG);
        var X = global_mouseEvent.X - oPos.X;

        var LogicXMax = oThis.m_oMap.Get_Width() + 1;
        var ScrollW   = oThis.HtmlElement.ScrollW;
        var NavW      = oThis.m_oImageData.W - 4;

        X -= ScrollW / 2;
        X = Math.max(0, Math.min(NavW - ScrollW, X));

        var nSpeed = 200;
        var nEndXOffset = (this.m_nTile_20 + LogicXMax * this.m_nTile_24 - NavW) * (X / (NavW - ScrollW));

        function HorScrollTimer(bFirstTime)
        {
            var nCurX = -oThis.m_oOffset.X;
            if (nCurX !== nEndXOffset)
            {
                if (nCurX < nEndXOffset)
                {
                    nCurX = Math.min(nEndXOffset, nCurX + nSpeed);
                }
                else
                {
                    nCurX = Math.max(nEndXOffset, nCurX - nSpeed);
                }

                oThis.m_oOffset.X = -nCurX;
                oThis.private_DrawMap();
                oThis.private_UpdateScrollsPos();

                if (nCurX !== nEndXOffset)
                    oThis.m_nHorScrollTimerId = setTimeout(HorScrollTimer, true === bFirstTime ? 300 : 30);
                else
                    oThis.m_nHorScrollTimerId = null;
            }
            else
                oThis.m_nHorScrollTimerId = null;
        };

        HorScrollTimer(true);
    };

    this.private_OnMouseUpHorScrollBG = function(e)
    {
        oThis.private_ClearHorScrollTimer();
    };

    this.private_OnMouseOverHorScrollBG = function()
    {
        oThis.private_ClearHorScrollBlurTimer();

        oThis.HtmlElement.HorScrollBG.style.opacity = 0.3;
        oThis.HtmlElement.HorScroll.style.opacity   = 0.5;
    };

    this.private_OnMouseOutHorScrollBG = function()
    {
        oThis.private_ClearHorScrollTimer();
        oThis.m_nHorScrollBlurTimerId = setTimeout(HorScrollBlur, 10);
    };

    this.private_ClearVerScrollTimer = function()
    {
        if (null !== oThis.m_nVerScrollTimerId)
        {
            clearTimeout(oThis.m_nVerScrollTimerId);
            oThis.m_nVerScrollTimerId = null;
        }
    };

    this.private_ClearVerScrollBlurTimer = function()
    {
        if (null !== oThis.m_nVerScrollBlurTimerId)
        {
            clearTimeout(oThis.m_nVerScrollBlurTimerId);
            oThis.m_nVerScrollBlurTimerId = null;
        }
    };

    this.private_OnMouseDownVerScrollBG = function(e)
    {
        oThis.private_ClearVerScrollTimer();

        check_MouseDownEvent(e, true);

        var oPos = Common_FindPosition(oThis.HtmlElement.VerScrollBG);
        var Y = global_mouseEvent.Y - oPos.Y;

        var LogicYMax = oThis.m_oMap.Get_Height() + 1;
        var ScrollH   = oThis.HtmlElement.ScrollH;
        var NavH      = oThis.m_oImageData.H - 4;

        Y -= ScrollH / 2;
        Y = Math.max(0, Math.min(NavH - ScrollH, Y));

        var nSpeed = 48;
        var nEndYOffset = (this.m_nTile_20 + LogicYMax * this.m_nTile_24 - NavH) * (Y / (NavH - ScrollH));

        function VerScrollTimer(bFirstTime)
        {
            var nCurY = -oThis.m_oOffset.Y;
            if (nCurY !== nEndYOffset)
            {
                if (nCurY < nEndYOffset)
                {
                    nCurY = Math.min(nEndYOffset, nCurY + nSpeed);
                }
                else
                {
                    nCurY = Math.max(nEndYOffset, nCurY - nSpeed);
                }

                oThis.m_oOffset.Y = -nCurY;
                oThis.private_DrawMap();
                oThis.private_UpdateScrollsPos();

                if (nCurY !== nEndYOffset)
                    oThis.m_nVerScrollTimerId = setTimeout(VerScrollTimer, true === bFirstTime ? 300 : 30);
                else
                    oThis.m_nVerScrollTimerId = null;
            }
            else
                oThis.m_nVerScrollTimerId = null;
        };

        VerScrollTimer(true);
    };

    this.private_OnMouseUpVerScrollBG = function(e)
    {
        oThis.private_ClearVerScrollTimer();
    };

    this.private_OnMouseOverVerScrollBG = function()
    {
        oThis.private_ClearVerScrollBlurTimer();
        oThis.HtmlElement.VerScrollBG.style.opacity = 0.3;
        oThis.HtmlElement.VerScroll.style.opacity   = 0.5;
    };

    this.private_OnMouseOutVerScrollBG = function()
    {
        oThis.private_ClearVerScrollTimer();
        oThis.m_nVerScrollBlurTimerId = setTimeout(VerScrollBlur, 10);
    };

    this.private_OnMouseOverHorScroll = function()
    {
        oThis.private_ClearHorScrollBlurTimer();

        oThis.HtmlElement.HorScroll.style.opacity   = 0.7;
        oThis.HtmlElement.HorScrollBG.style.opacity = 0.3;
    };

    this.private_OnMouseOutHorScroll = function()
    {
        oThis.private_ClearHorScrollTimer();
        oThis.m_nHorScrollBlurTimerId = setTimeout(HorScrollBlur, 10);
    };

    this.private_OnMouseOverVerScroll = function()
    {
        oThis.private_ClearVerScrollBlurTimer();
        oThis.HtmlElement.VerScroll.style.opacity   = 0.7;
        oThis.HtmlElement.VerScrollBG.style.opacity = 0.3;
    };

    this.private_OnMouseOutVerScroll = function()
    {
        oThis.HtmlElement.VerScroll.style.opacity   = 0.5;
        oThis.m_nVerScrollBlurTimerId = setTimeout(VerScrollBlur, 10);
    };

    this.private_OnDragStartScroll = function()
    {
        oThis.m_bMouseLock = true;
    };

    this.private_OnDragEndScroll = function()
    {
        oThis.m_bMouseLock = false;

        var X = global_mouseEvent.X;
        var Y = global_mouseEvent.Y;

        var oHorPos = Common_FindPosition(oThis.HtmlElement.HorScrollBG);
        var nHorX = oHorPos.X, nHorY = oHorPos.Y, nHorW = oThis.HtmlElement.HorScrollBG.clientWidth, nHorH = oThis.HtmlElement.HorScrollBG.clientHeight;
        if (X < nHorX || X > nHorX + nHorW || Y < nHorY || Y > nHorY + nHorH)
            oThis.m_nHorScrollBlurTimerId = setTimeout(HorScrollBlur, 10);

        var oVerPos = Common_FindPosition(oThis.HtmlElement.VerScrollBG);
        var nVerX = oVerPos.X, nVerY = oVerPos.Y, nVerW = oThis.HtmlElement.VerScrollBG.clientWidth, nVerH = oThis.HtmlElement.VerScrollBG.clientHeight;
        if (X < nVerX || X > nVerX + nVerW || Y < nVerY || Y > nVerY + nVerH)
            oThis.m_nVerScrollBlurTimerId = setTimeout(VerScrollBlur, 10);
    };

    this.private_OnDragHorScroll = function(X, Y)
    {
        X -= 2;
        var LogicXMax = oThis.m_oMap.Get_Width() + 1;
        var ScrollW   = oThis.HtmlElement.ScrollW;
        var NavW      = oThis.m_oImageData.W;

        var XOffset = (this.m_nTile_20 + LogicXMax * this.m_nTile_24 - NavW) * (X / (NavW - 4 - ScrollW));
        oThis.m_oOffset.X = -XOffset;
        oThis.private_DrawMap();
    };

    this.private_OnDragVerScroll = function(X, Y)
    {
        Y -= 2;
        var LogicYMax = oThis.m_oMap.Get_Height() + 1;
        var ScrollH   = oThis.HtmlElement.ScrollH;
        var NavH      = oThis.m_oImageData.H;

        var YOffset = (this.m_nTile_20 + LogicYMax * this.m_nTile_24 - NavH) * (Y / (NavH - 4 - ScrollH));
        oThis.m_oOffset.Y = -YOffset;
        oThis.private_DrawMap();
    };
}

CDrawingNavigator.prototype.Init = function(sDivId, oGameTree)
{
    if (this.m_oDrawing)
        this.m_oDrawing.Register_Navigator(this);

    this.m_oGameTree = oGameTree;
    this.m_oGameTree.Set_DrawingNavigator(this);
    this.m_oMap.Set_GameTree(oGameTree);

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var oMainElement = this.HtmlElement.Control.HtmlElement;
    var oMainControl = this.HtmlElement.Control;

    var sBoardName     = sDivId + "_Board";
    var sSelectionName = sDivId + "_Selection";
    var sCurrentName   = sDivId + "_Current";
    var sLinesName     = sDivId + "_Lines";
    var sShadowsName   = sDivId + "_Shadows";
    var sNodesName     = sDivId + "_Nodes";
    var sEventsName    = sDivId + "_Events";

    this.private_CreateCanvasElement(oMainElement, sBoardName);
    this.private_CreateCanvasElement(oMainElement, sSelectionName);
    this.private_CreateCanvasElement(oMainElement, sCurrentName);
    this.private_CreateCanvasElement(oMainElement, sLinesName);
    this.private_CreateCanvasElement(oMainElement, sShadowsName);
    this.private_CreateCanvasElement(oMainElement, sNodesName);
    var oEventDiv = this.private_CreateDivElement(oMainElement, sEventsName);

    this.HtmlElement.HorScrollBG = this.private_CreateDivElement(oMainElement, sDivId + "HorScroll_BG");
    this.HtmlElement.HorScroll   = this.private_CreateDivElement(oMainElement, sDivId + "HorScroll");
    this.HtmlElement.VerScrollBG = this.private_CreateDivElement(oMainElement, sDivId + "VerScroll_BG");
    this.HtmlElement.VerScroll   = this.private_CreateDivElement(oMainElement, sDivId + "VerScroll");

    this.HtmlElement.HorScrollBG.style.background = "rgb(0,0,0)";
    this.HtmlElement.HorScrollBG.style.opacity = "0";
    this.HtmlElement.VerScrollBG.style.background = "rgb(0,0,0)";
    this.HtmlElement.VerScrollBG.style.opacity = "0";

    this.HtmlElement.HorScrollBG['onmousedown'] = this.private_OnMouseDownHorScrollBG;
    this.HtmlElement.HorScrollBG['onmouseup']   = this.private_OnMouseUpHorScrollBG;
    this.HtmlElement.HorScrollBG['onmouseover'] = this.private_OnMouseOverHorScrollBG;
    this.HtmlElement.HorScrollBG['onmouseout']  = this.private_OnMouseOutHorScrollBG;

    this.HtmlElement.VerScrollBG['onmousedown'] = this.private_OnMouseDownVerScrollBG;
    this.HtmlElement.VerScrollBG['onmouseup']   = this.private_OnMouseUpVerScrollBG;
    this.HtmlElement.VerScrollBG['onmouseover'] = this.private_OnMouseOverVerScrollBG;
    this.HtmlElement.VerScrollBG['onmouseout']  = this.private_OnMouseOutVerScrollBG;

    this.HtmlElement.HorScroll['onmouseover'] = this.private_OnMouseOverHorScroll;
    this.HtmlElement.HorScroll['onmouseout']  = this.private_OnMouseOutHorScroll;
    this.HtmlElement.VerScroll['onmouseover'] = this.private_OnMouseOverVerScroll;
    this.HtmlElement.VerScroll['onmouseout']  = this.private_OnMouseOutVerScroll;

    var oHorScroll = CreateControlContainer(sDivId + "HorScroll_BG");
    oHorScroll.Bounds.SetParams(2, 0, 2, 4, true, false, true, true, -1, 8);
    oHorScroll.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
    oMainControl.AddControl(oHorScroll);

    var oVerScroll = CreateControlContainer(sDivId + "VerScroll_BG");
    oVerScroll.Bounds.SetParams(0, 2, 4, 2, false, true, true, true, 8, -1);
    oVerScroll.Anchor = (g_anchor_top | g_anchor_bottom | g_anchor_right);
    oMainControl.AddControl(oVerScroll);

    this.private_FillHtmlElement(this.HtmlElement.Board,     oMainControl, sBoardName);
    this.private_FillHtmlElement(this.HtmlElement.Selection, oMainControl, sSelectionName);
    this.private_FillHtmlElement(this.HtmlElement.Current,   oMainControl, sCurrentName);
    this.private_FillHtmlElement(this.HtmlElement.Lines,     oMainControl, sLinesName);
    this.private_FillHtmlElement(this.HtmlElement.Shadows,   oMainControl, sShadowsName);
    this.private_FillHtmlElement(this.HtmlElement.Nodes,     oMainControl, sNodesName);
    this.private_FillHtmlElement(this.HtmlElement.Events,    oMainControl, sEventsName);

    oEventDiv.onmousedown     = this.private_OnMouseDown;
    oEventDiv.onmousemove     = this.private_OnMouseMove;
    oEventDiv.onmouseout      = this.private_OnMouseOut;
    oEventDiv['onmousewheel'] = this.private_OnMouseWheel;
    if (oEventDiv.addEventListener)
        oEventDiv.addEventListener("DOMMouseScroll", this.private_OnMouseWheel, false);

    oEventDiv['onfocus']      = this.private_OnFocus;
    oEventDiv.tabIndex        = -1;   // Этот параметр нужен, чтобы принимать сообщения клавиатуры (чтобы на этой div вставал фокус)
    oEventDiv.style.hidefocus = true; // Убираем рамку фокуса в IE
    oEventDiv.style.outline   = 0;    // Убираем рамку фокуса в остальных браузерах

    // Сразу создаем камни и линии, потому что они у нас не зависят от размера Div.
    this.private_CreateTrueColorStones();
    this.private_CreateLines();
    this.private_CreateTarget();
    this.private_CreateShadows();
};
CDrawingNavigator.prototype.Update_All = function()
{
    this.private_CreateTrueColorStones();
    this.private_CreateLines();
    this.private_CreateTarget();
    this.private_CreateShadows();

    this.Update_Size(true);
};
CDrawingNavigator.prototype.Update_Size = function(bForce)
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    this.HtmlElement.Control.Resize(W, H);

    this.private_OnResize(W, H, bForce);
};
CDrawingNavigator.prototype.Update = function()
{
    if (this.m_oImageData.W <= 0 || this.m_oImageData.H <= 0)
        return;

    var LogicXMax = this.m_oMap.Get_Width() + 1;
    var LogicYMax = this.m_oMap.Get_Height() + 1;

    var NavW = this.m_oImageData.W;
    var NavH = this.m_oImageData.H;

    var _NavW = this.m_nTile_20 + LogicXMax * this.m_nTile_24;
    var _NavH = this.m_nTile_20 + LogicYMax * this.m_nTile_24;
    if (_NavW > NavW)
    {
        this.HtmlElement.ScrollW                    = Math.max(50, NavW * NavW / _NavW);
        this.HtmlElement.HorScroll.style.width      = Math.max(50, NavW * NavW / _NavW) + "px";
        this.HtmlElement.HorScroll.style.display    = "block";
        this.HtmlElement.HorScroll.style.position   = "absolute";
        this.HtmlElement.HorScroll.style.top        = NavH - 12 + "px";
        this.HtmlElement.HorScroll.style.height     = 8 + "px";
        this.HtmlElement.HorScroll.style.background = this.private_GetSettings_DarkBoard() ? "rgb(220, 220, 220)" : "rgb(0,0,0)";
        this.HtmlElement.HorScroll.style.opacity    = 0;

        Common_DragHandler.Init(this.HtmlElement.HorScroll, null, 2, NavW - this.HtmlElement.ScrollW - 2, NavH - 12, NavH - 12);

        this.HtmlElement.HorScroll.onDrag         = this.private_OnDragHorScroll;
        this.HtmlElement.HorScroll.onDragStart    = this.private_OnDragStartScroll;
        this.HtmlElement.HorScroll.onDragEnd      = this.private_OnDragEndScroll;

        this.HtmlElement.HorScrollBG.style.display = "block";
    }
    else
    {
        this.HtmlElement.HorScrollBG.style.display = "none";
        this.HtmlElement.HorScroll.style.display   = "none";
    }

    if (_NavH > NavH)
    {
        this.HtmlElement.ScrollH                    = Math.max(50, NavH * NavH / _NavH);
        this.HtmlElement.VerScroll.style.height     = Math.max(50, NavH * NavH / _NavH) + "px";
        this.HtmlElement.VerScroll.style.display    = "block";
        this.HtmlElement.VerScroll.style.position   = "absolute";
        this.HtmlElement.VerScroll.style.left       = NavW - 12 + "px";
        this.HtmlElement.VerScroll.style.width      = 8 + "px";
        this.HtmlElement.VerScroll.style.background = this.private_GetSettings_DarkBoard() ? "rgb(220, 220, 220)" : "rgb(0,0,0)";
        this.HtmlElement.VerScroll.style.opacity    = 0;

        Common_DragHandler.Init(this.HtmlElement.VerScroll, null, NavW - 12, NavW - 12, 2, NavH - this.HtmlElement.ScrollH - 2);

        this.HtmlElement.VerScroll.onDrag         = this.private_OnDragVerScroll;
        this.HtmlElement.VerScroll.onDragStart    = this.private_OnDragStartScroll;
        this.HtmlElement.VerScroll.onDragEnd      = this.private_OnDragEndScroll;

        this.HtmlElement.VerScrollBG.style.display = "block";
    }
    else
    {
        this.HtmlElement.VerScrollBG.style.display = "none";
        this.HtmlElement.VerScroll.style.display   = "none";
    }

    // Этими строками мы сбрасываем последнее состояние отрисовщика, чтобы перерисовка точно состоялась
    this.m_oLastDrawMap.H = -1;
    this.m_oLastDrawMap.W = -1;

    this.private_DrawMap();
    this.private_UpdateScrollsPos();
};
CDrawingNavigator.prototype.Create_FromGameTree = function()
{
    this.m_oMap.Create_FromGameTree();

    // Этими строками мы сбрасываем последнее состояние отрисовщика, чтобы перерисовка точно состоялась
    this.m_oLastDrawMap.H = -1;
    this.m_oLastDrawMap.W = -1;
};
CDrawingNavigator.prototype.Update_Current = function(bScrollToCurPos)
{
    this.m_bNeedRedrawCurrent = true;

    var W = this.m_oImageData.W;
    var H = this.m_oImageData.H;

    if (W <= 0 || H <= 0)
        return;

    var oCurNodePos = this.m_oGameTree.Get_CurNode().Get_NavigatorInfo();
    var X = oCurNodePos.X, Y = oCurNodePos.Y;

    var RealX = this.m_nTile_10 + this.m_oOffset.X + X * this.m_nTile_24;
    var RealY = this.m_nTile_10 + this.m_oOffset.Y + Y * this.m_nTile_24;

    if (false != bScrollToCurPos && true === this.m_bNavigatorScroll && (RealX <= this.m_nTile_10 || RealX >= W - this.m_nTile_10 || RealY <= this.m_nTile_10 || RealY >= H - this.m_nTile_10))
    {
        var LogicYMax  = this.m_oMap.Get_Height() + 1;
        var YMaxOffset = (this.m_nTile_20 + LogicYMax * this.m_nTile_24 - H);

        var LogicXMax  = this.m_oMap.Get_Width() + 1;
        var XMaxOffset = (this.m_nTile_20 + LogicXMax * this.m_nTile_24 - W);

        if (RealX <= this.m_nTile_10)
        {
            this.m_oOffset.X = -X * this.m_nTile_24;
        }
        else if (RealX >= W - this.m_nTile_10)
        {
            this.m_oOffset.X = W - this.m_nTile_24 - this.m_nTile_10 - this.m_nTile_10 - X * this.m_nTile_24;
        }

        if (RealY <= this.m_nTile_10)
            this.m_oOffset.Y = - Y * this.m_nTile_24;
        else if (RealY >= H - this.m_nTile_10)
            this.m_oOffset.Y = H - this.m_nTile_24 - this.m_nTile_10 - this.m_nTile_10 - Y * this.m_nTile_24;

        this.m_oOffset.X = Math.min(0, Math.max(this.m_oOffset.X, -XMaxOffset));
        this.m_oOffset.Y = Math.min(0, Math.max(this.m_oOffset.Y, -YMaxOffset));

        this.private_UpdateScrollsPos();
        this.private_DrawMap();
    }
};
CDrawingNavigator.prototype.Update_GameCurrent = function()
{
    this.m_bNeedRedrawGameCurrent = true;
};
CDrawingNavigator.prototype.Draw = function()
{
    if (this.m_bNeedRedrawCurrent)
        this.private_DrawCurrentOnTimer();
    if (this.m_bNeedRedrawMap)
        this.private_DrawMapOnTimer();
    if (this.m_bNeedRedrawGameCurrent)
        this.private_DrawGameCurrentOnTimer();
};
CDrawingNavigator.prototype.Need_Redraw = function()
{
    if (this.m_bNeedRedrawCurrent || this.m_bNeedRedrawMap)
        return true;

    return false;
};
CDrawingNavigator.prototype.private_CreateCanvasElement = function(oParentElement, sName)
{
    var oElement = document.createElement("canvas");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingNavigator.prototype.private_CreateDivElement = function(oParentElement, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingNavigator.prototype.private_FillHtmlElement = function(oElement, oParentControl, sName)
{
    oElement.Control = CreateControlContainer(sName);
    var oControl = oElement.Control;
    oControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1,-1);
    oControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    oParentControl.AddControl(oControl);
};
CDrawingNavigator.prototype.private_OnResize = function(W, H, bForce)
{
    W = Common.ConvertToRetinaValue(W);
    H = Common.ConvertToRetinaValue(H);

    this.private_DrawBackground(W, H, bForce);
    this.Update();
    this.Update_Current(true);
    this.Update_GameCurrent();
};
CDrawingNavigator.prototype.private_DrawBackground = function(W, H, bForce)
{
    var Canvas = this.HtmlElement.Board.Control.HtmlElement.getContext("2d");
    if (W !== this.m_oImageData.W || H !== this.m_oImageData.H || null === this.m_oImageData.Board || null !== this.m_oCreateWoodyId || true === bForce)
    {
        this.m_oImageData.W = W;
        this.m_oImageData.H = H;

        Canvas.fillStyle = this.private_GetSettings_BoardColor().ToString();
        Canvas.fillRect(0, 0, W, H);

        if (null !== this.m_oCreateWoodyId)
            clearTimeout(this.m_oCreateWoodyId);

        this.m_oCreateWoodyId = this.private_StartDrawingTimer();
    }
    else
    {
        Canvas.drawImage(this.m_oImageData.Board, 0, 0);
    }
};
CDrawingNavigator.prototype.private_CreateTrueColorBoard = function()
{
    this.m_oCreateWoodyId = null;

    var W = this.m_oImageData.W;
    var H = this.m_oImageData.H;
    var Canvas = this.HtmlElement.Board.Control.HtmlElement.getContext("2d");

    if (0 === W || 0 === H)
        return;

    var oImageData = Canvas.createImageData(W, H);

    var oBoardColor = this.private_GetSettings_BoardColor();
    var Red   = oBoardColor.r;
    var Green = oBoardColor.g;
    var Blue  = oBoardColor.b;

    var dCoffWf = new Array(W);
    for (var X = 0; X < W; X++)
        dCoffWf[X] = (Math.tan(300 * X / W) + 1) / 2 + (Math.tan(100 * X / W) + 1) / 10;

    var dCoffHf = new Array(H);
    for (var Y = 0; Y < H; Y++)
        dCoffHf[Y] = 0.02 * Math.tan(Y / H);

    var r, g, b;
    var oLinesColor = this.private_GetSettings_LinesColor();
    if (true === this.private_GetSettings_TrueColorBoard())
    {
        var f = 9e-1;
        for (var Y = 0; Y < H; Y++)
        {
            for (var X = 0; X < W; X++)
            {
                f = (dCoffWf[X] + dCoffHf[Y]) * 40 + 0.5;
                f = f - Math.floor(f);

                if (f < 2e-1)
                    f = 1 - f / 2;
                else if (f < 4e-1)
                    f = 1 - ( 4e-1 - f ) / 2;
                else
                    f = 1;

                if (Y == H - 1 || (Y == H - 2 && X < W - 2) || X >= W - 1 || (X == W - 2 && Y < H - 1))
                    f = f / 2;

                if (Y == 0 || (Y == 1 && X > 1) || X == 0 || (X == 1 && Y > 1))
                {
                    r = 128 + Red * f / 2;
                    g = 128 + Green * f / 2;
                    b = 128 + Blue * f / 2;
                }
                else
                {
                    r = Red * f;
                    g = Green * f;
                    b = Blue * f;
                }

                var Index = (X + Y * W) * 4;
                oImageData.data[Index + 0] = r;
                oImageData.data[Index + 1] = g;
                oImageData.data[Index + 2] = b;
                oImageData.data[Index + 3] = 255;
            }
        }
    }
    else
    {
        for (var i = 0; i < H; i++)
        {
            for (var j = 0; j < W; j++)
            {
                if (i == 0  || j == 0 || i === H - 1 || j === W - 1)
                {
                    r = oLinesColor.r;
                    g = oLinesColor.g;
                    b = oLinesColor.b;
                }
                else
                {
                    r = Red;
                    g = Green;
                    b = Blue;
                }

                var Index = (j + i * W) * 4;
                oImageData.data[Index + 0] = r;
                oImageData.data[Index + 1] = g;
                oImageData.data[Index + 2] = b;
                oImageData.data[Index + 3] = 255;
            }
        }
    }

    this.m_oImageData.Board = this.private_CreateCanvas(W, H, oImageData);
    Canvas.drawImage(this.m_oImageData.Board, 0, 0);
};
CDrawingNavigator.prototype.private_CreateTrueColorStones = function()
{
    var Canvas = this.HtmlElement.Nodes.Control.HtmlElement.getContext("2d");

    var pixel = 0.8, shadow = 0.7, d = this.m_nTile_20;
    var oBlackImageData  = Canvas.createImageData(d, d);
    var oWhiteImageData  = Canvas.createImageData(d, d);
    var oBlackTImageData = Canvas.createImageData(d, d);
    var oWhiteTImageData = Canvas.createImageData(d, d);

    var BlackBitmap  = oBlackImageData.data;
    var WhiteBitmap  = oWhiteImageData.data;
    var BlackTBitmap = oBlackTImageData.data;
    var WhiteTBitmap = oWhiteTImageData.data;

    var oWhiteColor = this.private_GetSettings_WhiteColor();
    var oBlackColor = this.private_GetSettings_BlackColor();
    var bDarkBoard  = this.private_GetSettings_DarkBoard();

    if (true === this.private_GetSettings_TrueColorStones())
    {
        var d2 = d / 2.0 - 5e-1;
        var r = d2 - 2e-1;
        var f = Math.sqrt(3);
        for (var i = 0; i < d; i++)
        {
            for (var j = 0; j < d; j++)
            {
                var di = i - d2;
                var dj = j - d2;
                var hh = r - Math.sqrt(di * di + dj * dj);
                var Index = (i * d + d - j - 1) * 4;
                if (hh >= 0)
                {
                    var z = r * r - di * di - dj * dj;

                    if (z > 0)
                        z = Math.sqrt(z) * f;
                    else
                        z = 0;

                    var x = di;
                    var y = dj;

                    var xr = Math.sqrt(6 * ( x * x + y * y + z * z ));
                    xr = (2 * z - x + y) / xr;

                    var xg = 0;

                    if (xr > 0.9)
                        xg = (xr - 0.9) * 10;

                    var alpha = 255;

                    if (hh <= pixel)
                    {
                        hh = (pixel - hh) / pixel;
                        var shade = shadow;
                        if (di - dj < r / 3)
                            shade = 1;

                        alpha = parseInt((1 - hh * shade ) * 255);
                    }

                    var g = parseInt(10 + 10 * xr + xg * 140);

                    BlackBitmap[Index + 0] = g;
                    BlackBitmap[Index + 1] = g;
                    BlackBitmap[Index + 2] = g;
                    BlackBitmap[Index + 3] = alpha;

                    BlackTBitmap[Index + 0] = g;
                    BlackTBitmap[Index + 1] = g;
                    BlackTBitmap[Index + 2] = g;
                    BlackTBitmap[Index + 3] = parseInt(alpha * 0.5);

                    g = parseInt(200 + 10 * xr + xg * 45);

                    WhiteBitmap[Index + 0] = g;
                    WhiteBitmap[Index + 1] = g;
                    WhiteBitmap[Index + 2] = g;
                    WhiteBitmap[Index + 3] = alpha;

                    WhiteTBitmap[Index + 0] = g;
                    WhiteTBitmap[Index + 1] = g;
                    WhiteTBitmap[Index + 2] = g;
                    WhiteTBitmap[Index + 3] = parseInt(alpha * 0.7);
                }
                else
                {
                    BlackBitmap[Index + 0] = 0;
                    BlackBitmap[Index + 1] = 0;
                    BlackBitmap[Index + 2] = 0;
                    BlackBitmap[Index + 3] = 0;

                    WhiteTBitmap[Index + 0] = 0;
                    WhiteTBitmap[Index + 1] = 0;
                    WhiteTBitmap[Index + 2] = 0;
                    WhiteTBitmap[Index + 3] = 0;
                }
            }
        }
    }
    else
    {
        var d2 = d / 2.0 - 5e-1;
        var r = d2 - 2e-1;

        for (var i = 0; i < d; i++)
        {
            for (var j = 0; j < d; j++)
            {
                var di = i - d2;
                var dj = j - d2;
                var hh = r - Math.sqrt(di * di + dj * dj);
                var Index = (i * d + d - j - 1) * 4;
                if (hh >= 0)
                {
                    var alpha = 255;

                    if (hh <= pixel)
                    {
                        var _hh = (pixel - hh) / pixel;
                        var shade = shadow;
                        if (di - dj < r / 3)
                            shade = 1;

                        alpha = parseInt((1 - _hh * shade ) * 255);
                    }
                    else if (hh <= 2 *pixel && hh >= pixel && true === bDarkBoard)
                    {
                        var _hh = (2 * pixel - hh) / (pixel);
                        var shade = shadow;
                        if (di - dj < r / 3)
                            shade = 1;
                        alpha = parseInt(_hh * shade * 255);
                    }

                    var bBorder = false;
                    if (hh <= 2 *pixel)
                    {
                        bBorder = true;
                    }

                    if (false === bBorder || false === bDarkBoard)
                    {
                        BlackBitmap[Index + 0] = oBlackColor.r;
                        BlackBitmap[Index + 1] = oBlackColor.g;
                        BlackBitmap[Index + 2] = oBlackColor.b;
                        BlackBitmap[Index + 3] = alpha;

                        BlackTBitmap[Index + 0] = oBlackColor.r;
                        BlackTBitmap[Index + 1] = oBlackColor.g;
                        BlackTBitmap[Index + 2] = oBlackColor.b;
                        BlackTBitmap[Index + 3] = parseInt(alpha * 0.5);
                    }
                    else
                    {
                        BlackBitmap[Index + 0] = oWhiteColor.r;
                        BlackBitmap[Index + 1] = oWhiteColor.g;
                        BlackBitmap[Index + 2] = oWhiteColor.b;
                        BlackBitmap[Index + 3] = alpha;

                        BlackTBitmap[Index + 0] = oWhiteColor.r;
                        BlackTBitmap[Index + 1] = oWhiteColor.g;
                        BlackTBitmap[Index + 2] = oWhiteColor.b;
                        BlackTBitmap[Index + 3] = parseInt(alpha * 0.5);
                    }

                    alpha = 255;
                    if (hh <= pixel)
                    {
                        var _hh = (pixel - hh) / pixel;
                        var shade = shadow;
                        if (di - dj < r / 3)
                            shade = 1;

                        alpha = parseInt((1 - _hh * shade ) * 255);
                    }
                    else if (hh <= 2 *pixel && hh >= pixel && false === bDarkBoard)
                    {
                        var _hh = (2 * pixel - hh) / (pixel);
                        var shade = shadow;
                        if (di - dj < r / 3)
                            shade = 1;
                        alpha = parseInt(_hh * shade * 255);
                    }

                    if (false === bBorder || true === bDarkBoard)
                    {
                        WhiteBitmap[Index + 0] = oWhiteColor.r;
                        WhiteBitmap[Index + 1] = oWhiteColor.g;
                        WhiteBitmap[Index + 2] = oWhiteColor.b;
                        WhiteBitmap[Index + 3] = alpha;

                        WhiteTBitmap[Index + 0] = oWhiteColor.r;
                        WhiteTBitmap[Index + 1] = oWhiteColor.g;
                        WhiteTBitmap[Index + 2] = oWhiteColor.b;
                        WhiteTBitmap[Index + 3] = parseInt(alpha / 2);
                    }
                    else
                    {
                        WhiteBitmap[Index + 0] = oBlackColor.r;
                        WhiteBitmap[Index + 1] = oBlackColor.g;
                        WhiteBitmap[Index + 2] = oBlackColor.b;
                        WhiteBitmap[Index + 3] = alpha;

                        WhiteTBitmap[Index + 0] = oBlackColor.r;
                        WhiteTBitmap[Index + 1] = oBlackColor.g;
                        WhiteTBitmap[Index + 2] = oBlackColor.b;
                        WhiteTBitmap[Index + 3] = parseInt(alpha / 2);
                    }
                }
                else
                {
                    BlackBitmap[Index + 0] = 0;
                    BlackBitmap[Index + 1] = 0;
                    BlackBitmap[Index + 2] = 0;
                    BlackBitmap[Index + 3] = 0;

                    BlackTBitmap[Index + 0] = 0;
                    BlackTBitmap[Index + 1] = 0;
                    BlackTBitmap[Index + 2] = 0;
                    BlackTBitmap[Index + 3] = 0;

                    WhiteBitmap[Index + 0] = 0;
                    WhiteBitmap[Index + 1] = 0;
                    WhiteBitmap[Index + 2] = 0;
                    WhiteBitmap[Index + 3] = 0;

                    WhiteTBitmap[Index + 0] = 0;
                    WhiteTBitmap[Index + 1] = 0;
                    WhiteTBitmap[Index + 2] = 0;
                    WhiteTBitmap[Index + 3] = 0;
                }
            }
        }
    }

	this.m_oImageData.Black  = this.private_CreateCanvas(d, d, oBlackImageData);
	this.m_oImageData.White  = this.private_CreateCanvas(d, d, oWhiteImageData);
	this.m_oImageData.BlackT = this.private_CreateCanvas(d, d, oBlackTImageData);
	this.m_oImageData.WhiteT = this.private_CreateCanvas(d, d, oWhiteTImageData);
};
CDrawingNavigator.prototype.private_CreateLines = function()
{
    var nTransAlpha = 96;

    var Canvas = this.HtmlElement.Lines.Control.HtmlElement.getContext("2d");

    var oHor_Start      = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor_Start2     = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor            = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor2           = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor_End        = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oVer            = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oVer2           = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oVer3           = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor_Start_T    = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor_Start2_T   = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor_Start2_T_2 = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor_Start2_T_3 = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor_T          = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor2_T         = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor2_T_2       = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor2_T_3       = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oHor_End_T      = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oVer_T          = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oVer2_T         = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oVer2_T_2       = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oVer2_T_3       = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);
    var oVer3_T         = Canvas.createImageData(this.m_nTile_24, this.m_nTile_24);

    var NHS_Bitmap      = oHor_Start.data;
    var NHS2_Bitmap     = oHor_Start2.data;
    var NH_Bitmap       = oHor.data;
    var NH2_Bitmap      = oHor2.data;
    var NHE_Bitmap      = oHor_End.data;
    var NV_Bitmap       = oVer.data;
    var NV2_Bitmap      = oVer2.data;
    var NV3_Bitmap      = oVer3.data;
    var NHS_Bitmap_T    = oHor_Start_T.data;
    var NHS2_Bitmap_T   = oHor_Start2_T.data;
    var NHS2_Bitmap_T_2 = oHor_Start2_T_2.data;
    var NHS2_Bitmap_T_3 = oHor_Start2_T_3.data;
    var NH_Bitmap_T     = oHor_T.data;
    var NH2_Bitmap_T    = oHor2_T.data;
    var NH2_Bitmap_T_2  = oHor2_T_2.data;
    var NH2_Bitmap_T_3  = oHor2_T_3.data;
    var NHE_Bitmap_T    = oHor_End_T.data;
    var NV_Bitmap_T     = oVer_T.data;
    var NV2_Bitmap_T    = oVer2_T.data;
    var NV2_Bitmap_T_2  = oVer2_T_2.data;
    var NV2_Bitmap_T_3  = oVer2_T_3.data;
    var NV3_Bitmap_T    = oVer3_T.data;

    var nChannel = true === this.private_GetSettings_DarkBoard() ? 200 : 28;

    var Color = new CColor(nChannel, nChannel, nChannel, 255);

    var nSize_12 = this.m_nTile_12;
    var nSize_11 = this.m_nTile_11;

    for ( var i = 0; i < this.m_nTile_24; i++ )
    {
        for ( var j = 0; j < this.m_nTile_24; j++ )
        {
            var Index = (i * this.m_nTile_24 + j) * 4;

            // NHS
            if ( j >= nSize_12 && ( nSize_11 === i || nSize_12 === i ) )
            {
                NHS_Bitmap[Index + 0] = Color.r;
                NHS_Bitmap[Index + 1] = Color.b;
                NHS_Bitmap[Index + 2] = Color.g;
                NHS_Bitmap[Index + 3] = 255;

                NHS_Bitmap_T[Index + 0] = Color.r;
                NHS_Bitmap_T[Index + 1] = Color.b;
                NHS_Bitmap_T[Index + 2] = Color.g;
                NHS_Bitmap_T[Index + 3] = nTransAlpha;
            }
            else
            {
                NHS_Bitmap[Index + 3] = 0;
                NHS_Bitmap_T[Index + 3] = 0;
            }

            // NHS2
            if ( ( j >= nSize_11 && ( nSize_11 === i || nSize_12 === i ) ) || ( i >= nSize_12 && ( nSize_11 === j || nSize_12 === j ) ) )
            {
                NHS2_Bitmap[Index + 0] = Color.r;
                NHS2_Bitmap[Index + 1] = Color.b;
                NHS2_Bitmap[Index + 2] = Color.g;
                NHS2_Bitmap[Index + 3] = 255;

                NHS2_Bitmap_T_3[Index + 0] = Color.r;
                NHS2_Bitmap_T_3[Index + 1] = Color.b;
                NHS2_Bitmap_T_3[Index + 2] = Color.g;
                NHS2_Bitmap_T_3[Index + 3] = nTransAlpha;
            }
            else
            {
                NHS2_Bitmap[Index + 3] = 0;
                NHS2_Bitmap_T_3[Index + 3] = 0;
            }

            if ( j >= nSize_11 && ( nSize_11 === i || nSize_12 === i ) )
            {
                NHS2_Bitmap_T[Index + 0] = Color.r;
                NHS2_Bitmap_T[Index + 1] = Color.b;
                NHS2_Bitmap_T[Index + 2] = Color.g;
                NHS2_Bitmap_T[Index + 3] = 255;
            }
            else if ( i >= nSize_12 && ( nSize_11 === j || nSize_12 === j ) )
            {
                NHS2_Bitmap_T[Index + 0] = Color.r;
                NHS2_Bitmap_T[Index + 1] = Color.b;
                NHS2_Bitmap_T[Index + 2] = Color.g;
                NHS2_Bitmap_T[Index + 3] = nTransAlpha;
            }
            else
                NHS2_Bitmap_T[Index + 3] = 0;


            if ( i >= nSize_12 && ( nSize_11 === j || nSize_12 === j ) )
            {
                NHS2_Bitmap_T_2[Index + 0] = Color.r;
                NHS2_Bitmap_T_2[Index + 1] = Color.b;
                NHS2_Bitmap_T_2[Index + 2] = Color.g;
                NHS2_Bitmap_T_2[Index + 3] = 255;
            }
            else if ( j >= nSize_11 && ( nSize_11 === i || nSize_12 === i ) )
            {
                NHS2_Bitmap_T_2[Index + 0] = Color.r;
                NHS2_Bitmap_T_2[Index + 1] = Color.b;
                NHS2_Bitmap_T_2[Index + 2] = Color.g;
                NHS2_Bitmap_T_2[Index + 3] = nTransAlpha;
            }
            else
                NHS2_Bitmap_T_2[Index + 3] = 0;

            // NH
            if ( nSize_11 === i || nSize_12 === i )
            {
                NH_Bitmap[Index + 0] = Color.r;
                NH_Bitmap[Index + 1] = Color.b;
                NH_Bitmap[Index + 2] = Color.g;
                NH_Bitmap[Index + 3] = 255;

                NH_Bitmap_T[Index + 0] = Color.r;
                NH_Bitmap_T[Index + 1] = Color.b;
                NH_Bitmap_T[Index + 2] = Color.g;
                NH_Bitmap_T[Index + 3] = nTransAlpha;
            }
            else
            {
                NH_Bitmap[Index + 3] = 0;
                NH_Bitmap_T[Index + 3] = 0;
            }

            // NH2
            if ( ( nSize_11 === i || nSize_12 === i ) || ( i >= nSize_12 && ( nSize_11 === j || nSize_12 === j ) ) )
            {
                NH2_Bitmap[Index + 0] = Color.r;
                NH2_Bitmap[Index + 1] = Color.b;
                NH2_Bitmap[Index + 2] = Color.g;
                NH2_Bitmap[Index + 3] = 255;

                NH2_Bitmap_T_3[Index + 0] = Color.r;
                NH2_Bitmap_T_3[Index + 1] = Color.b;
                NH2_Bitmap_T_3[Index + 2] = Color.g;
                NH2_Bitmap_T_3[Index + 3] = nTransAlpha;
            }
            else
            {
                NH2_Bitmap[Index + 3] = 0;
                NH2_Bitmap_T_3[Index + 3] = 0;
            }

            if ( nSize_11 === i || nSize_12 === i )
            {
                NH2_Bitmap_T[Index + 0] = Color.r;
                NH2_Bitmap_T[Index + 1] = Color.b;
                NH2_Bitmap_T[Index + 2] = Color.g;
                NH2_Bitmap_T[Index + 3] = 255;
            }
            else if ( i >= nSize_12 && ( nSize_11 === j || nSize_12 === j ) )
            {
                NH2_Bitmap_T[Index + 0] = Color.r;
                NH2_Bitmap_T[Index + 1] = Color.b;
                NH2_Bitmap_T[Index + 2] = Color.g;
                NH2_Bitmap_T[Index + 3] = nTransAlpha;
            }
            else
                NH2_Bitmap_T[Index + 3] = 0;

            if ( ( ( nSize_11 === i || nSize_12 === i ) && j <= nSize_12 ) || ( i >= nSize_12 && ( nSize_11 === j || nSize_12 === j ) ) )
            {
                NH2_Bitmap_T_2[Index + 0] = Color.r;
                NH2_Bitmap_T_2[Index + 1] = Color.b;
                NH2_Bitmap_T_2[Index + 2] = Color.g;
                NH2_Bitmap_T_2[Index + 3] = 255;
            }
            else if ( ( nSize_11 === i || nSize_12 === i ) && j > nSize_12 )
            {
                NH2_Bitmap_T_2[Index + 0] = Color.r;
                NH2_Bitmap_T_2[Index + 1] = Color.b;
                NH2_Bitmap_T_2[Index + 2] = Color.g;
                NH2_Bitmap_T_2[Index + 3] = nTransAlpha;
            }
            else
            {
                NH2_Bitmap[Index + 3] = 0;
                NH2_Bitmap_T_3[Index + 3] = 0;
            }

            // NHE
            if ( j <= nSize_11 && ( nSize_11 === i || nSize_12 === i ) )
            {
                NHE_Bitmap[Index + 0] = Color.r;
                NHE_Bitmap[Index + 1] = Color.b;
                NHE_Bitmap[Index + 2] = Color.g;
                NHE_Bitmap[Index + 3] = 255;

                NHE_Bitmap_T[Index + 0] = Color.r;
                NHE_Bitmap_T[Index + 1] = Color.b;
                NHE_Bitmap_T[Index + 2] = Color.g;
                NHE_Bitmap_T[Index + 3] = nTransAlpha;
            }
            else
            {
                NHE_Bitmap[Index + 3] = 0;
                NHE_Bitmap_T[Index + 3] = 0;
            }

            // NV
            if ( nSize_11 === j || nSize_12 === j )
            {
                NV_Bitmap[Index + 0] = Color.r;
                NV_Bitmap[Index + 1] = Color.b;
                NV_Bitmap[Index + 2] = Color.g;
                NV_Bitmap[Index + 3] = 255;

                NV_Bitmap_T[Index + 0] = Color.r;
                NV_Bitmap_T[Index + 1] = Color.b;
                NV_Bitmap_T[Index + 2] = Color.g;
                NV_Bitmap_T[Index + 3] = nTransAlpha;
            }
            else
            {
                NV_Bitmap[Index + 3] = 0;
                NV_Bitmap_T[Index + 3] = 0;
            }

            // NV2
            if ( ( nSize_11 === j || nSize_12 === j ) || ( j >= nSize_12 && ( nSize_11 === i || nSize_12 === i ) ) )
            {
                NV2_Bitmap[Index + 0] = Color.r;
                NV2_Bitmap[Index + 1] = Color.b;
                NV2_Bitmap[Index + 2] = Color.g;
                NV2_Bitmap[Index + 3] = 255;

                NV2_Bitmap_T_3[Index + 0] = Color.r;
                NV2_Bitmap_T_3[Index + 1] = Color.b;
                NV2_Bitmap_T_3[Index + 2] = Color.g;
                NV2_Bitmap_T_3[Index + 3] = nTransAlpha;
            }
            else
            {
                NV2_Bitmap[Index + 3] = 0;
                NV2_Bitmap_T_3[Index + 3] = 0;
            }

            if ( ( ( nSize_11 === j || nSize_12 === j ) && i <= nSize_12 ) || ( j >= nSize_12 && ( nSize_11 === i || nSize_12 === i ) ) )
            {
                NV2_Bitmap_T[Index + 0] = Color.r;
                NV2_Bitmap_T[Index + 1] = Color.b;
                NV2_Bitmap_T[Index + 2] = Color.g;
                NV2_Bitmap_T[Index + 3] = 255;
            }
            else if ( ( nSize_11 === j || nSize_12 === j ) && i > nSize_12 )
            {
                NV2_Bitmap_T[Index + 0] = Color.r;
                NV2_Bitmap_T[Index + 1] = Color.b;
                NV2_Bitmap_T[Index + 2] = Color.g;
                NV2_Bitmap_T[Index + 3] = nTransAlpha;
            }
            else
                NV2_Bitmap_T[Index + 3] = 0;

            if ( nSize_11 === j || nSize_12 === j )
            {
                NV2_Bitmap_T_2[Index + 0] = Color.r;
                NV2_Bitmap_T_2[Index + 1] = Color.b;
                NV2_Bitmap_T_2[Index + 2] = Color.g;
                NV2_Bitmap_T_2[Index + 3] = 255;
            }
            else if ( j > nSize_12 && ( nSize_11 === i || nSize_12 === i ) )
            {
                NV2_Bitmap_T_2[Index + 0] = Color.r;
                NV2_Bitmap_T_2[Index + 1] = Color.b;
                NV2_Bitmap_T_2[Index + 2] = Color.g;
                NV2_Bitmap_T_2[Index + 3] = nTransAlpha;
            }
            else
                NV2_Bitmap_T_2[Index + 3] = 0;

            // NV3
            if ( ( i <= nSize_11 && ( nSize_11 === j || nSize_12 === j ) ) || ( j >= nSize_11 && ( nSize_11 === i || nSize_12 === i ) ) )
            {
                NV3_Bitmap[Index + 0] = Color.r;
                NV3_Bitmap[Index + 1] = Color.b;
                NV3_Bitmap[Index + 2] = Color.g;
                NV3_Bitmap[Index + 3] = 255;

                NV3_Bitmap_T[Index + 0] = Color.r;
                NV3_Bitmap_T[Index + 1] = Color.b;
                NV3_Bitmap_T[Index + 2] = Color.g;
                NV3_Bitmap_T[Index + 3] = nTransAlpha;
            }
            else
            {
                NV3_Bitmap[Index + 3] = 0;
                NV3_Bitmap_T[Index + 3] = 0;
            }
        }
    }


	this.m_oImageData.Hor_Start      = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor_Start);
	this.m_oImageData.Hor_Start2     = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor_Start2);
	this.m_oImageData.Hor            = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor);
	this.m_oImageData.Hor2           = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor2);
	this.m_oImageData.Hor_End        = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor_End);
	this.m_oImageData.Ver            = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oVer);
	this.m_oImageData.Ver2           = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oVer2);
	this.m_oImageData.Ver3           = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oVer3);
	this.m_oImageData.Hor_Start_T    = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor_Start_T);
	this.m_oImageData.Hor_Start2_T   = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor_Start2_T);
	this.m_oImageData.Hor_Start2_T_2 = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor_Start2_T_2);
	this.m_oImageData.Hor_Start2_T_3 = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor_Start2_T_3);
	this.m_oImageData.Hor_T          = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor_T);
	this.m_oImageData.Hor2_T         = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor2_T);
	this.m_oImageData.Hor2_T_2       = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor2_T_2);
	this.m_oImageData.Hor2_T_3       = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor2_T_3);
	this.m_oImageData.Hor_End_T      = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oHor_End_T);
	this.m_oImageData.Ver_T          = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oVer_T);
	this.m_oImageData.Ver2_T         = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oVer2_T);
	this.m_oImageData.Ver2_T_2       = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oVer2_T_2);
	this.m_oImageData.Ver2_T_3       = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oVer2_T_3);
	this.m_oImageData.Ver3_T         = this.private_CreateCanvas(this.m_nTile_24, this.m_nTile_24, oVer3_T);

	this.m_oImageData.Triangle    = this.private_DrawTriangle(this.m_nTile_20, this.m_nTile_20, this.m_nTile_20 * 0.07, Color, 1, null);
    this.m_oImageData.Triangle_T  = this.private_DrawTriangle(this.m_nTile_20, this.m_nTile_20, this.m_nTile_20 * 0.07, new CColor(nChannel, nChannel, nChannel, nTransAlpha), 1, null);
    this.m_oImageData.Triangle_B  = this.private_DrawTriangle(this.m_nTile_20, this.m_nTile_20, this.m_nTile_20 * 0.06, new CColor(255, 255, 255, 255), 1, this.m_oImageData.Black);
    this.m_oImageData.Triangle_W  = this.private_DrawTriangle(this.m_nTile_20, this.m_nTile_20, this.m_nTile_20 * 0.06, new CColor(0, 0, 0, 255), 1, this.m_oImageData.White);
    this.m_oImageData.Triangle_BT = this.private_DrawTriangle(this.m_nTile_20, this.m_nTile_20, this.m_nTile_20 * 0.06, new CColor(255, 255, 255, nTransAlpha), 1, this.m_oImageData.BlackT);
    this.m_oImageData.Triangle_WT = this.private_DrawTriangle(this.m_nTile_20, this.m_nTile_20, this.m_nTile_20 * 0.06, new CColor(0, 0, 0, nTransAlpha), 1, this.m_oImageData.WhiteT);
};
CDrawingNavigator.prototype.private_CreateTarget = function()
{
    var Size = this.m_nTile_24;
    var Canvas = this.HtmlElement.Selection.Control.HtmlElement.getContext("2d");

    var oTarget      = Canvas.createImageData(Size, Size);
    var oCurrent     = Canvas.createImageData(Size, Size);
    var oGameCurrent = Canvas.createImageData(Size, Size);

    var TargetBitmap      = oTarget.data;
    var CurrentBitmap     = oCurrent.data;
    var GameCurrentBitmap = oGameCurrent.data;

    for (var Y = 0; Y < Size; Y++)
    {
        for (var X = 0; X < Size; X++)
        {
            var Index = (X + Y * Size) * 4;

            TargetBitmap[Index + 3] = 255;
            CurrentBitmap[Index + 3] = 255;
            GameCurrentBitmap[Index  + 3] = 255;
            if ((0 === X && Size - 1 === Y) || (Size - 1 === X && 0 === Y))
            {
                TargetBitmap[Index + 0] = 135;
                TargetBitmap[Index + 1] = 125;
                TargetBitmap[Index + 2] = 135;

                CurrentBitmap[Index + 0] = 216;
                CurrentBitmap[Index + 1] = 0;
                CurrentBitmap[Index + 2] = 0;

                GameCurrentBitmap[Index  + 0] = (0x2a * (216 / 255.0)) | 0;
                GameCurrentBitmap[Index  + 1] = (0x75 * (216 / 255.0)) | 0;
                GameCurrentBitmap[Index  + 2] = (0xf3 * (216 / 255.0)) | 0;
            }
            else if (Size - 1 === X || Size - 1 === Y)
            {
                TargetBitmap[Index + 0] = 89;
                TargetBitmap[Index + 1] = 89;
                TargetBitmap[Index + 2] = 89;

                CurrentBitmap[Index + 0] = 178;
                CurrentBitmap[Index + 1] = 0;
                CurrentBitmap[Index + 2] = 0;

                GameCurrentBitmap[Index  + 0] = (0x2a * (178 / 255.0)) | 0;
                GameCurrentBitmap[Index  + 1] = (0x75 * (178 / 255.0)) | 0;
                GameCurrentBitmap[Index  + 2] = (0xf3 * (178 / 255.0)) | 0;
            }
            else if (0 === Y || 0 === X)
            {
                TargetBitmap[Index + 0] = 182;
                TargetBitmap[Index + 1] = 182;
                TargetBitmap[Index + 2] = 182;

                CurrentBitmap[Index + 0] = 255;
                CurrentBitmap[Index + 1] = 0;
                CurrentBitmap[Index + 2] = 0;

                GameCurrentBitmap[Index  + 0] = 0x2a;
                GameCurrentBitmap[Index  + 1] = 0x75;
                GameCurrentBitmap[Index  + 2] = 0xf3;
            }
            else
            {
                TargetBitmap[Index + 0] = 128;
                TargetBitmap[Index + 1] = 128;
                TargetBitmap[Index + 2] = 128;

                CurrentBitmap[Index + 0] = 255;
                CurrentBitmap[Index + 1] = 0;
                CurrentBitmap[Index + 2] = 0;

                GameCurrentBitmap[Index  + 0] = 0x2a;
                GameCurrentBitmap[Index  + 1] = 0x75;
                GameCurrentBitmap[Index  + 2] = 0xf3;
            }
        }
    }

	this.m_oImageData.Target      = this.private_CreateCanvas(Size, Size, oTarget);
	this.m_oImageData.Current     = this.private_CreateCanvas(Size, Size, oCurrent);
	this.m_oImageData.GameCurrent = this.private_CreateCanvas(Size, Size, oGameCurrent);

    Canvas.drawImage(this.m_oImageData.Target, 0, 0);
    Canvas.drawImage(this.m_oImageData.Current, 0, 30);
    Canvas.drawImage(this.m_oImageData.GameCurrent, 0, 60)
};
CDrawingNavigator.prototype.private_DrawTriangle = function(W, H, PenWidth, Color, Alpha, oStoneCanvas)
{
    if (undefined === Alpha)
        Alpha = 1;

    var oCanvasElement = document.createElement("canvas");
	var Canvas = oCanvasElement.getContext("2d");

    Canvas.clearRect(0, 0, W, H);

    if (null !== oStoneCanvas)
        Canvas.drawImage(oStoneCanvas, 0, 0);

    Canvas.globalAlpha = Alpha;
    Canvas.strokeStyle = Color.ToString();
    Canvas.fillStyle   = Color.ToString();
    Canvas.lineWidth   = PenWidth;

    var r     = W / 2;
    var _y    = H * 3 / 4;
    var shift = W * 0.1;

    var _x1 =  Math.sqrt(r * r - (_y - r) * (_y - r)) + r;
    var _x2 = -Math.sqrt(r * r - (_y - r) * (_y - r)) + r;

    var x1 = _x1 - shift;
    var x2 = _x2 + shift;
    var y1 = shift;
    var y2 = _y;

    if (null !== oStoneCanvas)
    {
        x1 = Math.floor(x1 - 0.5);
        x2 = Math.ceil(x2 + 0.5);
        y1 = Math.ceil(y1 + 0.5);
        y2 = Math.floor(y2 - 0.5);
    }


    Canvas.beginPath();
    Canvas.moveTo(W / 2, y1);
    Canvas.lineTo(x1, y2);
    Canvas.lineTo(x2, y2);
    Canvas.closePath();
    Canvas.stroke();

	return oCanvasElement;
};
CDrawingNavigator.prototype.private_CreateShadows = function()
{
    var ShadowCanvas = this.HtmlElement.Shadows.Control.HtmlElement.getContext("2d");
    var d = this.m_nTile_20;
    var oShadowImageData = ShadowCanvas.createImageData(d, d);
    var Shadow = oShadowImageData.data;
    this.m_oImageData.ShadowOff = Math.max(parseInt(d * 0.15), 3);

    var r = (d - 5) / 2 + 1;
    for (var i = 0; i < d; i++)
    {
        for (var j = 0; j < d; j++)
        {
            var y = Math.abs(i - r);
            var x = Math.abs(j - r);
            var dist = Math.sqrt(x * x + y * y) / r;

            var f = ( dist < 1.0 ? 0.15 + 0.75 * ( 1 - dist ) : 0 );

            var Index = (d * i + j) * 4;
            Shadow[Index + 0] = 0;
            Shadow[Index + 1] = 0;
            Shadow[Index + 2] = 0;
            Shadow[Index + 3] = parseInt( 255 * f );
        }
    }

    this.m_oImageData.Shadow = this.private_CreateCanvas(d, d, oShadowImageData);
};
CDrawingNavigator.prototype.private_DrawMap = function()
{
    this.m_bNeedRedrawMap = true;
    this.Update_Current(false);
};
CDrawingNavigator.prototype.private_UpdateMousePos = function(X, Y)
{
    var oPos = Common_FindPosition(this.HtmlElement.Board.Control.HtmlElement);
    var _X = ((X - oPos.X - this.m_nTile_10 - this.m_oOffset.X) / this.m_nTile_24) | 0;
    var _Y = ((Y - oPos.Y - this.m_nTile_10 - this.m_oOffset.Y) / this.m_nTile_24) | 0;
    return {X : _X, Y : _Y};
};
CDrawingNavigator.prototype.private_UpdateTarget = function(X, Y)
{
    var W = this.m_oImageData.W;
    var H = this.m_oImageData.H;

    if (W <= 0 || H <= 0)
        return;

    var Canvas = this.HtmlElement.Selection.Control.HtmlElement.getContext("2d");
    Canvas.clearRect(0, 0, W, H);
    if (X >= 0 && Y >= 0)
    {
        var RealX = this.m_nTile_10 + this.m_oOffset.X + X * this.m_nTile_24;
        var RealY = this.m_nTile_10 + this.m_oOffset.Y + Y * this.m_nTile_24;

        var Value = this.m_oMap.Get(X, Y);
        if (Value.Is_Node())
            Canvas.drawImage(this.m_oImageData.Target, RealX, RealY);
    }
};
CDrawingNavigator.prototype.private_UpdateScrollsPos = function()
{
    var XOffset   = -this.m_oOffset.X;
    var LogicXMax =  this.m_oMap.Get_Width() + 1;
    var ScrollW   =  this.HtmlElement.ScrollW;
    var NavW      =  this.m_oImageData.W;

    var X = XOffset / (this.m_nTile_20 + LogicXMax * this.m_nTile_24 - NavW) * (NavW - 4 - ScrollW) + 2;

    var YOffset   = -this.m_oOffset.Y;
    var LogicYMax =  this.m_oMap.Get_Height() + 1;
    var ScrollH   =  this.HtmlElement.ScrollH;
    var NavH      =  this.m_oImageData.H;

    var Y = YOffset / (this.m_nTile_20 + LogicYMax * this.m_nTile_24 - NavH) * (NavH - 4 - ScrollH) + 2;

    this.HtmlElement.HorScroll.style.left = X + "px";
    this.HtmlElement.VerScroll.style.top  = Y + "px";
};
CDrawingNavigator.prototype.private_DrawMapOnTimer = function()
{
    var W = this.m_oImageData.W;
    var H = this.m_oImageData.H;

    if (0 === W || 0 === H)
        return;

    if (this.m_oLastDrawMap.W === W && this.m_oLastDrawMap.H === H && Math.abs(this.m_oOffset.X - this.m_oLastDrawMap.X) < 1 && Math.abs(this.m_oOffset.Y - this.m_oLastDrawMap.Y) < 1)
    {
        this.m_bNeedRedrawMap = false;
        return;
    }

    this.m_oLastDrawMap.W = W;
    this.m_oLastDrawMap.H = H;
    this.m_oLastDrawMap.X = this.m_oOffset.X;
    this.m_oLastDrawMap.Y = this.m_oOffset.Y;

    var Lines     = this.HtmlElement.Lines.Control.HtmlElement.getContext("2d");
    var Shadows   = this.HtmlElement.Shadows.Control.HtmlElement.getContext("2d");
    var Nodes     = this.HtmlElement.Nodes.Control.HtmlElement.getContext("2d");
    var Selection = this.HtmlElement.Selection.Control.HtmlElement.getContext("2d");
    Nodes.clearRect(0, 0, W, H);
    Shadows.clearRect(0, 0, W, H);
    Lines.clearRect(0, 0, W, H);
    Selection.clearRect(0, 0, W, H);

    var x = this.m_nTile_10 + this.m_oOffset.X;
    var y = this.m_nTile_10 + this.m_oOffset.Y;

    var Height = this.m_oMap.Get_Height();

    var bShadows = this.private_GetSettings_Shadows();

    for (var Y = 0; Y <= Height - 1 ; Y++)
    {
        var _y = y + this.m_nTile_24 * Y;

        // Отрисовываем только те строки, которые попадают в поле видимости
        if (_y >= -this.m_nTile_24 && _y <= H + this.m_nTile_24)
        {
            var Width = this.m_oMap.Get_LineWidth(Y);
            for (var X = 0; X <= Width; X++)
            {
                var _x = x + this.m_nTile_24 * X;

                // Отрисовываем только те столбцы, которые попадают в поле видимости
                if (_x  >= -this.m_nTile_24 && _x <= W + this.m_nTile_24)
                {
                    var Value = this.m_oMap.Get(X, Y);
                    if (false === Value.Is_Node())
                    {
                        var nType   = Value.Get_Type();
                        var oResult = Value.Is_OnCurrentVariant();

						Lines.clearRect(_x, _y, this.m_nTile_24, this.m_nTile_24);
                        switch(nType)
                        {
                            case ENavigatorElementType.Empty:
                            {
                                break;
                            }
                            case ENavigatorElementType.Line_Ver:
                            {
                                if (!oResult.bResult)
                                    Lines.drawImage(this.m_oImageData.Ver_T, _x, _y);
                                else
                                    Lines.drawImage(this.m_oImageData.Ver, _x, _y);

                                break;
                            }
                            case ENavigatorElementType.Line_Ver_Con:
                            {
                                if (oResult.bResult)
                                {
                                    if (1 === oResult.Temp)
                                        Lines.drawImage(this.m_oImageData.Ver2_T, _x, _y);
                                    else
                                        Lines.drawImage(this.m_oImageData.Ver2_T_2, _x, _y);
                                }
                                else
                                    Lines.drawImage(this.m_oImageData.Ver2_T_3, _x, _y);

                                break;
                            }
                            case ENavigatorElementType.Line_Ver_End:
                            {
                                if ( !oResult.bResult )
                                    Lines.drawImage(this.m_oImageData.Ver3_T, _x, _y);
                                else
                                    Lines.drawImage(this.m_oImageData.Ver3, _x, _y);
                            }
                        }
                    }
                    else
                    {
                        var bCurVariant = Value.Is_OnCurrentVariant();

                        // Value - нода
                        var oMove     = Value.Get_Move();
                        var nMoveType = oMove.Get_Type();
                        var sComment  = Value.Get_Comment();

                        var sText = "";
                        var nTextShift = 0;
                        switch (g_oGlobalSettings.Get_NavigatorLabel())
                        {
                            case ESettingsNavigatorLabels.Empty:
                            {
                                sText = "";
                                break;
                            }
                            case ESettingsNavigatorLabels.MoveNumbers:
                            {
                                sText = "" +  Value.Get_NavigatorInfo().Num;

                                if (sText.length <= 2)
                                {
                                    Nodes.font = "bold " + Common.ConvertToRetinaValue(10) + "px sans-serif";
                                }
                                else
                                {
                                    Nodes.font = "bold " + Common.ConvertToRetinaValue(9) + "px sans-serif";
                                    nTextShift = -1;
                                }

                                break;
                            }
                            case ESettingsNavigatorLabels.MoveNumbersCurrentVariant:
                            {
                                if (bCurVariant)
                                    sText = "" +  Value.Get_NavigatorInfo().Num;
                                else
                                    sText = "";

                                if (sText.length <= 2)
                                {
                                    Nodes.font = "bold " + Common.ConvertToRetinaValue(10) + "px sans-serif";
                                }
                                else
                                {
                                    Nodes.font = "bold " + Common.ConvertToRetinaValue(9) + "px sans-serif";
                                    nTextShift = -1;
                                }

                                break;
                            }
                            case ESettingsNavigatorLabels.MoveCoordinates:
                            {
                                var oSize = this.m_oGameTree.Get_Board().Get_Size();
                                sText = Common_PosValueToString(oMove.Get_Value(), oSize.X, oSize.Y);

                                if (sText.length <= 2)
                                    Nodes.font = "bold " + Common.ConvertToRetinaValue(10) + "px sans-serif";
                                else
                                    Nodes.font = "bold " + Common.ConvertToRetinaValue(8) + "px sans-serif";

                                break;
                            }
                        }
                        
                        var nTextW = Nodes.measureText(sText).width;

                        if (BOARD_BLACK === nMoveType)
                        {
                            if (bCurVariant && true === bShadows)
							{
								Shadows.clearRect(_x + this.m_oImageData.ShadowOff, _y + this.m_oImageData.ShadowOff, this.m_nTile_24, this.m_nTile_24);
								Shadows.drawImage(this.m_oImageData.Shadow, _x + this.m_nTile_2 + this.m_oImageData.ShadowOff, _y + this.m_nTile_2 + this.m_oImageData.ShadowOff);
							}

                            Nodes.clearRect(_x, _y, this.m_nTile_24, this.m_nTile_24);
                            Nodes.drawImage((bCurVariant ?  this.m_oImageData.Black : this.m_oImageData.BlackT) , _x + this.m_nTile_2, _y + this.m_nTile_2);

                            if ("" === sComment)
                            {
                                if ("" !== sText)
                                {
                                    Nodes.fillStyle = ( bCurVariant ?  "#CCC" : "rgb(192, 192, 192)" );
                                    Nodes.fillText(sText, _x + this.m_nTile_12 - nTextW / 2 + Common.ConvertToRetinaValue(nTextShift), _y + this.m_nTile_24 / 2 + this.m_nTile_3);
                                }
                            }
                            else
                            {
                                Nodes.drawImage((bCurVariant ?  this.m_oImageData.Triangle_B : this.m_oImageData.Triangle_BT) , _x + this.m_nTile_2, _y + this.m_nTile_2);
                            }
                        }
                        else if (BOARD_WHITE === nMoveType)
                        {
                            if (bCurVariant && true === bShadows)
							{
								Shadows.clearRect(_x + this.m_oImageData.ShadowOff, _y + this.m_oImageData.ShadowOff, this.m_nTile_24, this.m_nTile_24);
								Shadows.drawImage(this.m_oImageData.Shadow, _x + this.m_nTile_2 + this.m_oImageData.ShadowOff, _y + this.m_nTile_2 + this.m_oImageData.ShadowOff);
							}

							Nodes.clearRect(_x, _y, this.m_nTile_24, this.m_nTile_24);
                            Nodes.drawImage((bCurVariant ? this.m_oImageData.White : this.m_oImageData.WhiteT), _x + this.m_nTile_2, _y + this.m_nTile_2);

                            if ("" === sComment)
                            {
                                if ("" !== sText)
                                {
                                    Nodes.fillStyle = ( bCurVariant ?  "#000" : "rgb(56, 56, 56)" );
                                    Nodes.fillText(sText, _x + this.m_nTile_12 - nTextW / 2 + Common.ConvertToRetinaValue(nTextShift), _y + this.m_nTile_24 / 2 + this.m_nTile_3);
                                }
                            }
                            else
                            {
                                Nodes.drawImage((bCurVariant ?  this.m_oImageData.Triangle_W : this.m_oImageData.Triangle_WT) , _x + this.m_nTile_2, _y + this.m_nTile_2);
                            }
                        }
                        else // if (BOARD_EMPTY === nMoveType)
                        {
							Nodes.clearRect(_x, _y, this.m_nTile_24, this.m_nTile_24);
                            Nodes.drawImage((bCurVariant ? this.m_oImageData.Triangle : this.m_oImageData.Triangle_T),  _x + this.m_nTile_2, _y + this.m_nTile_2);
                        }

                        var NextsCount = Value.Get_NextsCount();
                        var NextCur = Value.Get_NextCur();

                        Lines.clearRect(_x, _y, this.m_nTile_24, this.m_nTile_24);
                        if (0 === X)
                        {
                            if (0 === NextsCount)
                            {}
                            else if (1 === NextsCount)
                            {
                                if (bCurVariant)
                                    Lines.drawImage(this.m_oImageData.Hor_Start, _x, _y);
                                else
                                    Lines.drawImage(this.m_oImageData.Hor_Start_T, _x, _y);
                            }
                            else
                            {
                                if (bCurVariant)
                                {
                                    if (0 == NextCur)
                                        Lines.drawImage(this.m_oImageData.Hor_Start2_T, _x, _y);
                                    else
                                        Lines.drawImage(this.m_oImageData.Hor_Start2_T_2, _x, _y);
                                }
                                else
                                    Lines.drawImage(this.m_oImageData.Hor_Start2_T_3, _x, _y);
                            }
                        }
                        else
                        {
                            if (0 === NextsCount)
                            {
                                if (bCurVariant)
                                    Lines.drawImage(this.m_oImageData.Hor_End, _x, _y);
                                else
                                    Lines.drawImage(this.m_oImageData.Hor_End_T, _x, _y);
                            }
                            else if (1 === NextsCount)
                            {
                                if (bCurVariant)
                                    Lines.drawImage(this.m_oImageData.Hor, _x, _y);
                                else
                                    Lines.drawImage(this.m_oImageData.Hor_T, _x, _y);
                            }
                            else
                            {
                                if (bCurVariant)
                                {
                                    if (0 === NextCur)
                                        Lines.drawImage(this.m_oImageData.Hor2_T, _x, _y);
                                    else
                                        Lines.drawImage(this.m_oImageData.Hor2_T_2, _x, _y);
                                }
                                else
                                    Lines.drawImage(this.m_oImageData.Hor2_T_3, _x, _y);
                            }
                        }

                        // TODO: Это можно заменить дополнительно созданными картинками с вырезынными частями.
                        if (BOARD_BLACK === nMoveType || BOARD_WHITE === nMoveType)
                            Lines.clearRect(_x + this.m_nTile_3, _y + this.m_nTile_3, this.m_nTile_18, this.m_nTile_18);
                    }
                }
            }
        }
    }

    this.m_bNeedRedrawMap = false;
};
CDrawingNavigator.prototype.private_DrawCurrentOnTimer = function()
{
    if (!this.m_oGameTree)
        return;

    var W = this.m_oImageData.W;
    var H = this.m_oImageData.H;

    if (W <= 0 || H <= 0)
        return;

    var oCurNodePos = this.m_oGameTree.Get_CurNode().Get_NavigatorInfo();
    var X = oCurNodePos.X, Y = oCurNodePos.Y;

    var RealX = this.m_nTile_10 + this.m_oOffset.X + X * this.m_nTile_24;
    var RealY = this.m_nTile_10 + this.m_oOffset.Y + Y * this.m_nTile_24;

    var Canvas = this.HtmlElement.Current.Control.HtmlElement.getContext("2d");
    Canvas.clearRect(0, 0, W, H);

    if (RealX  >= -this.m_nTile_24 && RealX <= W + this.m_nTile_24 && RealY >= -this.m_nTile_24 && RealY <= H + this.m_nTile_24)
    {
        Canvas.drawImage(this.m_oImageData.Current, RealX, RealY);
    }

    this.private_DrawGameCurrentOnTimer();

    this.m_bNeedRedrawCurrent = false;
};
CDrawingNavigator.prototype.private_DrawGameCurrentOnTimer = function()
{
    if (!this.m_oGameTree)
        return;

    var W = this.m_oImageData.W;
    var H = this.m_oImageData.H;

    if (W <= 0 || H <= 0)
        return;

    this.m_bNeedRedrawGameCurrent = false;

    var oCurNode     = this.m_oGameTree.Get_CurNode();
    var oGameCurNode = this.m_oGameTree.Get_GameCurNode();
    if (null === oGameCurNode || oGameCurNode === oCurNode)
        return;


    var oCurNodePos = oGameCurNode.Get_NavigatorInfo();
    var X = oCurNodePos.X, Y = oCurNodePos.Y;

    var RealX = this.m_nTile_10 + this.m_oOffset.X + X * this.m_nTile_24;
    var RealY = this.m_nTile_10 + this.m_oOffset.Y + Y * this.m_nTile_24;

    var Canvas = this.HtmlElement.Current.Control.HtmlElement.getContext("2d");
    //Canvas.clearRect(0, 0, W, H);

    if (RealX  >= -this.m_nTile_24 && RealX <= W + this.m_nTile_24 && RealY >= -this.m_nTile_24 && RealY <= H + this.m_nTile_24)
    {
        Canvas.drawImage(this.m_oImageData.GameCurrent, RealX, RealY);
    }
};
CDrawingNavigator.prototype.private_GetSettings_TrueColorBoard = function()
{
    return this.m_oGameTree.Get_LocalSettings().Is_NavigatorTrueColorBoard();
};
CDrawingNavigator.prototype.private_GetSettings_TrueColorStones = function()
{
    return this.m_oGameTree.Get_LocalSettings().Is_NavigatorTrueColorStones();
};
CDrawingNavigator.prototype.private_GetSettings_Shadows = function()
{
    return this.m_oGameTree.Get_LocalSettings().Is_NavigatorShadows();
};
CDrawingNavigator.prototype.private_GetSettings_WhiteColor = function()
{
    return this.m_oGameTree.Get_LocalSettings().Get_NavigatorWhiteColor();
};
CDrawingNavigator.prototype.private_GetSettings_BlackColor = function()
{
    return this.m_oGameTree.Get_LocalSettings().Get_NavigatorBlackColor();
};
CDrawingNavigator.prototype.private_GetSettings_BoardColor = function()
{
    return this.m_oGameTree.Get_LocalSettings().Get_NavigatorBoardColor();
};
CDrawingNavigator.prototype.private_GetSettings_LinesColor = function()
{
    return this.m_oGameTree.Get_LocalSettings().Get_NavigatorLinesColor();
};
CDrawingNavigator.prototype.private_GetSettings_DarkBoard = function()
{
    return this.m_oGameTree.Get_LocalSettings().Is_NavigatorDarkBoard();
};
CDrawingNavigator.prototype.private_CreateCanvas = function(nWidth, nHeight, oImageData)
{
	var oCanvas    = document.createElement("canvas");
	oCanvas.width  = nWidth;
	oCanvas.height = nHeight;
	oCanvas.getContext("2d").putImageData(oImageData, 0, 0);
	return oCanvas;
};