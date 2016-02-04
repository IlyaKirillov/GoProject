"use strict";

/**
 * Copyright 2015 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     19.12.2015
 * Time     1:30
 */

var EBoardTargetType =
{
    Unknown    : -1,
    BlackStone : 0,
    WhiteStone : 1,
    BlackX     : 2,
    WhiteX     : 3,
    ColorR     : 4,
    ColorG     : 5,
    ColorB     : 6,
    ColorA     : 7
};

function CBoardTarget(oImageData, oDrawingBoard)
{
    this.m_oDrawingBoard = oDrawingBoard;
    this.m_nLogicX       = -1;
    this.m_nLogicY       = -1;
    this.m_oHtmlElement  = null;
    this.m_eType         = EBoardTargetType.Unknown;
    this.m_nSize         = -1;

    this.m_oImageData = oImageData; // Ссылка на CDrawingBoard.m_oImageData
}
CBoardTarget.prototype.Init = function(sCanvasId)
{
    this.m_oHtmlElement = document.getElementById(sCanvasId);
    this.m_oHtmlElement.style.position = "absolute";
    this.Hide();
};
CBoardTarget.prototype.Get_LogicPos = function()
{
    return {X : this.m_nLogicX, Y : this.m_nLogicY};
};
CBoardTarget.prototype.Update_Size = function(nSize)
{
    this.m_oHtmlElement.width  = nSize;
    this.m_oHtmlElement.height = nSize;
    this.m_oHtmlElement.style.width  = nSize + "px";
    this.m_oHtmlElement.style.height = nSize + "px";
    this.m_nSize = nSize;
    this.m_eType = EBoardTargetType.Unknown;
};
CBoardTarget.prototype.Hide = function()
{
    this.m_oHtmlElement.style.display = "none";
    this.m_nLogicX = -1;
    this.m_nLogicY = -1;
};
CBoardTarget.prototype.Show = function()
{
    var oGameTree = this.m_oDrawingBoard.Get_GameTree();
    if (oGameTree && true === oGameTree.Get_LocalSettings().Is_ShowTarget())
        this.m_oHtmlElement.style.display = "block";
};
CBoardTarget.prototype.Check_LogicPos = function(X, Y, bForce)
{
    if (X == this.m_nLogicX && Y == this.m_nLogicY && true != bForce)
        return true;

    this.m_nLogicX = X;
    this.m_nLogicY = Y;
    this.Show();
    return false;
};
CBoardTarget.prototype.Set_Pos = function(X, Y)
{
    this.m_oHtmlElement.style.left = X + "px";
    this.m_oHtmlElement.style.top  = Y + "px";
};
CBoardTarget.prototype.Set_Type = function(eType)
{
    if (eType != this.m_eType)
    {
        this.m_eType = eType;
        if (EBoardTargetType.Unknown ===  eType)
            return;

        var Canvas = document.createElement("canvas");
        Canvas.width  = this.m_nSize;
        Canvas.height = this.m_nSize;
        var TargetCanvas = Canvas.getContext("2d");

        switch (eType)
        {
        case EBoardTargetType.BlackStone:
            TargetCanvas.putImageData(this.m_oImageData.BlackTarget, 0, 0);
            break;
        case EBoardTargetType.WhiteStone:
            TargetCanvas.putImageData(this.m_oImageData.WhiteTarget, 0, 0);
            break;
        case EBoardTargetType.BlackX:
            TargetCanvas.putImageData(this.m_oImageData.X_Black, 0, 0);
            break;
        case EBoardTargetType.WhiteX:
            TargetCanvas.putImageData(this.m_oImageData.X_White, 0, 0);
            break;
        case EBoardTargetType.ColorR:
            TargetCanvas.putImageData(this.m_oImageData.RcolorTarget, 0, 0);
            break;
        case EBoardTargetType.ColorG:
            TargetCanvas.putImageData(this.m_oImageData.GcolorTarget, 0, 0);
            break;
        case EBoardTargetType.ColorB:
            TargetCanvas.putImageData(this.m_oImageData.BcolorTarget, 0, 0);
            break;
        case EBoardTargetType.ColorA:
            TargetCanvas.putImageData(this.m_oImageData.AcolorTarget, 0, 0);
            break;
        }

        var sImgSrc = Canvas.toDataURL("image/png");
        this.m_oHtmlElement.style.backgroundImage = "url('" + sImgSrc + "')";
    }
};
CBoardTarget.prototype.Check_XY = function(X, Y)
{
    if (X == this.m_nLogicX && Y == this.m_nLogicY)
        return true;

    return false;
};