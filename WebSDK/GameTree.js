/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     17.11.14
 * Time     23:56
 */

function CGameTree(Drawing, Navigator, Sound, Marks)
{
    this.m_oNavigator      = Navigator;
    this.m_oSound          = Sound;
    this.m_oDrawing        = Drawing;
    this.m_oMarks          = Marks;

    this.m_oBoard          = new CLogicBoard();

    this.m_aNodes          = [];                // Список со всеми нодами
    this.m_oFirstNode      = new CNode(this);   // Первая нода
    this.m_nNodesIdCounter = 0;                 // Счетчик нод
    this.m_oCurNode        = this.m_oFirstNode; // Текущая нода

    this.m_nBlackCapt      = 0; // количество пленников черного игрока
    this.m_nWhiteCapt      = 0; // количество пленников белого игрока

    this.m_nKomi           = 0;
    this.m_nHandicap       = 0;

    this.m_nBlackScores    = 0;
    this.m_nWhiteScores    = 0;

    this.m_nMovesCount     = 0; // Количество ходов (не путать с нодами!)
    this.m_nCurNodeDepth   = 0; // Глубина текущей ноды

    this.m_sApplication    = ""; // "AP"
    this.m_sCharset        = ""; // "CA"

    this.m_sAnnotator      = ""; // "AN"
    this.m_sBlackRating    = ""; // "BR"
    this.m_sBlackTeam      = ""; // "BT"
    this.m_sCopyright      = ""; // "CP"
    this.m_sDateTime       = ""; // "DT"
    this.m_sEvent          = ""; // "EV"
    this.m_sGameName       = ""; // "GN"
    this.m_sGameInfo       = ""; // "GC"
    this.m_sGameFuseki     = ""; // "ON"
    this.m_sOverTime       = ""; // "OT"
    this.m_sBlack          = "Black"; // "PB"
    this.m_sPlace          = ""; // "PC"
    this.m_sWhite          = "White"; // "PW"
    this.m_sResult         = ""; // "RE"
    this.m_sRound          = ""; // "RO"
    this.m_sRules          = ""; // "RU"
    this.m_sGameSource     = ""; // "SO"
    this.m_nTimeLimit      = 0;  // "TM"
    this.m_sTranscriber    = ""; // "US"
    this.m_sWhiteRating    = ""; // "WR"
    this.m_sWhiteTeam      = ""; // "WT"


    // TODO: В будушем надо будет добавить обработку элементов:
    //       "GN", "GC", "ON", "PC", "RO", "SO", "TM", "US", "WT"

    this.m_bEventEnable  = true;
    this.m_nShowVariants = EShowVariants.Next;
};

CGameTree.prototype.Init_Match = function()
{
    this.m_oCurNode      = this.m_oFirstNode;
    this.m_nBlackCapt    = 0;
    this.m_nWhiteCapt    = 0;
    this.m_nMovesCount   = 0;
    this.m_nCurNodeDepth = 0;
};
CGameTree.prototype.Reset = function()
{
    this.m_aNodes        = [];
    this.m_oFirstNode    = new CNode(this);

    this.m_sApplication  = "";
    this.m_sAuthor       = "";
    this.m_sBlackRating  = "";
    this.m_sEvent        = "";
    this.m_sTimeSettings = "";
    this.m_sBlack        = "Black";
    this.m_sWhite        = "White";
    this.m_sWhiteRating  = "";
    this.m_sResult       = "";
    this.m_sRules        = "";

    this.Init_Match();
};
CGameTree.prototype.Get_NewNodeId = function()
{
    return ++this.m_nNodesIdCounter;
};
CGameTree.prototype.Add_Node = function(oNode)
{
    this.m_aNodes[oNode.Get_Id()] = oNode;
};
CGameTree.prototype.Change_NextMove = function(Value)
{
    this.m_nNextMove = (BOARD_BLACK === Value ? BOARD_WHITE : BOARD_BLACK);
};
CGameTree.prototype.Set_NextMove = function(Value)
{
    this.m_nNextMove = Value;
};
CGameTree.prototype.Get_FirstNode = function()
{
    return this.m_oFirstNode;
};
CGameTree.prototype.Get_CurNode = function()
{
    return this.m_oCurNode;
};
CGameTree.prototype.Set_CurNode = function(oNode)
{
    return this.m_oCurNode = oNode;
};
CGameTree.prototype.Add_NewNode = function(bUpdateNavigator)
{
    var oNewNode = new CNode(this);
    oNewNode.Set_Prev(this.m_oCurNode);
    this.m_oCurNode.Add_Next(oNewNode, true);
    this.m_oCurNode = oNewNode;
    this.m_nCurNodeDepth++;

    // TODO: Обновляем визуальное дерево вариантов
    if (true === bUpdateNavigator)
        this.m_oDrawing.Update_Navigator();
};
CGameTree.prototype.Add_NewNodeByPos = function(X, Y, Value)
{
    // Сначала проверим, есть ли у текущей ноды дочерняя нода с заданным значением.
    var Pos = Common_XYtoValue(X, Y);
    for (var Index = 0, NextsCount = this.m_oCurNode.Get_NextsCount(); Index < NextsCount; Index++)
    {
        var oNode = this.m_oCurNode.Get_Next( Index );
        var oMove = oNode.Get_Move();
        var nType = oMove.Get_Type();

        if (Pos === oMove.Get_Value() && (Value === nType && (BOARD_BLACK === Value || BOARD_WHITE === Value)))
        {
            this.m_oCurNode.Set_NextCur(Index);
            this.m_oCurNode = oNode;
            this.m_nCurNodeDepth++;

            // TODO: Обновляем текущую позицию в визуальном дереве вариантов
            this.m_oDrawing.Update_NavigatorCurrent(true);
            return;
        }
    }

    // Если мы попали сюда, значит данного хода нет среди следующих у текущей ноды.
    this.Add_NewNode(false);
    this.m_oCurNode.Add_Move(X, Y, Value);

    // TODO: Обновляем визуальное дерево вариантов
    this.m_oNavigator.Create_From_GameTree();
    this.m_oDrawing.Update_Navigator();
};
CGameTree.prototype.Add_MoveNumber = function(MoveNumber)
{
    this.m_oCurNode.Add_MoveNumber(MoveNumber);
};
CGameTree.prototype.AddOrRemove_Stones = function(Value, arrPos)
{
    this.m_oCurNode.AddOrRemove_Stones(Value, arrPos);
};
CGameTree.prototype.Add_Comment = function(sComment)
{
    this.m_oCurNode.Add_Comment(sComment);
};
CGameTree.prototype.Set_Comment = function(sComment)
{
    this.m_oCurNode.Set_Comment(sComment);
};
CGameTree.prototype.Add_Mark = function(Type, arrPos)
{
    this.m_oCurNode.Add_Mark(Type, arrPos);
};
CGameTree.prototype.Remove_Mark = function(arrPos)
{
    this.m_oCurNode.Add_Mark(ECommand.RM, arrPos);
};
CGameTree.prototype.Add_TextMark = function(sText, Pos)
{
    this.m_oCurNode.Add_TextMark(sText, Pos);
};
CGameTree.prototype.Add_TerritoryPoint = function(Value, arrPos)
{
    if (!this.m_oCurNode.Is_TerritoryUse())
        this.m_oCurNode.Set_TerritoryUse(true);

    for (var Index = 0, Count = arrPos.length; Index < Count; Index++)
        this.m_oCurNode.Add_TerritoryPoint(arrPos[Index], Value);
};
CGameTree.prototype.Add_BlackTimeLeft = function(Time)
{
    this.m_oCurNode.Add_BlackTimeLeft(Time);
};
CGameTree.prototype.Add_WhiteTimeLeft = function(Time)
{
    this.m_oCurNode.Add_WhiteTimeLeft(Time);
};
CGameTree.prototype.Update_TerritoryMarks = function()
{
    if (!this.m_oCurNode.Is_TerritoryUse())
        this.m_oCurNode.Set_TerritoryUse(true);

    this.m_oCurNode.Fill_TerritoryFromLogicBoard(this.m_oBoard);
};
CGameTree.prototype.Clear_TerritoryPoints = function()
{
    if (true === this.m_oCurNode.Is_TerritoryUse())
        this.m_oCurNode.Clear_TerritoryPoints();
};
CGameTree.prototype.Remove_CurNode = function()
{
    var PrevNode = this.m_oCurNode.Get_Prev();

    // Первую ноду удалить нельзя
    // TODO: Но ее можно почистить
    if (null === PrevNode)
        return;

    // Ищем позицию, в которой записана текующая нода у родительской
    for (var Index = 0, NextsCount = PrevNode.Get_NextsCount(); Index < NextsCount; Index++)
    {
        if (this.m_oCurNode === PrevNode.Get_Next(Index))
        {
            // TODO: Заметим, что саму ноду и всех ее потомков из массива this.m_aNodes мы не
            // удаляем, потом что придется пересчитывать номера всех нод, что очень затратно
            PrevNode.Remove_Next(Index);
            this.m_oCurNode = PrevNode;
            return;
        }
    }
};
CGameTree.prototype.Have_Move = function()
{
    return this.m_oCurNode.Have_Move();
};
CGameTree.prototype.Is_CurNodeLast = function()
{
    // Проверяем, последняя ли данная нода в варианте
    if (0 === this.m_oCurNode.Get_NextsCount())
        return true;

    return false;
};
CGameTree.prototype.Execute_CurNodeCommands = function()
{
    // TODO: Отключения подсчета очков
    // При переходе к ноде отключаем подсчет очков, если он был включен
    if (this.m_oDrawing && editmode_CountScores == this.m_oDrawing.Get_EditMode())
        this.m_oDrawing.Set_EditMode2( editmode_Move );

    // TODO: Очистить доску от отметок и комментариев.
    // Очистим доску от отметок и комментариев предыдущей ноды
    if (this.m_oMarks)
        this.m_oMarks.RemoveAll();

    if (this.m_oDrawing)
    {
        this.m_oDrawing.Clear_Comments();
        this.m_oDrawing.Clear_Variants();
        this.Show_Variants();
    }

    for (var CommandIndex = 0, CommandsCount = this.m_oCurNode.Get_CommandsCount(); CommandIndex < CommandsCount; CommandIndex++)
    {
        var Command = this.m_oCurNode.Get_Command( CommandIndex );
        var Command_Type  = Command.Get_Type();
        var Command_Value = Command.Get_Value();
        var Command_Count = Command.Get_Count();

        switch(Command_Type)
        {
            case ECommand.B:
            {
                var Pos = Common_ValuetoXY(Command_Value);
                this.Execute_Move(Pos.X, Pos.Y, BOARD_BLACK);
                break;
            }
            case ECommand.W:
            {
                var Pos = Common_ValuetoXY(Command_Value);
                this.Execute_Move(Pos.X, Pos.Y, BOARD_WHITE);
                break;
            }
            case ECommand.AB:
            {
                for (var Index = 0; Index < Command_Count; Index++ )
                {
                    var Pos = Common_ValuetoXY(Command_Value[Index]);
                    this.private_SetBoardPoint(Pos.X, Pos.Y, BOARD_BLACK, -1);
                }
                break;
            }
            case ECommand.AW:
            {
                for (var Index = 0; Index < Command_Count; Index++ )
                {
                    var Pos = Common_ValuetoXY(Command_Value[Index]);
                    this.private_SetBoardPoint(Pos.X, Pos.Y, BOARD_WHITE, -1);
                }
                break;
            }
            case ECommand.AE:
            {
                for (var Index = 0; Index < Command_Count; Index++ )
                {
                    var Pos = Common_ValuetoXY(Command_Value[Index]);
                    this.private_SetBoardPoint(Pos.X, Pos.Y, BOARD_EMPTY, -1);
                }
                break;
            }
            case ECommand.PL:
            {
                this.Set_NextMove(Command_Value);
                break;
            }
            case ECommand.CR:
            {
                if (this.m_oMarks)
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oMarks.Set(Pos.X, Pos.Y, new CDrawingMark(Pos.X, Pos.Y, drawing_mark_Cr, ""));
                    }
                }
                break;
            }
            case ECommand.MA:
            {
                if (this.m_oMarks)
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oMarks.Set(Pos.X, Pos.Y, new CDrawingMark(Pos.X, Pos.Y, drawing_mark_X, ""));
                    }
                }
                break;
            }
            case ECommand.SQ:
            {
                if (this.m_oMarks)
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oMarks.Set(Pos.X, Pos.Y, new CDrawingMark(Pos.X, Pos.Y, drawing_mark_Sq, ""));
                    }
                }
                break;
            }
            case ECommand.TR:
            {
                if (this.m_oMarks)
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oMarks.Set(Pos.X, Pos.Y, new CDrawingMark(Pos.X, Pos.Y, drawing_mark_Tr, ""));
                    }
                }
                break;
            }
            case ECommand.LB:
            {
                if (this.m_oMarks)
                {
                    var Pos = Common_ValuetoXY(Command_Value.Pos);
                    this.m_oMarks.Set(Pos.X, Pos.Y, new CDrawingMark(Pos.X, Pos.Y, drawing_mark_Tx, Command_Value.Text));
                }
                break;
            }
            case ECommand.RM:
            {
                if (this.m_oMarks)
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oMarks.RemoveAt(Pos.X, Pos.Y);
                    }
                }
                break;
            }
            case ECommand.BL:
            {
                if (this.m_oDrawing)
                    this.m_oDrawing.Update_BlackTime( Math.floor(Command_Value) );

                break;
            }
            case ECommand.WL:
            {
                if (this.m_oDrawing)
                    this.m_oDrawing.Update_WhiteTime( Math.floor(Command_Value) );
                break;
            }
        }
    }

    if (this.m_oDrawing)
    {
        if (this.m_oCurNode.Is_TerritoryUse())
            this.m_oDrawing.Set_EditMode2(editmode_CountScores);
        else
            this.m_oDrawing.Update_Prisoners();

        this.m_oDrawing.Add_Comment(this.m_oCurNode.Get_Comment());
        this.m_oMarks.Draw(this.m_oDrawing);
        this.m_oDrawing.Update_NavigatorCurrent(true);
    }
};
CGameTree.prototype.Execute_Move = function(X, Y, Value)
{
    // Проверяем пасс
    if (0 == X && 0 == Y)
    {
        this.private_UpdateNextMove(Value);
        return;
    }

    // Поскольку, мы следуем спецификации SGF, тогда при выполнении хода:
    //  1. мы не проверяем, есть ли уже в данном месте камень
    //  2. Проверяем, убивает ли данный камень чужие камни(без учета ко)
    //  3. Если камень, не убивает чужие камни, тогда проверяем самоубийство
    //  4. Увеличиваем номер хода на 1

    if (this.m_oSound)
        this.m_oSound.Play_PlaceStone();

    this.m_oBoard.Set(X, Y, Value, this.m_nMovesCount + 1);

    if (this.m_oDrawing)
        this.m_oDrawing.Draw_Sector(X, Y, Value);

    // Проверяем, убиваем ли мы данным ходом чужие камни (без проверки правила КО)
    var oDeadChecker = null;
    if (null !== (oDeadChecker == this.m_oBoard.Check_Kill(X, Y, Value)) && oDeadChecker.Get_Size() > 0)
    {
        var nGroupSize = oDeadChecker.Get_GroupSize();
        for (var Index = 0; Index < nGroupSize; Index++)
        {
            var Pos = Common_ValuetoXY(oDeadChecker.Get_Value(Index));
            this.private_SetBoardPoint(Pos.X, Pos.Y, BOARD_EMPTY, -1);
        }

        if (this.m_oSound)
            this.m_oSound.Play_CaptureStones(oDeadChecker);

        if (BOARD_BLACK === Value)
            this.m_nBlackCapt += nGroupSize;
        else
            this.m_nWhiteCapt += nGroupSize;
    }
    // Проверяем самоубийство
    else  if (null !== (oDeadChecker = this.m_oBoard.Check_Dead(X, Y, Value, false)) && oDeadChecker.Get_Size() > 0)
    {
        var nGroupSize = oDeadChecker.Get_GroupSize();
        for (var Index = 0; Index < nGroupSize; Index++)
        {
            var Pos = Common_ValuetoXY(oDeadChecker.Get_Value(Index));
            this.private_SetBoardPoint(Pos.X, Pos.Y, BOARD_EMPTY, -1);
        }

        if (this.m_oSound)
            this.m_oSound.Play_CaptureStones( g_nGroupSize );

        if (BOARD_BLACK === Value)
            this.m_nWhiteCapt += nGroupSize;
        else
            this.m_nBlackCapt += nGroupSize;
    }
    else
    {
        // Обнуляем КО
        this.m_oBoard.Reset_Ko();
    }

    // Пас
    if (this.m_oMarks && 0 != X && 0 != Y)
        this.m_oMarks.Set_LastMoveMark(X, Y);

    this.private_UpdateNextMove(Value);
};
CGameTree.prototype.GoTo_Next = function()
{
    if (0 === this.m_oCurNode.Get_NextsCount() || -1 === this.m_oCurNode.Get_NextCur())
        return false;

    this.m_oCurNode = this.m_oCurNode.Get_Next(this.m_oCurNode.Get_NextCur());
    this.m_nCurNodeDepth++;

    return true;
};
CGameTree.prototype.Show_Variants = function()
{
    this.m_oCurNode.Show_Variants();
};
CGameTree.prototype.GoTo_MainVariant = function(Node)
{
    var _Node = (undefined === Node ? this.m_oFirstNode : Node);
    _Node.GoTo_MainVariant();
};
CGameTree.prototype.Count_Scores = function()
{
    var Scores = this.m_oBoard.Count_Scores(this.m_oMarks);

    this.m_nBlackScores = Scores.Black + this.m_nBlackCapt;
    this.m_nWhiteScores = Scores.White + this.m_nWhiteCapt + this.m_nKomi;
};
CGameTree.prototype.GoTo_Node = function(Node)
{
    this.Init_Match();
    this.m_oBoard.Clear();

    // Временно отключаем звук, отрисовку камней и перемещение навигации
    var oDrawing = this.m_oDrawing;
    var oSound   = this.m_oSound;

    this.m_oDrawing = null;
    this.m_oSound   = null;

    // Делаем вариант с данной нодой текущим
    if (!oResult.Node.Make_ThisNodeCurrent())
        return;

    this.m_oCurNode = this.m_oFirstNode;
    while (this.m_oCurNode != Node && this.m_oCurNode.Get_Nexts_Count() > 0)
    {
        // Выполняем на данной ноде только следующие команды:
        // ход (белых/черных), добавление/удаление камня.

        var CommandsCount = this.m_oCurNode.Get_Commands_Count();
        for ( var CommandIndex = 0; CommandIndex < CommandsCount; CommandIndex++ )
        {
            var Command = this.m_oCurNode.Get_Command( CommandIndex );
            var Command_Type  = Command.Get_Type();
            var Command_Value = Command.Get_Value();
            var Command_Count = Command.Get_Count();

            switch(Command_Type)
            {
                case ECommand.B:
                {
                    var Pos = Common_ValuetoXY(Command_Value);
                    this.Execute_Move(Pos.X, Pos.Y, BOARD_BLACK);
                    break;
                }
                case ECommand.W:
                {
                    var Pos = Common_ValuetoXY(Command_Value);
                    this.Execute_Move(Pos.X, Pos.Y, BOARD_WHITE);
                    break;
                }
                case ECommand.AB:
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oBoard.Set(Pos.X, Pos.Y, BOARD_BLACK, -1);
                    }
                    break;
                }
                case ECommand.AW:
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oBoard.Set(Pos.X, Pos.Y, BOARD_WHITE, -1);
                    }
                    break;
                }
                case ECommand.AE:
                {
                    for (var Index = 0; Index < Command_Count; Index++ )
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oBoard.Set(Pos.X, Pos.Y, BOARD_EMPTY, -1);
                    }
                    break;
                }
            }
        }

        if (!this.GoTo_Next())
            break;
    }

    // Включаем звук
    this.m_oSound = oSound;

    // У последней ноды выполняем команды в нормальном режиме
    this.Execute_CurNodeCommands();

    // Вклчаем отрисовку и рисуем текущую позицию
    this.m_oDrawing = oDrawing;

    if (this.m_oDrawing)
    {
        // Отрисовываем все камни
        this.m_oDrawing.Draw_Board_AllStones();

        // Если это необходимо, то перерисовываем навигатор
        this.m_oDrawing.Update_Navigator();
    }
};
CGameTree.prototype.Info_Get_BlackName = function()
{
    return this.m_sBlack;
};
CGameTree.prototype.Info_Get_BlackRating = function()
{
    return this.m_sBlackRating;
};
CGameTree.prototype.Info_Get_WhiteName = function()
{
    return this.m_sWhite;
};
CGameTree.prototype.Info_Get_WhiteRating = function()
{
    return this.m_sWhiteRating;
};
CGameTree.prototype.Get_Board = function()
{
    return this.m_oBoard;
};
CGameTree.prototype.Get_NextMove = function()
{
    return this.m_nNextMove;
};
CGameTree.prototype.Get_MovesCount = function()
{
    return this.m_nMovesCount;
};
CGameTree.prototype.Get_BlackCapt = function()
{
    return this.m_nBlackCapt;
};
CGameTree.prototype.Get_WhiteCapt = function()
{
    return this.m_nWhiteCapt;
};
CGameTree.prototype.Get_BlackScores = function()
{
    return this.m_nBlackScores;
};
CGameTree.prototype.Get_WhiteScores = function()
{
    return this.m_nWhiteScores;
};
CGameTree.prototype.Get_CurNodeDepth = function()
{
    return this.m_nCurNodeDepth;
};
CGameTree.prototype.Get_Komi = function()
{
    return this.m_nKomi;
};
CGameTree.prototype.Set_Komi = function(nKomi)
{
    this.m_nKomi = nKomi;
};
CGameTree.prototype.Get_Handicap = function()
{
    return this.m_nHandicap;
};
CGameTree.prototype.Set_Handicap = function(nHandicap)
{
    this.m_nHandicap = nHandicap;
};
CGameTree.prototype.Set_Application = function(sApp)
{
    this.m_sApplication = sApp;
};
CGameTree.prototype.Get_Application = function()
{
    return this.m_sApplication;
};
CGameTree.prototype.Set_Charset = function(sCharset)
{
    this.m_sCharset = sCharset;
};
CGameTree.prototype.Get_Charset = function()
{
    return this.m_sCharset;
};
CGameTree.prototype.Set_ShowVariants = function(nType)
{
    this.m_nShowVariants = nType;
};
CGameTree.prototype.Get_ShowVariants = function()
{
    return this.m_nShowVariants;
};
CGameTree.prototype.Set_Annotator = function(sAnnotator)
{
    this.m_sAnnotator = sAnnotator;
};
CGameTree.prototype.Get_Annotator = function()
{
    return this.m_sAnnotator;
};
CGameTree.prototype.Set_BlackRating = function(sRating)
{
    this.m_sBlackRating = sRating;
};
CGameTree.prototype.Get_BlackRating = function()
{
    return this.m_sBlackRating
};
CGameTree.prototype.Set_BlackTeam = function(sTeam)
{
    this.m_sBlackTeam = sTeam;
};
CGameTree.prototype.Get_BlackTeam = function()
{
    return this.m_sBlackTeam;
};
CGameTree.prototype.Set_Copyright = function(sCopyright)
{
    this.m_sCopyright = sCopyright;
};
CGameTree.prototype.Get_Copyright = function()
{
    return this.m_sCopyright;
};
CGameTree.prototype.Set_DateTime = function(sDateTime)
{
    this.m_sDateTime = sDateTime;
};
CGameTree.prototype.Get_DateTime = function()
{
    return this.m_sDateTime;
};
CGameTree.prototype.Set_Event = function(sEvent)
{
    this.m_sEvent = sEvent;
};
CGameTree.prototype.Get_Event = function()
{
    return this.m_sEvent;
};
CGameTree.prototype.Set_GameName = function(sGameName)
{
    this.m_sGameName = sGameName;
};
CGameTree.prototype.Set_GameInfo = function(sGameInfo)
{
    this.m_sGameInfo = sGameInfo;
};
CGameTree.prototype.Set_GameFuseki = function(sFuseki)
{
    this.m_sGameFuseki = sFuseki;
};
CGameTree.prototype.Set_OverTime = function(sOverTime)
{
    this.m_sOverTime = sOverTime;
};
CGameTree.prototype.Set_Black = function(sBlack)
{
    this.m_sBlack = sBlack;
};
CGameTree.prototype.Set_Place = function(sPlace)
{
    this.m_sPlace = sPlace;
};
CGameTree.prototype.Set_White = function(sWhite)
{
    this.m_sWhite = sWhite;
};
CGameTree.prototype.Set_Result = function(sResult)
{
    this.m_sResult = sResult;
};
CGameTree.prototype.Set_Round = function(sRound)
{
    this.m_sRound = sRound;
};
CGameTree.prototype.Set_Rules = function(sRules)
{
    this.m_sRules = sRules;
};
CGameTree.prototype.Set_GameSource = function(sGameSource)
{
    this.m_sGameSource = sGameSource;
};
CGameTree.prototype.Set_TimeLimit = function(sTimeLimit)
{
    this.m_nTimeLimit = sTimeLimit;
};
CGameTree.prototype.Set_Transcriber = function(sTranscribber)
{
    this.m_sTranscriber = sTranscribber;
};
CGameTree.prototype.Set_WhiteRating = function(sWhiteRating)
{
    this.m_sWhiteRating = sWhiteRating;
};
CGameTree.prototype.Set_WhiteTeam = function(sWhiteTeam)
{
    this.m_sWhiteTeam = sWhiteTeam;
};
CGameTree.Set_BoardSize = function(W, H)
{
    this.m_oBoard.Reset_Size(W, H);

    // TODO: перерисовать доску
    if (this.m_oDrawing)
        this.m_oDrawing.OnReset_BoardSize();
};
CGameTree.prototype.private_UpdateNextMove = function(CurMoveValue)
{
    if (BOARD_BLACK === CurMoveValue)
        this.Set_NextMove(BOARD_WHITE);
    else
        this.Set_NextMove(BOARD_BLACK);

    this.m_nMovesCount++;
};
CGameTree.prototype.private_SetBoardPoint = function(X, Y, Value, Num)
{
    this.m_oBoard.Set(X, Y, Value, Num);

    // TODO: отрисовка
    if (this.m_oDrawing)
        this.m_oDrawing.Draw_Sector(X, Y, Value);
};