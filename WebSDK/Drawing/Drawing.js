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

var ESettingsNavigatorLabels =
{
    Empty                     : 0,
    MoveNumbers               : 1,
    MoveNumbersCurrentVariant : 2,
    MoveCoordinates           : 3
};

var ESettingsLoadShowVariants =
{
    None     : 0,
    Curr     : 1,
    Next     : 2,
    FromFile : 3
};

var EDrawingTemplate =
{
    None        : 0,
    SimpleBoard : 1,
    Viewer      : 2,
    VerEditor   : 3,
    HorEditor   : 4,
    Problems    : 5
};

function CSettingsBase()
{
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
CSettingsBase.prototype.private_SetColorScheme = function(eScheme)
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
        default:
        case EColorScheme.TrueColor:
        {
            bTrueColorBoard   = true;
            bTrueColorStones  = true;
            bShellWhiteStones = true;
            bShadows          = true;

            oBoardColor       = new CColor(231, 188, 95, 255);
            oLinesColor       = new CColor(0, 0, 0, 255);
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

function CSettings()
{
    CSettings.superclass.constructor.call(this);

    this.m_bSound = true;

    this.m_bLoadUnfinishedFilesOnLastNode = false;
    this.m_bRulers                        = false;
    this.m_bCycleThroughVariants          = false;
    this.m_eNavigatorLabels               = ESettingsNavigatorLabels.MoveNumbers;
    this.m_eLoadShowVariants              = ESettingsLoadShowVariants.FromFile;
    this.m_bShowTarget                    = true;

    this.m_bMultiLevelToolbarMainNavigation = true;
    this.m_bMultiLevelToolbarTreeNavigation = true;
    this.m_bMultiLevelToolbarGeneral        = true;
    this.m_bMultiLevelToolbarAutoPlay       = true;
    this.m_bMultiLevelToolbarTimeline       = true;
    this.m_bMultiLevelToolbarKifuMode       = true;
}
CommonExtend(CSettings, CSettingsBase);
CSettings.prototype.Load_FromLocalStorage = function()
{
    // Appearance
    this.m_bShowTarget           = ("0" === Common.Get_LocalStorageItem("ShowTarget") ? false : true);
    this.m_bCycleThroughVariants = ("1" === Common.Get_LocalStorageItem("CycleThroughVariants") ? true : false);
    this.m_bSound                = ("0" === Common.Get_LocalStorageItem("Sound") ? false : true);

    var sNavigatorLabels    = Common.Get_LocalStorageItem("NavigatorLabels");
    this.m_eNavigatorLabels = (!sNavigatorLabels || "" === sNavigatorLabels ? ESettingsNavigatorLabels.MoveNumbers : parseInt(sNavigatorLabels));

    // ColorScheme
    var eColorScheme = EColorScheme.TrueColor;
    var sColorScheme = Common.Get_LocalStorageItem("ColorScheme");
    if ("BookStyle" === sColorScheme)
        eColorScheme = EColorScheme.BookStyle;
    else if ("SimpleColor" === sColorScheme)
        eColorScheme = EColorScheme.SimpleColor;
    else if ("Dark" === sColorScheme)
        eColorScheme = EColorScheme.Dark;

    this.Set_ColorScheme(eColorScheme);

    // Loading Settings
    this.m_bLoadUnfinishedFilesOnLastNode = ("1" === Common.Get_LocalStorageItem("LoadUnfinishedFilesOnLastNode") ? true : false);

    var sLoadShowVariants    = Common.Get_LocalStorageItem("ShowVariants");
    this.m_eLoadShowVariants = (!sLoadShowVariants || "" === sLoadShowVariants ? ESettingsLoadShowVariants.FromFile : parseInt(sLoadShowVariants));

    // Rulers
    var sRulers    = Common.Get_LocalStorageItem("Rulers");
    this.m_bRulers = (sRulers === "1" ? true : false);

    // MultilevelToolbar
    this.m_bMultiLevelToolbarMainNavigation = Common.Get_LocalStorageItem("MultiLevelToolbarMainNavigation") == "0" ? false : true;
    this.m_bMultiLevelToolbarTreeNavigation = Common.Get_LocalStorageItem("MultiLevelToolbarTreeNavigation") == "0" ? false : true;
    this.m_bMultiLevelToolbarGeneral        = Common.Get_LocalStorageItem("MultiLevelToolbarGeneral") == "0" ? false : true;
    this.m_bMultiLevelToolbarAutoPlay       = Common.Get_LocalStorageItem("MultiLevelToolbarAutoPlay") == "1" ? true : false;
    this.m_bMultiLevelToolbarTimeline       = Common.Get_LocalStorageItem("MultiLevelToolbarTimeline") == "1" ? true : false;
    this.m_bMultiLevelToolbarKifuMode       = Common.Get_LocalStorageItem("MultiLevelToolbarKifuMode") == "1" ? true : false;
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
CSettings.prototype.Set_Rulers = function(Value)
{
    this.m_bRulers = Value;
    Common.Set_LocalStorageItem("Rulers", Value === true ? "1" : "0");
};
CSettings.prototype.Is_Rulers = function()
{
    return this.m_bRulers;
};
CSettings.prototype.Set_LoadUnfinishedFilesOnLastNode = function(Value)
{
    this.m_bLoadUnfinishedFilesOnLastNode = Value;
    Common.Set_LocalStorageItem("LoadUnfinishedFilesOnLastNode", Value === true ? "1" : "0");
};
CSettings.prototype.Is_LoadUnfinishedFilesOnLastNode = function()
{
    return this.m_bLoadUnfinishedFilesOnLastNode;
};
CSettings.prototype.Set_CycleThroughVariants = function(Value)
{
    this.m_bCycleThroughVariants = Value;
    Common.Set_LocalStorageItem("CycleThroughVariants", Value === true ? "1" : "0");
};
CSettings.prototype.Is_CycleThroughVariants = function()
{
    return this.m_bCycleThroughVariants;
};
CSettings.prototype.Set_ShowTarget = function(Value)
{
    this.m_bShowTarget = Value;
    Common.Set_LocalStorageItem("ShowTarget", Value === true ? "1" : "0");
};
CSettings.prototype.Is_ShowTarget = function()
{
    return this.m_bShowTarget;
};
CSettings.prototype.Set_ColorScheme = function(eScheme)
{
    switch (eScheme)
    {
    case EColorScheme.TrueColor: Common.Set_LocalStorageItem("ColorScheme", "TrueColor"); break;
    case EColorScheme.BookStyle: Common.Set_LocalStorageItem("ColorScheme", "BookStyle"); break;
    case EColorScheme.SimpleColor: Common.Set_LocalStorageItem("ColorScheme", "SimpleColor"); break;
    case EColorScheme.Dark: Common.Set_LocalStorageItem("ColorScheme", "Dark"); break;
    }

    return this.private_SetColorScheme(eScheme);
};
CSettings.prototype.Get_NavigatorLabel = function()
{
    return this.m_eNavigatorLabels;
};
CSettings.prototype.Set_NavigatorLabel = function(eValue)
{
    this.m_eNavigatorLabels = eValue;
    Common.Set_LocalStorageItem("NavigatorLabels", eValue);
};
CSettings.prototype.Get_LoadShowVariants = function()
{
    return this.m_eLoadShowVariants;
};
CSettings.prototype.Set_LoadShowVariants = function(eValue)
{
    this.m_eLoadShowVariants = eValue;
    Common.Set_LocalStorageItem("ShowVariants", eValue);
};
CSettings.prototype.Toggle_MultiLevelToolbarMainNavigation = function()
{
    this.m_bMultiLevelToolbarMainNavigation = !this.m_bMultiLevelToolbarMainNavigation;
    Common.Set_LocalStorageItem("MultiLevelToolbarMainNavigation", true === this.m_bMultiLevelToolbarMainNavigation ? "1" : "0");
    return this.m_bMultiLevelToolbarMainNavigation;
};
CSettings.prototype.Toggle_MultiLevelToolbarTreeNavigation = function()
{
    this.m_bMultiLevelToolbarTreeNavigation = !this.m_bMultiLevelToolbarTreeNavigation;
    Common.Set_LocalStorageItem("MultiLevelToolbarTreeNavigation", true === this.m_bMultiLevelToolbarTreeNavigation ? "1" : "0");
    return this.m_bMultiLevelToolbarTreeNavigation;
};
CSettings.prototype.Toggle_MultiLevelToolbarGeneral = function()
{
    this.m_bMultiLevelToolbarGeneral = !this.m_bMultiLevelToolbarGeneral;
    Common.Set_LocalStorageItem("MultiLevelToolbarGeneral", true === this.m_bMultiLevelToolbarGeneral ? "1" : "0");
    return this.m_bMultiLevelToolbarGeneral;
};
CSettings.prototype.Toggle_MultiLevelToolbarAutoPlay = function()
{
    this.m_bMultiLevelToolbarAutoPlay = !this.m_bMultiLevelToolbarAutoPlay;
    Common.Set_LocalStorageItem("MultiLevelToolbarAutoPlay", true === this.m_bMultiLevelToolbarAutoPlay ? "1" : "0");
    return this.m_bMultiLevelToolbarAutoPlay;
};
CSettings.prototype.Toggle_MultiLevelToolbarTimeline = function()
{
    this.m_bMultiLevelToolbarTimeline = !this.m_bMultiLevelToolbarTimeline;
    Common.Set_LocalStorageItem("MultiLevelToolbarTimeline", true === this.m_bMultiLevelToolbarTimeline ? "1" : "0");
    return this.m_bMultiLevelToolbarTimeline;
};
CSettings.prototype.Toggle_MultiLevelToolbarKifuMode = function()
{
    this.m_bMultiLevelToolbarKifuMode = !this.m_bMultiLevelToolbarKifuMode;
    Common.Set_LocalStorageItem("MultiLevelToolbarKifuMode", true === this.m_bMultiLevelToolbarKifuMode ? "1" : "0");
    return this.m_bMultiLevelToolbarKifuMode;
};
CSettings.prototype.Is_MultiLevelToolbarMainNavigation = function()
{
    return this.m_bMultiLevelToolbarMainNavigation;
};
CSettings.prototype.Is_MultiLevelToolbarTreeNavigation = function()
{
    return this.m_bMultiLevelToolbarTreeNavigation;
};
CSettings.prototype.Is_MultiLevelToolbarGeneral = function()
{
    return this.m_bMultiLevelToolbarGeneral;
};
CSettings.prototype.Is_MultiLevelToolbarAutoPlay = function()
{
    return this.m_bMultiLevelToolbarAutoPlay;
};
CSettings.prototype.Is_MultiLevelToolbarTimeline = function()
{
    return this.m_bMultiLevelToolbarTimeline;
};
CSettings.prototype.Is_MultiLevelToolbarKifuMode = function()
{
    return this.m_bMultiLevelToolbarKifuMode;
};
var g_oGlobalSettings = new CSettings();

function CLocalSetting(oGameTree)
{
    CLocalSetting.superclass.constructor.call(this);

    this.m_oBoardPr =
    {
        bTrueColorBoard   : null,
        bTrueColorStones  : null,
        oBoardColor       : null,
        bShellWhiteStones : null,
        bShadows          : null,
        oWhiteColor       : null,
        oBlackColor       : null,
        oLinesColor       : null,
        bDarkBoard        : null
    };

    this.m_oNavigatorPr =
    {
        bTrueColorBoard  : null,
        bTrueColorStones : null,
        oBoardColor      : null,
        bShadows         : null,
        oWhiteColor      : null,
        oBlackColor      : null,
        oLinesColor      : null,
        bDarkBoard       : null
    };

    this.m_oGameTree = oGameTree;

    this.m_bShowTarget = null;

    this.m_bEmbedding  = false;
}
CommonExtend(CLocalSetting, CSettingsBase);
CLocalSetting.prototype.Is_Embedding = function()
{
    return this.m_bEmbedding;
};
CLocalSetting.prototype.Set_Embedding = function(bEmbedding)
{
    this.m_bEmbedding = bEmbedding;
};
CLocalSetting.prototype.Set_ColorScheme = function(eScheme)
{
    if (null !== eScheme)
        return this.private_SetColorScheme(eScheme);
    else
        return {Board : true, Navigator : true};
};
CLocalSetting.prototype.Is_BoardTrueColorBoard = function()
{
    if (null === this.m_oBoardPr.bTrueColorBoard)
        return g_oGlobalSettings.m_oBoardPr.bTrueColorBoard;
    else
        return this.m_oBoardPr.bTrueColorBoard;
};
CLocalSetting.prototype.Is_BoardTrueColorStones = function()
{
    if (null === this.m_oBoardPr.bTrueColorStones)
        return g_oGlobalSettings.m_oBoardPr.bTrueColorStones;
    else
        return this.m_oBoardPr.bTrueColorStones;
};
CLocalSetting.prototype.Is_BoardShellWhiteStones = function()
{
    if (null === this.m_oBoardPr.bShellWhiteStones)
        return g_oGlobalSettings.m_oBoardPr.bShellWhiteStones;
    else
        return this.m_oBoardPr.bShellWhiteStones;
};
CLocalSetting.prototype.Set_BoardShellWhiteStones = function(isShell)
{
    this.m_oBoardPr.bShellWhiteStones = isShell;
};
CLocalSetting.prototype.Is_BoardShadows = function()
{
    if (null === this.m_oBoardPr.bShadows)
        return g_oGlobalSettings.m_oBoardPr.bShadows;
    else
        return this.m_oBoardPr.bShadows;
};
CLocalSetting.prototype.Get_BoardWhiteColor = function()
{
    if (null === this.m_oBoardPr.oWhiteColor)
        return g_oGlobalSettings.m_oBoardPr.oWhiteColor;
    else
        return this.m_oBoardPr.oWhiteColor;
};
CLocalSetting.prototype.Get_BoardBlackColor = function()
{
    if (null === this.m_oBoardPr.oBlackColor)
        return g_oGlobalSettings.m_oBoardPr.oBlackColor;
    else
        return this.m_oBoardPr.oBlackColor;
};
CLocalSetting.prototype.Get_BoardBoardColor = function()
{
    if (null === this.m_oBoardPr.oBoardColor)
        return g_oGlobalSettings.m_oBoardPr.oBoardColor;
    else
        return this.m_oBoardPr.oBoardColor;
};
CLocalSetting.prototype.Get_BoardLinesColor = function()
{
    if (null === this.m_oBoardPr.oLinesColor)
        return g_oGlobalSettings.m_oBoardPr.oLinesColor;
    else
        return this.m_oBoardPr.oLinesColor;
};
CLocalSetting.prototype.Is_BoardDarkBoard = function()
{
    if (null === this.m_oBoardPr.bDarkBoard)
        return g_oGlobalSettings.m_oBoardPr.bDarkBoard;
    else
        return this.m_oBoardPr.bDarkBoard;
};
CLocalSetting.prototype.Is_NavigatorTrueColorBoard = function()
{
    if (null === this.m_oNavigatorPr.bTrueColorBoard)
        return g_oGlobalSettings.m_oNavigatorPr.bTrueColorBoard;
    else
        return this.m_oNavigatorPr.bTrueColorBoard;
};
CLocalSetting.prototype.Is_NavigatorTrueColorStones = function()
{
    if (null === this.m_oNavigatorPr.bTrueColorStones)
        return g_oGlobalSettings.m_oNavigatorPr.bTrueColorStones;
    else
        return this.m_oNavigatorPr.bTrueColorStones;
};
CLocalSetting.prototype.Is_NavigatorShadows = function()
{
    if (null === this.m_oNavigatorPr.bShadows)
        return g_oGlobalSettings.m_oNavigatorPr.bShadows;
    else
        return this.m_oNavigatorPr.bShadows;
};
CLocalSetting.prototype.Get_NavigatorWhiteColor = function()
{
    if (null === this.m_oNavigatorPr.oWhiteColor)
        return g_oGlobalSettings.m_oNavigatorPr.oWhiteColor;
    else
        return this.m_oNavigatorPr.oWhiteColor;
};
CLocalSetting.prototype.Get_NavigatorBlackColor = function()
{
    if (null === this.m_oNavigatorPr.oBlackColor)
        return g_oGlobalSettings.m_oNavigatorPr.oBlackColor;
    else
        return this.m_oNavigatorPr.oBlackColor;
};
CLocalSetting.prototype.Get_NavigatorBoardColor = function()
{
    if (null === this.m_oNavigatorPr.oBoardColor)
        return g_oGlobalSettings.m_oNavigatorPr.oBoardColor;
    else
        return this.m_oNavigatorPr.oBoardColor;
};
CLocalSetting.prototype.Get_NavigatorLinesColor = function()
{
    if (null === this.m_oNavigatorPr.oLinesColor)
        return g_oGlobalSettings.m_oNavigatorPr.oLinesColor;
    else
        return this.m_oNavigatorPr.oLinesColor;
};
CLocalSetting.prototype.Is_NavigatorDarkBoard = function()
{
    if (null === this.m_oNavigatorPr.bDarkBoard)
        return g_oGlobalSettings.m_oNavigatorPr.bDarkBoard;
    else
        return this.m_oNavigatorPr.bDarkBoard;
};
CLocalSetting.prototype.Is_ShowTarget = function()
{
    if (null === this.m_bShowTarget)
        return g_oGlobalSettings.Is_ShowTarget();
    else
        return this.m_bShowTarget;
};
CLocalSetting.prototype.Set_ShowTarget = function(bShowTarget)
{
    this.m_bShowTarget = bShowTarget;
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
        KifuMode        : null
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

    this.private_OnMainDivClick = function()
    {
        if (oThis.m_oSelectBoardModeButton)
            oThis.m_oSelectBoardModeButton.Hide_Toolbar();

        if (oThis.m_oButtons.ToolbarCustomize)
            oThis.m_oButtons.ToolbarCustomize.Hide_ContextMenu(false);

        if (oThis.m_oButtons.Menu)
            oThis.m_oButtons.Menu.Hide_Menu(false);
    };
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
}
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
CDrawing.prototype.Toggle_MultiLevelToolbarMainNavigation = function()
{
    var bShow = g_oGlobalSettings.Toggle_MultiLevelToolbarMainNavigation();

    if (this.m_oButtons.ToolbarCustomize)
        this.m_oButtons.ToolbarCustomize.Set_MainNavigation(bShow);

    return bShow;
};
CDrawing.prototype.Toggle_MultiLevelToolbarTreeNavigation = function()
{
    var bShow = g_oGlobalSettings.Toggle_MultiLevelToolbarTreeNavigation();

    if (this.m_oButtons.ToolbarCustomize)
        this.m_oButtons.ToolbarCustomize.Set_TreeNavigation(bShow);

    return bShow;
};
CDrawing.prototype.Toggle_MultiLevelToolbarGeneral = function()
{
    var bShow = g_oGlobalSettings.Toggle_MultiLevelToolbarGeneral();

    if (this.m_oButtons.ToolbarCustomize)
        this.m_oButtons.ToolbarCustomize.Set_General(bShow);

    return bShow;
};
CDrawing.prototype.Toggle_MultiLevelToolbarAutoPlay = function()
{
    var bShow = g_oGlobalSettings.Toggle_MultiLevelToolbarAutoPlay();

    if (this.m_oButtons.ToolbarCustomize)
        this.m_oButtons.ToolbarCustomize.Set_AutoPlay(bShow);

    return bShow;
};
CDrawing.prototype.Toggle_MultiLevelToolbarTimeline = function()
{
    var bShow = g_oGlobalSettings.Toggle_MultiLevelToolbarTimeline();

    if (this.m_oButtons.ToolbarCustomize)
        this.m_oButtons.ToolbarCustomize.Set_Timeline(bShow);

    return bShow;
};
CDrawing.prototype.Toggle_MultiLevelToolbarKifuMode = function()
{
    var bShow = g_oGlobalSettings.Toggle_MultiLevelToolbarKifuMode();

    if (this.m_oButtons.ToolbarCustomize)
        this.m_oButtons.ToolbarCustomize.Set_KifuMode(bShow);

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