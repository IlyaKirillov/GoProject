/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     18.11.14
 * Time     0:48
 */

function CNodeIdCounter()
{
    this.m_nCounter = 0;
}

CNodeIdCounter.prototype.Get_NextId = function()
{
    return ((++this.m_nCounter) + "");
};
CNodeIdCounter.prototype.Reset = function()
{
    this.m_nCounter = 0;
};

var g_oIdCounter = new CNodeIdCounter();

function CNode(oGameTree)
{
    this.m_sId        = g_oIdCounter.Get_NextId();
    this.m_oGameTree  = oGameTree;
    this.m_oHandler   = oGameTree ? oGameTree.Get_Handler() : null;
    this.m_aNext      = [];                        // Массив следующих нод
    this.m_nNextCur   = -1;                        // Номер текущей следующей ноды
    this.m_oPrev      = null;                      // Родительская нода
    this.m_aCommands  = [];                        // Массив команд данной ноды
    this.m_oMove      = new CMove(0, BOARD_EMPTY); // Основной ход данной ноды (если он есть)
    this.m_sComment   = "";                        // Комментарий
    this.m_oTerritory = new CTerritory(false, {}); // Метки территории (если в данной ноде есть подсчет очков)
    this.m_oNavInfo   = {X : -1, Y : -1, Num : -1};// Позиция данной ноды в навигаторе и номер данного хода
    this.m_bLoaded    = false;                     // Была ли данная нода в исходном загруженном файле.
    this.m_oColorMap  = {};                        // Карта цветов
}
CNode.prototype.Get_Id = function()
{
    return this.m_sId;
};
CNode.prototype.Is_FromFile = function()
{
    return this.m_bLoaded;
};
CNode.prototype.Get_NodeById = function(sId)
{
    if (sId === this.m_sId)
        return this;

    for (var nIndex = 0, nNextsCount = this.Get_NextsCount(); nIndex < nNextsCount; nIndex++)
    {
        var oNode = this.m_aNext[nIndex].Get_NodeById(sId);
        if (null !== oNode)
            return oNode;
    }

    return null;
};
CNode.prototype.Get_NodeByMoveNumber = function(nMoveNumber)
{
    if (0 === nMoveNumber)
        return this;

    var nCurMoveNumber = 0;
    var oCurNode = this;
    while (nCurMoveNumber !== nMoveNumber)
    {
        if (oCurNode.Get_NextsCount() <= 0)
            break;

        oCurNode = oCurNode.Get_Next(oCurNode.Get_NextCur());
        if (!oCurNode)
            break;

        if (oCurNode.Have_Move())
            nCurMoveNumber++;
    }

    return oCurNode;
};
CNode.prototype.Copy_CurrentVariant = function(LastNode)
{
    var oNode = new CNode();

    // TODO: Сделать нормальное копирование
    oNode.m_aCommands = this.m_aCommands;

    if (this.m_aNext.length > 0 && this !== LastNode)
    {
        oNode.m_aNext[0] = this.m_aNext[this.m_nNextCur].Copy_CurrentVariant(LastNode);
        oNode.m_nNextCur = 0;
        oNode.m_aNext[0].m_oPrev = oNode;
    }

    return oNode;
};
CNode.prototype.Is_Node = function()
{
    return true;
};
CNode.prototype.Clear = function()
{
    this.m_aNext      = [];
    this.m_nNextCur   = - 1;
    this.m_aCommands  = [];
    this.m_oMove      = new CMove(0, BOARD_EMPTY);
    this.m_sComment   = "";
    this.m_oTerritory = new CTerritory(false, {});
};
CNode.prototype.Get_Next = function(Index)
{
    return (undefined !== this.m_aNext[Index] ? this.m_aNext[Index] : this.m_aNext[this.m_nNextCur]);
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
CNode.prototype.Add_Next = function(Node, bSetCur, nPos)
{
    Node.Set_Prev(this);

    if (undefined === nPos)
    {
        this.m_aNext.push(Node);

        if (true === bSetCur || -1 === this.m_nNextCur)
            this.m_nNextCur = this.m_aNext.length - 1;
    }
    else
    {
        nPos = Math.max(0, Math.min(this.m_aNext.length, nPos));
        this.m_aNext.splice(nPos, 0, Node);

        if (true === bSetCur || -1 === this.m_nNextCur)
            this.m_nNextCur = nPos;
    }

    if (this.m_oGameTree)
        this.m_oGameTree.Set_Modified(true);
};
CNode.prototype.Remove_Next = function(Index)
{
    this.m_aNext.splice(Index, 1);

    if (this.m_nNextCur >= Index)
        this.m_nNextCur--;

    if (-1 === this.m_nNextCur && this.m_aNext.length > 0)
        this.m_nNextCur = 0;

    if (this.m_oGameTree)
        this.m_oGameTree.Set_Modified(true);
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
    this.m_aCommands.push(Command);
    this.ToHandler_AddCommand(Command);

    if (this.m_oGameTree)
        this.m_oGameTree.Set_Modified(true);
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

    if (this.m_oGameTree)
        this.m_oGameTree.Set_Modified(true);
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

    if (this.m_oGameTree)
        this.m_oGameTree.Set_Modified(true);
};
CNode.prototype.Set_Comment = function(sComment)
{
    this.m_sComment = sComment;

    if (this.m_oGameTree)
        this.m_oGameTree.Set_Modified(true);
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
CNode.prototype.Fill_TerritoryToLogicBoard = function(LogicBoard)
{
    this.m_oTerritory.Fill_PointsToLogicBoard(LogicBoard);
};
CNode.prototype.Fill_TerritoryFromLogicBoard = function(LogicBoard)
{
    this.m_oTerritory.Fill_PointsFromLogicBoard(LogicBoard);
};
CNode.prototype.Get_MainVariantLen = function()
{
    var Count = 1; // сама нода всегда входит в основной вариант
    var NextNode = this;
    while (NextNode.Get_NextsCount() > 0)
    {
        Count++;
        NextNode = NextNode.Get_Next(0);
    }

    return Count;
};
CNode.prototype.GoTo_MainVariant = function()
{
    var Node = this;
    while(Node.Get_NextsCount() > 0)
    {
        Node.Set_NextCur(0);
        Node = Node.Get_Next(0);
    }
};
CNode.prototype.Get_LastNodeInMainVariant = function()
{
    // Смещаемся к последней ноде в основном варианте
    var CurNode = this;
    while (CurNode.Get_NextsCount() > 0)
        CurNode = CurNode.Get_Next(0);

    return CurNode;
};
CNode.prototype.Is_First = function()
{
    return (null === this.m_oPrev ? true : false);
};
CNode.prototype.Make_ThisNodeCurrent = function()
{
    var bResult = false;
    var CurrNode = this.Get_Prev();
    var NextNode = this;
    while (null != CurrNode)
    {
        var bFind = false;
        for (var Index = 0, NextsCount = CurrNode.Get_NextsCount(); Index < NextsCount; Index++)
        {
            if (NextNode === CurrNode.Get_Next(Index))
            {
                if (Index !== CurrNode.Get_NextCur())
                    bResult = true;

                CurrNode.Set_NextCur(Index);
                bFind = true;
                break;
            }
        }

        if (!bFind)
            return false;

        NextNode = CurrNode;
        CurrNode = CurrNode.Get_Prev();
    }

    return bResult;
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

        CurrNode = PrevNode;
    }

    return true;
};
CNode.prototype.Set_NavigatorInfo = function(X, Y, Num)
{
    this.m_oNavInfo.X   = X;
    this.m_oNavInfo.Y   = Y;
    this.m_oNavInfo.Num = Num;
};
CNode.prototype.Get_NavigatorInfo = function()
{
    return this.m_oNavInfo;
};
CNode.prototype.Add_Move = function(X, Y, Value)
{
    var Pos = Common_XYtoValue(X, Y);
    this.Add_Command(new CCommand((BOARD_BLACK === Value ? ECommand.B : ECommand.W), Pos));

    if (BOARD_EMPTY === this.m_oMove.Get_Type())
    {
        this.m_oMove.Set_Value(Pos);
        this.m_oMove.Set_Type(Value);
    }
};
CNode.prototype.Add_MoveNumber = function(MoveNumber)
{
    this.Add_Command(new CCommand(ECommand.MN, MoveNumber));
};
CNode.prototype.AddOrRemove_Stones = function(Value, arrPos)
{
    var Type = (BOARD_BLACK === Value ? ECommand.AB : (BOARD_WHITE === Value ? ECommand.AW : ECommand.AE));
    this.Add_Command(new CCommand(Type, Common_CopyArray(arrPos), arrPos.length));
};
CNode.prototype.Add_Mark = function(MarkType, arrPos)
{
    var CommandType = ECommand.Unknown;
    switch(MarkType)
    {
        case EDrawingMark.Cr: CommandType = ECommand.CR; break;
        case EDrawingMark.Lm: return;
        case EDrawingMark.Sq: CommandType = ECommand.SQ; break;
        case EDrawingMark.Tr: CommandType = ECommand.TR; break;
        case EDrawingMark.Tx: CommandType = ECommand.LB; break;
        case EDrawingMark.X : CommandType = ECommand.MA; break;
        case ECommand.RM    : CommandType = ECommand.RM; break;
    }

    this.Add_Command(new CCommand(CommandType, Common_CopyArray(arrPos), arrPos.length));
};
CNode.prototype.Add_TextMark = function(sText, Pos)
{
    this.Add_Command(new CCommand(ECommand.LB, {Text : sText, Pos : Pos}));
};
CNode.prototype.Set_NextMove = function(Value)
{
    this.Add_Command(new CCommand(ECommand.PL, Value));
};
CNode.prototype.Add_BlackTimeLeft = function(Time)
{
    this.Add_Command(new CCommand(ECommand.BL, Time));
};
CNode.prototype.Add_WhiteTimeLeft = function(Time)
{
    this.Add_Command(new CCommand(ECommand.WL, Time));
};
CNode.prototype.Show_Variants = function(eType, oDrawingBoard)
{
    oDrawingBoard.Clear_Variants();

    switch (eType)
    {
        case EShowVariants.Next:
        {
            this.private_ShowNextVariants(oDrawingBoard, -1);
            break;
        }

        case EShowVariants.Curr:
        {
            var PrevNode = this.Get_Prev();
            if (null !== PrevNode)
                PrevNode.private_ShowNextVariants(oDrawingBoard, this.Get_Move().Get_Value());

            break;
        }

        default:
            return;
    }
};
CNode.prototype.Count_NodeNumber = function()
{
    var Counter  = 1;
    var CurrNode = this;
    var PrevNode = null;
    while (null !== (PrevNode = CurrNode.Get_Prev()))
    {
        Counter++;
        CurrNode = PrevNode;
    }

    return Counter;
};
CNode.prototype.private_ShowNextVariants = function(oDrawingBoard, ExceptionalValue)
{
    if (!oDrawingBoard)
        return;

    for (var Index = 0, NextsCount = this.Get_NextsCount(); Index < NextsCount; Index++)
    {
        var oNode = this.Get_Next(Index);
        var oMove = oNode.Get_Move();

        if (BOARD_EMPTY !== oMove.Get_Type() && ExceptionalValue !== oMove.Get_Value())
        {
            var Pos = Common_ValuetoXY(oMove.Get_Value());
            oDrawingBoard.Draw_Variant(Pos.X, Pos.Y);
        }
    }
};
CNode.prototype.Find_RightNodes = function(aNodes)
{
    if (-1 !== this.m_sComment.indexOf("RIGHT"))
        aNodes.push(this);

    for (var nIndex = 0, nCount = this.Get_NextsCount(); nIndex < nCount; nIndex++)
    {
        this.Get_Next(nIndex).Find_RightNodes(aNodes);
    }
};
CNode.prototype.Add_ColorMark = function(X, Y, Color)
{
    this.m_oColorMap[Common_XYtoValue(X, Y)] = Color;

    if (this.m_oGameTree)
        this.m_oGameTree.Set_Modified(true);
};
CNode.prototype.Remove_ColorMark = function(X, Y)
{
    delete this.m_oColorMap[Common_XYtoValue(X, Y)];

    if (this.m_oGameTree)
        this.m_oGameTree.Set_Modified(true);
};
CNode.prototype.Remove_AllColorMarks = function()
{
    this.m_oColorMap = {};

    if (this.m_oGameTree)
        this.m_oGameTree.Set_Modified(true);
};
CNode.prototype.Draw_ColorMap = function(oDrawingBoard)
{
    oDrawingBoard.Clear_AllColorMarks();

    for (var nPos in this.m_oColorMap)
    {
        oDrawingBoard.m_oColorMarks[nPos] = this.m_oColorMap[nPos];
    }

    oDrawingBoard.Draw_AllColorMarks();
};
CNode.prototype.Copy_ColorMapFromPrevNode = function()
{
    this.m_oColorMap = {};
    if (null !== this.m_oPrev)
    {
        var oPrevMap = this.m_oPrev.m_oColorMap;
        for (var nPos in oPrevMap)
        {
            this.m_oColorMap[nPos] = oPrevMap[nPos].Copy();
        }
    }

    if (this.m_oGameTree)
        this.m_oGameTree.Set_Modified(true);
};
CNode.prototype.Get_ColorTable = function(oTable)
{
    for (var nPos in this.m_oColorMap)
    {
        var nColor = this.m_oColorMap[nPos].ToLong();
        oTable[nColor] = true;
    }
    for (var nNextNode = 0, nNextsCount = this.Get_NextsCount(); nNextNode < nNextsCount; nNextNode++)
    {
        this.m_aNext[nNextNode].Get_ColorTable(oTable);
    }
};
CNode.prototype.Make_CurrentVariantMainly = function()
{
    var oCurNode  = this;
    var nCurNext  = this.Get_NextCur();
    var oNextNode = this.Get_Next(nCurNext);

    while (null !== oNextNode && undefined !== oNextNode)
    {
        if (0 !== nCurNext)
        {
            oCurNode.m_aNext.splice(nCurNext, 1);
            oCurNode.m_aNext.splice(0, 0, oNextNode);
            oCurNode.Set_NextCur(0);
        }

        oCurNode  = oNextNode;
        nCurNext  = oCurNode.Get_NextCur();
        oNextNode = oCurNode.Get_Next(nCurNext);
    }
};
CNode.prototype.Move_Variant = function(nCount)
{
    var oCurNode  = this;
    var oPrevNode = this.Get_Prev();

    while (null !== oPrevNode && undefined !== oPrevNode)
    {
        var nNextsCount = oPrevNode.Get_NextsCount();
        if (oPrevNode.Get_NextsCount() > 1)
        {
            for (var nIndex = 0; nIndex < nNextsCount; ++nIndex)
            {
                if (oCurNode === oPrevNode.Get_Next(nIndex))
                {
                    if (nCount > 0)
                    {
                        if (nIndex > 0)
                        {
                            oPrevNode.m_aNext.splice(nIndex, 1);
                            oPrevNode.m_aNext.splice(nIndex - 1, 0, oCurNode);
                            oPrevNode.Set_NextCur(nIndex - 1);
                        }
                    }
                    else
                    {
                        if (nIndex < nNextsCount - 1)
                        {
                            oPrevNode.m_aNext.splice(nIndex, 1);
                            oPrevNode.m_aNext.splice(nIndex + 1, 0, oCurNode);
                            oPrevNode.Set_NextCur(nIndex + 1);
                        }
                    }

                    break;
                }
            }
            return;
        }

        oCurNode  = oPrevNode;
        oPrevNode = oPrevNode.Get_Prev();
    }
};
//----------------------------------------------------------------------------------------------------------------------
// Функции, которые приходят из вне
//----------------------------------------------------------------------------------------------------------------------
CNode.prototype.ToHandler_AddCommand = function()
{
    if (this.m_oHandler && this.m_oHandler.Add_NodeCommand)
        this.m_oHandler.Add_NodeCommand(this.Get_Id(), Command.To_String());
};
CNode.prototype.FromHandler_AddCommand = function(sCommand)
{
    var oCommand = new CCommand();
    oCommand.From_String(sCommand);

    this.m_aCommands.push(oCommand);
};
CNode.prototype.ToHandler_UpdateNexts = function()
{
    if (!(this.m_oHandler && this.m_oHandler.Update_NodeNexts))
        return;

    var aNext = [];
    for (var nPos = 0, nCount = this.m_aNext.length; nPos < nCount; ++nPos)
    {
        aNext.push(this.m_aNext[nPos].Get_Id());
    }

    this.m_oHandler.Update_NodeNexts(this.Get_Id(), aNext);
};
CNode.prototype.FromHandler_UpdateNexts = function(aNext)
{

};