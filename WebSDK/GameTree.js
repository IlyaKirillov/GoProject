/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     17.11.14
 * Time     23:56
 */

var EDITINGFLAGS_MASK      = 0xFFFFFFFF; // 4 байта
var EDITINGFLAGS_NEWNODE   = 0x00000001; // Можно ли добавлять новую ноду, или ходить можно только по уже имеющимся.
var EDITINGFLAGS_MOVE      = 0x00000002; // Можно ли свободно передвигаться по нодам
var EDITINGFLAGS_BOARDMODE = 0x00000004; // Можно ли изменять тип редактирования на доске
var EDITINGFLAGS_LOADFILE  = 0x00000008; // Можно ли загружать файлы
var EDITINGFLAGS_GAMEINFO  = 0x00000010; // Можно ли редактировать информацию об игре
var EDITINGFLAGS_VIEWPORT  = 0x00000020; // Можно ли менять границы доски

var EDITINGFLAGS_NEWNODE_NON   = EDITINGFLAGS_MASK ^ EDITINGFLAGS_NEWNODE;
var EDITINGFLAGS_MOVE_NON      = EDITINGFLAGS_MASK ^ EDITINGFLAGS_MOVE;
var EDITINGFLAGS_BOARDMODE_NON = EDITINGFLAGS_MASK ^ EDITINGFLAGS_BOARDMODE;
var EDITINGFLAGS_LOADFILE_NON  = EDITINGFLAGS_MASK ^ EDITINGFLAGS_LOADFILE;
var EDITINGFLAGS_GAMEINFO_NON  = EDITINGFLAGS_MASK ^ EDITINGFLAGS_GAMEINFO;
var EDITINGFLAGS_VIEWPORT_NON  = EDITINGFLAGS_MASK ^ EDITINGFLAGS_VIEWPORT;

function CGameTree(Drawing)
{
    this.m_oSettings         = new CLocalSetting(this);
    this.m_oSound            = new CBoardSound();
    this.m_oDrawing          = Drawing;

    this.m_oInterfaceState   = new CInterfaceState();

    this.m_oBoard            = new CLogicBoard();
    this.m_oDrawingBoard     = null;
    this.m_oDrawingNavigator = null;

    this.m_oFirstNode        = new CNode(this);   // Первая нода
    this.m_oCurNode          = this.m_oFirstNode; // Текущая нода
    this.m_oStartNode        = this.m_oFirstNode; // Стартовая нода для просмотра файла

    this.m_nBlackCapt        = 0; // количество пленников черного игрока
    this.m_nWhiteCapt        = 0; // количество пленников белого игрока

    this.m_nNextMove         = BOARD_BLACK;

    this.m_nKomi             = 0;
    this.m_nHandicap         = 0;

    this.m_nBlackScores      = 0;
    this.m_nWhiteScores      = 0;

    this.m_nMovesCount       = 0; // Количество ходов (не путать с нодами!)
    this.m_nCurNodeDepth     = 0; // Глубина текущей ноды

    this.m_sApplication      = ""; // "AP"
    this.m_sCharset          = ""; // "CA"

    this.m_sGameAnnotator    = ""; // "AN"
    this.m_sBlackRating      = ""; // "BR"
    this.m_sBlackTeam        = ""; // "BT"
    this.m_sCopyright        = ""; // "CP"
    this.m_sDateTime         = ""; // "DT"
    this.m_sGameEvent        = ""; // "EV"
    this.m_sGameName         = ""; // "GN"
    this.m_sGameInfo         = ""; // "GC"
    this.m_sGameFuseki       = ""; // "ON"
    this.m_sOverTime         = ""; // "OT"
    this.m_sBlack            = "Black"; // "PB"
    this.m_sGamePlace        = ""; // "PC"
    this.m_sWhite            = "White"; // "PW"
    this.m_sResult           = ""; // "RE"
    this.m_sGameRound        = ""; // "RO"
    this.m_sRules            = ""; // "RU"
    this.m_sGameSource       = ""; // "SO"
    this.m_nTimeLimit        = 0;  // "TM"
    this.m_sGameTranscriber  = ""; // "US"
    this.m_sWhiteRating      = ""; // "WR"
    this.m_sWhiteTeam        = ""; // "WT"


    // TODO: В будушем надо будет добавить обработку элементов:
    //       "GN", "GC", "ON", "PC", "RO", "SO", "TM", "US", "WT"

    this.m_bEventEnable  = true;
    this.m_eShowVariants = EShowVariants.Next;

    this.m_nEditingFlags = 0xFFFFFFFF;

    this.m_nAutoPlayTimer   = null;
    this.m_dAutoPlaySpeed   = 0.75;
    this.m_nAutoPlayOldTime = -1;

    this.m_bTutorModeAuto      = false;
    this.m_nTutorMode          = BOARD_EMPTY;
    this.m_nTutorInterval      = 300;
    this.m_sTutorText          = "";
    this.m_nTutorId            = null;
    this.m_pTutorRightCallback = null;
    this.m_pTutorWrongCallback = null;
    this.m_pTutorResetCallback = null;

    this.m_nGifId              = null;

    this.m_oHandler            = null;

    this.m_bModified           = false;

    this.m_bKifuMode           = false;
    this.m_nKifuEditFlags      = 0;
}
CGameTree.prototype.Copy_ForScoreEstimate = function()
{
    var oGameTree = new CGameTree();
    oGameTree.m_oBoard = this.m_oBoard.Copy();
    oGameTree.m_oFirstNode = this.m_oFirstNode.Copy_CurrentVariant(this.m_oCurNode);
    oGameTree.m_oCurNode   = oGameTree.m_oFirstNode;
    oGameTree.m_nKomi      = this.m_nKomi;
    oGameTree.Step_ForwardToEnd();
    return oGameTree;
};
CGameTree.prototype.Set_TutorMode = function(bAuto, nMode, nInterval)
{
    if (true === bAuto)
    {
        this.m_bTutorModeAuto = true;
        this.m_nTutorMode     = BOARD_EMPTY;
    }
    else
    {
        this.m_bTutorModeAuto = false;
        this.m_nTutorMode     = nMode;
    }

    if (undefined !== nInterval)
        this.m_nTutorInterval = nInterval * 1000;
};
CGameTree.prototype.Set_TutorNewNodeText = function(sText)
{
    if (!sText || "" === sText)
        sText = "Wrong.\nOut of variants.";

    this.m_sTutorText = sText;
};
CGameTree.prototype.Set_TutorCallbacks = function(pRightCallBack, pWrongCallback, pResetCallback)
{
    this.m_pTutorRightCallback = pRightCallBack;
    this.m_pTutorWrongCallback = pWrongCallback;
    this.m_pTutorResetCallback = pResetCallback;
};
CGameTree.prototype.Find_ProblemRightVariant = function()
{
    // Ищем по всем нодам, ноду с комментарием RIGHT. Среди найденых нод выбираем любую случайным образом, и делаем
    // вариант с данной нодой текущим.
    var aRightNodes = [];
    this.m_oFirstNode.Find_RightNodes(aRightNodes);

    if (aRightNodes.length > 0)
    {
        var nRand = Math.max(0, Math.min(aRightNodes.length - 1, Math.floor(Math.random() * aRightNodes.length)));
        aRightNodes[nRand].Make_ThisNodeCurrent();
        return true;
    }

    return false;
};
CGameTree.prototype.Start_AutoPlay = function(bForce)
{
    if (!(EDITINGFLAGS_MOVE & this.m_nEditingFlags) && true !== bForce)
        return;

    this.Stop_AutoPlay();

    if (this.m_oDrawing)
        this.m_oDrawing.On_StartAutoPlay();

    var oThis = this;

    var PlayingFunction = function()
    {
        if (oThis.Get_CurNode().Get_NextsCount() > 0)
        {
            oThis.m_nAutoPlayTimer = 0; // Делаем его не null
            oThis.Step_Forward(1, bForce);
        }

        if (oThis.Get_CurNode().Get_NextsCount() > 0)
        {
            oThis.m_nAutoPlayOldTime = new Date().getTime();
            oThis.m_nAutoPlayTimer = setTimeout(PlayingFunction, oThis.Get_AutoPlayInterval());
        }
        else
        {
            oThis.m_nAutoPlayTimer = null;

            if (oThis.m_oDrawing)
                oThis.m_oDrawing.On_StopAutoPlay();
        }
    };

    var CurTime = new Date().getTime();
    var CurInterval = CurTime - this.m_nAutoPlayOldTime;
    var AutoPlayInterval = this.Get_AutoPlayInterval();

    var NewInterval = AutoPlayInterval - CurInterval;

    if (NewInterval <= 0)
        PlayingFunction();
    else
        this.m_nAutoPlayTimer = setTimeout(PlayingFunction, NewInterval);
};
CGameTree.prototype.Get_AutoPlayInterval = function()
{
    var nMinInterval = 100;  // 0.1 секунды
    var nMaxInterval = 7000; // 7 секунд
    return nMinInterval + (nMaxInterval - nMinInterval) * (1 - this.m_dAutoPlaySpeed);
};
CGameTree.prototype.Stop_AutoPlay = function()
{
    if (this.m_oDrawing)
        this.m_oDrawing.On_StopAutoPlay();

    if (null !== this.m_nAutoPlayTimer)
    {
        clearTimeout(this.m_nAutoPlayTimer);
        this.m_nAutoPlayTimer = null;
    }
};
CGameTree.prototype.Set_AutoPlaySpeed = function(dSpeed)
{
    this.m_dAutoPlaySpeed = dSpeed;

    if (this.m_oDrawing)
        this.m_oDrawing.Update_AutoPlaySpeed(dSpeed);

    // Перестартовываем с новой скоростью, чтобы не ждать старый таймер.
    if (null !== this.m_nAutoPlayTimer)
    {
        this.Start_AutoPlay();
    }
};
CGameTree.prototype.GoTo_NodeByTimeLine = function(dPos)
{
    // Сначала посчитаем количество ходов в текущем варианте
    var MovesCount = this.private_GetMovesCountInCurVariant();

    var CurMove = dPos * (MovesCount - 1);

    var CurNode = this.m_oFirstNode;
    while (CurNode.Get_NextsCount() > 0 && CurMove > 0)
    {
        CurMove--;
        CurNode = CurNode.Get_Next();
    }

    this.GoTo_Node(CurNode);
};
CGameTree.prototype.private_GetTimeLinePos = function()
{
    var CurNode = this.m_oFirstNode;
    var Count = 1;
    var CurPos = 1;
    while (CurNode.Get_NextsCount() > 0)
    {
        Count++;
        CurNode = CurNode.Get_Next();

        if (CurNode === this.m_oCurNode)
            CurPos = Count;
    }

    if (Count > 0)
        return (CurPos - 1) / (Count - 1);

    return 1;
};
CGameTree.prototype.private_GetMovesCountInCurVariant = function()
{
    var CurNode = this.m_oFirstNode;
    var Count = 1;
    while (CurNode.Get_NextsCount() > 0)
    {
        Count++;
        CurNode = CurNode.Get_Next();
    }

    return Count;
};
CGameTree.prototype.On_EndLoadDrawing = function()
{
    if (this.m_oDrawingNavigator)
        this.m_oDrawingNavigator.Create_FromGameTree();

    if (this.m_oDrawing)
    {
        this.Update_InterfaceState();
        this.m_oDrawing.Update_AutoPlaySpeed(this.m_dAutoPlaySpeed);
    }
};
CGameTree.prototype.Set_DrawingNavigator = function(oDrawingNavigator)
{
    this.m_oDrawingNavigator = oDrawingNavigator;
};
CGameTree.prototype.Set_Drawing = function(oDrawing)
{
    this.m_oDrawing = oDrawing;
};
CGameTree.prototype.Update_Size = function()
{
    if (this.m_oDrawing)
        this.m_oDrawing.Update_Size();
};
CGameTree.prototype.Get_Drawing = function()
{
    return this.m_oDrawing;
};
CGameTree.prototype.Get_DrawingBoard = function()
{
    return this.m_oDrawingBoard;
};
CGameTree.prototype.Get_DrawingNavigator = function()
{
    return this.m_oDrawingNavigator;
};
CGameTree.prototype.Focus = function()
{
    if (this.m_oDrawingBoard)
        this.m_oDrawingBoard.Focus();
};
CGameTree.prototype.Load_Sgf = function(sFile, oViewPort, sMoveReference, sExt)
{
    if (!(this.m_nEditingFlags & EDITINGFLAGS_LOADFILE))
        return;

    g_oIdCounter.Reset();

    var nEditingFlags = this.m_nEditingFlags;
    this.Reset_EditingFlags();

    // Сначала определим тип файла
    var oReader = null;
    if ("gib" === sExt)
        oReader = new CGibReader(this);
    else if ("ngf" === sExt)
        oReader = new CNgfReader(this);
    else
        oReader = new CSgfReader(this);

    oReader.Load(sFile);

    if (this.m_bTutorModeAuto)
        this.m_nTutorMode = this.Get_NextMove() === BOARD_BLACK ? BOARD_WHITE : BOARD_BLACK;

    var nSizeX = this.m_oBoard.Get_Size().X;
    var nSizeY = this.m_oBoard.Get_Size().Y;
    if (this.m_oDrawingBoard && oViewPort)
    {
        if (true === oViewPort.Auto)
        {
            var X0 = (oReader.m_oViewPort.X0 <= 4 ? 0 : oReader.m_oViewPort.X0 - 2);
            var X1 = (nSizeX - oReader.m_oViewPort.X1 <= 3 ? nSizeX - 1 : oReader.m_oViewPort.X1);
            var Y0 = (oReader.m_oViewPort.Y0 <= 4 ? 0 : oReader.m_oViewPort.Y0 - 2);
            var Y1 = (nSizeY - oReader.m_oViewPort.Y1 <= 3 ? nSizeY - 1 : oReader.m_oViewPort.Y1);
            this.m_oDrawingBoard.Set_ViewPort(X0, Y0, X1, Y1);
        }
        else if (undefined !== oViewPort.X0 && undefined !== oViewPort.X1 && undefined !== oViewPort.Y0 && undefined !== oViewPort.Y1)
            this.m_oDrawingBoard.Set_ViewPort(oViewPort.X0, oViewPort.Y0, oViewPort.X1, oViewPort.Y1);
    }
    else if (this.m_oDrawingBoard)
        this.m_oDrawingBoard.Set_ViewPort(0, 0, nSizeX - 1, nSizeY - 1);

    if (this.m_oDrawingNavigator)
    {
        this.m_oDrawingNavigator.Create_FromGameTree();
        this.m_oDrawingNavigator.Update();
    }

    if (sMoveReference)
        this.GoTo_MoveReference(sMoveReference);
    else
    {
        var oStartNode;
        if (this.Is_LoadUnfinishedFilesOnLastNode() && this.Is_Unfinished())
            oStartNode = this.m_oFirstNode.Get_LastNodeInMainVariant();
        else
            oStartNode = this.m_oFirstNode;

        this.m_oStartNode = oStartNode;
        this.GoTo_Node(oStartNode);
    }

    var eShowVariants = this.Get_LoadShowVariants();
    if (ESettingsLoadShowVariants.FromFile !== this.Get_LoadShowVariants())
        this.m_eShowVariants = eShowVariants;

    this.m_nEditingFlags = nEditingFlags;

    if (this.m_oDrawingBoard)
        this.m_oDrawingBoard.On_EndLoadSgf();

    if (this.m_oDrawing)
        this.m_oDrawing.Update_Size(true);

    this.Set_Modified(false);
};
CGameTree.prototype.Save_Sgf = function()
{
    var oWriter = new CSgfWriter();
    oWriter.Write(this);
    return oWriter.m_sFile;
};
CGameTree.prototype.Set_DrawingBoard = function(DrawingBoard)
{
    this.m_oDrawingBoard = DrawingBoard;
};
CGameTree.prototype.Reset = function()
{
    this.m_oFirstNode    = new CNode(this);

    this.Set_GameName("");
    this.Set_Result("");
    this.Set_Rules("");
    this.Set_Komi(0);
    this.Set_Handicap("0");
    this.Set_TimeLimit("");
    this.Set_OverTime("");
    this.Set_Black("Black");
    this.Set_BlackRating("");
    this.Set_White("White");
    this.Set_WhiteRating("");
    this.Set_Copyright("");
    this.Set_GameInfo("");
    this.Set_DateTime("");
    this.Set_GameEvent("");
    this.Set_GameRound("");
    this.Set_GamePlace("");
    this.Set_GameAnnotator("");
    this.Set_GameFuseki("");
    this.Set_GameSource("");
    this.Set_GameTranscriber("");

    this.m_eShowVariants = EShowVariants.None;

    this.Init_Match();
};
CGameTree.prototype.GoTo_StartNode = function()
{
    this.GoTo_Node(this.m_oStartNode);
};
CGameTree.prototype.Step_BackwardToStart = function()
{
    var nOldFlag = this.m_nEditingFlags;
    // Если у нас TutorMode, то даем перемещаться в начало, даже с запрещающим флагом перемещения
    if (BOARD_EMPTY !== this.m_nTutorMode)
    {
        this.Set_EditingFlags({Move : true});
    }

    this.GoTo_Node(this.m_oFirstNode);

    this.m_nEditingFlags = nOldFlag;

    if (BOARD_EMPTY !== this.m_nTutorMode)
    {
        if (this.m_pTutorResetCallback)
            this.private_SendCallback(this.m_pTutorResetCallback)
    }

};
CGameTree.prototype.Step_Backward = function(Count)
{
    var ParentNode = this.Get_CurNode();
    while (null != ParentNode.Get_Prev() && Count > 0)
    {
        ParentNode = ParentNode.Get_Prev();
        Count--;

        if (ParentNode.Get_NextsCount() > 1)
            break;
    }

    this.GoTo_Node(ParentNode);
};
CGameTree.prototype.Step_Forward = function(Count, bForce)
{
    if (1 === Count)
    {
        if (!this.GoTo_Next(bForce))
            return;

        if (this.m_oHandler && this.m_oHandler["GoTo_Node"])
            this.m_oHandler["GoTo_Node"](this.Get_CurNode().Get_Id());

        this.Execute_CurNodeCommands();
    }
    else
    {
        for (var Index = 0; Index < Count; Index++)
        {
            this.GoTo_Next();

            if (this.Get_CurNode().Get_NextsCount() > 1)
                break;
        }

        this.GoTo_Node(this.Get_CurNode());
    }
};
CGameTree.prototype.Step_ForwardToEnd = function()
{
    while (this.GoTo_Next())
        ;

    this.GoTo_Node(this.Get_CurNode());
};
CGameTree.prototype.Pass = function()
{
    if (true === this.Add_NewNodeByPos(0, 0, this.m_nNextMove))
        this.Execute_CurNodeCommands();
};
CGameTree.prototype.GoTo_PrevVariant = function()
{
    var PrevNode = this.m_oCurNode.Get_Prev();
    if (null !== PrevNode)
    {
        // Ищем ветку с предыдущим вариантом
        var NextCur    = PrevNode.Get_NextCur();
        var NextsCount = PrevNode.Get_NextsCount();
        if (NextsCount > 1)
        {
            if (this.Is_CycleThroughVariants())
            {
                var Node;
                if (NextCur > 0)
                    Node = PrevNode.Get_Next(NextCur - 1);
                else
                    Node = PrevNode.Get_Next(NextsCount - 1);

                this.GoTo_Node(Node);
            }
            else
            {
                if (NextCur > 0)
                {
                    Node = PrevNode.Get_Next(NextCur - 1);
                    this.GoTo_Node(Node);
                }
            }
        }
    }
};
CGameTree.prototype.GoTo_NextVariant = function()
{
    var PrevNode = this.m_oCurNode.Get_Prev();
    if (null !== PrevNode)
    {
        // Ищем ветку со следующим вариантом
        var NextCur    = PrevNode.Get_NextCur();
        var NextsCount = PrevNode.Get_NextsCount();

        if (NextsCount > 1)
        {
            if (this.Is_CycleThroughVariants())
            {
                var Node;
                if (NextCur < NextsCount - 1)
                    Node = PrevNode.Get_Next(NextCur + 1);
                else
                    Node = PrevNode.Get_Next(0);

                this.GoTo_Node(Node);
            }
            else
            {
                if (NextCur < NextsCount - 1)
                {
                    var Node = PrevNode.Get_Next(NextCur + 1);
                    this.GoTo_Node(Node);
                }
            }
        }
    }
};
CGameTree.prototype.GoTo_MainVariant = function()
{
    var CurNode = this.m_oCurNode;
    while (!CurNode.Is_OnMainVariant())
    {
        var PrevNode = CurNode.Get_Prev();

        // Такого не должно быть.
        if (null === PrevNode && CurNode !== this.m_oFirstNode)
            return;

        CurNode = PrevNode;
    }

    CurNode.GoTo_MainVariant();
    this.GoTo_Node(CurNode);

    if (this.m_oDrawingNavigator)
        this.m_oDrawingNavigator.Update();
};
CGameTree.prototype.GoTo_NodeByXY = function(X, Y)
{
    if (this.m_oSound)
        this.m_oSound.Off();

    var CurNode = this.m_oCurNode;
    this.Step_BackwardToStart();

    var BreakCounter = 0;
    while (BreakCounter < 1000 && BOARD_EMPTY === this.m_oBoard.Get(X, Y))
    {
        this.Step_Forward(1);
        BreakCounter++;
    }

    // Если мы не нашли искомую ноду, тогда возвращаемся к начальной
    if (BOARD_EMPTY === this.m_oBoard.Get(X, Y))
        this.GoTo_Node(CurNode);

    if (this.m_oSound)
        this.m_oSound.On();
};
CGameTree.prototype.Set_NextMove = function(Value)
{
    this.m_nNextMove = Value;
    this.m_oCurNode.Set_NextMove(Value);
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
    if (this.m_oHandler && this.m_oHandler.Set_CurNode)
        this.m_oHandler.Set_CurNode(oNode.Get_Id());

    this.m_oCurNode = oNode;
};
CGameTree.prototype.Add_Move = function(X, Y, Value)
{
    this.m_oCurNode.Add_Move(X, Y, Value);
};
CGameTree.prototype.Add_NewNode = function(bUpdateNavigator, bSetCur)
{
    if (!(this.m_nEditingFlags & EDITINGFLAGS_NEWNODE))
        return false;

    var oNewNode = new CNode(this);
    if (this.m_oHandler && this.m_oHandler.Add_NewNode)
        this.m_oHandler.Add_NewNode(oNode.Get_Id());

    this.m_oCurNode.Add_Next(oNewNode, bSetCur);
    this.Set_CurNode(oNewNode);
    this.m_nCurNodeDepth++;

    if (true === bUpdateNavigator && this.m_oDrawingNavigator)
    {
        this.m_oDrawingNavigator.Create_FromGameTree();
        this.m_oDrawingNavigator.Update();
    }

    return true;
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

        if (true === this.Is_KifuMode() && 0 !== Index)
            return false;

        if (Pos === oMove.Get_Value() && (Value === nType && (BOARD_BLACK === Value || BOARD_WHITE === Value)))
        {
            var OldNextCur = this.m_oCurNode.Get_NextCur();

            this.m_oCurNode.Set_NextCur(Index);
            this.Set_CurNode(oNode);
            this.m_nCurNodeDepth++;

            if (this.m_oDrawingNavigator && OldNextCur !== Index)
                this.m_oDrawingNavigator.Update();

            return true;
        }
    }

    if (!(this.m_nEditingFlags & EDITINGFLAGS_NEWNODE))
        return false;

    // Если мы попали сюда, значит данного хода нет среди следующих у текущей ноды.
    this.Add_NewNode(false, true);
    this.m_oCurNode.Add_Move(X, Y, Value);

    if (this.m_oDrawingNavigator)
    {
        this.m_oDrawingNavigator.Create_FromGameTree();
        this.m_oDrawingNavigator.Update();
    }

    if (BOARD_EMPTY !== this.m_nTutorMode && "" !== this.m_sTutorText)
        this.m_oCurNode.Set_Comment(this.m_sTutorText);

    return true;
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
    var sOldComment = this.m_oCurNode.Get_Comment();
    this.m_oCurNode.Add_Comment(sComment);

    if (this.m_oDrawing)
        this.m_oDrawing.Update_Comments(this.m_oCurNode.Get_Comment());

    if (this.m_oDrawingNavigator && "" === sOldComment && "" !== sComment)
        this.m_oDrawingNavigator.Update();
};
CGameTree.prototype.Set_Comment = function(sComment)
{
    var sOldComment = this.m_oCurNode.Get_Comment();
    this.m_oCurNode.Set_Comment(sComment);

    if (this.m_oDrawingNavigator && (("" === sOldComment && "" !== sComment) || ("" !== sOldComment && "" === sComment)))
        this.m_oDrawingNavigator.Update();
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
    {
        this.m_oCurNode.Set_TerritoryUse(false);
        this.m_oCurNode.Clear_TerritoryPoints();
    }

    if (this.m_oDrawingBoard)
    {
        this.m_oDrawingBoard.Remove_AllMarks();

        for (var CommandIndex = 0, CommandsCount = this.m_oCurNode.Get_CommandsCount(); CommandIndex < CommandsCount; CommandIndex++)
        {
            var Command = this.m_oCurNode.Get_Command( CommandIndex );
            var Command_Type  = Command.Get_Type();
            var Command_Value = Command.Get_Value();
            var Command_Count = Command.Get_Count();

            switch(Command_Type)
            {
                case ECommand.CR:
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oDrawingBoard.Add_Mark(new CDrawingMark(Pos.X, Pos.Y, EDrawingMark.Cr, ""));
                    }
                    break;
                }
                case ECommand.MA:
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oDrawingBoard.Add_Mark(new CDrawingMark(Pos.X, Pos.Y, EDrawingMark.X, ""));
                    }
                    break;
                }
                case ECommand.SQ:
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oDrawingBoard.Add_Mark(new CDrawingMark(Pos.X, Pos.Y, EDrawingMark.Sq, ""));
                    }
                    break;
                }
                case ECommand.TR:
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oDrawingBoard.Add_Mark(new CDrawingMark(Pos.X, Pos.Y, EDrawingMark.Tr, ""));
                    }
                    break;
                }
                case ECommand.LB:
                {
                    var Pos = Common_ValuetoXY(Command_Value.Pos);
                    this.m_oDrawingBoard.Add_Mark(new CDrawingMark(Pos.X, Pos.Y, EDrawingMark.Tx, Command_Value.Text));
                    break;
                }
                case ECommand.RM:
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oDrawingBoard.Remove_Mark(Pos.X, Pos.Y);
                    }
                    break;
                }
            }
        }

        if (this.m_oCurNode.Have_Move())
        {
            var oMove = this.m_oCurNode.Get_Move();
            var X = oMove.Get_X();
            var Y = oMove.Get_Y();

            this.m_oDrawingBoard.Set_LastMoveMark(X, Y);
        }
        else
        {
            this.m_oDrawingBoard.Set_LastMoveMark(-1, -1);
        }

        this.m_oDrawingBoard.Draw_Marks();
    }
};
CGameTree.prototype.Remove_CurNode = function()
{
    var PrevNode = this.m_oCurNode.Get_Prev();

    // Первую ноду удалить нельзя, поэтому мы просто чистим её
    if (null === PrevNode)
    {
        this.m_oCurNode.Clear();

        // Перестраиваем визуальное дерево вариантов
        if (this.m_oDrawingNavigator)
        {
            this.m_oDrawingNavigator.Create_FromGameTree();
            this.m_oDrawingNavigator.Update();
        }

        this.GoTo_Node(this.m_oCurNode);

        return;
    }

    // Ищем позицию, в которой записана текующая нода у родительской
    for (var Index = 0, NextsCount = PrevNode.Get_NextsCount(); Index < NextsCount; Index++)
    {
        if (this.m_oCurNode === PrevNode.Get_Next(Index))
        {
            PrevNode.Remove_Next(Index);
            this.Set_CurNode(PrevNode);

            // Перестраиваем визуальное дерево вариантов
            if (this.m_oDrawingNavigator)
            {
                this.m_oDrawingNavigator.Create_FromGameTree();
                this.m_oDrawingNavigator.Update();
            }

            this.GoTo_Node(PrevNode);
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
    if (this.m_oDrawingBoard)
    {
        // При переходе к ноде отключаем подсчет очков, если он был включен
        if (EBoardMode.CountScores === this.m_oDrawingBoard.Get_Mode())
            this.m_oDrawingBoard.Set_Mode(EBoardMode.Move);

        // Очистим доску от отметок и комментариев предыдущей ноды
        this.m_oDrawingBoard.Remove_AllMarks();
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
                this.Execute_Move(Pos.X, Pos.Y, BOARD_BLACK, false);
                break;
            }
            case ECommand.W:
            {
                var Pos = Common_ValuetoXY(Command_Value);
                this.Execute_Move(Pos.X, Pos.Y, BOARD_WHITE, false);
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
                this.private_SetNextMove(Command_Value);
                break;
            }
            case ECommand.CR:
            {
                if (this.m_oDrawingBoard)
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oDrawingBoard.Add_Mark(new CDrawingMark(Pos.X, Pos.Y, EDrawingMark.Cr, ""));
                    }
                }
                break;
            }
            case ECommand.MA:
            {
                if (this.m_oDrawingBoard)
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oDrawingBoard.Add_Mark(new CDrawingMark(Pos.X, Pos.Y, EDrawingMark.X, ""));
                    }
                }
                break;
            }
            case ECommand.SQ:
            {
                if (this.m_oDrawingBoard)
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oDrawingBoard.Add_Mark(new CDrawingMark(Pos.X, Pos.Y, EDrawingMark.Sq, ""));
                    }
                }
                break;
            }
            case ECommand.TR:
            {
                if (this.m_oDrawingBoard)
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oDrawingBoard.Add_Mark(new CDrawingMark(Pos.X, Pos.Y, EDrawingMark.Tr, ""));
                    }
                }
                break;
            }
            case ECommand.LB:
            {
                if (this.m_oDrawingBoard)
                {
                    var Pos = Common_ValuetoXY(Command_Value.Pos);
                    this.m_oDrawingBoard.Add_Mark(new CDrawingMark(Pos.X, Pos.Y, EDrawingMark.Tx, Command_Value.Text));
                }
                break;
            }
            case ECommand.RM:
            {
                if (this.m_oDrawingBoard)
                {
                    for (var Index = 0; Index < Command_Count; Index++)
                    {
                        var Pos = Common_ValuetoXY(Command_Value[Index]);
                        this.m_oDrawingBoard.Remove_Mark(Pos.X, Pos.Y);
                    }
                }
                break;
            }
            case ECommand.BL:
            {
                if (false)
                    this.m_oDrawing.Update_BlackTime( Math.floor(Command_Value) );

                break;
            }
            case ECommand.WL:
            {
                if (false)
                    this.m_oDrawing.Update_WhiteTime( Math.floor(Command_Value) );
                break;
            }
        }
    }

    if (this.m_oDrawingBoard)
    {
        if (this.m_oCurNode.Have_Move())
        {
            var oMove = this.m_oCurNode.Get_Move();
            var X = oMove.Get_X();
            var Y = oMove.Get_Y();

            this.m_oDrawingBoard.Set_LastMoveMark(X, Y);
        }
        else
            this.m_oDrawingBoard.Set_LastMoveMark(-1, -1);

        if (this.m_oCurNode.Is_TerritoryUse())
            this.m_oDrawingBoard.Set_Mode(EBoardMode.CountScores);

        this.m_oDrawingBoard.Draw_Marks();
        this.m_oCurNode.Draw_ColorMap(this.m_oDrawingBoard);
    }

    if (this.m_oDrawing)
    {
        var sComment = this.m_oCurNode.Get_Comment();

        var bNeedUpdateComment = true;
        if (BOARD_EMPTY !== this.m_nTutorMode)
        {
            if (-1 !== sComment.indexOf("CHOICE"))
                sComment = sComment.replace("CHOICE", "");

            if (this.m_oCurNode.Get_NextsCount() <= 0)
            {
                if (-1 !== sComment.indexOf("RIGHT") && null !== this.m_pTutorRightCallback)
                {
                    this.m_oDrawing.Update_Comments(sComment.replace("RIGHT", ""));
                    this.private_SendCallback(this.m_pTutorRightCallback)
                    bNeedUpdateComment = false;
                }
                else if (-1 === sComment.indexOf("RIGHT") && null !== this.m_pTutorWrongCallback)
                {
                    this.m_oDrawing.Update_Comments(sComment);
                    this.private_SendCallback(this.m_pTutorWrongCallback)
                    bNeedUpdateComment = false;
                }
            }

            if (bNeedUpdateComment)
                this.m_oDrawing.Update_Comments(sComment);
        }
        else
            this.m_oDrawing.Update_Comments(sComment);
    }

    if (this.m_oDrawingNavigator)
        this.m_oDrawingNavigator.Update_Current(true);

    this.Update_InterfaceState();

    if (this.m_nNextMove === this.m_nTutorMode)
    {
        if (null !== this.m_nTutorId || null !== this.m_nAutoPlayTimer || null !== this.m_nGifId)
            return;

        if (this.m_oCurNode.Get_NextsCount() >= 0)
        {
            var nOldFlags = this.m_nEditingFlags;
            var oThis = this;

            this.m_nTutorId = setTimeout(function()
            {
                oThis.Reset_EditingFlags();

                // Находим все ноды с комментарием CHOICE, и выбираем случайно одну из них. Если таковых нод нет, тогда
                // идем по верхней ветке.

                var oCurNode = oThis.Get_CurNode();
                var aChoice = [];
                for (var nIndex = 0, nCount = oCurNode.Get_NextsCount(); nIndex < nCount; nIndex++)
                {
                    var oTempNode = oCurNode.Get_Next(nIndex);
                    if (-1 !== oTempNode.Get_Comment().indexOf("CHOICE"))
                        aChoice.push(nIndex);
                }

                if (aChoice.length > 0)
                {
                    var nRand = Math.max(0, Math.min(aChoice.length - 1, Math.floor(Math.random() * aChoice.length)));
                    oCurNode.Set_NextCur(aChoice[nRand]);
                }
                else if (oCurNode.Get_NextsCount() > 0)
                    oCurNode.Set_NextCur(0);

                oThis.Step_Forward(1);
                oThis.m_nEditingFlags = nOldFlags;
                oThis.m_nTutorId = null;
            }, this.m_nTutorInterval);

            this.Forbid_All();
        }
    }
};
CGameTree.prototype.Execute_Move = function(X, Y, Value, bSilent)
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

    if (this.m_oSound && true !== bSilent)
        this.m_oSound.Play_PlaceStone();

    this.private_SetBoardPoint(X, Y, Value, this.m_nMovesCount + 1, bSilent);

    // Проверяем, убиваем ли мы данным ходом чужие камни (без проверки правила КО)
    var oDeadChecker = null;
    if (null !== (oDeadChecker = this.m_oBoard.Check_Kill(X, Y, Value, false)) && oDeadChecker.Get_Size() > 0)
    {
        var nGroupSize = oDeadChecker.Get_Size();
        for (var Index = 0; Index < nGroupSize; Index++)
        {
            var Pos = Common_ValuetoXY(oDeadChecker.Get_Value(Index));
            this.private_SetBoardPoint(Pos.X, Pos.Y, BOARD_EMPTY, -1);
        }

        if (this.m_oSound && true !== bSilent)
            this.m_oSound.Play_CaptureStones(oDeadChecker.Get_Size());

        if (BOARD_BLACK === Value)
            this.m_nBlackCapt += nGroupSize;
        else
            this.m_nWhiteCapt += nGroupSize;
    }
    // Проверяем самоубийство
    else if (null !== (oDeadChecker = this.m_oBoard.Check_Dead(X, Y, Value, false)) && oDeadChecker.Get_Size() > 0)
    {
        var nGroupSize = oDeadChecker.Get_Size();
        for (var Index = 0; Index < nGroupSize; Index++)
        {
            var Pos = Common_ValuetoXY(oDeadChecker.Get_Value(Index));
            this.private_SetBoardPoint(Pos.X, Pos.Y, BOARD_EMPTY, -1);
        }

        if (this.m_oSound && true !== bSilent)
            this.m_oSound.Play_CaptureStones(oDeadChecker.Get_Size());

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

    this.private_UpdateNextMove(Value);
};
CGameTree.prototype.GoTo_Next = function(bForce)
{
    if (!(this.m_nEditingFlags & EDITINGFLAGS_MOVE) && true !== bForce)
        return false;

    if (0 === this.m_oCurNode.Get_NextsCount() || -1 === this.m_oCurNode.Get_NextCur())
        return false;

    this.Set_CurNode(this.m_oCurNode.Get_Next(this.m_oCurNode.Get_NextCur()));
    this.m_nCurNodeDepth++;

    return true;
};
CGameTree.prototype.Show_Variants = function()
{
    if (this.m_oDrawingBoard)
        this.m_oCurNode.Show_Variants(this.m_eShowVariants, this.m_oDrawingBoard);
};
CGameTree.prototype.Count_Scores = function()
{
    if (this.m_oDrawingBoard)
    {
        var Scores = this.m_oBoard.Count_Scores(this.m_oDrawingBoard);
        this.m_oDrawingBoard.Draw_Marks();
        this.Update_TerritoryMarks();

        this.m_nBlackScores = Scores.Black + this.m_nBlackCapt;
        this.m_nWhiteScores = Scores.White + this.m_nWhiteCapt + this.m_nKomi;

        this.Update_InterfaceState();
    }
};
CGameTree.prototype.Set_Sound = function(sPath)
{
    this.m_oSound.Init(sPath);
};
CGameTree.prototype.GoTo_Node = function(Node, bForce)
{
    if (!(this.m_nEditingFlags & EDITINGFLAGS_MOVE) && true !== bForce)
        return;

    if (true === this.Is_KifuMode())
        this.Stop_KifuMode();

    if (this.m_oHandler && this.m_oHandler["GoTo_Node"])
        this.m_oHandler["GoTo_Node"](Node.Get_Id());

    this.Stop_AutoPlay();

    this.Init_Match();
    this.m_oBoard.Clear();

    // Временно отключаем звук, отрисовку камней и перемещение навигации
    if (this.m_oSound)
        this.m_oSound.Off();

    // Делаем вариант с данной нодой текущим
    var bUpdateNavigator = Node.Make_ThisNodeCurrent();

    this.Set_CurNode(this.m_oFirstNode);
    while (this.m_oCurNode != Node && this.m_oCurNode.Get_NextsCount() > 0)
    {
        // Выполняем на данной ноде только следующие команды:
        // ход (белых/черных), добавление/удаление камня.

        var CommandsCount = this.m_oCurNode.Get_CommandsCount();
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
                    this.Execute_Move(Pos.X, Pos.Y, BOARD_BLACK, true);
                    break;
                }
                case ECommand.W:
                {
                    var Pos = Common_ValuetoXY(Command_Value);
                    this.Execute_Move(Pos.X, Pos.Y, BOARD_WHITE, true);
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

        if (!this.GoTo_Next(bForce))
            break;
    }

    // Отрисовываем текущую позицию
    if (this.m_oDrawingBoard)
        this.m_oDrawingBoard.Draw_AllStones();

    // У последней ноды выполняем команды в нормальном режиме
    this.Execute_CurNodeCommands();

    if (this.m_oDrawingNavigator && true === bUpdateNavigator)
        this.m_oDrawingNavigator.Update();

    // Включаем звук
    if (this.m_oSound)
        this.m_oSound.On();
};
CGameTree.prototype.Get_BlackName = function()
{
    return this.m_sBlack;
};
CGameTree.prototype.Get_BlackRating = function()
{
    return this.m_sBlackRating;
};
CGameTree.prototype.Get_WhiteName = function()
{
    return this.m_sWhite;
};
CGameTree.prototype.Get_WhiteRating = function()
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
    this.Set_Modified(true);
};
CGameTree.prototype.Get_Handicap = function()
{
    return this.m_nHandicap;
};
CGameTree.prototype.Set_Handicap = function(nHandicap)
{
    this.m_nHandicap = nHandicap;
    this.Set_Modified(true);
};
CGameTree.prototype.Set_Application = function(sApp)
{
    this.m_sApplication = sApp;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_Application = function()
{
    return this.m_sApplication;
};
CGameTree.prototype.Set_Author = function(sAuthor)
{
    this.m_sAuthor = sAuthor;
    this.Set_Modified(true);
};
CGameTree.prototype.Set_Charset = function(sCharset)
{
    this.m_sCharset = sCharset;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_Charset = function()
{
    return this.m_sCharset;
};
CGameTree.prototype.Set_ShowVariants = function(eType)
{
    if (eType !== this.m_eShowVariants)
    {
        this.m_eShowVariants = eType;
        this.Show_Variants();
    }
};
CGameTree.prototype.Get_ShowVariants = function()
{
    return this.m_eShowVariants;
};
CGameTree.prototype.Set_GameAnnotator = function(sAnnotator)
{
    this.m_sGameAnnotator = sAnnotator;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_GameAnnotator = function()
{
    return this.m_sGameAnnotator;
};
CGameTree.prototype.Set_BlackRating = function(sRating)
{
    this.m_sBlackRating = sRating;
    if (this.m_oDrawing)
        this.m_oDrawing.Update_BlackRank(this.m_sBlackRating);

    this.Set_Modified(true);
};
CGameTree.prototype.Set_BlackTeam = function(sTeam)
{
    this.m_sBlackTeam = sTeam;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_BlackTeam = function()
{
    return this.m_sBlackTeam;
};
CGameTree.prototype.Set_Copyright = function(sCopyright)
{
    this.m_sCopyright = sCopyright;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_Copyright = function()
{
    return this.m_sCopyright;
};
CGameTree.prototype.Set_DateTime = function(sDateTime)
{
    this.m_sDateTime = sDateTime;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_DateTime = function()
{
    return this.m_sDateTime;
};
CGameTree.prototype.Set_GameEvent = function(sEvent)
{
    this.m_sGameEvent = sEvent;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_GameEvent = function()
{
    return this.m_sGameEvent;
};
CGameTree.prototype.Set_GameName = function(sGameName)
{
    this.m_sGameName = sGameName;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_GameName = function()
{
    return this.m_sGameName;
};
CGameTree.prototype.Get_MatchName = function()
{
    var sGameName = this.Get_GameName();
    if ("" === sGameName)
        sGameName = this.Get_WhiteName() + " vs. " + this.Get_BlackName();
    if ("" === sGameName)
        sGameName = "White vs. Black";

    return sGameName;
};
CGameTree.prototype.Set_GameInfo = function(sGameInfo)
{
    this.m_sGameInfo = sGameInfo;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_GameInfo = function()
{
    return this.m_sGameInfo;
};
CGameTree.prototype.Set_GameFuseki = function(sFuseki)
{
    this.m_sGameFuseki = sFuseki;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_GameFuseki = function()
{
    return this.m_sGameFuseki;
};
CGameTree.prototype.Set_OverTime = function(sOverTime)
{
    this.m_sOverTime = sOverTime;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_OverTime = function()
{
    return this.m_sOverTime;
};
CGameTree.prototype.Set_Black = function(sBlack)
{
    this.m_sBlack = sBlack;
    if (this.m_oDrawing)
        this.m_oDrawing.Update_BlackName(this.m_sBlack);

    this.Set_Modified(true);
};
CGameTree.prototype.Set_GamePlace = function(sPlace)
{
    this.m_sGamePlace = sPlace;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_GamePlace = function()
{
    return this.m_sGamePlace;
};
CGameTree.prototype.Set_White = function(sWhite)
{
    this.m_sWhite = sWhite;
    if (this.m_oDrawing)
        this.m_oDrawing.Update_WhiteName(this.m_sWhite);

    this.Set_Modified(true);
};
CGameTree.prototype.Set_Result = function(sResult)
{
    this.m_sResult = sResult;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_Result = function()
{
    return this.m_sResult;
};
CGameTree.prototype.Set_GameRound = function(sRound)
{
    this.m_sGameRound = sRound;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_GameRound = function()
{
    return this.m_sGameRound;
};
CGameTree.prototype.Set_Rules = function(sRules)
{
    this.m_sRules = sRules;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_Rules = function()
{
    return this.m_sRules;
};
CGameTree.prototype.Set_GameSource = function(sGameSource)
{
    this.m_sGameSource = sGameSource;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_GameSource = function()
{
    return this.m_sGameSource;
};
CGameTree.prototype.Set_TimeLimit = function(sTimeLimit)
{
    this.m_nTimeLimit = sTimeLimit;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_TimeLimit = function()
{
    return this.m_nTimeLimit;
};
CGameTree.prototype.Set_GameTranscriber = function(sTranscribber)
{
    this.m_sGameTranscriber = sTranscribber;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_GameTranscriber = function()
{
    return this.m_sGameTranscriber;
};
CGameTree.prototype.Set_WhiteRating = function(sWhiteRating)
{
    this.m_sWhiteRating = sWhiteRating;
    if (this.m_oDrawing)
        this.m_oDrawing.Update_WhiteRank(this.m_sWhiteRating);

    this.Set_Modified(true);
};
CGameTree.prototype.Set_WhiteTeam = function(sWhiteTeam)
{
    this.m_sWhiteTeam = sWhiteTeam;
    this.Set_Modified(true);
};
CGameTree.prototype.Get_WhiteTeam = function()
{
    return this.m_sWhiteTeam;
};
CGameTree.prototype.Set_BoardSize = function(_W, _H)
{
    var W = Math.min(52, Math.max(_W, 2));
    var H = Math.min(52, Math.max(_H, 2));

    var OldSize = this.m_oBoard.Get_Size();
    if (W !== OldSize.X || H !== OldSize.Y)
    {
        this.m_oBoard.Reset_Size(W, H);

        if (this.m_oDrawingBoard)
            this.m_oDrawingBoard.On_Resize(true);
    }
};
CGameTree.prototype.Init_Match = function()
{
    this.Set_CurNode(this.m_oFirstNode);
    this.m_nBlackCapt    = 0;
    this.m_nWhiteCapt    = 0;
    this.m_nMovesCount   = 0;
    this.m_nCurNodeDepth = 0;
    this.m_nNextMove     = BOARD_BLACK;
};
CGameTree.prototype.private_UpdateNextMove = function(CurMoveValue)
{
    if (BOARD_BLACK === CurMoveValue)
        this.private_SetNextMove(BOARD_WHITE);
    else
        this.private_SetNextMove(BOARD_BLACK);

    this.m_nMovesCount++;
};
CGameTree.prototype.private_SetBoardPoint = function(X, Y, Value, Num, bSilent)
{
    this.m_oBoard.Set(X, Y, Value, Num);

    if (this.m_oDrawingBoard && true !== bSilent)
        this.m_oDrawingBoard.Draw_Sector(X, Y, Value);
};
CGameTree.prototype.private_SetNextMove = function(Value)
{
    this.m_nNextMove = Value;
};
CGameTree.prototype.Update_InterfaceState = function(bUpdateInfo)
{
    if (this.m_oDrawing)
    {
        var oIState = this.m_oInterfaceState;
        var PrevNode = this.m_oCurNode.Get_Prev();

        oIState.Backward = null === this.m_oCurNode.Get_Prev() ? false : true;
        oIState.Forward  = this.m_oCurNode.Get_NextsCount() <= 0 ? false : true;

        if (null !== PrevNode)
        {
            var PrevNextCur = PrevNode.Get_NextCur();
            var PrevNextsCount = PrevNode.Get_NextsCount();

            if (this.Is_CycleThroughVariants())
            {
                oIState.NextVariant = PrevNextsCount > 1 ? true : false;
                oIState.PrevVariant = PrevNextsCount > 1 ? true : false;
            }
            else
            {
                oIState.NextVariant = PrevNextCur < PrevNextsCount - 1 ? true : false;
                oIState.PrevVariant = PrevNextCur > 0 ? true : false;
            }
        }
        else
        {
            oIState.NextVariant = false;
            oIState.PrevVariant = false;
        }

        if (this.m_oDrawingBoard)
            oIState.BoardMode = this.m_oDrawingBoard.Get_Mode();

        oIState.TimelinePos = this.private_GetTimeLinePos();

        this.m_oDrawing.Update_InterfaceState(oIState);

        if (this.m_oDrawingBoard && EBoardMode.CountScores === this.m_oDrawingBoard.Get_Mode())
            this.m_oDrawing.Update_Scores(this.Get_BlackScores(), this.Get_WhiteScores());
        else
            this.m_oDrawing.Update_Captured(this.Get_BlackCapt(), this.Get_WhiteCapt());

        if (bUpdateInfo)
        {
            this.m_oDrawing.Update_BlackRank(this.m_sBlackRating);
            this.m_oDrawing.Update_WhiteRank(this.m_sWhiteRating);
            this.m_oDrawing.Update_BlackName(this.m_sBlack);
            this.m_oDrawing.Update_WhiteName(this.m_sWhite);
        }
    }
};
CGameTree.prototype.Set_EditingFlags = function(oFlags)
{
    if (!oFlags)
        return;

    if (true === oFlags.NewNode)
        this.m_nEditingFlags |= EDITINGFLAGS_NEWNODE;
    else if (false === oFlags.NewNode)
        this.m_nEditingFlags &= EDITINGFLAGS_NEWNODE_NON;

    if (true === oFlags.Move)
        this.m_nEditingFlags |= EDITINGFLAGS_MOVE;
    else if (false === oFlags.Move)
        this.m_nEditingFlags &= EDITINGFLAGS_MOVE_NON;

    if (true === oFlags.ChangeBoardMode)
        this.m_nEditingFlags |= EDITINGFLAGS_BOARDMODE;
    else if (false === oFlags.ChangeBoardMode)
        this.m_nEditingFlags &= EDITINGFLAGS_BOARDMODE_NON;

    if (true === oFlags.LoadFile)
        this.m_nEditingFlags |= EDITINGFLAGS_LOADFILE;
    else if (false === oFlags.LoadFile)
        this.m_nEditingFlags &= EDITINGFLAGS_LOADFILE_NON;

    if (true === oFlags.GameInfo)
        this.m_nEditingFlags |= EDITINGFLAGS_GAMEINFO;
    else if (false === oFlags.GameInfo)
        this.m_nEditingFlags &= EDITINGFLAGS_GAMEINFO_NON;

    if (true === oFlags.ViewPort)
        this.m_nEditingFlags |= EDITINGFLAGS_VIEWPORT;
    else if (false === oFlags.ViewPort)
        this.m_nEditingFlags &= EDITINGFLAGS_VIEWPORT_NON;
};
CGameTree.prototype.Reset_EditingFlags = function()
{
    this.m_nEditingFlags = EDITINGFLAGS_MASK;
};
CGameTree.prototype.Forbid_All = function()
{
    this.m_nEditingFlags = 0;
};
CGameTree.prototype.Can_EditGameInfo = function()
{
    return (this.m_nEditingFlags & EDITINGFLAGS_GAMEINFO ? true : false);
};
CGameTree.prototype.Download_PngBoardScreenShot = function()
{
    var oDrawingBoard = this.Get_DrawingBoard();

    if (oDrawingBoard)
    {
        var oCanvas = oDrawingBoard.Get_FullImage(true);
        var sImage  = oCanvas.toDataURL("image/png");

        var oHref = document.createElement("a");
        oHref['download'] = "BoardShot.png";
        oHref['href']     = "data:image/png;base64" + sImage;
        Common.Click(oHref);
    }
};
CGameTree.prototype.Download_GifForCurVariant = function()
{
    var aNodes = [];
    var oCurNode = this.m_oFirstNode;
    aNodes.push(oCurNode);
    while (oCurNode.Get_NextsCount() > 0)
    {
        oCurNode = oCurNode.Get_Next(oCurNode.Get_NextCur());
        aNodes.push(oCurNode);
    }

    this.private_DownloadGif(aNodes);
};
CGameTree.prototype.Download_GifForProblem = function()
{
    var aNodes = [];
    var aRightNodes = [];
    this.m_oFirstNode.Find_RightNodes(aRightNodes);

    for (var nIndex = 0, nLen = aRightNodes.length; nIndex < nLen; nIndex++)
    {
        var oRightNode = aRightNodes[nIndex];
        oRightNode.Make_ThisNodeCurrent();

        var oCurNode = this.m_oFirstNode;
        aNodes.push(oCurNode);
        while (oCurNode !== oRightNode && oCurNode.Get_NextsCount() > 0)
        {
            oCurNode = oCurNode.Get_Next(oCurNode.Get_NextCur());
            aNodes.push(oCurNode);
        }
    }

    this.private_DownloadGif(aNodes);
};
CGameTree.prototype.Download_GifBoardScreenShot = function()
{
    this.private_DownloadGif([this.m_oCurNode]);
};
CGameTree.prototype.Abort_DownloadGid = function()
{
    this.m_nGifId = null;
};
CGameTree.prototype.private_DownloadGif = function(aNodes)
{
    var oDrawingBoard = this.Get_DrawingBoard();
    if (!oDrawingBoard)
        return;

    var oStartNode = this.m_oCurNode;

    // Оценим сложность файла. Количество фреймов * W * H - постоянная величина равная 2.000.000
    // 2000 * 1000 * 1 фрейм
    // 100 * 100 * 200 фреймов

    var nGifDifficult = 2000000;

    var W = oDrawingBoard.m_oImageData.W;
    var H = oDrawingBoard.m_oImageData.H;

    var nOverallFramesCount = aNodes.length;
    var nTimerFramesCount   = Math.max(1, Math.ceil(nGifDifficult / W / H));
    var nCurrentFrame       = 0;
    var oStones             = null;
    var oMarks              = null;

    var nIntervalsCount = Math.ceil(nOverallFramesCount / nTimerFramesCount);
    var bUseTimeout = (nIntervalsCount > 5 ? true : false);

    var oGifWindow = true === bUseTimeout ? CreateWindow(oDrawingBoard.HtmlElement.Control.HtmlElement.id, EWindowType.GifWriter, {Drawing : this.m_oDrawing, GameTree : this}) : null;

    // Устанавливаем черно-белый цвет, чтобы уменьшить количество используемых цветов.
    oDrawingBoard.Set_BlackWhiteLastMark(true);

    var oGifWriter = new CGifWriter();

    oGifWriter.Set_Delay(1500);
    oGifWriter.Start();

    var W = 0;
    var H = 0;

    if (null !== oGifWindow)
        oGifWindow.On_Start();

    var oThis = this;

    this.m_nGifId = true;

    var TimerFunction = function()
    {
        if (null === oThis.m_nGifId)
        {
            // Извне отменили запись гифки
            oDrawingBoard.Set_BlackWhiteLastMark(false);
            oThis.GoTo_Node(oStartNode, true);
            return;
        }

        var nLastFrame = Math.min(nCurrentFrame + nTimerFramesCount, nOverallFramesCount);
        for (; nCurrentFrame < nLastFrame; nCurrentFrame++)
        {
            oThis.GoTo_Node(aNodes[nCurrentFrame], true);

            oCanvas  = oDrawingBoard.Get_FullImage(false);
            oContext = oCanvas.getContext("2d");

            // Теперь нам надо запоминать логическое состояние отрисовки, т.е. где что отрисовано (камни и метки)
            // и перед отрисовкой следующего фрейма сравнивать его с предыдущим состоянием. При сравнении находим
            // границы ректа, в котором произошли изменения, кроме того запоминаем измененные области.
            // В итоге новый фрейм обрезаем по границам ректа, а пикселы вне измененных областей мы делаем прозрачными.

            var oState = oDrawingBoard.Get_BoardState();
            var oCurStones = oState.Stones;
            var oCurMarks  = oState.Marks;

            if (0 === W || 0 === H)
            {
                W = oCanvas.width;
                H = oCanvas.height;
            }

            if (null === oStones || null === oMarks)
            {
                // Первый фрейм мы добавляем целиком
                oGifWriter.Add_ContextFrame(oContext, 0, 0, W, H, [{X0 : 0, Y0 : 0, X1 : W, Y1 : H}]);
            }
            else
            {
                var oChangedAreas = {};
                for (var nPos in oCurMarks)
                    oChangedAreas[nPos] = oCurMarks[nPos];

                for (var nPos in oMarks)
                {
                    if (undefined !== oChangedAreas[nPos] && (false === oChangedAreas[nPos] || false === oMarks[nPos]))
                        oChangedAreas[nPos] = false;
                    else
                        oChangedAreas[nPos] = oMarks[nPos];
                }

                for (var nPos in oStones)
                {
                    if (oStones[nPos] !== oCurStones[nPos] && false !== oChangedAreas[nPos])
                        oChangedAreas[nPos] = true;
                }

                // Теперь для всех найденных измененных точке высчитаем области, которые нужно перерисовать
                var aAreas = [];
                for (var nPos in oChangedAreas)
                {
                    var oPos = Common_ValuetoXY(nPos);
                    var oArea = oDrawingBoard.Get_BoardAreaByPosition(oPos.X, oPos.Y, oDrawingBoard.private_GetSettings_Shadows(), oChangedAreas[nPos]);
                    if (null !== oArea)
                        aAreas.push(oArea);
                }

                if (aAreas.length > 0)
                {
                    // Найдем общие границы всех измененных участков
                    var X0 = W, Y0 = H, X1 = 0, Y1 = 0;
                    for (var nIndex = 0, nCount = aAreas.length; nIndex < nCount; nIndex++)
                    {
                        var oArea = aAreas[nIndex];

                        if (oArea.X0 < X0)
                            X0 = oArea.X0;

                        if (oArea.Y0 < Y0)
                            Y0 = oArea.Y0;

                        if (oArea.X1 > X1)
                            X1 = oArea.X1;

                        if (oArea.Y1 > Y1)
                            Y1 = oArea.Y1;
                    }

                    oGifWriter.Add_ContextFrame(oContext, X0, Y0, X1 - X0, Y1 - Y0, aAreas);
                }
                else
                    oGifWriter.Add_ContextFrame(oContext, 0, 0, W, H, []);
            }

            oStones = oState.Stones;
            oMarks  = oState.Marks;
        }

        if (null !== oGifWindow)
            oGifWindow.On_Progress(Math.min(100, nCurrentFrame / nOverallFramesCount * 100));

        if (nCurrentFrame < nOverallFramesCount)
        {
            if (true === bUseTimeout)
                setTimeout(TimerFunction, 10);
            else
                TimerFunction();
        }
        else
        {
            if (oGifWindow)
                oGifWindow.On_End();

            oGifWriter.Finish();


            var sGameName = oThis.Get_GameName();
            if ("" === sGameName)
                sGameName = oThis.Get_WhiteName() + " vs. " + oThis.Get_BlackName();
            if ("" === sGameName)
                sGameName = "download";

            sGameName += ".gif";

            var oBlob = new Blob([oGifWriter.Get_Stream().Get_Bytes()], {type: "image/gif"});
            Common.SaveAs(oBlob, sGameName);

            // Возвращаемся к ноде, в которой мы были изначально.
            oThis.m_nGifId = null;
            oDrawingBoard.Set_BlackWhiteLastMark(false);
            oThis.GoTo_Node(oStartNode, true);
        }
    };

    if (true === bUseTimeout)
        setTimeout(TimerFunction, 10);
    else
        TimerFunction();
};
CGameTree.prototype.private_SendCallback = function(pCallback)
{
    // Не посылаем сообщения, когда создается Gif изображение
    if (null !== this.m_nGifId)
        return;

    if (pCallback)
        pCallback();
};
CGameTree.prototype.Toggle_Sound = function(bSound, bLocal)
{
    g_oGlobalSettings.Set_Sound(bSound);
};
CGameTree.prototype.Is_SoundOn = function()
{
    return g_oGlobalSettings.Is_SoundOn();
};
CGameTree.prototype.Set_LoadUnfinishedFilesOnLastNode = function(Value)
{
    g_oGlobalSettings.Set_LoadUnfinishedFilesOnLastNode(Value);
};
CGameTree.prototype.Is_LoadUnfinishedFilesOnLastNode = function()
{
    if (this.m_oDrawing && EDrawingTemplate.Problems === this.m_oDrawing.Get_TemplateType())
        return false;

    return g_oGlobalSettings.Is_LoadUnfinishedFilesOnLastNode();
};
CGameTree.prototype.Is_ShowTarget = function()
{
    return g_oGlobalSettings.Is_ShowTarget();
};
CGameTree.prototype.Set_ShowTarget = function(Value, bFromApi)
{
    if (true === bFromApi)
    {
        this.m_oSettings.Set_ShowTarget(Value);
    }
    else
    {
        g_oGlobalSettings.Set_ShowTarget(Value);
    }


    if (this.m_oDrawingBoard)
        this.m_oDrawingBoard.Update_Target();
};
CGameTree.prototype.Is_CycleThroughVariants = function()
{
    return g_oGlobalSettings.Is_CycleThroughVariants();
};
CGameTree.prototype.Set_CycleThroughVariants = function(Value)
{
    g_oGlobalSettings.Set_CycleThroughVariants(Value);
    this.Update_InterfaceState();
};
CGameTree.prototype.Get_NavigatorLabel = function()
{
    return g_oGlobalSettings.Get_NavigatorLabel();
};
CGameTree.prototype.Set_NavigatorLabel = function(eValue)
{
    if (eValue !== this.Get_NavigatorLabel())
    {
        g_oGlobalSettings.Set_NavigatorLabel(eValue);

        if (this.m_oDrawingNavigator)
            this.m_oDrawingNavigator.Update();
    }
};
CGameTree.prototype.Get_LoadShowVariants = function()
{
    return g_oGlobalSettings.Get_LoadShowVariants();
};
CGameTree.prototype.Set_LoadShowVariants = function(eValue)
{
    if (eValue !== this.Get_LoadShowVariants())
    {
        g_oGlobalSettings.Set_LoadShowVariants(eValue);
    }
};
CGameTree.prototype.Is_Unfinished = function()
{
    if ("" === this.m_sResult || null === this.m_sResult || undefined === this.m_sResult)
        return true;

    return false;
};
CGameTree.prototype.Add_ColorMark = function(X, Y, Color)
{
    this.m_oCurNode.Add_ColorMark(X, Y, Color);

    if (this.m_oDrawing)
        this.m_oDrawing.Update_ColorsCounter();
};
CGameTree.prototype.Remove_ColorMark = function(X, Y)
{
    this.m_oCurNode.Remove_ColorMark(X, Y);

    if (this.m_oDrawing)
        this.m_oDrawing.Update_ColorsCounter();
};
CGameTree.prototype.Remove_AllColorMarks = function()
{
    this.m_oCurNode.Remove_AllColorMarks();
    if (this.m_oDrawing)
        this.m_oDrawing.Update_ColorsCounter();
};
CGameTree.prototype.Copy_ColorMapFromPrevNode = function()
{
    this.m_oCurNode.Copy_ColorMapFromPrevNode();

    if (this.m_oDrawingBoard)
        this.m_oCurNode.Draw_ColorMap(this.m_oDrawingBoard);

    if (this.m_oDrawing)
        this.m_oDrawing.Update_ColorsCounter();

};
CGameTree.prototype.Get_MoveReference = function(bStrong)
{
    var oCurNode = this.Get_CurNode();
    var oEndNode = oCurNode;

    var oStream = new CStreamWriter();
    oStream.Write_String("GBMR"); // GoBoard Move Reference (сигнатура)

    if (false !== bStrong)
    {
        while (!oCurNode.Is_FromFile())
        {
            var oPrev = oCurNode.Get_Prev();
            if (null === oPrev)
                return "";

            oCurNode = oPrev;
        }

        oStream.Write_Short(1);       // версия
        oStream.Write_String2(oCurNode.Get_Id());

        // Значит добавленный вариант, которого не было в исходном файле
        if (oCurNode !== oEndNode)
        {
            oStream.Write_Byte(0x01);

            var aNodes       = [];
            var oTempCurNode = oEndNode;

            while (oTempCurNode !== oCurNode)
            {
                aNodes.splice(0, 0, oTempCurNode);
                oTempCurNode = oTempCurNode.Get_Prev();
            }

            oStream.Write_Long(aNodes.length);
            for (var nIndex = 0, nCount = aNodes.length; nIndex < nCount; nIndex++)
            {
                var oNode = aNodes[nIndex];
                oStream.Write_Short(0x01); // Начало ноды

                // Мы записываем только команды добавления камней и ходов
                var nStartPos = oStream.Get_CurPosition();
                oStream.Skip(4);

                var nWrittenCommansCount = 0;
                for (var CommandIndex = 0, CommandsCount = oNode.Get_CommandsCount(); CommandIndex < CommandsCount; CommandIndex++)
                {
                    var Command       = oNode.Get_Command(CommandIndex);
                    var Command_Type  = Command.Get_Type();
                    var Command_Value = Command.Get_Value();
                    var Command_Count = Command.Get_Count();

                    // Начало всегда такое
                    // Short : тип команды
                    // Long  : длина бинарника под данную команду

                    switch (Command_Type)
                    {
                        case ECommand.B:
                        {
                            oStream.Write_Short(0x10); // B
                            oStream.Write_Long(4);
                            oStream.Write_Long(Command_Value);
                            nWrittenCommansCount++;
                            break;
                        }
                        case ECommand.W:
                        {
                            oStream.Write_Short(0x11); // W
                            oStream.Write_Long(4);
                            oStream.Write_Long(Command_Value);
                            nWrittenCommansCount++;
                            break;
                        }
                        case ECommand.AB:
                        case ECommand.AW:
                        case ECommand.AE:
                        {
                            switch (Command_Type)
                            {
                                case ECommand.AB:
                                    oStream.Write_Short(0x20);
                                    break;
                                case ECommand.AW:
                                    oStream.Write_Short(0x21);
                                    break;
                                case ECommand.AE:
                                    oStream.Write_Short(0x22);
                                    break;
                            }

                            oStream.Write_Long(4 * (Command_Count + 1));
                            oStream.Write_Long(Command_Count);

                            for (var Index = 0; Index < Command_Count; Index++)
                                oStream.Write_Long(Command_Value[Index]);

                            nWrittenCommansCount++;
                            break;
                        }
                    }
                }

                var nEndPos = oStream.Get_CurPosition();
                oStream.Seek(nStartPos);
                oStream.Write_Long(nWrittenCommansCount);
                oStream.Seek(nEndPos);
                oStream.Write_Short(0x00);
            }
        }
        else
            oStream.Write_Byte(0x00);
    }
    else
    {
        oStream.Write_Short(2);       // версия

        var nCountPos = oStream.Get_CurPosition();
        oStream.Skip(4);

        var oCurNode = this.Get_FirstNode();
        var nCount = 0;
        while (oCurNode !== oEndNode && oCurNode.Get_NextsCount() > 0)
        {
            nCount++;
            oStream.Write_Long(oCurNode.Get_NextCur());
            oCurNode = oCurNode.Get_Next();
        }

        var nEndPos = oStream.Get_CurPosition();
        oStream.Seek(nCountPos);
        oStream.Write_Long(nCount);
        oStream.Seek(nEndPos);
    }

    return Common.Encode_Base64_UrlSafe(oStream.Get_Bytes());
};
CGameTree.prototype.GoTo_MoveReference = function(sReference)
{
    var oFirstNode = this.Get_FirstNode();

    var aBytes = Common.Decode_Base64_UrlSafe(sReference);
    var oReader = new CStreamReader(aBytes, aBytes.length);
    var sSign = oReader.Get_String(4);

    if ("GBMR" !== sSign)
        return this.GoTo_Node(oFirstNode);

    var nVersion = oReader.Get_Short();
    if (1 === nVersion)
    {
        var sId = oReader.Get_String2();

        var oNode = oFirstNode.Get_NodeById(sId);

        if (null !== oNode)
        {
            var bUserVariant = oReader.Get_Byte();

            this.Set_CurNode(oNode);

            if (0x01 === bUserVariant)
            {
                var nUserNodesCount = oReader.Get_Long();
                for (var nIndex = 0; nIndex < nUserNodesCount; nIndex++)
                {
                    if (0x01 !== oReader.Get_Short())
                        break;

                    this.Add_NewNode(false, false);

                    var nCommandsCount = oReader.Get_Long();
                    for (var nCommandIndex = 0; nCommandIndex < nCommandsCount; nCommandIndex++)
                    {
                        var nCommandType = oReader.Get_Short();
                        var nCommandLen  = oReader.Get_Long();

                        switch (nCommandType)
                        {
                            case 0x10:
                            {
                                var oPos = Common_ValuetoXY(oReader.Get_Long());
                                this.Add_Move(oPos.X, oPos.Y, BOARD_BLACK);
                                break;
                            }
                            case 0x11:
                            {
                                var oPos = Common_ValuetoXY(oReader.Get_Long());
                                this.Add_Move(oPos.X, oPos.Y, BOARD_WHITE);
                                break;
                            }
                            case 0x20:
                            case 0x21:
                            case 0x22:
                            {

                                var Value = BOARD_BLACK;
                                switch (nCommandType)
                                {
                                    case 0x20:
                                        Value = BOARD_BLACK;
                                        break;
                                    case 0x21:
                                        Value = BOARD_WHITE;
                                        break;
                                    case 0x22:
                                        Value = BOARD_EMPTY;
                                        break;
                                }

                                var nPointsCount = oReader.Get_Long();

                                var arrPos = [];
                                for (var nPointIndex = 0; nPointIndex < nPointsCount; nPointIndex++)
                                    arrPos.push(oReader.Get_Long());

                                this.AddOrRemove_Stones(Value, arrPos);

                                break;
                            }
                            default  :
                            {
                                oReader.Skip(nCommandLen);
                                break;
                            }
                        }
                    }

                    oReader.Get_Short(); // 0x00
                    oNode = this.Get_CurNode();

                    if (this.m_oDrawingNavigator)
                    {
                        this.m_oDrawingNavigator.Create_FromGameTree();
                        this.m_oDrawingNavigator.Update();
                    }
                }
            }

            this.GoTo_Node(oNode, true);
        }
        else
            this.GoTo_Node(oFirstNode, true);
    }
    else if (2 === nVersion)
    {
        var nCount = oReader.Get_Long();
        var oCurNode = oFirstNode;
        for (var nIndex = 0; nIndex < nCount; nIndex++)
        {
            var nNextCur = oReader.Get_Long();
            if (nNextCur < 0 || nNextCur >= oCurNode.Get_NextsCount() || oCurNode.Get_NextsCount() <= 0)
                break;

            oCurNode = oCurNode.Get_Next(nNextCur);
        }

        this.GoTo_Node(oCurNode, true);
    }
};
CGameTree.prototype.Make_CurrentVariantMainly = function()
{
    // Делаем текущий вариант основным
    this.m_oFirstNode.Make_CurrentVariantMainly();

    if (this.m_oDrawingNavigator)
    {
        this.m_oDrawingNavigator.Create_FromGameTree();
        this.m_oDrawingNavigator.Update();
        this.m_oDrawingNavigator.Update_Current(true);
    }
};
CGameTree.prototype.Move_Variant = function(nCount)
{
    this.m_oCurNode.Move_Variant(nCount);

    if (this.m_oDrawingNavigator)
    {
        this.m_oDrawingNavigator.Create_FromGameTree();
        this.m_oDrawingNavigator.Update();
        this.m_oDrawingNavigator.Update_Current(true);
    }
};
CGameTree.prototype.Toggle_Rulers = function()
{
    if (this.m_oDrawingBoard)
    {
        this.m_oDrawingBoard.Set_Rulers(!this.m_oDrawingBoard.Get_Rulers());
    }
};
CGameTree.prototype.Set_Handler = function(oHandler)
{
    this.m_oHandler = oHandler;
};
CGameTree.prototype.Get_Handler = function()
{
    return this.m_oHandler;
};
CGameTree.prototype.GoTo_NodeById = function(sNodeId)
{
    var oFirstNode = this.Get_FirstNode();
    var oNode = oFirstNode.Get_NodeById(sNodeId);

    if (null !== oNode)
        this.GoTo_Node(oNode);
};
CGameTree.prototype.GoTo_NodeByMoveNumber = function(nMoveNumber)
{
    var oFirstNode = this.Get_FirstNode();
    var oNode = oFirstNode.Get_NodeByMoveNumber(nMoveNumber);

    if (null !== oNode)
        this.GoTo_Node(oNode);
};
CGameTree.prototype.Get_DivHeightByWidth = function(nWidth)
{
    if (this.m_oDrawing)
        return this.m_oDrawing.Get_DivHeightByWidth(nWidth);

    return 0;
};
CGameTree.prototype.Set_Modified = function(bModified)
{
    this.m_bModified = bModified;
};
CGameTree.prototype.Is_Modified = function()
{
    return this.m_bModified;
};
CGameTree.prototype.Get_LocalSettings = function()
{
    return this.m_oSettings;
};
CGameTree.prototype.Set_LocalColorScheme = function(eScheme)
{
    var oResult = this.m_oSettings.Set_ColorScheme(eScheme);

    if (true === oResult.Board && this.m_oDrawingBoard)
        this.m_oDrawingBoard.Update_Size(true);

    if (this.m_oDrawingNavigator && true === oResult.Navigator)
        this.m_oDrawingNavigator.Update_All();
};
CGameTree.prototype.Get_LogicBoardForKifu = function()
{
    var oCurNode = this.Get_CurNode();

    var oNode = this.Get_FirstNode();
    this.GoTo_Node(oNode);

    var oKifu = new CKifuLogicBoard();
    oKifu.Load_FromNode(this.Get_Board(), oNode);

    this.GoTo_Node(oCurNode);

    return oKifu;
};
CGameTree.prototype.Start_KifuMode = function()
{
    this.m_nKifuEditFlags = this.m_nEditingFlags;
    this.Forbid_All();
    this.Set_EditingFlags({Move : true});

    this.GoTo_MainVariant();

    this.m_bKifuMode = true;

    if (this.m_oDrawing)
        this.m_oDrawing.Update_KifuMode();
};
CGameTree.prototype.Stop_KifuMode = function()
{
    this.m_nEditingFlags = this.m_nKifuEditFlags;
    this.m_bKifuMode = false;

    if (this.m_oDrawing)
        this.m_oDrawing.Update_KifuMode();
};
CGameTree.prototype.Is_KifuMode = function()
{
    return this.m_bKifuMode;
};

function CMatchCommandMove()
{
    this.m_nColor = BOARD_EMPTY;
    this.m_nPos   = 0;
}

function CMatchCommandComment()
{
    this.m_sAuthor  = "";
    this.m_sComment = "";
}

function CMatchCommandPass()
{
    this.m_nColor = BOARD_EMPTY;
}

function CMatchCommnadResign()
{
    this.m_nColor = BOARD_EMPTY;
}

function CMatchMode()
{
    this.m_bMode     = false;
    this.m_nColor    = BOARD_EMPTY;
    this.m_sStartSgf = "";
    this.m_aCommands = [];
}