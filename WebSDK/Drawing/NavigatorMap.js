"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     30.11.14
 * Time     17:43
 */

var ENavigatorElementType =
{
    Empty        : -10,
    Line_Ver     : -9,
    Line_Ver_Con : -8,
    Line_Ver_End : -7
};

function CNavigatorElement(Type, Prev, Next)
{
    this.m_nType = Type;
    this.m_oPrev = Prev;
    this.m_oNext = Next;
}
CNavigatorElement.prototype.Is_Node = function()
{
    return false;
};
CNavigatorElement.prototype.Get_Type = function()
{
    return this.m_nType;
};
CNavigatorElement.prototype.Get_Next = function()
{
    return this.m_oNext;
};
CNavigatorElement.prototype.Get_Prev = function()
{
    return this.m_oPrev;
};
CNavigatorElement.prototype.Is_OnCurrentVariant = function()
{
    if (ENavigatorElementType.Empty === this.m_nType)
        return {bResult : false};
    else if (ENavigatorElementType.Line_Ver === this.m_nType)
    {
        if (this.m_oPrev.Is_OnCurrentVariant() && this.m_oPrev.Get_NextsCount() > 0 && this.m_oPrev.Get_Next().Get_NavigatorInfo().Y >= this.m_oNext.Get_NavigatorInfo().Y)
            return {bResult : true};
        else
            return {bResult : false};
    }
    else if (ENavigatorElementType.Line_Ver_Con === this.m_nType)
    {
        if (!this.m_oPrev.Is_OnCurrentVariant())
            return {bResult : false};

        var _Y0 = this.m_oNext.Get_NavigatorInfo().Y;
        var _Y1 = this.m_oPrev.Get_Next().Get_NavigatorInfo().Y;

        if (_Y0 < _Y1)
            return {bResult : true, Temp : 0};
        else if (_Y0 === _Y1)
            return {bResult : true, Temp : 1};
        else
            return {bResult : false};
    }
    else if (ENavigatorElementType.Line_Ver_End  === this.m_nType)
        return {bResult : this.m_oNext.Is_OnCurrentVariant()}

    return {bResult : false};
};

function CNavigatorMap()
{
    this.m_oMap      = [];
    this.m_oGameTree = null;
    this.m_nMove     = 0;
};
CNavigatorMap.prototype.Set_GameTree = function(oGameTree)
{
    this.m_oGameTree = oGameTree;
};
CNavigatorMap.prototype.Clear = function()
{
    this.m_oMap  = [];
    this.m_nMove = 0;
};
CNavigatorMap.prototype.Create_FromGameTree = function()
{
    if (this.m_oGameTree)
    {
        this.Clear();
        this.Create_FromCurNode(this.m_oGameTree.Get_FirstNode(), 0, 0);
    }
};
CNavigatorMap.prototype.Create_FromCurNode = function(Node, X, Y)
{
    var Len = Node.Get_MainVariantLen();

    // Ищем строку, на которой целиком умещается основной вариант данной ноды.
    while (!(this.private_CheckNodeMainVariant(X, Y, Len)))
        Y++;

    // Заполняем найденую строку основным вариантом ноды.
    this.private_FillNodeMainVariant(Node, X, Y);

    // Переходим к последней ноде основного варианта.
    var CurNode = Node.Get_LastNodeInMainVariant();
    X += Len - 1;

    var ResultY = {VY : Y};

    while (true)
    {
        var OldY = Y;
        var StartMoveNumber = this.m_nMove;
        var NextsCount = CurNode.Get_NextsCount();
        for (var Index = 1; Index < NextsCount; Index++)
        {
            this.m_nMove = StartMoveNumber;

            var OldY2 = Y;
            var ResY = this.Create_FromCurNode(CurNode.Get_Next(Index), X + 1, Y + 1);
            Y = ResY.Y;
            for (var TempY = OldY2 + 1; TempY <= Y; TempY++)
            {
                if (TempY === ResY.VY)
                {
                    if (NextsCount - 1 === Index)
                    {
                        this.Set(X, TempY, new CNavigatorElement(ENavigatorElementType.Line_Ver_End, CurNode, CurNode.Get_Next(Index)));
                        break;
                    }
                    else
                        this.Set(X, TempY, new CNavigatorElement(ENavigatorElementType.Line_Ver_Con, CurNode, CurNode.Get_Next(Index)));
                }
                else if (TempY < ResY.VY)
                    this.Set(X, TempY, new CNavigatorElement(ENavigatorElementType.Line_Ver, CurNode, CurNode.Get_Next(Index)));
                else
                    this.Set(X, TempY, new CNavigatorElement(ENavigatorElementType.Line_Ver, CurNode, CurNode.Get_Next(Index + 1)));
            }
        }

        this.m_nMove = StartMoveNumber;

        if (CurNode === Node)
            break;

        if (CurNode.Have_Move())
            this.m_nMove--;

        CurNode = CurNode.Get_Prev();
        X--;
        Y = OldY;
    }

    ResultY.Y = Y;
    return ResultY;
};
CNavigatorMap.prototype.Get = function(X, Y)
{
    if (undefined === this.m_oMap[Y] || undefined === this.m_oMap[Y][X])
        return new CNavigatorElement(ENavigatorElementType.Empty, null, null);

    return this.m_oMap[Y][X];
};
CNavigatorMap.prototype.Set = function(X, Y, Value)
{
    if (undefined === this.m_oMap[Y])
        this.m_oMap[Y] = [];

    if (Value.Is_Node())
    {
        if (Value.Have_Move())
        {
            this.m_nMove++;
            Value.Set_NavigatorInfo(X, Y, this.m_nMove);
        }
        else
            Value.Set_NavigatorInfo(X, Y, -1);
    }

    this.m_oMap[Y][X] = Value;
};
CNavigatorMap.prototype.Is_Empty = function(X, Y)
{
    if (undefined === this.m_oMap[Y] || undefined === this.m_oMap[Y][X] || ENavigatorElementType.Empty === this.m_oMap[Y][X].Get_Type())
        return true;

    return false;
};
CNavigatorMap.prototype.private_CheckNodeMainVariant = function(X, Y, Len)
{
    for (var Index = 0; Index < Len; Index++)
    {
        if (false === this.Is_Empty(X + Index, Y))
            return false;
    }

    return true;
};
CNavigatorMap.prototype.private_FillNodeMainVariant = function(Node, X, Y)
{
    var CurNode = Node;
    this.Set(X, Y, Node);

    while (CurNode.Get_NextsCount() > 0)
    {
        X++;
        CurNode = CurNode.Get_Next(0);
        this.Set(X, Y, CurNode);
    }
};
CNavigatorMap.prototype.Get_Height = function()
{
    return this.m_oMap.length;
};
CNavigatorMap.prototype.Get_Width = function()
{
    var X = 0;
    var Height = this.Get_Height();
    for (var Y = 0; Y < Height; Y++)
    {
        var CurX = this.Get_LineWidth(Y);
        if (CurX > X)
            X = CurX;
    }

    return X;
};
CNavigatorMap.prototype.Get_LineWidth = function(Y)
{
    return this.m_oMap[Y].length - 1;
};
