"use strict";

/**
 * Copyright 2021 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     09.01.2021
 * Time     0:02
 */

const ESettingsNavigatorLabels = {
	Empty                     : 0,
	MoveNumbers               : 1,
	MoveNumbersCurrentVariant : 2,
	MoveCoordinates           : 3
};

const ESettingsLoadShowVariants = {
	None     : 0,
	Curr     : 1,
	Next     : 2,
	FromFile : 3
};

function CSettingsBase()
{
	this.m_oBoardPr = {
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

	this.m_oNavigatorPr = {
		bTrueColorBoard  : true,
		bTrueColorStones : true,
		oBoardColor      : new CColor(231, 188, 95, 255),
		bShadows         : true,
		oWhiteColor      : new CColor(255, 255, 255, 255),
		oBlackColor      : new CColor(0, 0, 0, 255),
		oLinesColor      : new CColor(0, 0, 0, 255),
		bDarkBoard       : false
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

			oBoardColor = new CColor(231, 188, 95, 255);
			oLinesColor = new CColor(0, 0, 0, 255);
			break;
		}
		case EColorScheme.BookStyle:
		{
			bTrueColorBoard   = false;
			bTrueColorStones  = false;
			bShellWhiteStones = false;
			bShadows          = false;

			oBoardColor = new CColor(255, 255, 255, 255);
			oLinesColor = new CColor(0, 0, 0, 255);
			break;
		}
		case EColorScheme.SimpleColor:
		{
			bTrueColorBoard   = false;
			bTrueColorStones  = false;
			bShellWhiteStones = false;
			bShadows          = false;

			oBoardColor = new CColor(231, 188, 95, 255);
			oLinesColor = new CColor(0, 0, 0, 255);
			break;
		}
		case EColorScheme.Dark:
		{
			bTrueColorBoard   = false;
			bTrueColorStones  = false;
			bShellWhiteStones = false;
			bShadows          = false;
			bDarkTheme        = true;

			oBoardColor = new CColor(30, 30, 30, 255);
			oWhiteColor = new CColor(220, 220, 220, 220);
			oLinesColor = new CColor(255, 255, 255, 255);
			break;
		}
	}

	var bBoardChange = false, bNavigatorChange = false;
	if (this.m_oBoardPr.bTrueColorBoard !== bTrueColorBoard
		|| this.m_oBoardPr.bTrueColorStones !== bTrueColorStones
		|| this.m_oBoardPr.oBoardColor.Compare(oBoardColor) !== true
		|| this.m_oBoardPr.bShellWhiteStones !== bShellWhiteStones
		|| this.m_oBoardPr.bShadows !== bShadows
		|| this.m_oBoardPr.oWhiteColor.Compare(oWhiteColor) !== true
		|| this.m_oBoardPr.oBlackColor.Compare(oBlackColor) !== true
		|| this.m_oBoardPr.oLinesColor.Compare(oLinesColor) !== true
		|| this.m_oBoardPr.bDarkBoard !== bDarkTheme)
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
		bBoardChange                      = true;
	}

	if (this.m_oNavigatorPr.bTrueColorBoard !== bTrueColorBoard
		|| this.m_oNavigatorPr.bTrueColorStones !== bTrueColorStones
		|| this.m_oNavigatorPr.oBoardColor.Compare(oBoardColor) !== true
		|| this.m_oNavigatorPr.bShadows !== bShadows
		|| this.m_oNavigatorPr.oWhiteColor.Compare(oWhiteColor) !== true
		|| this.m_oNavigatorPr.oBlackColor.Compare(oBlackColor) !== true
		|| this.m_oNavigatorPr.oLinesColor.Compare(oLinesColor) !== true
		|| this.m_oNavigatorPr.bDarkBoard !== bDarkTheme)
	{
		this.m_oNavigatorPr.bTrueColorBoard  = bTrueColorBoard;
		this.m_oNavigatorPr.bTrueColorStones = bTrueColorStones;
		this.m_oNavigatorPr.oBoardColor      = oBoardColor;
		this.m_oNavigatorPr.bShadows         = bShadows;
		this.m_oNavigatorPr.oWhiteColor      = oWhiteColor;
		this.m_oNavigatorPr.oBlackColor      = oBlackColor;
		this.m_oNavigatorPr.oLinesColor      = oLinesColor;
		this.m_oNavigatorPr.bDarkBoard       = bDarkTheme;
		bNavigatorChange                     = true;
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
	this.m_bMultiLevelToolbarNavigationMap  = true;
	this.m_bMultiLevelToolbarKifuMode       = true;
}
CommonExtend(CSettings, CSettingsBase);
CSettings.prototype.Load_FromLocalStorage = function()
{
	// Appearance
	this.m_bShowTarget           = ("0" === Common.GetLocalStorageItem("ShowTarget") ? false : true);
	this.m_bCycleThroughVariants = ("1" === Common.GetLocalStorageItem("CycleThroughVariants") ? true : false);
	this.m_bSound                = ("0" === Common.GetLocalStorageItem("Sound") ? false : true);

	var sNavigatorLabels    = Common.GetLocalStorageItem("NavigatorLabels");
	this.m_eNavigatorLabels = (!sNavigatorLabels || "" === sNavigatorLabels ? ESettingsNavigatorLabels.MoveNumbers : parseInt(sNavigatorLabels));

	// ColorScheme
	var eColorScheme = EColorScheme.TrueColor;
	var sColorScheme = Common.GetLocalStorageItem("ColorScheme");
	if ("BookStyle" === sColorScheme)
		eColorScheme = EColorScheme.BookStyle;
	else if ("SimpleColor" === sColorScheme)
		eColorScheme = EColorScheme.SimpleColor;
	else if ("Dark" === sColorScheme)
		eColorScheme = EColorScheme.Dark;

	this.Set_ColorScheme(eColorScheme);

	// Loading Settings
	this.m_bLoadUnfinishedFilesOnLastNode = ("1" === Common.GetLocalStorageItem("LoadUnfinishedFilesOnLastNode") ? true : false);

	var sLoadShowVariants    = Common.GetLocalStorageItem("ShowVariants");
	this.m_eLoadShowVariants = (!sLoadShowVariants || "" === sLoadShowVariants ? ESettingsLoadShowVariants.FromFile : parseInt(sLoadShowVariants));

	// Rulers
	var sRulers    = Common.GetLocalStorageItem("Rulers");
	this.m_bRulers = (sRulers === "1" ? true : false);

	// MultilevelToolbar
	this.m_bMultiLevelToolbarMainNavigation = Common.GetLocalStorageItem("MultiLevelToolbarMainNavigation") !== "0";
	this.m_bMultiLevelToolbarTreeNavigation = Common.GetLocalStorageItem("MultiLevelToolbarTreeNavigation") !== "0";
	this.m_bMultiLevelToolbarGeneral        = Common.GetLocalStorageItem("MultiLevelToolbarGeneral") !== "0";
	this.m_bMultiLevelToolbarAutoPlay       = Common.GetLocalStorageItem("MultiLevelToolbarAutoPlay") === "1";
	this.m_bMultiLevelToolbarTimeline       = Common.GetLocalStorageItem("MultiLevelToolbarTimeline") === "1";
	this.m_bMultiLevelToolbarNavigationMap  = Common.GetLocalStorageItem("MultiLevelToolbarNavigationMap") !== "0";
	this.m_bMultiLevelToolbarKifuMode       = Common.GetLocalStorageItem("MultiLevelToolbarKifuMode") === "1";
};
CSettings.prototype.Set_Sound = function(Value)
{
	this.m_bSound = Value;
	Common.SetLocalStorageItem("Sound", Value === true ? "1" : "0");
};
CSettings.prototype.Is_SoundOn = function()
{
	return this.m_bSound;
};
CSettings.prototype.Set_Rulers = function(Value)
{
	this.m_bRulers = Value;
	Common.SetLocalStorageItem("Rulers", Value === true ? "1" : "0");
};
CSettings.prototype.Is_Rulers = function()
{
	return this.m_bRulers;
};
CSettings.prototype.Set_LoadUnfinishedFilesOnLastNode = function(Value)
{
	this.m_bLoadUnfinishedFilesOnLastNode = Value;
	Common.SetLocalStorageItem("LoadUnfinishedFilesOnLastNode", Value === true ? "1" : "0");
};
CSettings.prototype.Is_LoadUnfinishedFilesOnLastNode = function()
{
	return this.m_bLoadUnfinishedFilesOnLastNode;
};
CSettings.prototype.Set_CycleThroughVariants = function(Value)
{
	this.m_bCycleThroughVariants = Value;
	Common.SetLocalStorageItem("CycleThroughVariants", Value === true ? "1" : "0");
};
CSettings.prototype.Is_CycleThroughVariants = function()
{
	return this.m_bCycleThroughVariants;
};
CSettings.prototype.Set_ShowTarget = function(Value)
{
	this.m_bShowTarget = Value;
	Common.SetLocalStorageItem("ShowTarget", Value === true ? "1" : "0");
};
CSettings.prototype.Is_ShowTarget = function()
{
	return this.m_bShowTarget;
};
CSettings.prototype.Set_ColorScheme = function(eScheme)
{
	switch (eScheme)
	{
		case EColorScheme.TrueColor: Common.SetLocalStorageItem("ColorScheme", "TrueColor"); break;
		case EColorScheme.BookStyle: Common.SetLocalStorageItem("ColorScheme", "BookStyle"); break;
		case EColorScheme.SimpleColor: Common.SetLocalStorageItem("ColorScheme", "SimpleColor"); break;
		case EColorScheme.Dark: Common.SetLocalStorageItem("ColorScheme", "Dark"); break;
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
	Common.SetLocalStorageItem("NavigatorLabels", eValue);
};
CSettings.prototype.Get_LoadShowVariants = function()
{
	return this.m_eLoadShowVariants;
};
CSettings.prototype.Set_LoadShowVariants = function(eValue)
{
	this.m_eLoadShowVariants = eValue;
	Common.SetLocalStorageItem("ShowVariants", eValue);
};
CSettings.prototype.ToggleMultiLevelToolbarMainNavigation = function()
{
	this.m_bMultiLevelToolbarMainNavigation = !this.m_bMultiLevelToolbarMainNavigation;
	Common.SetLocalStorageItem("MultiLevelToolbarMainNavigation", true === this.m_bMultiLevelToolbarMainNavigation ? "1" : "0");
	return this.m_bMultiLevelToolbarMainNavigation;
};
CSettings.prototype.ToggleMultiLevelToolbarTreeNavigation = function()
{
	this.m_bMultiLevelToolbarTreeNavigation = !this.m_bMultiLevelToolbarTreeNavigation;
	Common.SetLocalStorageItem("MultiLevelToolbarTreeNavigation", true === this.m_bMultiLevelToolbarTreeNavigation ? "1" : "0");
	return this.m_bMultiLevelToolbarTreeNavigation;
};
CSettings.prototype.ToggleMultiLevelToolbarGeneral = function()
{
	this.m_bMultiLevelToolbarGeneral = !this.m_bMultiLevelToolbarGeneral;
	Common.SetLocalStorageItem("MultiLevelToolbarGeneral", true === this.m_bMultiLevelToolbarGeneral ? "1" : "0");
	return this.m_bMultiLevelToolbarGeneral;
};
CSettings.prototype.ToggleMultiLevelToolbarAutoPlay = function()
{
	this.m_bMultiLevelToolbarAutoPlay = !this.m_bMultiLevelToolbarAutoPlay;
	Common.SetLocalStorageItem("MultiLevelToolbarAutoPlay", true === this.m_bMultiLevelToolbarAutoPlay ? "1" : "0");
	return this.m_bMultiLevelToolbarAutoPlay;
};
CSettings.prototype.ToggleMultiLevelToolbarTimeline = function()
{
	this.m_bMultiLevelToolbarTimeline = !this.m_bMultiLevelToolbarTimeline;
	Common.SetLocalStorageItem("MultiLevelToolbarTimeline", true === this.m_bMultiLevelToolbarTimeline ? "1" : "0");
	return this.m_bMultiLevelToolbarTimeline;
};
CSettings.prototype.ToggleMultiLevelToolbarNavigationMap = function()
{
	this.m_bMultiLevelToolbarNavigationMap = !this.m_bMultiLevelToolbarNavigationMap;
	Common.SetLocalStorageItem("MultiLevelToolbarNavigationMap", true === this.m_bMultiLevelToolbarNavigationMap ? "1" : "0");
	return this.m_bMultiLevelToolbarNavigationMap;
};
CSettings.prototype.ToggleMultiLevelToolbarKifuMode = function()
{
	this.m_bMultiLevelToolbarKifuMode = !this.m_bMultiLevelToolbarKifuMode;
	Common.SetLocalStorageItem("MultiLevelToolbarKifuMode", true === this.m_bMultiLevelToolbarKifuMode ? "1" : "0");
	return this.m_bMultiLevelToolbarKifuMode;
};
CSettings.prototype.IsMultiLevelToolbarMainNavigation = function()
{
	return this.m_bMultiLevelToolbarMainNavigation;
};
CSettings.prototype.IsMultiLevelToolbarTreeNavigation = function()
{
	return this.m_bMultiLevelToolbarTreeNavigation;
};
CSettings.prototype.IsMultiLevelToolbarGeneral = function()
{
	return this.m_bMultiLevelToolbarGeneral;
};
CSettings.prototype.IsMultiLevelToolbarAutoPlay = function()
{
	return this.m_bMultiLevelToolbarAutoPlay;
};
CSettings.prototype.IsMultiLevelToolbarTimeline = function()
{
	return this.m_bMultiLevelToolbarTimeline;
};
CSettings.prototype.IsMultiLevelToolbarNavigationMap = function()
{
	return this.m_bMultiLevelToolbarNavigationMap;
};
CSettings.prototype.IsMultiLevelToolbarKifuMode = function()
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