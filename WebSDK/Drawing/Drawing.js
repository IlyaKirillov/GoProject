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

function CSettings()
{
    this.m_bSound = true;

    this.m_oBoardPr =
    {
        bTrueColorBoard   : true,
        bTrueColorStones  : true,
        oBoardColor       : new CColor(231, 188, 95, 255),
        bShellWhiteStones : true,
        bShadows          : true,
        oWhiteColor       : new CColor(255, 255, 255, 255),
        oBlackColor       : new CColor(0, 0, 0, 255),
        oLinesColor       : new CColor(0, 0, 0, 255),
        bDarkBoard        : false
    };

    this.m_oNavigatorPr =
    {
        bTrueColorBoard   : true,
        bTrueColorStones  : true,
        oBoardColor       : new CColor(231, 188, 95, 255),
        bShadows          : true,
        oWhiteColor       : new CColor(255, 255, 255, 255),
        oBlackColor       : new CColor(0, 0, 0, 255),
        oLinesColor       : new CColor(0, 0, 0, 255),
        bDarkBoard        : false
    };
}
CSettings.prototype.Load_FromLocalStorage = function()
{
    var sSound = Common.Get_LocalStorageItem("Sound");
    this.m_bSound = (sSound === "0" ? false : true);

    var eColorScheme = EColorScheme.TrueColor;
    var sColorScheme = Common.Get_LocalStorageItem("ColorScheme");
    if ("BookStyle" === sColorScheme)
        eColorScheme = EColorScheme.BookStyle;
    else if ("SimpleColor" === sColorScheme)
        eColorScheme = EColorScheme.SimpleColor;
    else if ("Dark" === sColorScheme)
        eColorScheme = EColorScheme.Dark;

    this.Set_ColorScheme(eColorScheme);
};
CSettings.prototype.Set_Sound = function(Value)
{
    this.m_bSound = Value;
    Common.Set_LocalStorageItem("Sound", Value === true ? "1" : "0");
};
CSettings.prototype.Is_SoundOn = function()
{
    return this.m_bSound;
};
CSettings.prototype.Set_ColorScheme = function(eScheme)
{
    var bTrueColorBoard   = true;
    var bTrueColorStones  = true;
    var oBoardColor       = null;
    var bShellWhiteStones = true;
    var bShadows          = true;
    var oWhiteColor       = new CColor(255, 255, 255, 255);
    var oBlackColor       = new CColor(0, 0, 0, 255);
    var oLinesColor       = new CColor(0, 0, 0, 255);
    var bDarkTheme        = false;

    switch (eScheme)
    {
        case EColorScheme.TrueColor:
        {
            bTrueColorBoard   = true;
            bTrueColorStones  = true;
            bShellWhiteStones = true;
            bShadows          = true;

            oBoardColor       = new CColor(231, 188, 95, 255);
            oLinesColor       = new CColor(0, 0, 0, 255);

            Common.Set_LocalStorageItem("ColorScheme", "TrueColor");
            break;
        }
        case EColorScheme.BookStyle:
        {
            bTrueColorBoard   = false;
            bTrueColorStones  = false;
            bShellWhiteStones = false;
            bShadows          = false;

            oBoardColor       = new CColor(255, 255, 255, 255);
            oLinesColor       = new CColor(0, 0, 0, 255);

            Common.Set_LocalStorageItem("ColorScheme", "BookStyle");
            break;
        }
        case EColorScheme.SimpleColor:
        {
            bTrueColorBoard   = false;
            bTrueColorStones  = false;
            bShellWhiteStones = false;
            bShadows          = false;

            oBoardColor       = new CColor(231, 188, 95, 255);
            oLinesColor       = new CColor(0, 0, 0, 255);

            Common.Set_LocalStorageItem("ColorScheme", "SimpleColor");
            break;
        }
        case EColorScheme.Dark:
        {
            bTrueColorBoard   = false;
            bTrueColorStones  = false;
            bShellWhiteStones = false;
            bShadows          = false;
            bDarkTheme        = true;

            oBoardColor       = new CColor(30, 30, 30, 255);
            oWhiteColor       = new CColor(220, 220, 220, 220);
            oLinesColor       = new CColor(255, 255, 255, 255);

            Common.Set_LocalStorageItem("ColorScheme", "Dark");
            break;
        }
    }

    var bBoardChange = false, bNavigatorChange = false;
    if (this.m_oBoardPr.bTrueColorBoard   !== bTrueColorBoard     ||
        this.m_oBoardPr.bTrueColorStones  !== bTrueColorStones    ||
        this.m_oBoardPr.oBoardColor.Compare(oBoardColor) !== true ||
        this.m_oBoardPr.bShellWhiteStones !== bShellWhiteStones   ||
        this.m_oBoardPr.bShadows          !== bShadows            ||
        this.m_oBoardPr.oWhiteColor.Compare(oWhiteColor) !== true ||
        this.m_oBoardPr.oBlackColor.Compare(oBlackColor) !== true ||
        this.m_oBoardPr.oLinesColor.Compare(oLinesColor) !== true ||
        this.m_oBoardPr.bDarkBoard        !== bDarkTheme)
    {

        this.m_oBoardPr.bTrueColorBoard   = bTrueColorBoard;
        this.m_oBoardPr.bTrueColorStones  = bTrueColorStones;
        this.m_oBoardPr.oBoardColor       = oBoardColor;
        this.m_oBoardPr.bShellWhiteStones = bShellWhiteStones;
        this.m_oBoardPr.bShadows          = bShadows;
        this.m_oBoardPr.oWhiteColor       = oWhiteColor;
        this.m_oBoardPr.oBlackColor       = oBlackColor;
        this.m_oBoardPr.oLinesColor       = oLinesColor;
        this.m_oBoardPr.bDarkBoard        = bDarkTheme;
        bBoardChange = true;
    }

    if (this.m_oNavigatorPr.bTrueColorBoard   !== bTrueColorBoard     ||
        this.m_oNavigatorPr.bTrueColorStones  !== bTrueColorStones    ||
        this.m_oNavigatorPr.oBoardColor.Compare(oBoardColor) !== true ||
        this.m_oNavigatorPr.bShadows          !== bShadows            ||
        this.m_oNavigatorPr.oWhiteColor.Compare(oWhiteColor) !== true ||
        this.m_oNavigatorPr.oBlackColor.Compare(oBlackColor) !== true ||
        this.m_oNavigatorPr.oLinesColor.Compare(oLinesColor) !== true ||
        this.m_oNavigatorPr.bDarkBoard        !== bDarkTheme)
    {
        this.m_oNavigatorPr.bTrueColorBoard  = bTrueColorBoard;
        this.m_oNavigatorPr.bTrueColorStones = bTrueColorStones;
        this.m_oNavigatorPr.oBoardColor      = oBoardColor;
        this.m_oNavigatorPr.bShadows         = bShadows;
        this.m_oNavigatorPr.oWhiteColor      = oWhiteColor;
        this.m_oNavigatorPr.oBlackColor      = oBlackColor;
        this.m_oNavigatorPr.oLinesColor      = oLinesColor;
        this.m_oNavigatorPr.bDarkBoard       = bDarkTheme;
        bNavigatorChange = true;
    }

    return {Board : bBoardChange, Navigator : bNavigatorChange};
};

var g_oGlobalSettings = new CSettings();

function CDrawing(oGameTree)
{
    this.m_oGameTree = oGameTree;

    if (oGameTree)
        oGameTree.Set_Drawing(this);

    this.m_oMainDiv        = null
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
        BoardModeNum    : []
    };

    this.m_oBoard     = null;
    this.m_oNavigator = null;
    this.m_oTimeLine  = null;

    this.m_oAutoPlayButton = null;
    this.m_oAutoPlaySlider = null;

    this.m_oBlackInfo      = null;
    this.m_oWhiteInfo      = null;

    // Массив ссылок на окна с комментариями
    this.m_aComments = [];

    var oThis = this;
    this.m_bNeedUpdateSize = true;

    this.private_OnTimerDraw = function()
    {
        Common_RequestAnimationFrame(oThis.private_OnTimerDraw);

        if (oThis.m_oNavigator && oThis.m_oNavigator.Need_Redraw())
        {
            oThis.m_oNavigator.Draw();
        }

        if (oThis.m_bNeedUpdateSize)
            oThis.private_UpdateSize(false);
    };

    this.private_OnTimerDraw();
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
CDrawing.prototype.Create_SimpleBoard = function(sDivId)
{
    this.private_SetMainDiv(sDivId);

    var DrawingBoard = new CDrawingBoard(this);
    DrawingBoard.Init(sDivId, this.m_oGameTree);
    DrawingBoard.Focus();

    this.m_aElements.push(DrawingBoard);

    this.Update_Size();
};
CDrawing.prototype.Create_BoardWithNavigateButtons = function(sDivId)
{
    g_oGlobalSettings.Load_FromLocalStorage();

    this.private_SetMainDiv(sDivId);
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

    var oDrawingBoard = new CDrawingBoard(this);
    oDrawingBoard.Init(sBoardDivId, oGameTree);
    oDrawingBoard.Focus();

    var oToolbarControl = CreateControlContainer(sToolbaDivId);
    oToolbarControl.Bounds.SetParams(0, 0, 1000, 0, false, false, false, true, -1, H);
    oToolbarControl.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
    oControl.AddControl(oToolbarControl);

    var oDrawingToolbar = new CDrawingToolbar(this);
    oDrawingToolbar.Init(sToolbaDivId, oGameTree, {Controls : [EDrawingButtonType.BackwardToStart, EDrawingButtonType.Backward_5, EDrawingButtonType.Backward, EDrawingButtonType.Forward, EDrawingButtonType.Forward_5, EDrawingButtonType.ForwardToEnd, EDrawingButtonType.NextVariant,
        EDrawingButtonType.PrevVariant, EDrawingButtonType.EditModeMove, EDrawingButtonType.EditModeScores, EDrawingButtonType.EditModeAddRem, EDrawingButtonType.EditModeTr, EDrawingButtonType.EditModeSq, EDrawingButtonType.EditModeCr, EDrawingButtonType.EditModeX, EDrawingButtonType.EditModeText, EDrawingButtonType.EditModeNum, EDrawingButtonType.GameInfo, EDrawingButtonType.About]});

    this.m_oControl = oMainControl;
    this.m_aElements.push(oDrawingBoard);
    this.m_aElements.push(oDrawingToolbar);

    this.Update_Size();
};
CDrawing.prototype.Create_BoardCommentsButtonsNavigator = function(sDivId)
{
    g_oGlobalSettings.Load_FromLocalStorage();

    var oGameTree = this.m_oGameTree;
    var oDrawingBoard = new CDrawingBoard(this);

    var oParentControl = CreateControlContainer(sDivId);
    var sMainDivId = sDivId + "GoBoard";

    this.private_CreateDiv(oParentControl.HtmlElement, sMainDivId);
    var oMainControl = CreateControlContainer(sMainDivId);
    oMainControl.Bounds.SetParams(0, 0, 1, 1, false, false, true, true, -1, -1);
    oMainControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oParentControl.AddControl(oMainControl);

    oMainControl.Set_Type(1, oDrawingBoard, {RMin : 400});

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

    var oNavigatorControl = CreateControlContainer(sNavigatorDivId);
    oNavigatorControl.Bounds.SetParams(0, 500, 1000, 1000, false, false, false, false, -1, -1);
    oNavigatorControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oPanelControl.AddControl(oNavigatorControl);

    var oDrawingNavigator = new CDrawingNavigator(this);
    oDrawingNavigator.Init(sNavigatorDivId, oGameTree);

    var sInfoDivId     = sCaTDivId + "_Info";
    var sCommentsDivId = sCaTDivId + "_Comments";
    var sToolsDivId    = sCaTDivId + "_Toolbar";
    var sToolsDivId2   = sCaTDivId + "_ToolbarSecond";
    var sTools2DivId   = sCaTDivId + "_ToolbarAutoPlay";
    var sTools3DivId   = sCaTDivId + "_ToolbarTimeLine";
    this.private_CreateDiv(oCaTControl.HtmlElement, sInfoDivId);
    this.private_CreateDiv(oCaTControl.HtmlElement, sCommentsDivId);
    this.private_CreateDiv(oCaTControl.HtmlElement, sToolsDivId);
    this.private_CreateDiv(oCaTControl.HtmlElement, sToolsDivId2);
    var oTools2Element = this.private_CreateDiv(oCaTControl.HtmlElement, sTools2DivId);
    this.private_CreateDiv(oCaTControl.HtmlElement, sTools3DivId);

    var sAutoPlaySlider = sTools2DivId + "_Slider";
    var sAutoPlayButton = sTools2DivId + "_Button";
    this.private_CreateDiv(oTools2Element, sAutoPlayButton);
    this.private_CreateDiv(oTools2Element, sAutoPlaySlider);

    var ToolbarH = 25;
    var InfoH    = 50;

    // INFO
    var oInfoControl = CreateControlContainer(sInfoDivId);
    oInfoControl.Bounds.SetParams(0, 0, 1000, 0, false, false, false, false, -1, InfoH);
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

    // END INFO

    var oCommentsControl = CreateControlContainer(sCommentsDivId);
    oCommentsControl.Bounds.SetParams(0, InfoH, 1000, ToolbarH * 4, false, true, false, true, -1, ToolbarH);
    oCommentsControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oCaTControl.AddControl(oCommentsControl);

    var oToolsControl = CreateControlContainer(sToolsDivId);
    oToolsControl.Bounds.SetParams(0, 0, 1000, ToolbarH * 3, false, false, false, true, -1, ToolbarH);
    oToolsControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
    oCaTControl.AddControl(oToolsControl);

    oToolsControl = CreateControlContainer(sToolsDivId2);
    oToolsControl.Bounds.SetParams(0, 0, 1000, ToolbarH * 2, false, false, false, true, -1, ToolbarH);
    oToolsControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
    oCaTControl.AddControl(oToolsControl);

    oToolsControl = CreateControlContainer(sTools2DivId);
    oToolsControl.Bounds.SetParams(0, 0, 1000, ToolbarH, false, false, false, true, -1, ToolbarH);
    oToolsControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
    oCaTControl.AddControl(oToolsControl);

    var oAutoControl = CreateControlContainer(sAutoPlayButton);
    oAutoControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, ToolbarH, -1);
    oAutoControl.Anchor = (g_anchor_left | g_anchor_top | g_anchor_bottom);
    oToolsControl.AddControl(oAutoControl);

    oAutoControl = CreateControlContainer(sAutoPlaySlider);
    oAutoControl.Bounds.SetParams(ToolbarH, 0, 1000, 1000, true, false, false, false, -1, ToolbarH);
    oAutoControl.Anchor = (g_anchor_top | g_anchor_right | g_anchor_bottom);
    oToolsControl.AddControl(oAutoControl);

    oToolsControl = CreateControlContainer(sTools3DivId);
    oToolsControl.Bounds.SetParams(0, 0, 1000, 0, false, false, false, true, -1, ToolbarH);
    oToolsControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
    oCaTControl.AddControl(oToolsControl);

    var oDrawingComents = new CDrawingComments(this);
    oDrawingComents.Init(sCommentsDivId, oGameTree);

    var oDrawingToolbar = new CDrawingToolbar(this);
    oDrawingToolbar.Init(sToolsDivId, oGameTree, {Controls : [EDrawingButtonType.BackwardToStart, EDrawingButtonType.Backward_5, EDrawingButtonType.Backward, EDrawingButtonType.Forward, EDrawingButtonType.Forward_5, EDrawingButtonType.ForwardToEnd, EDrawingButtonType.Pass, EDrawingButtonType.NextVariant, EDrawingButtonType.PrevVariant]});

    var oDrawingToolbar2 = new CDrawingToolbar(this);
    oDrawingToolbar2.Init(sToolsDivId2, oGameTree, {Controls : [EDrawingButtonType.EditModeMove, EDrawingButtonType.EditModeScores, EDrawingButtonType.EditModeAddRem, EDrawingButtonType.EditModeTr, EDrawingButtonType.EditModeSq, EDrawingButtonType.EditModeCr, EDrawingButtonType.EditModeX, EDrawingButtonType.EditModeText, EDrawingButtonType.EditModeNum, EDrawingButtonType.GameInfo, EDrawingButtonType.Settings, EDrawingButtonType.About]});


    var oDrawingTimeLineSlider = new CDrawingSlider(this);
    oDrawingTimeLineSlider.Init(sTools3DivId, oGameTree, EDrawingSliderType.Timeline, 0);

    var oDrawingAutoPlayButton = new CDrawingButton(this);
    oDrawingAutoPlayButton.Init(sAutoPlayButton, oGameTree, EDrawingButtonType.AutoPlay);

    var oDrawingAutoPlaySlider = new CDrawingSlider(this);
    oDrawingAutoPlaySlider.Init(sAutoPlaySlider, oGameTree, EDrawingSliderType.AutoPlaySpeed, 0);

    this.m_aElements.push(oDrawingBoard);
    this.m_aElements.push(oDrawingNavigator);
    this.m_aElements.push(oDrawingComents);
    this.m_aElements.push(oDrawingToolbar);
    this.m_aElements.push(oDrawingToolbar2);
    this.m_aElements.push(oDrawingTimeLineSlider);
    this.m_aElements.push(oDrawingAutoPlayButton);
    this.m_aElements.push(oDrawingAutoPlaySlider);
    this.m_aElements.push(oDrawingBlackInfo);
    this.m_aElements.push(oDrawingWhiteInfo);

    this.m_oControl = oParentControl;

    this.Update_Size();

    oGameTree.On_EndLoadDrawing();

    this.private_SetMainDiv(sMainDivId);
};
CDrawing.prototype.Create_Problems = function(sDivId)
{
    var oGameTree = this.m_oGameTree;

    var oDrawingBoard = new CDrawingBoard(this);
    oDrawingBoard.Set_ShellWhiteStones(false);

    var oParentControl = CreateControlContainer(sDivId);
    var sMainDivId = sDivId + "GoBoard";
    this.private_CreateDiv(oParentControl.HtmlElement, sMainDivId);
    var oMainControl = CreateControlContainer(sMainDivId);
    oMainControl.Bounds.SetParams(0, 0, 1, 1, false, false, true, true, -1, -1);
    oMainControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oParentControl.AddControl(oMainControl);

    oMainControl.Set_Type(1, oDrawingBoard, {RMin : 100});

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

    var sToolsDivId    = sPanelDivId + "_Toolbar";
    var sCommentsDivId = sPanelDivId + "_Comments";
    this.private_CreateDiv(oPanelControl.HtmlElement, sCommentsDivId);
    this.private_CreateDiv(oPanelControl.HtmlElement, sToolsDivId);

    var ToolbarH = 25;

    var oCommentsControl = CreateControlContainer(sCommentsDivId);
    oCommentsControl.Bounds.SetParams(0, ToolbarH, 1000, 1000, false, true, false, false, -1, -1);
    oCommentsControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oPanelControl.AddControl(oCommentsControl);

    var oToolsControl = CreateControlContainer(sToolsDivId);
    oToolsControl.Bounds.SetParams(0, 0, 1000, 1000, true, true, false, true, -1, ToolbarH);
    oToolsControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top);
    oPanelControl.AddControl(oToolsControl);

    var oDrawingComments = new CDrawingComments(this);
    oDrawingComments.Init(sCommentsDivId, oGameTree);

    var oDrawingToolbar = new CDrawingToolbar(this);
    oDrawingToolbar.Init(sToolsDivId, oGameTree, {Controls : [EDrawingButtonType.BackwardToStart]});

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
CDrawing.prototype.private_SetMainDiv = function(sDivId)
{
    this.m_oMainDiv = document.getElementById(sDivId);
};
CDrawing.prototype.private_UpdateSize = function(bForce)
{
    this.m_bNeedUpdateSize = false;

    if (this.m_oControl)
    {
        var W = this.m_oControl.HtmlElement.clientWidth;
        var H = this.m_oControl.HtmlElement.clientHeight;

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
};
CDrawing.prototype.Update_WhiteRank = function(sRank)
{
    if (this.m_oWhiteInfo)
        this.m_oWhiteInfo.Update_Rank(sRank);
};
CDrawing.prototype.Update_Captured = function(dBlack, dWhite)
{
    if (this.m_oBlackInfo)
        this.m_oBlackInfo.Update_Captured(dBlack);

    if (this.m_oWhiteInfo)
        this.m_oWhiteInfo.Update_Captured(dWhite);
};
CDrawing.prototype.Update_Scores = function(dBlack, dWhite)
{
    if (this.m_oBlackInfo)
        this.m_oBlackInfo.Update_Scores(dBlack);

    if (this.m_oWhiteInfo)
        this.m_oWhiteInfo.Update_Scores(dWhite);
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

    // TimeLine
    if (this.m_oTimeLine)
        this.m_oTimeLine.Update_Pos(oIState.TimelinePos);
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