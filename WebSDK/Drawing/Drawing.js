"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     27.11.14
 * Time     23:15
 */

var EColorScheme =
{
    Custom      : 0,
    TrueColor   : 1,
    BookStyle   : 2,
    SimpleColor : 3,
    Dark        : 4
};

var EDrawingTemplate =
{
    None        : 0,
    SimpleBoard : 1,
    Viewer      : 2,
    VerEditor   : 3,
    HorEditor   : 4,
    Problems    : 5,

    GoUniverseViewerHor : 21,
    GoUniverseViewerVer : 22,
    GoUniverseMatch     : 23
};

function CDrawing(oGameTree)
{
    this.m_oGameTree = oGameTree;

    if (oGameTree)
        oGameTree.Set_Drawing(this);

    this.m_oMainDiv        = null;
    this.m_oMainControl    = null;
    this.m_oDisableElement = null;

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
        Pass            : null,

        BoardModeMove   : [],
        BoardModeScores : [],
        BoardModeEditor : [],
        BoardModeTr     : [],
        BoardModeSq     : [],
        BoardModeCr     : [],
        BoardModeX      : [],
        BoardModeText   : [],
        BoardModeNum    : [],
        BoardModeColor  : [],

        ToolbarCustomize: null,
        Menu            : null,
        KifuMode        : null,
		EditorControl   : null
    };

    this.m_oWindows =
    {
        Kifu : null
    };

    this.m_oAddLabelElement = null;

    this.m_oBoard     = null;
    this.m_oNavigator = null;
    this.m_oTimeLine  = null;

    this.m_oAutoPlayButton = null;
    this.m_oAutoPlaySlider = null;

    this.m_oSelectBoardModeButton = null;

    this.m_oBlackInfo      = null;
    this.m_oWhiteInfo      = null;
    this.m_oViewerScores   = null;
    this.m_oViewerTitle    = null;

    // Массив ссылок на окна с комментариями
    this.m_aComments = [];

    var oThis = this;
    this.m_bNeedUpdateSize = true;

    this.m_eTemplateType       = EDrawingTemplate.None;
    this.m_bMixedTemplate      = false;
    this.m_nMixedTemplateIndex = -1;
    this.m_nMixedRightSide     = 400;
    this.m_nMixedBotSize       = 200;
    this.m_nMinWidth           = -1;

    this.m_nViewerTitleH   = 0;
    this.m_nViewerToolbarH = 0;

    this.m_nVerEditorTitleH   = 0;
    this.m_nVerEditorToolbarH = 0;
    this.m_nVerEditorComNavH  = 0;

    this.m_arrStateHandlers = [];
	this.m_nAnimationFrameTimer = null;

    this.private_OnMainDivClick = function()
    {
        if (oThis.m_oSelectBoardModeButton)
            oThis.m_oSelectBoardModeButton.Hide_Toolbar();

        if (oThis.m_oButtons.ToolbarCustomize)
            oThis.m_oButtons.ToolbarCustomize.Hide_ContextMenu(false);

        if (oThis.m_oButtons.Menu)
            oThis.m_oButtons.Menu.Hide_Menu(false);

		if (oThis.m_oButtons.EditorControl)
			oThis.m_oButtons.EditorControl.Hide_Menu(false);
    };
    this.private_OnTimerDraw = function()
    {
    	if (null !== oThis.m_nAnimationFrameTimer)
		{
			Common_CancelAnimationFrame(oThis.m_nAnimationFrameTimer);
			oThis.m_nAnimationFrameTimer = null;
		}

		oThis.m_nAnimationFrameTimer = Common_RequestAnimationFrame(oThis.private_OnTimerDraw);

        if (oThis.m_oNavigator && oThis.m_oNavigator.Need_Redraw())
        {
            oThis.m_oNavigator.Draw();
        }

        if (oThis.m_bNeedUpdateSize)
            oThis.private_UpdateSize(false);
    };

    this.private_OnTimerDraw();
}
CDrawing.prototype.OnDestroy = function()
{
	if (null !== this.m_nAnimationFrameTimer)
	{
		Common_CancelAnimationFrame(this.m_nAnimationFrameTimer);
		this.m_nAnimationFrameTimer = null;
	}

    if (this.m_oMainDiv)
        delete g_aWindows[this.m_oMainDiv.id];
};
CDrawing.prototype.Disable = function()
{
    if (this.m_oMainDiv)
    {
        var oDisable = document.createElement("div");
        oDisable.style.width           = "100%";
        oDisable.style.height          = "100%";
        oDisable.style.position        = "absolute";
        oDisable.style.left            = "0px";
        oDisable.style.top             = "0px";
        oDisable.style.backgroundColor = "rgb(0, 0, 0)";
        oDisable.style.opacity         = 0.4;

        this.m_oMainDiv.appendChild(oDisable);
        this.m_oDisableElement = oDisable;

        var oErrorWindow = g_aWindows[this.m_oMainDiv.id][EWindowType.Error];
        if (oErrorWindow)
            oErrorWindow = oErrorWindow.HtmlElement.Control.HtmlElement;

        if (Common.Is_NodeDescendant(this.m_oMainDiv, oErrorWindow, 0))
        {
            this.m_oMainDiv.removeChild(oErrorWindow);
            this.m_oMainDiv.appendChild(oErrorWindow);
        }
    }
};
CDrawing.prototype.Enable = function()
{
    if (this.m_oDisableElement)
    {
        this.m_oMainDiv.removeChild(this.m_oDisableElement);
        this.m_oDisableElement = null;
    }
};
CDrawing.prototype.Get_Width = function()
{
    if (this.m_oMainDiv)
        return parseInt(this.m_oMainDiv.clientWidth);

    return 0;
};
CDrawing.prototype.Get_Height = function()
{
    if (this.m_oMainDiv)
        return parseInt(this.m_oMainDiv.clientHeight);

    return 0;
};
CDrawing.prototype.Get_MainDiv = function()
{
    return this.m_oMainDiv;
};
CDrawing.prototype.Get_GameTree = function()
{
    return this.m_oGameTree;
};
CDrawing.prototype.Get_ElementOffset = function(oElement)
{
    var X = 0;
    var Y = 0;

    var _oElement = oElement;
    while (_oElement != this.m_oMainDiv && _oElement)
    {
        X += (_oElement.offsetLeft - _oElement.scrollLeft + _oElement.clientLeft);
        Y += (_oElement.offsetTop  - _oElement.scrollTop  + _oElement.clientTop);
        _oElement = _oElement.offsetParent;
    }

    return {X : X, Y : Y};
};
CDrawing.prototype.Set_TemplateType = function(eType)
{
    this.m_eTemplateType = eType;
};
CDrawing.prototype.Create_SimpleBoard = function(sDivId)
{
    this.Set_TemplateType(EDrawingTemplate.SimpleBoard);
    this.private_SetMainDiv(sDivId);

    var DrawingBoard = new CDrawingBoard(this);
    DrawingBoard.Init(sDivId, this.m_oGameTree);
    DrawingBoard.Focus();

    this.m_aElements.push(DrawingBoard);

    this.Update_Size();
};
CDrawing.prototype.Create_Viewer = function(sDivId)
{
    this.Set_TemplateType(EDrawingTemplate.Viewer);
    this.private_CreateWrappingMainDiv(sDivId);

    this.m_nMinWidth = 295;

    var oGameTree    = this.m_oGameTree;
    var oMainControl = this.m_oMainControl;
    var sMainDivId   = this.m_oMainDiv.id;

    var InfoH    = 25;
    var ToolbarH = 36;

    this.m_nViewerTitleH   = InfoH;
    this.m_nViewerToolbarH = ToolbarH;
    //------------------------------------------------------------------------------------------------------------------
    // Делим главную дивку на 3 части сверху 20px под информацию об игрока, снизу 36px под тулбар, а остальное для доски.
    //------------------------------------------------------------------------------------------------------------------
    var sInfoDivId = sMainDivId + "I";
    this.private_CreateDiv(oMainControl.HtmlElement, sInfoDivId);

    var oInfoControl = CreateControlContainer(sInfoDivId);
    oInfoControl.Bounds.SetParams(0, 0, 1000, 0, false, false, false, false, -1, InfoH);
    oInfoControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oInfoControl);
    //------------------------------------------------------------------------------------------------------------------
    // Информация
    //------------------------------------------------------------------------------------------------------------------
    var sScoresInfo = sInfoDivId + "S";
    this.private_CreateDiv(oInfoControl.HtmlElement, sScoresInfo);
    var oScoresInfoControl = CreateControlContainer(sScoresInfo);
    oScoresInfoControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, 122, -1);
    oScoresInfoControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom);
    oInfoControl.AddControl(oScoresInfoControl);

    this.m_oViewerScores = new CDrawingViewerScores(this);
    this.m_oViewerScores.Init(sScoresInfo, oGameTree);
    this.m_aElements.push(this.m_oViewerScores);

    var sTitleInfo = sInfoDivId + "T";
    this.private_CreateDiv(oInfoControl.HtmlElement, sTitleInfo);
    var oTitleInfoControl = CreateControlContainer(sTitleInfo);
    oTitleInfoControl.Bounds.SetParams(122, 0, 1000, 1000, true, false, false, false, -1, -1);
    oTitleInfoControl.Anchor = (g_anchor_top | g_anchor_right | g_anchor_bottom);
    oInfoControl.AddControl(oTitleInfoControl);

    this.m_oViewerTitle = new CDrawingViewerTitle(this);
    this.m_oViewerTitle.Init(sTitleInfo, oGameTree);
    this.m_aElements.push(this.m_oViewerTitle);
    //------------------------------------------------------------------------------------------------------------------
    // Тулбар
    //------------------------------------------------------------------------------------------------------------------
    var sToolbarDivId = sMainDivId + "T";
    this.private_CreateDiv(oMainControl.HtmlElement, sToolbarDivId);

    var oToolbarControl = CreateControlContainer(sToolbarDivId);
    oToolbarControl.Bounds.SetParams(0, 0, 1000, 0, false, false, false, true, -1, ToolbarH);
    oToolbarControl.Anchor = (g_anchor_bottom | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oToolbarControl);

    var oDrawingToolbar = new CDrawingToolbar(this);

    oDrawingToolbar.Add_Control(new CDrawingButtonBackwardToStart(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonBackward5(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonBackward(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonForward(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonForward5(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonForwardToEnd(this), 36, 1, EToolbarFloat.Left);

    oDrawingToolbar.Add_Control(new CDrawingButtonAbout(this), 36, 1, EToolbarFloat.Right);
    oDrawingToolbar.Add_Control(new CDrawingButtonGameInfo(this), 36, 1, EToolbarFloat.Right);

    oDrawingToolbar.Init(sToolbarDivId, oGameTree);
    this.m_aElements.push(oDrawingToolbar);
    //------------------------------------------------------------------------------------------------------------------
    // Доска
    //------------------------------------------------------------------------------------------------------------------
    var sBoardDivId = sMainDivId + "B";
    var oBoardElement = this.private_CreateDiv(oMainControl.HtmlElement, sBoardDivId);

    var oBoardControl = CreateControlContainer(sBoardDivId);
    oBoardControl.Bounds.SetParams(0, InfoH, 1000, ToolbarH, false, true, false, true, -1, -1);
    oBoardControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
    oMainControl.AddControl(oBoardControl);

    var sBoardDivId2 = sBoardDivId + "B";
    this.private_CreateDiv(oBoardElement, sBoardDivId2);
    var oBoardControl2 = CreateControlContainer(sBoardDivId2);
    oBoardControl.AddControl(oBoardControl2);

    var sBoardDivId3 = sBoardDivId + "N";
    this.private_CreateDiv(oBoardElement, sBoardDivId3);
    var oBoardControl3 = CreateControlContainer(sBoardDivId3);
    oBoardControl.AddControl(oBoardControl3);

    var oDrawingBoard = new CDrawingBoard(this);
    oDrawingBoard.Init(sBoardDivId2, this.m_oGameTree);
    oDrawingBoard.Focus();
    this.m_aElements.push(oDrawingBoard);
    oBoardControl.Set_Type(3, oDrawingBoard, {RMin : 0});
    //------------------------------------------------------------------------------------------------------------------
    this.Update_Size();
    oGameTree.On_EndLoadDrawing();
};
CDrawing.prototype.Create_BoardWithNavigateButtons = function(sDivId)
{
    g_oGlobalSettings.Load_FromLocalStorage();

    this.m_nMinWidth = 739;

    this.private_SetMainDiv(sDivId);
    var oGameTree = this.m_oGameTree;

    var oMainControl = CreateControlContainer(sDivId);
    this.private_CreateDiv(oMainControl.HtmlElement, sDivId + "div");

    var H = 36;
    var oControl = CControlContainerBoardAndBottomButtons.Create(sDivId + "div");
    oControl.Set(H + 2);
    var oMainElement = oControl.HtmlElement;
    oMainControl.AddControl(oControl);

    var sBoardDivId        = sDivId + "_Board";
    var sToolbarPanelDivId = sDivId + "_ToolbarPanel";
    var sToolbarDivId      = sDivId + "_Toolbar";

    this.private_CreateDiv(oMainElement, sBoardDivId);
    var oToolbarPanelElement = this.private_CreateDiv(oMainElement, sToolbarPanelDivId);
    oToolbarPanelElement.style.background = "rgb(217, 217, 217)";
    this.private_CreateDiv(oToolbarPanelElement, sToolbarDivId);

    var oBoardControl = CreateControlContainer(sBoardDivId);
    oBoardControl.Bounds.SetParams(0, 0, 1000, H + 2, false, false, false, true, -1, -1);
    oBoardControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oControl.AddControl(oBoardControl);

    var oDrawingBoard = new CDrawingBoard(this);
    oDrawingBoard.Init(sBoardDivId, oGameTree);
    oDrawingBoard.Focus();

    var oToolbarPanelControl = CreateControlContainer(sToolbarPanelDivId);
    oToolbarPanelControl.Bounds.SetParams(0, 0, 1000, 0, false, false, false, true, -1, H + 2);
    oToolbarPanelControl.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
    oControl.AddControl(oToolbarPanelControl);

    var oToolbarControl = CreateControlContainer(sToolbarDivId);
    oToolbarControl.Bounds.SetParams(0, 1, 1000, 1, false, true, false, true, -1, -1);
    oToolbarControl.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
    oToolbarPanelControl.AddControl(oToolbarControl);

    var oDrawingToolbar = new CDrawingToolbar(this);

    oDrawingToolbar.Add_Control(new CDrawingButtonBackwardToStart(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonBackward5(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonBackward(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonForward(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonForward5(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonForwardToEnd(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonNextVariant(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonPrevVariant(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonEditModeMove(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonEditModeScores(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonEditModeAddRem(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonEditModeTr(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonEditModeSq(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonEditModeCr(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonEditModeX(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonEditModeText(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonEditModeNum(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonGameInfo(this), 36, 1, EToolbarFloat.Left);

    oDrawingToolbar.Add_Control(new CDrawingButtonAbout(this), 36, 1, EToolbarFloat.Right);
    oDrawingToolbar.Add_Control(new CDrawingButtonSettings(this), 36, 1, EToolbarFloat.Right);

    oDrawingToolbar.Init(sToolbarDivId, oGameTree);

    this.m_oControl = oMainControl;
    this.m_aElements.push(oDrawingBoard);
    this.m_aElements.push(oDrawingToolbar);

    this.Update_Size();
};
CDrawing.prototype.Create_MixedFullTemplate = function(sDivId)
{
    this.m_bMixedTemplate = true;
    this.m_nMixedRightSide = 400;
    this.m_nMixedBotSize   = 200;
    this.private_CreateWrappingMainDiv(sDivId);
    this.private_UpdateSize(true);
};
CDrawing.prototype.Create_HorizontalFullTemplate = function(sDivId)
{
    this.m_bMixedTemplate = false;
    this.private_CreateWrappingMainDiv(sDivId);
    this.private_CreateHorFullTemplate();
    this.Set_TemplateType(EDrawingTemplate.HorEditor);
};
CDrawing.prototype.Create_VerticalFullTemplate = function(sDivId)
{
    this.m_bMixedTemplate = false;
    this.private_CreateWrappingMainDiv(sDivId);
    this.private_CreateVerFullTemplate();
    this.Set_TemplateType(EDrawingTemplate.VerEditor);
};
CDrawing.prototype.Create_VerticalSpecialTemplate_1 = function(sDivId)
{
	this.private_CreateWrappingMainDiv(sDivId);

	this.m_nMinWidth = 332;

	var oGameTree    = this.m_oGameTree;
	var oMainControl = this.m_oMainControl;
	var sMainDivId   = this.m_oMainDiv.id;
	var bIsEmbedding = oGameTree.Get_LocalSettings().Is_Embedding();
	//------------------------------------------------------------------------------------------------------------------
	// Делим главную дивку на 2 части сверху 50px под информацию об игрока, а снизу все остальное.
	//------------------------------------------------------------------------------------------------------------------
	var InfoH    = 50;

	var sInfoBackDivId = sMainDivId + "B";
	this.private_CreateDiv(oMainControl.HtmlElement, sInfoBackDivId).style.background = "rgb(217, 217, 217)";;
	var oInfoControlBack = CreateControlContainer(sInfoBackDivId);
	oInfoControlBack.Bounds.SetParams(0, 0, 1000, 0, true, false, false, false, -1, InfoH);
	oInfoControlBack.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
	oMainControl.AddControl(oInfoControlBack);

	var sInfoDivId = sMainDivId + "I";
	this.private_CreateDiv(oMainControl.HtmlElement, sInfoDivId);
	//------------------------------------------------------------------------------------------------------------------
	// Добавляем кнопку меню слева.
	//------------------------------------------------------------------------------------------------------------------
	var oInfoControl = CreateControlContainer(sInfoDivId);
	oInfoControl.Bounds.SetParams(true !== bIsEmbedding ? 36 + 7 : 0, 0, 1000, 0, true, false, false, false, -1, InfoH);
	oInfoControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
	oMainControl.AddControl(oInfoControl);

	var sNotInfoDivId = sMainDivId + "O";
	this.private_CreateDiv(oMainControl.HtmlElement, sNotInfoDivId);
	var oNotInfoControl = CreateControlContainer(sNotInfoDivId);
	oNotInfoControl.Bounds.SetParams(0, InfoH, 1000, 1000, false, true, false, false, -1, -1);
	oNotInfoControl.Anchor = (g_anchor_bottom | g_anchor_left | g_anchor_right);
	oMainControl.AddControl(oNotInfoControl);
	//------------------------------------------------------------------------------------------------------------------
	// Заполняем контрол с информацией (слева информация о белом, справ о черном).
	//------------------------------------------------------------------------------------------------------------------
	var sWhiteInfo = sInfoDivId + "W";
	this.private_CreateDiv(oInfoControl.HtmlElement, sWhiteInfo);
	var oInfoWhiteControl = CreateControlContainer(sWhiteInfo);
	oInfoWhiteControl.Bounds.SetParams(0, 0, 500, 1000, false, false, false, false, -1, -1);
	oInfoWhiteControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
	oInfoControl.AddControl(oInfoWhiteControl);
	var oDrawingWhiteInfo = new CDrawingPlayerInfo(this);
	oDrawingWhiteInfo.Init(sWhiteInfo, oGameTree, BOARD_WHITE);
	this.m_aElements.push(oDrawingWhiteInfo);

	var sBlackInfo = sInfoDivId + "B";
	this.private_CreateDiv(oInfoControl.HtmlElement, sBlackInfo);
	var oInfoBlackControl = CreateControlContainer(sBlackInfo);
	oInfoBlackControl.Bounds.SetParams(500, 0, 1000, 1000, false, false, false, false, -1, -1);
	oInfoBlackControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
	oInfoControl.AddControl(oInfoBlackControl);
	var oDrawingBlackInfo = new CDrawingPlayerInfo(this);
	oDrawingBlackInfo.Init(sBlackInfo, oGameTree, BOARD_BLACK);
	this.m_aElements.push(oDrawingBlackInfo);
	//------------------------------------------------------------------------------------------------------------------
	// Нижний контрол будет специального типа, вверху у него место под доску, внизу под все остальное.
	//------------------------------------------------------------------------------------------------------------------
	var oDrawingBoard = new CDrawingBoard(this);
	this.m_aElements.push(oDrawingBoard);
	oNotInfoControl.Set_Type(3, oDrawingBoard, {RMin : this.m_nMixedBotSize - 50});
	var sBoardDivId = sNotInfoDivId  + "B";
	this.private_CreateDiv(oNotInfoControl.HtmlElement, sBoardDivId);
	var oBoardControl = CreateControlContainer(sBoardDivId);
	oNotInfoControl.AddControl(oBoardControl);
	oDrawingBoard.Init(sBoardDivId, oGameTree);
	oDrawingBoard.Focus();

	var sNotBoardDivId = sNotInfoDivId + "N";
	var oNotBoardElement = this.private_CreateDiv(oNotInfoControl.HtmlElement, sNotBoardDivId);
	var oNotBoardControl = CreateControlContainer(sNotBoardDivId);
	oNotInfoControl.AddControl(oNotBoardControl);
	oNotBoardElement.style.background = "rgb(217, 217, 217)";
	//------------------------------------------------------------------------------------------------------------------
	// Создаем контрол с кнопками.
	//------------------------------------------------------------------------------------------------------------------
	var sToolbarDivId = sNotBoardDivId + "T";
	this.private_CreateDiv(oNotBoardControl.HtmlElement, sToolbarDivId);

	var oToolbarControl = CreateControlContainer(sToolbarDivId);
	oToolbarControl.Bounds.SetParams(0, 1, 1000, 1, false, true, false, true, -1, -1);
	oToolbarControl.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
	oNotBoardControl.AddControl(oToolbarControl);

	var oDrawingToolbar = new CDrawingToolbar(this);
	oDrawingToolbar.Add_Control(new CDrawingButtonBackwardToStart(this), 36, 1, EToolbarFloat.Left);
	oDrawingToolbar.Add_Control(new CDrawingButtonBackward5(this), 36, 1, EToolbarFloat.Left);
	oDrawingToolbar.Add_Control(new CDrawingButtonBackward(this), 36, 1, EToolbarFloat.Left);
	oDrawingToolbar.Add_Control(new CDrawingButtonForward(this), 36, 1, EToolbarFloat.Left);
	oDrawingToolbar.Add_Control(new CDrawingButtonForward5(this), 36, 1, EToolbarFloat.Left);
	oDrawingToolbar.Add_Control(new CDrawingButtonForwardToEnd(this), 36, 1, EToolbarFloat.Left);
	oDrawingToolbar.Add_Control(new CDrawingButtonAbout(this), 36, 1, EToolbarFloat.Right);
	oDrawingToolbar.Add_Control(new CDrawingButtonAutoPlay(this), 36, 1, EToolbarFloat.Right);
	oDrawingToolbar.Init(sToolbarDivId, oGameTree);

	var ToolbarH = 36;
	this.m_aElements.push(oDrawingToolbar);
	this.m_nMixedBotSize = ToolbarH + 160;
	oNotInfoControl.Set_Type(3, oDrawingBoard, {RMin : this.m_nMixedBotSize - 50});
	//------------------------------------------------------------------------------------------------------------------
	// Контрол под доской тоже делим на 2 части: сверху 36px под кнопки, а снизу все остальное под навигатор.
	//------------------------------------------------------------------------------------------------------------------
	var oToolsControl = CreateControlContainer(sToolbarDivId);
	oToolsControl.Bounds.SetParams(0, 1, 1000, 0, false, true, false, false, -1, ToolbarH);
	oToolsControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top);
	oNotBoardControl.AddControl(oToolsControl);

	var sUnderToolbarDivId = sNotBoardDivId + "U";
	this.private_CreateDiv(oNotBoardControl.HtmlElement, sUnderToolbarDivId);
	var oUnderToolBarControl = CreateControlContainer(sUnderToolbarDivId);
	oUnderToolBarControl.Bounds.SetParams(0, ToolbarH + 2, 1000, 1000, false, true, false, false, -1, -1);
	oUnderToolBarControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
	oNotBoardControl.AddControl(oUnderToolBarControl);
	//------------------------------------------------------------------------------------------------------------------
	// Заполняем контрол справа. Туда добавим 2 контрола, которые оба будут занимать все место и перекрывать друг друга.
	//------------------------------------------------------------------------------------------------------------------
	var sNavigatorDivId = sUnderToolbarDivId + "N";
	this.private_CreateDiv(oUnderToolBarControl.HtmlElement, sNavigatorDivId);
	var oNavigatorControl = CreateControlContainer(sNavigatorDivId);
	oNavigatorControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
	oNavigatorControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
	oUnderToolBarControl.AddControl(oNavigatorControl);
	//------------------------------------------------------------------------------------------------------------------
	// Заполняем навигатор.
	//------------------------------------------------------------------------------------------------------------------
	var oDrawingNavigator = new CDrawingNavigator(this);
	oDrawingNavigator.Init(sNavigatorDivId, oGameTree);
	this.m_aElements.push(oDrawingNavigator);
	//------------------------------------------------------------------------------------------------------------------
	// Обновляем размер и сообщаем основному классу, что построение закончилось.
	//------------------------------------------------------------------------------------------------------------------
	this.Update_Size();
	oGameTree.On_EndLoadDrawing();
};
CDrawing.prototype.private_CreateWrappingMainDiv = function(sDivId)
{
    g_oGlobalSettings.Load_FromLocalStorage();
    //------------------------------------------------------------------------------------------------------------------
    // Создаем оберточную div для всего редактора, которая будет главной для нас.
    //------------------------------------------------------------------------------------------------------------------
    var oParentControl = CreateControlContainer(sDivId);
    this.m_oControl = oParentControl;
    var sMainDivId = sDivId + "GB";
    this.private_CreateDiv(oParentControl.HtmlElement, sMainDivId);
    var oMainControl = CreateControlContainer(sMainDivId);
    oMainControl.Bounds.SetParams(0, 0, 1, 1, false, false, true, true, -1, -1);
    oMainControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oParentControl.AddControl(oMainControl);
    this.private_SetMainDiv(sMainDivId, oMainControl);
};
CDrawing.prototype.private_CreateHorFullTemplate = function()
{
    var oGameTree    = this.m_oGameTree;
    var oMainControl = this.m_oMainControl;
    var sMainDivId   = this.m_oMainDiv.id;
    var sDivId       = sMainDivId;
    var bIsEmbedding = oGameTree.Get_LocalSettings().Is_Embedding();

    this.m_nMixedRightSide = 344;
    var oDrawingBoard = new CDrawingBoard(this);
    oMainControl.Set_Type(1, oDrawingBoard, {RMin : this.m_nMixedRightSide});

    var sBoardDivId = sDivId + "_Board";
    var sPanelDivId = sDivId + "_Panel";

    this.private_CreateDiv(oMainControl.HtmlElement, sBoardDivId);
    this.private_CreateDiv(oMainControl.HtmlElement, sPanelDivId);

    var oBoardControl = CreateControlContainer(sBoardDivId);
    var oPanelControl = CreateControlContainer(sPanelDivId);
    oMainControl.AddControl(oBoardControl);
    oMainControl.AddControl(oPanelControl);

    oDrawingBoard.Init(sBoardDivId, oGameTree);
    oDrawingBoard.Focus();

    var sCaTDivId       = sPanelDivId + "_CaT";
    var sNavigatorDivId = sPanelDivId + "_Navigator";
    this.private_CreateDiv(oPanelControl.HtmlElement, sCaTDivId);
    this.private_CreateDiv(oPanelControl.HtmlElement, sNavigatorDivId);

    var oCaTControl = CreateControlContainer(sCaTDivId);
    oCaTControl.Bounds.SetParams(0, 0, 1000, 500, false, false, false, false, -1, -1);
    oCaTControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oPanelControl.AddControl(oCaTControl);
    oCaTControl.HtmlElement.style.background = "rgb(217, 217, 217)";

    var oNavigatorControl = CreateControlContainer(sNavigatorDivId);
    oNavigatorControl.Bounds.SetParams(0, 500, 1000, 1000, false, false, false, false, -1, -1);
    oNavigatorControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oPanelControl.AddControl(oNavigatorControl);

	this.Controls = {
		Panel     : oPanelControl,
		CaT       : oCaTControl,
		Navigator : oNavigatorControl
	};

	var oDrawingNavigator = new CDrawingNavigator(this);
    oDrawingNavigator.Init(sNavigatorDivId, oGameTree);

    var sInfoDivId     = sCaTDivId + "_Info";
    var sCommentsDivId = sCaTDivId + "_Comments";
    var sToolsDivId    = sCaTDivId + "_Toolbar";

    this.private_CreateDiv(oCaTControl.HtmlElement, sInfoDivId);
    this.private_CreateDiv(oCaTControl.HtmlElement, sCommentsDivId);
    this.private_CreateDiv(oCaTControl.HtmlElement, sToolsDivId);

    var InfoH    = 50;

    // INFO
    var oInfoControl = CreateControlContainer(sInfoDivId);
    oInfoControl.Bounds.SetParams(true !== bIsEmbedding ? 7 + 36 : 0, 0, 1000, 0, true, false, false, false, -1, InfoH);
    oInfoControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oCaTControl.AddControl(oInfoControl);

    var sWhiteInfo = sInfoDivId + "_White";
    var sBlackInfo = sInfoDivId + "_Black";
    this.private_CreateDiv(oInfoControl.HtmlElement, sWhiteInfo);
    this.private_CreateDiv(oInfoControl.HtmlElement, sBlackInfo);

    var oInfoWhiteControl = CreateControlContainer(sWhiteInfo);
    oInfoWhiteControl.Bounds.SetParams(0, 0, 500, 1000, false, false, false, false, -1, -1);
    oInfoWhiteControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oInfoControl.AddControl(oInfoWhiteControl);

    var oInfoBlackControl = CreateControlContainer(sBlackInfo);
    oInfoBlackControl.Bounds.SetParams(500, 0, 1000, 1000, false, false, false, false, -1, -1);
    oInfoBlackControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oInfoControl.AddControl(oInfoBlackControl);

    var oDrawingWhiteInfo = new CDrawingPlayerInfo(this);
    oDrawingWhiteInfo.Init(sWhiteInfo, oGameTree, BOARD_WHITE);
    var oDrawingBlackInfo = new CDrawingPlayerInfo(this);
    oDrawingBlackInfo.Init(sBlackInfo, oGameTree, BOARD_BLACK);

    if (true !== bIsEmbedding)
    {
        var sMenuButton = sCaTDivId + "_M";
        this.private_CreateDiv(oCaTControl.HtmlElement, sMenuButton);
        var oMenuButtonControl = CreateControlContainer(sMenuButton);
        oMenuButtonControl.Bounds.SetParams(7, 7, 1000, 7, true, true, false, true, 36, 36);
        oMenuButtonControl.Anchor = (g_anchor_top | g_anchor_left);
        oCaTControl.AddControl(oMenuButtonControl);

        var oDrawingMenuButton = new CDrawingButtonFileMenu(this);
        oDrawingMenuButton.Init(sMenuButton, oGameTree);
        this.Register_MenuButton(oDrawingMenuButton);
        this.m_aElements.push(oDrawingMenuButton);
    }
    // END INFO

    var oDrawingMultilevelToolbar = new CDrawingMultiLevelToolbar(this);
    oDrawingMultilevelToolbar.Init(sToolsDivId);

    var nToolbarHeight = oDrawingMultilevelToolbar.Get_Height();

    var oToolsControl = CreateControlContainer(sToolsDivId);
    oToolsControl.Bounds.SetParams(6, 0, 6, 0, true, false, true, true, -1, nToolbarHeight);
    oToolsControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
    oCaTControl.AddControl(oToolsControl);

    var oCommentsControl = CreateControlContainer(sCommentsDivId);
    oCommentsControl.Bounds.SetParams(0, InfoH, 1000, nToolbarHeight + 1, false, true, false, true, -1, -1);
    oCommentsControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oCaTControl.AddControl(oCommentsControl);

    var oThis = this;
    oDrawingMultilevelToolbar.Set_OnChangeCallback(function()
    {
        nToolbarHeight = oDrawingMultilevelToolbar.Get_Height();
        oToolsControl.Bounds.SetParams(6, 0, 6, 0, true, false, true, true, -1, nToolbarHeight);
        oCommentsControl.Bounds.SetParams(0, InfoH, 1000, nToolbarHeight + 1, false, true, false, true, -1, -1);
        oThis.Update_Size(false);
    });

    var oDrawingComments = new CDrawingComments(this);
    oDrawingComments.Init(sCommentsDivId, oGameTree);

    this.m_aElements.push(oDrawingBoard);
    this.m_aElements.push(oDrawingNavigator);
    this.m_aElements.push(oDrawingComments);
    this.m_aElements.push(oDrawingMultilevelToolbar);
    this.m_aElements.push(oDrawingBlackInfo);
    this.m_aElements.push(oDrawingWhiteInfo);

    this.Update_Size();
    oGameTree.On_EndLoadDrawing();
};
CDrawing.prototype.private_CreateVerFullTemplate = function()
{
    this.m_nMinWidth = 332;

    var oGameTree    = this.m_oGameTree;
    var oMainControl = this.m_oMainControl;
    var sMainDivId   = this.m_oMainDiv.id;
    var bIsEmbedding = oGameTree.Get_LocalSettings().Is_Embedding();
    //------------------------------------------------------------------------------------------------------------------
    // Делим главную дивку на 2 части сверху 50px под информацию об игрока, а снизу все остальное.
    //------------------------------------------------------------------------------------------------------------------
    var InfoH    = 50;

    var sInfoBackDivId = sMainDivId + "B";
    this.private_CreateDiv(oMainControl.HtmlElement, sInfoBackDivId).style.background = "rgb(217, 217, 217)";;
    var oInfoControlBack = CreateControlContainer(sInfoBackDivId);
    oInfoControlBack.Bounds.SetParams(0, 0, 1000, 0, true, false, false, false, -1, InfoH);
    oInfoControlBack.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oInfoControlBack);

    var sInfoDivId = sMainDivId + "I";
    this.private_CreateDiv(oMainControl.HtmlElement, sInfoDivId);
    //------------------------------------------------------------------------------------------------------------------
    // Добавляем кнопку меню слева.
    //------------------------------------------------------------------------------------------------------------------

    if (true !== bIsEmbedding)
    {
        var sMenuButton           = sMainDivId + "M";
        this.private_CreateDiv(oMainControl.HtmlElement, sMenuButton);
        var oMenuButtonControl    = CreateControlContainer(sMenuButton);
        oMenuButtonControl.Bounds.SetParams(7, 7, 1000, 7, true, true, false, true, 36, 36);
        oMenuButtonControl.Anchor = (g_anchor_top | g_anchor_left);
        oMainControl.AddControl(oMenuButtonControl);

        var oDrawingMenuButton = new CDrawingButtonFileMenu(this);
        oDrawingMenuButton.Init(sMenuButton, oGameTree);
        this.Register_MenuButton(oDrawingMenuButton);
        this.m_aElements.push(oDrawingMenuButton);
    }

    var oInfoControl = CreateControlContainer(sInfoDivId);
    oInfoControl.Bounds.SetParams(true !== bIsEmbedding ? 36 + 7 : 0, 0, 1000, 0, true, false, false, false, -1, InfoH);
    oInfoControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oInfoControl);

    var sNotInfoDivId = sMainDivId + "O";
    this.private_CreateDiv(oMainControl.HtmlElement, sNotInfoDivId);
    var oNotInfoControl = CreateControlContainer(sNotInfoDivId);
    oNotInfoControl.Bounds.SetParams(0, InfoH, 1000, 1000, false, true, false, false, -1, -1);
    oNotInfoControl.Anchor = (g_anchor_bottom | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oNotInfoControl);
    //------------------------------------------------------------------------------------------------------------------
    // Заполняем контрол с информацией (слева информация о белом, справ о черном).
    //------------------------------------------------------------------------------------------------------------------
    var sWhiteInfo = sInfoDivId + "W";
    this.private_CreateDiv(oInfoControl.HtmlElement, sWhiteInfo);
    var oInfoWhiteControl = CreateControlContainer(sWhiteInfo);
    oInfoWhiteControl.Bounds.SetParams(0, 0, 500, 1000, false, false, false, false, -1, -1);
    oInfoWhiteControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oInfoControl.AddControl(oInfoWhiteControl);
    var oDrawingWhiteInfo = new CDrawingPlayerInfo(this);
    oDrawingWhiteInfo.Init(sWhiteInfo, oGameTree, BOARD_WHITE);
    this.m_aElements.push(oDrawingWhiteInfo);

    var sBlackInfo = sInfoDivId + "B";
    this.private_CreateDiv(oInfoControl.HtmlElement, sBlackInfo);
    var oInfoBlackControl = CreateControlContainer(sBlackInfo);
    oInfoBlackControl.Bounds.SetParams(500, 0, 1000, 1000, false, false, false, false, -1, -1);
    oInfoBlackControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oInfoControl.AddControl(oInfoBlackControl);
    var oDrawingBlackInfo = new CDrawingPlayerInfo(this);
    oDrawingBlackInfo.Init(sBlackInfo, oGameTree, BOARD_BLACK);
    this.m_aElements.push(oDrawingBlackInfo);
    //------------------------------------------------------------------------------------------------------------------
    // Нижний контрол будет специального типа, вверху у него место под доску, внизу под все остальное.
    //------------------------------------------------------------------------------------------------------------------
    var oDrawingBoard = new CDrawingBoard(this);
    this.m_aElements.push(oDrawingBoard);
    oNotInfoControl.Set_Type(3, oDrawingBoard, {RMin : this.m_nMixedBotSize - 50});
    var sBoardDivId = sNotInfoDivId  + "B";
    this.private_CreateDiv(oNotInfoControl.HtmlElement, sBoardDivId);
    var oBoardControl = CreateControlContainer(sBoardDivId);
    oNotInfoControl.AddControl(oBoardControl);
    oDrawingBoard.Init(sBoardDivId, oGameTree);
    oDrawingBoard.Focus();

    var sNotBoardDivId = sNotInfoDivId + "N";
    var oNotBoardElement = this.private_CreateDiv(oNotInfoControl.HtmlElement, sNotBoardDivId);
    var oNotBoardControl = CreateControlContainer(sNotBoardDivId);
    oNotInfoControl.AddControl(oNotBoardControl);
    oNotBoardElement.style.background = "rgb(217, 217, 217)";
    //------------------------------------------------------------------------------------------------------------------
    // Создаем контрол с кнопками.
    //------------------------------------------------------------------------------------------------------------------
    var sToolbarDivId = sNotBoardDivId + "T";
    this.private_CreateDiv(oNotBoardControl.HtmlElement, sToolbarDivId);

    var oDrawingToolbar = new CDrawingMultiLevelToolbar(this);
    oDrawingToolbar.Init(sToolbarDivId);
    var ToolbarH = oDrawingToolbar.Get_Height();
    this.m_aElements.push(oDrawingToolbar);
    this.m_nMixedBotSize = ToolbarH + 160;
    oNotInfoControl.Set_Type(3, oDrawingBoard, {RMin : this.m_nMixedBotSize - 50});
    //------------------------------------------------------------------------------------------------------------------
    // Контрол под доской тоже делим на 2 части: сверху 25px под кнопки, а снизу все остальное под навигатор.
    //------------------------------------------------------------------------------------------------------------------
    var oToolsControl = CreateControlContainer(sToolbarDivId);
    oToolsControl.Bounds.SetParams(0, 1, 1000, 0, false, true, false, false, -1, ToolbarH);
    oToolsControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top);
    oNotBoardControl.AddControl(oToolsControl);

    var sUnderToolbarDivId = sNotBoardDivId + "U";
    this.private_CreateDiv(oNotBoardControl.HtmlElement, sUnderToolbarDivId);
    var oUnderToolBarControl = CreateControlContainer(sUnderToolbarDivId);
    oUnderToolBarControl.Bounds.SetParams(0, ToolbarH + 2, 1000, 1000, false, true, false, false, -1, -1);
    oUnderToolBarControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
    oNotBoardControl.AddControl(oUnderToolBarControl);
    //------------------------------------------------------------------------------------------------------------------
    // Обработчик изменения многоуровнего тулбара.
    //------------------------------------------------------------------------------------------------------------------
    var oThis = this;
    oDrawingToolbar.Set_OnChangeCallback(function()
    {
        ToolbarH = oDrawingToolbar.Get_Height();
        oThis.m_nMixedBotSize = ToolbarH + 160;
        oNotInfoControl.Set_Type(3, oDrawingBoard, {RMin : oThis.m_nMixedBotSize - 50});
        oToolsControl.Bounds.SetParams(0, 1, 1000, 0, false, true, false, false, -1, ToolbarH);
        oUnderToolBarControl.Bounds.SetParams(0, ToolbarH + 2, 1000, 1000, false, true, false, false, -1, -1);
        oThis.Update_Size(false);
    });
    //------------------------------------------------------------------------------------------------------------------
    // Контрол под панелью управления делим на 2 части, справа панель 30px с кнопками для переключения, слева все
    // остальное.
    //------------------------------------------------------------------------------------------------------------------
    var ToolbarW = 36;
    var sVerticalToolbarDivId = sUnderToolbarDivId + "L";
    this.private_CreateDiv(oUnderToolBarControl.HtmlElement, sVerticalToolbarDivId);
    var oRightToolbarControl = CreateControlContainer(sVerticalToolbarDivId);
    oRightToolbarControl.Bounds.SetParams(0, 0, 0, 1000, false, false, false, false, ToolbarW, -1);
    oRightToolbarControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_bottom);
    oUnderToolBarControl.AddControl(oRightToolbarControl);

    var sNavComDivId = sUnderToolbarDivId + "R";
    this.private_CreateDiv(oUnderToolBarControl.HtmlElement, sNavComDivId);
    var oNavComControl = CreateControlContainer(sNavComDivId);
    oNavComControl.Bounds.SetParams(ToolbarW, 0, 1000, 1000, true, false, false, false, -1, -1);
    oNavComControl.Anchor = (g_anchor_right | g_anchor_top | g_anchor_bottom);
    oUnderToolBarControl.AddControl(oNavComControl);
    //------------------------------------------------------------------------------------------------------------------
    // Заполняем контрол справа. Туда добавим 2 контрола, которые оба будут занимать все место и перекрывать друг друга.
    //------------------------------------------------------------------------------------------------------------------
    var sNavigatorDivId = sNavComDivId + "N";
    this.private_CreateDiv(oNavComControl.HtmlElement, sNavigatorDivId);
    var oNavigatorControl = CreateControlContainer(sNavigatorDivId);
    oNavigatorControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
    oNavigatorControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
    oNavComControl.AddControl(oNavigatorControl);

    var sCommentsDivId = sNavComDivId + "C";
    this.private_CreateDiv(oNavComControl.HtmlElement, sCommentsDivId);
    var oCommentsControl = CreateControlContainer(sCommentsDivId);
    oCommentsControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
    oCommentsControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
    oNavComControl.AddControl(oCommentsControl);
    //------------------------------------------------------------------------------------------------------------------
    // Заполняем навигатор.
    //------------------------------------------------------------------------------------------------------------------
    var oDrawingNavigator = new CDrawingNavigator(this);
    oDrawingNavigator.Init(sNavigatorDivId, oGameTree);
    this.m_aElements.push(oDrawingNavigator);
    //------------------------------------------------------------------------------------------------------------------
    // Заполняем окно с комментариями.
    //------------------------------------------------------------------------------------------------------------------
    var oDrawingComments = new CDrawingComments(this);
    oDrawingComments.Init(sCommentsDivId, oGameTree);
    this.m_aElements.push(oDrawingComments);
    //------------------------------------------------------------------------------------------------------------------
    // Заполняем контрол с кнопками слева.
    //------------------------------------------------------------------------------------------------------------------
    var oDrawingVerticalToolbar = new CDrawingNavigatorCommentsTabs(this);
    oDrawingVerticalToolbar.Init(sVerticalToolbarDivId, oGameTree, sNavigatorDivId, sCommentsDivId);
    this.m_aElements.push(oDrawingVerticalToolbar);
    //------------------------------------------------------------------------------------------------------------------
    // Обновляем размер и сообщаем основному классу, что построение закончилось.
    //------------------------------------------------------------------------------------------------------------------
    this.Update_Size();
    oGameTree.On_EndLoadDrawing();

    this.m_nVerEditorTitleH   = InfoH;
    this.m_nVerEditorToolbarH = 36;
    this.m_nVerEditorComNavH  = 160;
};
CDrawing.prototype.Create_BoardCommentsButtonsNavigator = function(sDivId)
{
    return this.Create_HorizontalFullTemplate(sDivId);
};
CDrawing.prototype.Create_Problems = function(sDivId)
{
    this.Set_TemplateType(EDrawingTemplate.Problems);
    var oGameTree = this.m_oGameTree;

    var oDrawingBoard = new CDrawingBoard(this);
    var oParentControl = CreateControlContainer(sDivId);
    var sMainDivId = sDivId + "GoBoard";
    this.private_CreateDiv(oParentControl.HtmlElement, sMainDivId);
    var oMainControl = CreateControlContainer(sMainDivId);
    oMainControl.Bounds.SetParams(0, 0, 1, 1, false, false, true, true, -1, -1);
    oMainControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oParentControl.AddControl(oMainControl);

    this.m_nMixedRightSide = 200;
    oMainControl.Set_Type(1, oDrawingBoard, {RMin : this.m_nMixedRightSide});

    var sBoardDivId = sDivId + "_Board";
    var sPanelDivId = sDivId + "_Panel";

    this.private_CreateDiv(oMainControl.HtmlElement, sBoardDivId);
    this.private_CreateDiv(oMainControl.HtmlElement, sPanelDivId);

    var oBoardControl = CreateControlContainer(sBoardDivId);
    var oPanelControl = CreateControlContainer(sPanelDivId);
    oMainControl.AddControl(oBoardControl);
    oMainControl.AddControl(oPanelControl);
    oPanelControl.HtmlElement.style.background = "rgb(217, 217, 217)";

    oDrawingBoard.Init(sBoardDivId, oGameTree);
    oDrawingBoard.Focus();
    oDrawingBoard.Set_ShellWhiteStones(false);

    var sToolsDivId    = sPanelDivId + "_Toolbar";
    var sCommentsDivId = sPanelDivId + "_Comments";
    this.private_CreateDiv(oPanelControl.HtmlElement, sCommentsDivId);
    this.private_CreateDiv(oPanelControl.HtmlElement, sToolsDivId);

    var ToolbarH = 36;

    var oCommentsControl = CreateControlContainer(sCommentsDivId);
    oCommentsControl.Bounds.SetParams(0, ToolbarH + 2, 1000, 1000, false, true, false, false, -1, -1);
    oCommentsControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oPanelControl.AddControl(oCommentsControl);

    var oToolsControl = CreateControlContainer(sToolsDivId);
    oToolsControl.Bounds.SetParams(6, 1, 1000, 1000, true, true, false, true, -1, ToolbarH);
    oToolsControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top);
    oPanelControl.AddControl(oToolsControl);

    var oDrawingComments = new CDrawingComments(this);
    oDrawingComments.Init(sCommentsDivId, oGameTree);

    var oDrawingToolbar = new CDrawingToolbar(this);
    oDrawingToolbar.Add_Control(new CDrawingButtonBackwardToStart(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonAbout(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Init(sToolsDivId, oGameTree);

    this.m_aElements.push(oDrawingBoard);
    this.m_aElements.push(oDrawingComments);
    this.m_aElements.push(oDrawingToolbar);

    this.m_oControl = oParentControl;

    this.Update_Size();

    oGameTree.On_EndLoadDrawing();

    this.private_SetMainDiv(sMainDivId);
};
CDrawing.prototype.Update_Size = function(bForce)
{
    if (bForce)
        this.private_UpdateSize(true);
    else
        this.m_bNeedUpdateSize = true;
};
CDrawing.prototype.private_SetMainDiv = function(sDivId, oMainControl)
{
    this.m_oMainDiv     = document.getElementById(sDivId);
    this.m_oMainControl = oMainControl;

    this.m_oMainDiv.style.background = "url(\'" + g_sBackground + "\')";
    this.m_oMainDiv.onclick = this.private_OnMainDivClick;
};
CDrawing.prototype.private_ClearMainDiv = function()
{
    this.Remove_LabelElement();

    while (this.m_oMainDiv.firstChild)
        this.m_oMainDiv.removeChild(this.m_oMainDiv.firstChild);

    if (this.m_oMainControl)
        this.m_oMainControl.Clear();

    g_aWindows = {};
};
CDrawing.prototype.private_UpdateSize = function(bForce)
{
    if (true === this.m_bMixedTemplate)
    {
        // Сначала  определим какой тип тимплейта должен быть сейчас
        var W = this.m_oControl.HtmlElement.clientWidth;
        var H = this.m_oControl.HtmlElement.clientHeight;

        if (this.m_nMinWidth > 0 && W < this.m_nMinWidth)
            W = this.m_nMinWidth;

        var nNewTemplateIndex = -1;
        if (H - (W - this.m_nMixedRightSide) > this.m_nMixedBotSize + 100)
        {
            // Вертикальный
            nNewTemplateIndex = 1;
        }
        else
        {
            // Горизонтальный
            nNewTemplateIndex = 0;
        }

        if (this.m_nMixedTemplateIndex !== nNewTemplateIndex)
        {
            this.m_nMixedTemplateIndex = nNewTemplateIndex;

            this.private_ClearMainDiv();

            if (0 === this.m_nMixedTemplateIndex)
                this.private_CreateHorFullTemplate();
            else
                this.private_CreateVerFullTemplate();

            if (this.m_oGameTree)
            {
                this.m_oGameTree.GoTo_Node(this.m_oGameTree.Get_CurNode(), true);
                this.m_oGameTree.Update_InterfaceState(true);
            }
        }
    }

    this.m_bNeedUpdateSize = false;

    if (this.m_oControl)
    {
        var W = this.m_oControl.HtmlElement.clientWidth;
        var H = this.m_oControl.HtmlElement.clientHeight;

        if (this.m_nMinWidth > 0 && W < this.m_nMinWidth)
            W = this.m_nMinWidth;

        this.m_oControl.Resize(W, H);
    }

    for (var Index = 0, Count = this.m_aElements.length; Index < Count; Index++)
        this.m_aElements[Index].Update_Size(bForce);
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
CDrawing.prototype.Register_PassButton = function(PassButton)
{
    this.m_oButtons.Pass = PassButton;
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
CDrawing.prototype.Register_EditModeColorButton = function(oButton)
{
    this.m_oButtons.BoardModeColor.push(oButton);
};
CDrawing.prototype.Register_Comments = function(oComments)
{
    this.m_aComments.push(oComments);
};
CDrawing.prototype.Register_Board = function(oBoard)
{
    this.m_oBoard = oBoard;
};
CDrawing.prototype.Register_Navigator = function(oNavigator)
{
    this.m_oNavigator = oNavigator;
};
CDrawing.prototype.Register_TimeLine = function(oTimeLine)
{
    this.m_oTimeLine = oTimeLine;
};
CDrawing.prototype.Register_AutoPlaySpeed = function(oAutoPlay)
{
    this.m_oAutoPlaySlider = oAutoPlay;
};
CDrawing.prototype.Register_AutoPlayButton = function(oAutoPlayButton)
{
    this.m_oAutoPlayButton = oAutoPlayButton;
};
CDrawing.prototype.Register_SelectBoardModeButton = function(oButton)
{
    this.m_oSelectBoardModeButton = oButton;
};
CDrawing.prototype.Register_ToolbarCustomizeButton = function(oButton)
{
    this.m_oButtons.ToolbarCustomize = oButton;
};
CDrawing.prototype.Register_AddLabelElement = function(oElement)
{
    this.Remove_LabelElement();
    this.m_oAddLabelElement = oElement;
};
CDrawing.prototype.Register_MenuButton = function(oElement)
{
    this.m_oButtons.Menu = oElement;
};
CDrawing.prototype.Register_EditorControlButton = function(oElement)
{
	this.m_oButtons.EditorControl = oElement;
};
CDrawing.prototype.Register_KifuModeButton = function(oElement)
{
    this.m_oButtons.KifuMode = oElement;
};
CDrawing.prototype.Register_KifuWindow = function(oWindow)
{
    this.m_oWindows.Kifu = oWindow;
};
CDrawing.prototype.Remove_LabelElement = function()
{
    if (this.m_oAddLabelElement)
    {
        var oElement = this.m_oAddLabelElement;
        this.m_oAddLabelElement = null;
        this.m_oMainDiv.removeChild(oElement);
    }
};
CDrawing.prototype.On_StartAutoPlay = function()
{
    if (this.m_oAutoPlayButton)
        this.m_oAutoPlayButton.Set_State2(EDrawingButtonState2.AutoPlayPlaying);
};
CDrawing.prototype.On_StopAutoPlay = function()
{
    if (this.m_oAutoPlayButton)
        this.m_oAutoPlayButton.Set_State2(EDrawingButtonState2.AutoPlayStopped);
};
CDrawing.prototype.Update_AutoPlaySpeed = function(dPos)
{
    if (this.m_oAutoPlaySlider)
        this.m_oAutoPlaySlider.Update_Pos(dPos);
};
CDrawing.prototype.Update_KifuMode = function()
{
    if (this.m_oButtons.KifuMode)
        this.m_oButtons.KifuMode.Set_Selected(this.m_oGameTree.Is_KifuMode());
};
CDrawing.prototype.Register_BlackInfo = function(oInfo)
{
    this.m_oBlackInfo = oInfo;
};
CDrawing.prototype.Register_WhiteInfo = function(oInfo)
{
    this.m_oWhiteInfo = oInfo;
};
CDrawing.prototype.Update_BlackName = function(sName)
{
    if (this.m_oBlackInfo)
        this.m_oBlackInfo.Update_Name(sName);

    this.private_UpdateViewerTitle();
};
CDrawing.prototype.Update_BlackRank = function(sRank)
{
    if (this.m_oBlackInfo)
        this.m_oBlackInfo.Update_Rank(sRank);
};
CDrawing.prototype.Update_WhiteName = function(sName)
{
    if (this.m_oWhiteInfo)
        this.m_oWhiteInfo.Update_Name(sName);

    this.private_UpdateViewerTitle();
};
CDrawing.prototype.Update_WhiteRank = function(sRank)
{
    if (this.m_oWhiteInfo)
        this.m_oWhiteInfo.Update_Rank(sRank);
};
CDrawing.prototype.private_UpdateViewerTitle = function()
{
    if (this.m_oViewerTitle)
        this.m_oViewerTitle.Set_Title(this.m_oGameTree.Get_MatchName());
};
CDrawing.prototype.Update_Captured = function(dBlack, dWhite)
{
    if (this.m_oBlackInfo)
        this.m_oBlackInfo.Update_Captured(dBlack);

    if (this.m_oWhiteInfo)
        this.m_oWhiteInfo.Update_Captured(dWhite);

    if (this.m_oViewerScores)
        this.m_oViewerScores.Update_Scores(dWhite, dBlack);
};
CDrawing.prototype.Update_Scores = function(dBlack, dWhite)
{
    if (this.m_oBlackInfo)
        this.m_oBlackInfo.Update_Scores(dBlack);

    if (this.m_oWhiteInfo)
        this.m_oWhiteInfo.Update_Scores(dWhite);

    if (this.m_oViewerScores)
        this.m_oViewerScores.Update_Scores(dWhite, dBlack);
};
CDrawing.prototype.Update_InterfaceState = function(oIState)
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

    for (var Index = 0, Count = this.m_oButtons.BoardModeColor.length; Index < Count; Index++)
        this.m_oButtons.BoardModeColor[Index].Set_Selected(oIState.BoardMode === EBoardMode.AddMarkColor);

    // TimeLine
    if (this.m_oTimeLine)
        this.m_oTimeLine.Update_Pos(oIState.TimelinePos);

    if (this.m_oSelectBoardModeButton)
        this.m_oSelectBoardModeButton.On_UpdateBoardMode(oIState.BoardMode);

    if (this.m_oWindows.Kifu)
        this.m_oWindows.Kifu.Update_NextMove();

    this.Update_ColorsCounter();

    for (var nIndex = 0, nCount = this.m_arrStateHandlers.length; nIndex < nCount; ++nIndex)
    {
        var oHandler = this.m_arrStateHandlers[nIndex];
        if (oHandler && oHandler.OnGameTreeStateChange)
            oHandler.OnGameTreeStateChange(this.m_oGameTree, oIState);
    }
};
CDrawing.prototype.Update_Comments = function(sComment)
{
    for (var Index = 0, Count = this.m_aComments.length; Index < Count; Index++)
        this.m_aComments[Index].Update_Comments(sComment);
};
CDrawing.prototype.Update_ColorsCounter = function()
{
    var oCountColorsWindow = g_aWindows[EWindowType.CountColors];
    if (oCountColorsWindow && oCountColorsWindow.Is_Visible())
        oCountColorsWindow.Update();
};
CDrawing.prototype.ToggleMultiLevelToolbarMainNavigation = function()
{
	var bShow = g_oGlobalSettings.ToggleMultiLevelToolbarMainNavigation();

	if (this.m_oButtons.ToolbarCustomize)
		this.m_oButtons.ToolbarCustomize.Set_MainNavigation(bShow);

	return bShow;
};
CDrawing.prototype.ToggleMultiLevelToolbarTreeNavigation = function()
{
	var bShow = g_oGlobalSettings.ToggleMultiLevelToolbarTreeNavigation();

	if (this.m_oButtons.ToolbarCustomize)
		this.m_oButtons.ToolbarCustomize.Set_TreeNavigation(bShow);

	return bShow;
};
CDrawing.prototype.ToggleMultiLevelToolbarGeneral = function()
{
	var bShow = g_oGlobalSettings.ToggleMultiLevelToolbarGeneral();

	if (this.m_oButtons.ToolbarCustomize)
		this.m_oButtons.ToolbarCustomize.Set_General(bShow);

	return bShow;
};
CDrawing.prototype.ToggleMultiLevelToolbarAutoPlay = function()
{
	var bShow = g_oGlobalSettings.ToggleMultiLevelToolbarAutoPlay();

	if (this.m_oButtons.ToolbarCustomize)
		this.m_oButtons.ToolbarCustomize.SetAutoPlay(bShow);

	return bShow;
};
CDrawing.prototype.ToggleMultiLevelToolbarTimeline = function()
{
	var bShow = g_oGlobalSettings.ToggleMultiLevelToolbarTimeline();

	if (this.m_oButtons.ToolbarCustomize)
		this.m_oButtons.ToolbarCustomize.SetTimeline(bShow);

	return bShow;
};
CDrawing.prototype.ToggleMultiLevelToolbarNavigationMap = function()
{
	var isShow = g_oGlobalSettings.ToggleMultiLevelToolbarNavigationMap();

	if (this.m_oButtons.ToolbarCustomize)
		this.m_oButtons.ToolbarCustomize.SetNavigationMap(isShow);

	this.SetShowNavigationMap(isShow);

	return isShow;
};
CDrawing.prototype.ToggleMultiLevelToolbarKifuMode = function()
{
	var bShow = g_oGlobalSettings.ToggleMultiLevelToolbarKifuMode();

	if (this.m_oButtons.ToolbarCustomize)
		this.m_oButtons.ToolbarCustomize.SetKifuMode(bShow);

	return bShow;
};
CDrawing.prototype.Get_DivHeightByWidth = function(nWidth)
{
    var oDrawingBoard = this.m_oGameTree? this.m_oGameTree.Get_DrawingBoard() : null;
    if (!oDrawingBoard)
        return 0;

    var dAscpect = oDrawingBoard.Get_AspectRatio();

    if (Math.abs(dAscpect) < 0.1)
        return 0;

    var dKoef = 1 / oDrawingBoard.Get_AspectRatio();

    switch (this.m_eTemplateType)
    {
        case EDrawingTemplate.SimpleBoard:
            return dKoef * nWidth;
        case EDrawingTemplate.Viewer:
            return this.m_nViewerTitleH + this.m_nViewerToolbarH + dKoef * nWidth;
        case EDrawingTemplate.VerEditor:
            return this.m_nVerEditorComNavH + this.m_nVerEditorTitleH + this.m_nVerEditorToolbarH + dKoef * nWidth;
        case EDrawingTemplate.HorEditor:
            return (nWidth - this.m_nMixedRightSide) * dKoef;
        case EDrawingTemplate.Problems:
            return (nWidth - this.m_nMixedRightSide) * dKoef;
        case EDrawingTemplate.None:
        default:
            return 0;
    }

    return 0;
};
CDrawing.prototype.Get_TemplateType = function()
{
    return this.m_eTemplateType;
};
CDrawing.prototype.Add_StateHandler = function(oHandler)
{
    this.m_arrStateHandlers.push(oHandler);
};
CDrawing.prototype.Create_ViewerForBooklet = function(sDivId)
{
    // Ширина страницы в буклете пока ровно 440px

    this.Set_TemplateType(EDrawingTemplate.Viewer);
    this.private_CreateWrappingMainDiv(sDivId);

    this.m_oMainDiv.style.background = "";

    this.m_nMinWidth = 295;

    var oGameTree    = this.m_oGameTree;
    var oMainControl = this.m_oMainControl;
    var sMainDivId   = this.m_oMainDiv.id;

    var InfoH    = 25;
    var ToolbarH = 36;

    this.m_nViewerTitleH   = InfoH;
    this.m_nViewerToolbarH = ToolbarH;
    //------------------------------------------------------------------------------------------------------------------
    // Делим главную дивку на 3 части сверху 20px под информацию об игрока, снизу 36px под тулбар, а остальное для доски.
    //------------------------------------------------------------------------------------------------------------------
    var sInfoDivId = sMainDivId + "I";
    this.private_CreateDiv(oMainControl.HtmlElement, sInfoDivId);

    var oInfoControl = CreateControlContainer(sInfoDivId);
    oInfoControl.Bounds.SetParams(0, 0, 1000, 0, false, false, false, false, -1, InfoH);
    oInfoControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oMainControl.AddControl(oInfoControl);
    //------------------------------------------------------------------------------------------------------------------
    // Информация
    //------------------------------------------------------------------------------------------------------------------
    var sScoresInfo = sInfoDivId + "S";
    this.private_CreateDiv(oInfoControl.HtmlElement, sScoresInfo);
    var oScoresInfoControl = CreateControlContainer(sScoresInfo);
    oScoresInfoControl.Bounds.SetParams(159, 0, 1000, 1000, true, false, false, false, 122, -1);
    oScoresInfoControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom);
    oInfoControl.AddControl(oScoresInfoControl);

    this.m_oViewerScores = new CDrawingViewerScores(this);
    this.m_oViewerScores.Init(sScoresInfo, oGameTree);
    this.m_oViewerScores.HtmlElement.Control.HtmlElement.style.backgroundColor = "";
    this.m_aElements.push(this.m_oViewerScores);
    //------------------------------------------------------------------------------------------------------------------
    // Тулбар
    //------------------------------------------------------------------------------------------------------------------
    var sToolbarDivId = sMainDivId + "T";
    this.private_CreateDiv(oMainControl.HtmlElement, sToolbarDivId);

    var oToolbarControl = CreateControlContainer(sToolbarDivId);
    oToolbarControl.Bounds.SetParams(109, 0, 1000, 0, true, false, false, true, 221, ToolbarH);
    oToolbarControl.Anchor = (g_anchor_bottom | g_anchor_left);
    oMainControl.AddControl(oToolbarControl);

    var oDrawingToolbar = new CDrawingToolbar(this);

    oDrawingToolbar.Add_Control(new CDrawingButtonBackwardToStart(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonBackward5(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonBackward(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonForward(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonForward5(this), 36, 1, EToolbarFloat.Left);
    oDrawingToolbar.Add_Control(new CDrawingButtonForwardToEnd(this), 36, 1, EToolbarFloat.Left);

    oDrawingToolbar.Init(sToolbarDivId, oGameTree);
    oDrawingToolbar.HtmlElement.Control.HtmlElement.style.backgroundColor = "";
    this.m_aElements.push(oDrawingToolbar);
    //------------------------------------------------------------------------------------------------------------------
    // Доска
    //------------------------------------------------------------------------------------------------------------------
    var sBoardDivId = sMainDivId + "B";
    var oBoardElement = this.private_CreateDiv(oMainControl.HtmlElement, sBoardDivId);

    var oBoardControl = CreateControlContainer(sBoardDivId);
    oBoardControl.Bounds.SetParams(0, InfoH, 1000, ToolbarH, false, true, false, true, -1, -1);
    oBoardControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
    oMainControl.AddControl(oBoardControl);

    var sBoardDivId2 = sBoardDivId + "B";
    this.private_CreateDiv(oBoardElement, sBoardDivId2);
    var oBoardControl2 = CreateControlContainer(sBoardDivId2);
    oBoardControl.AddControl(oBoardControl2);

    var sBoardDivId3 = sBoardDivId + "N";
    this.private_CreateDiv(oBoardElement, sBoardDivId3);
    var oBoardControl3 = CreateControlContainer(sBoardDivId3);
    oBoardControl.AddControl(oBoardControl3);

    var oDrawingBoard = new CDrawingBoard(this);
    oDrawingBoard.Init(sBoardDivId2, this.m_oGameTree);
    oDrawingBoard.Focus();
    this.m_aElements.push(oDrawingBoard);
    oBoardControl.Set_Type(3, oDrawingBoard, {RMin : 0});
    //------------------------------------------------------------------------------------------------------------------
    this.Update_Size();
    oGameTree.On_EndLoadDrawing();
};
CDrawing.prototype.SetShowNavigationMap = function(isShow)
{
	switch (this.m_eTemplateType)
	{
		case EDrawingTemplate.SimpleBoard:
		case EDrawingTemplate.Viewer:
		case EDrawingTemplate.VerEditor:
		case EDrawingTemplate.Problems:
		case EDrawingTemplate.None:
		default:
			break;
		case EDrawingTemplate.HorEditor:
		{
			if (!isShow)
			{
				let oCaTControl = this.Controls.CaT;
				oCaTControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
				oCaTControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
				oCaTControl.HtmlElement.style.background = "rgb(217, 217, 217)";

				let oNavigatorControl = this.Controls.Navigator;
				oNavigatorControl.Bounds.SetParams(0, 1000, 1000, 1000, false, false, false, false, -1, -1);
				oNavigatorControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
				oNavigatorControl.HtmlElement.style.display = "none";
			}
			else
			{
				let oCaTControl = this.Controls.CaT;
				oCaTControl.Bounds.SetParams(0, 0, 1000, 500, false, false, false, false, -1, -1);
				oCaTControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
				oCaTControl.HtmlElement.style.background = "rgb(217, 217, 217)";

				let oNavigatorControl = this.Controls.Navigator;
				oNavigatorControl.Bounds.SetParams(0, 500, 1000, 1000, false, false, false, false, -1, -1);
				oNavigatorControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
				oNavigatorControl.HtmlElement.style.display = "block";
			}

			this.Update_Size(true);
		}
	}
};