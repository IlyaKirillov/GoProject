/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     18.11.14
 * Time     0:48
 */

function CNode(oGameTree)
{
    this.m_nId        = oGameTree.Get_NewNodeId();   // Id ноды
    this.m_aNext      = [];                          // Массив следующих нод
    this.m_nNextCur   = -1;                          // Номер текущей следующей ноды
    this.m_oPrev      = null;                        // Родительская нода
    this.m_aCommands  = [];                          // Массив команд данной ноды
    this.m_oMove      = new CMove( 0, move_N );      // Основной ход данной ноды (если он есть)
    this.m_sComment   = "";                          // Комментарий
    this.m_oTerritory = new CTerritory( false, {} ); // Метки территории (если в данной ноде есть подсчет очков)
    this.m_oNavInfo   = { X : -1, Y : -1 };          // Позиция данной ноды в навигаторе

    oGameTree.Add_Node(this);
}

CNode.prototype.Get_Id = function()
{
    return this.m_nId;
};
CNode.prototype.Get_Next = function(Index)
{
    return (undefined !== this.m_aNex[Index] ? this.m_aNext[Index] : this.m_aNext[this.m_nNextCur]);
};
CNode.prototype.Get_NextCur = function()
{
    return this.m_nNextCur;
};
CNode.prototype.Set_NextCur = function(Index)
{
    // Если длина массива this.m_aNext будет 0, тогда this.m_nNextCur будет -1
    var _Index = (Index >= this.m_aNext.length ? this.m_aNext.length - 1 : Index);
    this.m_nNextCur = _Index;
};
CNode.prototype.Get_NextsCount = function()
{
    return this.m_aNext.length;
};
CNode.prototype.Add_Next = function(Node, bSetCur)
{
    this.m_aNext.Add(Node);

    if (true === bSetCur)
        this.m_nNextCur = this.m_aNext.length - 1;
};
CNode.prototype.Remove_Next = function(Index)
{
    this.m_aNext.splice(Index, 1);

    if (this.m_nNextCur >= Index)
        this.m_nNextCur--;

    if (-1 === this.m_nNextCur && this.m_aNext.length > 0)
        this.m_nNextCur = 0;
};
CNode.prototype.Get_Prev = function()
{
    return this.m_oPrev;
};
CNode.prototype.Set_Prev = function(Node)
{
    this.m_oPrev = Node;
};
CNode.prototype.Add_Command = function(Command)
{
    this.m_aCommands.Add(Command);
};
CNode.prototype.Get_Command = function(Index)
{
    return this.m_aCommands[Index];
};
CNode.prototype.Get_CommandsCount = function()
{
    return this.m_aCommands.length;
};
CNode.prototype.Set_Move = function(Move)
{
    this.m_oMove = Move;
};
CNode.prototype.Get_Move = function()
{
    return this.m_oMove;
};
CNode.prototype.Have_Move = function()
{
    if (BOARD_EMPTY === this.m_oMove.Get_Type())
        return false;

    return true;
};
CNode.prototype.Add_Comment = function(sComment)
{
    this.m_sComment += sComment;
};
CNode.prototype.Set_Comment = function(sComment)
{
    this.m_sComment = sComment;
};
CNode.prototype.Get_Comment = function()
{
    return this.m_sComment;
};
CNode.prototype.Is_TerritoryUse = function()
{
    return this.m_oTerritory.Is_Use();
};
CNode.prototype.Set_TerritoryUse = function(Use)
{
    this.m_oTerritory.Set_Use(Use);
};
CNode.prototype.Add_TerritoryPoint = function(Pos, Value)
{
    this.m_oTerritory.Add_Point(Pos, Value);
};
CNode.prototype.Clear_TerritoryPoints = function()
{
    this.m_oTerritory.Clear_Points();
};
CNode.prototype.Fill_Territory = function(LogicBoard)
{
    this.m_oTerritory.Fill_Points(LogicBoard);
};
CNode.prototype.Get_MainVariantLen = function()
{
    var Count = 1; // сама нода всегда входит в основной вариант
    var NextNode = this;
    while (NextNode.Get_Nexts_Count() > 0)
    {
        Count++;
        NextNode = NextNode.Get_Next(0);
    }

    return Count;
};
CNode.prototype.Get_LastNodeInMainVariant = function()
{
    // Смещаемся к последней ноде в основном варианте
    var CurNode = this;
    while (CurNode.Get_Nexts_Count() > 0)
        CurNode = CurNode.Get_Next(0);

    return CurNode;
};
CNode.prototype.Is_First = function()
{
    return (null === this.m_oPrev ? true : false);
};
CNode.prototype.Make_ThisNodeCurrent = function()
{
    var CurrNode = this.Get_Prev();
    var NextNode = this;
    while (null != CurrentNode)
    {
        var bFind = false;
        for (var Index = 0, NextsCount = CurrNode.Get_Nexts_Count(); Index < NextsCount; Index++)
        {
            if (NextNode === CurrNode.Get_Next(Index))
            {
                CurrNode.Set_NextCur(Index);
                bFind = true;
                break;
            }
        }

        if (!bFlag)
            return false;

        NextNode = CurrNode;
        CurrNode = CurrNode.Get_Prev();
    }

    return true;
};
CNode.prototype.Is_OnMainVariant = function()
{
    var CurrNode = this;
    var PrevNode = null;
    while (null !== (PrevNode = CurrNode.Get_Prev()))
    {
        if (0 != PrevNode.Get_NextCur())
            return false;

        CurrNode = PrevNode;
    }

    return true;
};
CNode.prototype.Is_OnCurrentVariant = function()
{
    var CurrNode = this;
    var PrevNode = null;
    while (null != (PrevNode = CurrNode.Get_Prev()))
    {
        if (PrevNode.Get_Next(PrevNode.Get_NextCur()) != CurrNode)
            return false;

        CurrNode = ParentNode;
    }

    return true;
};
CNode.prototype.Set_NavigatorInfo = function(X,Y)
{
    this.m_oNavInfo.X = X;
    this.m_oNavInfo.Y = Y;
};
CNode.prototype.Get_NavigatorInfo = function()
{
    return this.m_oNavInfo;
};
