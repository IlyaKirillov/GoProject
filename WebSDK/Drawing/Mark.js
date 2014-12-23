/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     22.11.14
 * Time     15:34
 */

var EDrawingMark =
{
    Lm :  -1, // Метка последнего хода
    Tr :   0, // Треугольник
    Sq :   1, // Прямоугольник
    Cr :   2, // Окружность
    Tx :   3, // Текстовая отметка
    X  :   4, // X
    Tb :   5, // Территория черных
    Tw :   6, // Территория белых
    Tb2:   7, // Территория черных
    Tw2:   8  // Территория белых
};

function CDrawingMark(X, Y, Type, Text)
{
    this.m_oPos  = {X : undefined === X ? 0 : X, Y : undefined == Y ? 0 : Y}; // Позиция на доске
    this.m_nType = undefined === Type ? EDrawingMark.Tr : Type;               // Типа
    this.m_sText = undefined === Text ? "" : Text;                            // Текст
}

CDrawingMark.prototype.Get_Pos = function()
{
    return this.m_oPos;
};
CDrawingMark.prototype.Get_X = function()
{
    return this.m_oPos.X;
}
CDrawingMark.prototype.Get_Y = function()
{
    return this.m_oPos.Y;
};
CDrawingMark.prototype.Set_Pos = function(X, Y)
{
    this.m_oPos.X = X;
    this.m_oPos.Y = Y;
};
CDrawingMark.prototype.Get_Type = function()
{
    return this.m_nType;
};
CDrawingMark.prototype.Set_Type = function(Type)
{
    this.m_nType = Type;
};
CDrawingMark.prototype.Get_Text = function()
{
    return this.m_sText;
};
CDrawingMark.prototype.Set_Text = function(Text)
{
    this.m_sText = Text;
};