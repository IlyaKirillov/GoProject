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
    this.m_oCanvas       = null;
    this.m_eType         = EBoardTargetType.Unknown;
    this.m_nSize         = -1;
    this.m_nX            = 0;
    this.m_nY            = 0;

    this.m_oImageData  = oImageData; // Ссылка на CDrawingBoard.m_oImageData
    this.m_oTargetData = null;
}
CBoardTarget.prototype.Init = function(sCanvasId)
{
    this.m_oHtmlElement = document.getElementById(sCanvasId);
    this.m_oHtmlElement.style.position = "absolute";
    this.m_oHtmlElement.style.left     = "0px";
    this.m_oHtmlElement.style.top      = "0px";
    this.m_oCanvas = document.createElement("canvas");    
    this.m_oHtmlElement.appendChild(this.m_oCanvas);

    this.Hide();
};
CBoardTarget.prototype.Get_LogicPos = function()
{
    return {X : this.m_nLogicX, Y : this.m_nLogicY};
};
CBoardTarget.prototype.Update_Size = function(W, H)
{    
    this.m_oHtmlElement.style.width  = W + "px";
    this.m_oHtmlElement.style.height = H + "px";

    this.m_oCanvas.style.width  = W + "px";
    this.m_oCanvas.style.height = H + "px";
    this.m_oCanvas.width        = Common.ConvertToRetinaValue(W);
    this.m_oCanvas.height       = Common.ConvertToRetinaValue(H);

    this.m_eType = EBoardTargetType.Unknown;
};
CBoardTarget.prototype.SetTargetSize = function(nSize)
{
    this.m_nSize = nSize;
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
    var oCanvas = this.m_oCanvas.getContext("2d");
    oCanvas.clearRect(this.m_nX, this.m_nY, this.m_nSize, this.m_nSize);
    
    if (this.m_oTargetData)
        oCanvas.drawImage(this.m_oTargetData, X, Y);

    this.m_nX = X;
    this.m_nY = Y;
};
CBoardTarget.prototype.Set_Type = function(eType)
{
    if (eType != this.m_eType)
    {
        this.m_eType = eType;
        if (EBoardTargetType.Unknown ===  eType)
            return;    

        switch (eType)
        {
        case EBoardTargetType.BlackStone:
            this.m_oTargetData = this.m_oImageData.BlackTarget;
            break;
        case EBoardTargetType.WhiteStone:
            this.m_oTargetData = this.m_oImageData.WhiteTarget;
            break;
        case EBoardTargetType.BlackX:
            this.m_oTargetData = this.m_oImageData.X_Black;
            break;
        case EBoardTargetType.WhiteX:
            this.m_oTargetData = this.m_oImageData.X_White;
            break;
        case EBoardTargetType.ColorR:
            this.m_oTargetData = this.m_oImageData.RcolorTarget;
            break;
        case EBoardTargetType.ColorG:
            this.m_oTargetData = this.m_oImageData.GcolorTarget;
            break;
        case EBoardTargetType.ColorB:
            this.m_oTargetData = this.m_oImageData.BcolorTarget;
            break;
        case EBoardTargetType.ColorA:
            this.m_oTargetData = this.m_oImageData.AcolorTarget;
            break;
        }

        this.Set_Pos(this.m_nX, this.m_nY);
    }
};
CBoardTarget.prototype.Check_XY = function(X, Y)
{
    if (X == this.m_nLogicX && Y == this.m_nLogicY)
        return true;

    return false;
};