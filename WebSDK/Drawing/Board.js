"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     18.11.14
 * Time     22:59
 */

function CDrawingBoard()
{
    this.m_oGameTree   = null;
    this.m_oLogicBoard = null;

    this.m_bRulers  = false;

    this.m_dKoeffOffsetY = 0;
    this.m_dKoeffOffsetX = 0;
    this.m_dKoeffCellW   = 0;
    this.m_dKoeffCellH   = 0;
    this.m_dKoeffDiam    = 0;

    this.m_oCreateWoodyId = null; // Id таймера по которому рисуется красивая доска.

    this.m_oImageData =
    {
        W           : 0,
        H           : 0,
        StoneDiam   : 0,
        ShadowOff   : 0,
        Lines       : null,
        Board       : null,
        BlackStone  : null,
        WhiteStones : new Array(),
        WhiteStones2: new Array(361),
        BlackTarget : null,
        WhiteTarget : null
    };

    this.m_oSimpleBoardPr =
    {
        BoardColor        : new CColor( 0xE8, 0xC4, 0x73, 255 ),
        WhiteStoneColor   : new CColor( 0xFF, 0xFF, 0xFF, 255 ),
        BlackStoneColor   : new CColor( 0x00, 0x00, 0x00, 255 ),
        StoneContourColor : new CColor(  141,  141,  141, 255 ),
        HandiPointsColor  : new CColor(  112,   95,   54, 255 ),
        LineColor         : new CColor(  112,   95,   54, 255 )
    };

    this.HtmlElement =
    {
        Contol : null,

        Board    : {Control : null}, // Канва для отрисовки текстурной доски.
        Lines    : {Control : null}, // Канва для отрисовки линий.
        Stones   : {Control : null}, // Канва для отрисовки камней.
        Shadow   : {Control : null}, // Канва для теней от камней.
        Variants : {Control : null}, // Канва для отрисовки вариантов.
        Marks    : {Control : null}, // Канва для отрисовки отметок
        Target   : {Control : null}, // Канва для отрисовки курсора в виде камня.
        Event    : {Control : null}  // Div для обработки сообщений мыши и клавиатуры.
    };

    var oThis = this;

    this.private_OnMouseMove = function(e)
    {
        //check_MouseMoveEvent(e);
        //var oPos = oThis.private_UpdateMousePos(global_mouseEvent.X, global_mouseEvent.Y);
    };
    this.private_OnMouseOut = function(e)
    {
        //check_MouseMoveEvent(e);
    };
    this.private_OnMouseDown = function(e)
    {
        //check_MouseDownEvent(e, true);
        //var oPos = oThis.private_UpdateMousePos(global_mouseEvent.X, global_mouseEvent.Y);
    };
}

CDrawingBoard.prototype.Init = function(sName, GameTree)
{
    this.m_oGameTree   = GameTree;
    this.m_oLogicBoard = GameTree.Get_Board();

    this.HtmlElement.Control = CreateControlContainer(sName);
    var oElement = this.HtmlElement.Control.HtmlElement;

    var sBoardName    = sName + "_BoardCanvas";
    var sLinesName    = sName + "_LinesCanvas";
    var sShadowsName  = sName + "_ShadowsCanvas";
    var sStonesName   = sName + "_StonesCanvas";
    var sVariantsName = sName + "_VariantsCanvas";
    var sMarksName    = sName + "_MarksCanvas";
    var sTargetName   = sName + "_TargetCanvas";
    var sEventName    = sName + "_EventDiv";

    // Сначала заполняем Div нужными нам элементами
    this.private_CreateCanvasElement(oElement, sBoardName);
    this.private_CreateCanvasElement(oElement, sLinesName);
    this.private_CreateCanvasElement(oElement, sShadowsName);
    this.private_CreateCanvasElement(oElement, sStonesName);
    this.private_CreateCanvasElement(oElement, sVariantsName);
    this.private_CreateCanvasElement(oElement, sMarksName);
    this.private_CreateCanvasElement(oElement, sTargetName);
    var oEventDiv = this.private_CreateDivElement(oElement, sEventName);

    // Теперь выставляем настройки для созданных элементов. Для CDrawingBoard все внутренние элементы будут
    // растягиваться по ширине Div, в которой они лежат.
    var oControl = this.HtmlElement.Control;
    this.private_FillHtmlElement(this.HtmlElement.Board,    oControl, sBoardName);
    this.private_FillHtmlElement(this.HtmlElement.Lines,    oControl, sLinesName);
    this.private_FillHtmlElement(this.HtmlElement.Shadow,   oControl, sShadowsName);
    this.private_FillHtmlElement(this.HtmlElement.Stones,   oControl, sStonesName);
    this.private_FillHtmlElement(this.HtmlElement.Variants, oControl, sVariantsName);
    this.private_FillHtmlElement(this.HtmlElement.Marks,    oControl, sMarksName);
    this.private_FillHtmlElement(this.HtmlElement.Target,   oControl, sTargetName);
    this.private_FillHtmlElement(this.HtmlElement.Event,    oControl, sEventName);

    oEventDiv.onmousemove  = this.private_OnMouseMove;
    oEventDiv.onmouseout   = this.private_OnMouseOut;
    oEventDiv.onmousedown  = this.private_OnMouseDown;

    return oControl;
};
CDrawingBoard.prototype.Update_Size = function(W, H)
{
    this.HtmlElement.Control.Resize(W, H);

    this.private_UpdateKoeffs();
    this.private_OnResize();
};
CDrawingBoard.prototype.private_CreateCanvasElement = function(oParentElement, sName)
{
    var oElement = document.createElement("canvas");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingBoard.prototype.private_CreateDivElement = function(oParentElement, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingBoard.prototype.private_FillHtmlElement = function(oElement, oParentControl, sName)
{
    oElement.Control = CreateControlContainer(sName);
    var oControl = oElement.Control;
    oControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1,-1);
    oControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    oParentControl.AddControl(oControl);
};
CDrawingBoard.prototype.private_UpdateMousePos = function(X, Y)
{
    var oPos = Common_FindPosition(this.HtmlElement.Board.Control.HtmlElement);
    return { X: X - oPos.X, Y : Y - oPos.Y };
};
CDrawingBoard.prototype.private_UpdateKoeffs = function()
{
    var oSize = this.m_oLogicBoard.Get_Size();
    var nW = oSize.X, nH = oSize.Y;
    if (true === this.m_bRulers)
    {
        var dAbsCellW   = g_dBoard_W / (2 * g_dHorOff_2_Cell_W + nW);
        var dAbdOffsetX = (g_dBoard_W - (nW) * dAbsCellW) / 2;

        var dAbsCellH   = g_dBoard_H / (2 * g_dVerOff_2_Cell_H + nH);
        var dAbsOffsetY = (g_dBoard_H - (nH) * dAbsCellH) / 2;

        this.m_dKoeffOffsetY = (dAbsOffsetY + dAbsCellH / 2) / g_dBoard_H;
        this.m_dKoeffOffsetX = (dAbdOffsetX + dAbsCellW / 2) / g_dBoard_W;
        this.m_dKoeffCellW   = dAbsCellW / g_dBoard_W;
        this.m_dKoeffCellH   = dAbsCellH / g_dBoard_H;
        this.m_dKoeffDiam    = 4 / g_dBoard_W;
    }
    else
    {
        var dAbsCellW   = g_dBoard_W / (2 * g_dHorOff_2_Cell_W + nW - 1);
        var dAbdOffsetX = (g_dBoard_W - (nW - 1) * dAbsCellW) / 2;

        var dAbsCellH   = g_dBoard_H / (2 * g_dVerOff_2_Cell_H + nH - 1);
        var dAbsOffsetY = (g_dBoard_H - (nH - 1) * dAbsCellH) / 2;

        this.m_dKoeffOffsetY = dAbsOffsetY / g_dBoard_H;
        this.m_dKoeffOffsetX = dAbdOffsetX / g_dBoard_W;
        this.m_dKoeffCellW   = dAbsCellW / g_dBoard_W;
        this.m_dKoeffCellH   = dAbsCellH / g_dBoard_H;
        this.m_dKoeffDiam    = 4 / g_dBoard_W;
    }

};
CDrawingBoard.prototype.private_OnResize = function()
{
    var W = this.HtmlElement.Board.Control.HtmlElement.width;
    var H = this.HtmlElement.Board.Control.HtmlElement.height;

    if (W != this.m_oImageData.W || H != this.m_oImageData.H || null === this.m_oImageData.Board || null !== this.m_oCreateWoodyId)
    {
        // Перестартовываем таймер, т.к. изменились размеры
        if (null !== this.m_oCreateWoodyId)
            clearTimeout(this.m_oCreateWoodyId);

        // Стартуем таймер с отрисовкой красивой доски
        //this.m_oCreateWoodyId = setTimeout( function(){ this.Create_WoodyBoard(); }, 200 );

        // Пока рисуем простой вариант
        this.private_DrawSimpleBoard(W, H);
    }
    else
    {
        // TODO: Релизовать данный вариант
        this.private_DrawSimpleBoard(W, H);
    }
};
CDrawingBoard.prototype.private_DrawSimpleBoard = function(W, H)
{
    if (0 === W || 0 === H)
        return;

    // Доска
    var Board = this.HtmlElement.Board.Control.HtmlElement.getContext("2d");
    Board.fillStyle = this.m_oSimpleBoardPr.BoardColor.ToString();
    Board.fillRect(0, 0, W, H);

    // Разлиновка
    var LinesCanvas = this.HtmlElement.Lines.Control.HtmlElement.getContext("2d");

    var dOffX  = this.m_dKoeffOffsetX * W;
    var dOffY  = this.m_dKoeffOffsetY * H;
    var dCellW = this.m_dKoeffCellW * W;
    var dCellH = this.m_dKoeffCellH * H;

    var oSize = this.m_oLogicBoard.Get_Size();

    LinesCanvas.clearRect(0, 0, W, H);
    LinesCanvas.strokeStyle = this.m_oSimpleBoardPr.LineColor.ToString();

    var X0 = dOffX, X1 = W - dOffX;
    for (var nY = 0; nY < oSize.Y; nY++)
    {
        var VerY = dOffY + nY * dCellH;
        LinesCanvas.beginPath();
        LinesCanvas.moveTo(X0, VerY);
        LinesCanvas.lineTo(X1, VerY);
        LinesCanvas.stroke();
    }

    var Y0 = dOffY, Y1 = H - dOffY;
    for (var nX = 0; nX < oSize.X; nX++)
    {
        var HorX = dOffX + nX * dCellW;
        LinesCanvas.beginPath();
        LinesCanvas.moveTo(HorX, Y0);
        LinesCanvas.lineTo(HorX, Y1);
        LinesCanvas.stroke();
    }

    // Форовые точки
    if (oSize.X === oSize.Y && (9 === oSize.X || 13 === oSize.X || 19 === oSize.X))
    {
        LinesCanvas.fillStyle = this.m_oSimpleBoardPr.HandiPointsColor.ToString();

        // Радиус делаем минимум 2 пикселя, чтобы форовая отметка всегда выделялась на
        // фоне сетки доски.
        var dRad = Math.max(2, this.m_dKoeffDiam * W / 2);
        var aPoints = [];
        switch (oSize.X)
        {
            case 9:  aPoints = [[2, 2], [2, 6], [4, 4], [6, 2], [6, 6]]; break;
            case 13: aPoints = [[3, 3], [3, 6], [3, 9], [6, 3], [6, 6], [6, 9], [9, 3], [9, 6], [9, 9]]; break;
            case 19: aPoints = [[3, 3], [3, 9], [3, 15], [9, 3], [9, 9], [9, 15], [15, 3], [15, 9], [15, 15]]; break;
        }

        for (var nPointIndex = 0, Count = aPoints.length; nPointIndex < Count; nPointIndex++)
        {
            var dX = dOffX + aPoints[nPointIndex][0] * dCellW;
            var dY = dOffY + aPoints[nPointIndex][1] * dCellW;

            LinesCanvas.beginPath();
            LinesCanvas.arc(dX, dY, dRad, 0, 2 * Math.PI, false);
            LinesCanvas.fill();
        }
    }

    // Рисуем все камни
    var StonesCanvas = this.HtmlElement.Stones.Control.HtmlElement.getContext("2d");
    StonesCanvas.clearRect(0, 0, W, H);
    StonesCanvas.strokeStyle = this.m_oSimpleBoardPr.StoneContourColor.ToString();
    StonesCanvas.lineWidth   = 1;

    var ColorB = this.m_oSimpleBoardPr.BlackStoneColor.ToString();
    var ColorW = this.m_oSimpleBoardPr.WhiteStoneColor.ToString();

    for (var nY = 1; nY <= oSize.Y; nY++)
    {
        for (var nX = 1; nX <= oSize.X; nX++)
        {
            var Value = this.m_oLogicBoard.Get(nX, nY);

            if (BOARD_BLACK === Value )
                StonesCanvas.fillStyle = ColorB;
            else if (BOARD_WHITE === Value )
                StonesCanvas.fillStyle = ColorW;
            else
                continue;

            var dX = dOffX + (nX - 1) * dCellW;
            var dY = dOffY + (nY - 1) * dCellH;

            StonesCanvas.beginPath();
            StonesCanvas.arc(dX, dY, dCellW / 2, 0, Math.PI * 2, false);
            StonesCanvas.fill();
            StonesCanvas.stroke();
        }
    }

    // Очищаем другие канвы
    this.HtmlElement.Shadow.Control.HtmlElement.getContext("2d").clearRect(0, 0, W, H);
    this.HtmlElement.Variants.Control.HtmlElement.getContext("2d").clearRect(0, 0, W, H);
    this.HtmlElement.Marks.Control.HtmlElement.getContext("2d").clearRect(0, 0, W, H);
    this.HtmlElement.Target.Control.HtmlElement.getContext("2d").clearRect(0, 0, W, H);
};