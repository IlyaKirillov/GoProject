"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     27.11.14
 * Time     23:15
 */

function CDrawing(oGameTree)
{
    this.m_oGameTree = oGameTree;

    if (oGameTree)
        oGameTree.Set_Drawing(this);

    this.m_oControl = null;
    this.m_aElements = [];

    // Массивы с ссылками на кнопки заданного типа
    this.m_oButtons =
    {
        BackwardToStart : [],
        Backward_5      : [],
        Backward        : [],
        Forward         : [],
        Forward_5       : [],
        ForwardToEnd    : [],
        NextVariant     : [],
        PrevVariant     : [],

        BoardModeMove   : [],
        BoardModeScores : [],
        BoardModeEditor : [],
        BoardModeTr     : [],
        BoardModeSq     : [],
        BoardModeCr     : [],
        BoardModeX      : [],
        BoardModeText   : [],
        BoardModeNum    : []
    };

    // Массив ссылок на окна с комментариями
    this.m_aComments = [];
};
CDrawing.prototype.Create_SimpleBoard = function(sDivId)
{
    var DrawingBoard = new CDrawingBoard();
    DrawingBoard.Init(sDivId, this.m_oGameTree);
    DrawingBoard.Focus();

    this.m_aElements.push(DrawingBoard);

    this.Update_Size();
};
CDrawing.prototype.Create_BoardWithNavigateButtons = function(sDivId)
{
    var oGameTree = this.m_oGameTree;

    var oMainControl = CreateControlContainer(sDivId);
    this.private_CreateDiv(oMainControl.HtmlElement, sDivId + "div");

    var H = 25;
    var oControl = CControlContainerBoardAndBottomButtons.Create(sDivId + "div");
    oControl.Set(H);
    var oMainElement = oControl.HtmlElement;
    oMainControl.AddControl(oControl);

    var sBoardDivId    = sDivId + "_Board";
    var sToolbaDivId   = sDivId + "_Toolbar";

    this.private_CreateDiv(oMainElement, sBoardDivId);
    this.private_CreateDiv(oMainElement, sToolbaDivId);

    var oBoardControl = CreateControlContainer(sBoardDivId);
    oBoardControl.Bounds.SetParams(0, 0, 1000, H, false, false, false, true, -1, -1);
    oBoardControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oControl.AddControl(oBoardControl);

    var oDrawingBoard = new CDrawingBoard();
    oDrawingBoard.Init(sBoardDivId, oGameTree);
    oDrawingBoard.Focus();

    var oToolbarControl = CreateControlContainer(sToolbaDivId);
    oToolbarControl.Bounds.SetParams(0, 0, 1000, 0, false, false, false, true, -1, H);
    oToolbarControl.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
    oControl.AddControl(oToolbarControl);

    var oDrawingToolbar = new CDrawingToolbar(this);
    oDrawingToolbar.Init(sToolbaDivId, oGameTree, {Controls : [EDrawingButtonType.BackwardToStart, EDrawingButtonType.Backward_5, EDrawingButtonType.Backward, EDrawingButtonType.Forward, EDrawingButtonType.Forward_5, EDrawingButtonType.ForwardToEnd, EDrawingButtonType.NextVariant,
        EDrawingButtonType.PrevVariant, EDrawingButtonType.EditModeMove, EDrawingButtonType.EditModeScores, EDrawingButtonType.EditModeAddRem, EDrawingButtonType.EditModeTr, EDrawingButtonType.EditModeSq, EDrawingButtonType.EditModeCr, EDrawingButtonType.EditModeX, EDrawingButtonType.EditModeText, EDrawingButtonType.EditModeNum]});

    this.m_oControl = oMainControl;
    this.m_aElements.push(oDrawingBoard);
    this.m_aElements.push(oDrawingToolbar);

    this.Update_Size();
};
CDrawing.prototype.Update_Size = function()
{
    if (this.m_oControl)
    {
        var W = this.m_oControl.HtmlElement.clientWidth;
        var H = this.m_oControl.HtmlElement.clientHeight;

        this.m_oControl.Resize(W, H);
    }

    for (var Index = 0, Count = this.m_aElements.length; Index < Count; Index++)
        this.m_aElements[Index].Update_Size();
};
CDrawing.prototype.private_CreateDiv = function(oParent, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParent.appendChild(oElement);
    return oElement;
};
CDrawing.prototype.Register_BackwardToStartButton = function(oButton)
{
    this.m_oButtons.BackwardToStart.push(oButton);
};
CDrawing.prototype.Register_Backward_5Button = function(oButton)
{
    this.m_oButtons.Backward_5.push(oButton);
};
CDrawing.prototype.Register_BackwardButton = function(oButton)
{
    this.m_oButtons.Backward.push(oButton);
};
CDrawing.prototype.Register_ForwardButton = function(oButton)
{
    this.m_oButtons.Forward.push(oButton);
};
CDrawing.prototype.Register_Forward_5Button = function(oButton)
{
    this.m_oButtons.Forward_5.push(oButton);
};
CDrawing.prototype.Register_ForwardToEndButton = function(oButton)
{
    this.m_oButtons.ForwardToEnd.push(oButton);
};
CDrawing.prototype.Register_NextVariantButton = function(oButton)
{
    this.m_oButtons.NextVariant.push(oButton);
};
CDrawing.prototype.Register_PrevVariantButton = function(oButton)
{
    this.m_oButtons.PrevVariant.push(oButton);
};
CDrawing.prototype.Register_EditModeMoveButton = function(oButton)
{
    this.m_oButtons.BoardModeMove.push(oButton);
};
CDrawing.prototype.Register_EditModeScoresButton = function(oButton)
{
    this.m_oButtons.BoardModeScores.push(oButton);
};
CDrawing.prototype.Register_EditModeAddRemButton = function(oButton)
{
    this.m_oButtons.BoardModeEditor.push(oButton);
};
CDrawing.prototype.Register_EditModeTrButton = function(oButton)
{
    this.m_oButtons.BoardModeTr.push(oButton);
};
CDrawing.prototype.Register_EditModeSqButton = function(oButton)
{
    this.m_oButtons.BoardModeSq.push(oButton);
};
CDrawing.prototype.Register_EditModeCrButton = function(oButton)
{
    this.m_oButtons.BoardModeCr.push(oButton);
};
CDrawing.prototype.Register_EditModeXButton = function(oButton)
{
    this.m_oButtons.BoardModeX.push(oButton);
};
CDrawing.prototype.Register_EditModeTextButton = function(oButton)
{
    this.m_oButtons.BoardModeText.push(oButton);
};
CDrawing.prototype.Register_EditModeNumButton = function(oButton)
{
    this.m_oButtons.BoardModeNum.push(oButton);
};
CDrawing.prototype.Register_Comments = function(oComments)
{
    this.m_aComments.push(oComments);
};
CDrawing.prototype.Update_IntrefaceState = function(oIState)
{
    // Backward
    for (var Index = 0, Count = this.m_oButtons.BackwardToStart.length; Index < Count; Index++)
        this.m_oButtons.BackwardToStart[Index].Set_Enabled(oIState.Backward);

    for (var Index = 0, Count = this.m_oButtons.Backward_5.length; Index < Count; Index++)
        this.m_oButtons.Backward_5[Index].Set_Enabled(oIState.Backward);

    for (var Index = 0, Count = this.m_oButtons.Backward.length; Index < Count; Index++)
        this.m_oButtons.Backward[Index].Set_Enabled(oIState.Backward);

    // Forward
    for (var Index = 0, Count = this.m_oButtons.Forward.length; Index < Count; Index++)
        this.m_oButtons.Forward[Index].Set_Enabled(oIState.Forward);

    for (var Index = 0, Count = this.m_oButtons.Forward_5.length; Index < Count; Index++)
        this.m_oButtons.Forward_5[Index].Set_Enabled(oIState.Forward);

    for (var Index = 0, Count = this.m_oButtons.ForwardToEnd.length; Index < Count; Index++)
        this.m_oButtons.ForwardToEnd[Index].Set_Enabled(oIState.Forward);

    // NextVarianta
    for (var Index = 0, Count = this.m_oButtons.NextVariant.length; Index < Count; Index++)
        this.m_oButtons.NextVariant[Index].Set_Enabled(oIState.NextVariant);

    // PrevVarianta
    for (var Index = 0, Count = this.m_oButtons.PrevVariant.length; Index < Count; Index++)
        this.m_oButtons.PrevVariant[Index].Set_Enabled(oIState.PrevVariant);

    // BoardMode
    for (var Index = 0, Count = this.m_oButtons.BoardModeMove.length; Index < Count; Index++)
        this.m_oButtons.BoardModeMove[Index].Set_Selected(oIState.BoardMode === EBoardMode.Move);

    for (var Index = 0, Count = this.m_oButtons.BoardModeScores.length; Index < Count; Index++)
        this.m_oButtons.BoardModeScores[Index].Set_Selected(oIState.BoardMode === EBoardMode.CountScores);

    for (var Index = 0, Count = this.m_oButtons.BoardModeEditor.length; Index < Count; Index++)
        this.m_oButtons.BoardModeEditor[Index].Set_Selected(oIState.BoardMode === EBoardMode.AddRemove);

    for (var Index = 0, Count = this.m_oButtons.BoardModeTr.length; Index < Count; Index++)
        this.m_oButtons.BoardModeTr[Index].Set_Selected(oIState.BoardMode === EBoardMode.AddMarkTr);

    for (var Index = 0, Count = this.m_oButtons.BoardModeSq.length; Index < Count; Index++)
        this.m_oButtons.BoardModeSq[Index].Set_Selected(oIState.BoardMode === EBoardMode.AddMarkSq);

    for (var Index = 0, Count = this.m_oButtons.BoardModeCr.length; Index < Count; Index++)
        this.m_oButtons.BoardModeCr[Index].Set_Selected(oIState.BoardMode === EBoardMode.AddMarkCr);

    for (var Index = 0, Count = this.m_oButtons.BoardModeX.length; Index < Count; Index++)
        this.m_oButtons.BoardModeX[Index].Set_Selected(oIState.BoardMode === EBoardMode.AddMarkX);

    for (var Index = 0, Count = this.m_oButtons.BoardModeText.length; Index < Count; Index++)
        this.m_oButtons.BoardModeText[Index].Set_Selected(oIState.BoardMode === EBoardMode.AddMarkTx);

    for (var Index = 0, Count = this.m_oButtons.BoardModeNum.length; Index < Count; Index++)
        this.m_oButtons.BoardModeNum[Index].Set_Selected(oIState.BoardMode === EBoardMode.AddMarkNum);
};
CDrawing.prototype.Update_Comments = function(sComment)
{
    for (var Index = 0, Count = this.m_aComments.length; Index < Count; Index++)
        this.m_aComments[Index].Update_Comments(sComment);
};


function CDrawingFullInfo()
{
    this.m_oGameTree = null;

    this.HtmlElement =
    {
        Control  : null
    };
}

CDrawingFullInfo.prototype.Init = function()
{

};
CDrawingFullInfo.prototype.Update_Size = function()
{

};