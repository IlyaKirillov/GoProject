"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     27.11.14
 * Time     1:27
 */

function CDrawingToolbar(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;

    this.HtmlElement =
    {
        Control : null
    };

    this.m_oBColor = new CColor(217, 217, 217, 255);

    this.m_aControls = [];
    this.m_aDrawingControls = [];
}

CDrawingToolbar.prototype.Add_Control = function(oControl, nW, nSpace, eAlign)
{
    this.m_aDrawingControls.push(new CDrawingToolbarItem(oControl, nW, nSpace, eAlign));
};
CDrawingToolbar.prototype.Init = function(sDivId, oGameTree)
{
    this.m_oGameTree = oGameTree;

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var  oMainElement = this.HtmlElement.Control.HtmlElement;
    var  oMainControl = this.HtmlElement.Control;

    oMainElement.style.backgroundColor = this.m_oBColor.ToString();

    var nLeft  = 0;
    var nRight = 0;
    for (var nIndex = 0, nCount = this.m_aDrawingControls.length; nIndex < nCount; ++nIndex)
    {
        var oDrawingControl = this.m_aDrawingControls[nIndex];
        var oControl        = oDrawingControl.Get_Control();

        if (null !== oControl)
        {
            var sElementName = sDivId + nIndex;
            this.private_CreateDivElement(oMainElement, sElementName);

            if (EToolbarFloat.Left === oDrawingControl.Get_Align())
            {
                this.private_FillHtmlElement(oMainControl, sElementName, nLeft, oDrawingControl.Get_W(), true);
                nLeft += oDrawingControl.Get_W() + oDrawingControl.Get_Space();
            }
            else
            {
                this.private_FillHtmlElement(oMainControl, sElementName, nRight, oDrawingControl.Get_W(), false);
                nRight += oDrawingControl.Get_W() + oDrawingControl.Get_Space();
            }

            oControl.Init(sElementName, oGameTree);

            this.m_aControls.push(oControl);
        }
    }

    this.Update_Size();
};
CDrawingToolbar.prototype.Update_Size = function()
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    this.HtmlElement.Control.Resize(W, H);
    for (var Index = 0, Count = this.m_aControls.length; Index < Count; Index++)
    {
        this.m_aControls[Index].Update_Size();
    }
};
CDrawingToolbar.prototype.Get_MinWidth = function()
{
    var nMinW = 0;
    for (var nIndex = 0, nCount = this.m_aDrawingControls.length; nIndex < nCount; ++nIndex)
    {
        var oItem = this.m_aDrawingControls[nIndex];

        var nW = oItem.Get_W();

        if (-1 === nW)
            nW = 0x00FFFFFF;

        nMinW += nW + oItem.Get_Space();
    }

    return nMinW;
};
CDrawingToolbar.prototype.private_CreateDivElement = function(oParentElement, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingToolbar.prototype.private_FillHtmlElement = function(oParentControl, sName, nDistance, nWidth, bLeftAlign)
{
    var oControl = CreateControlContainer(sName);

    if (bLeftAlign)
    {
        oControl.Bounds.SetParams(nDistance, 0, 1000, 1000, true, false, false, false, nWidth, -1);
        oControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom);
    }
    else
    {
        oControl.Bounds.SetParams(0, 0, nDistance, 1000, false, false, true, false, nWidth, -1);
        oControl.Anchor = (g_anchor_top | g_anchor_right | g_anchor_bottom);
    }

    oParentControl.AddControl(oControl);
};

function CDrawingNavigatorCommentsTabs(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;

    this.HtmlElement =
    {
        Control   : null,
        Comments  : { Control : null },
        Navgiator : { Control : null }
    };

    this.m_oBColor = new CColor(217, 217, 217, 255);
    this.m_oNavigatorButton = null;
    this.m_oCommentsButton  = null;
    this.m_oNavigatorDiv    = null;
    this.m_oCommentsDiv     = null;

    this.m_aControls = [];
}
CDrawingNavigatorCommentsTabs.prototype.Init = function(sDivId, oGameTree, _sNavigatorDivId, _sCommentsDivId)
{
    this.m_oGameTree = oGameTree;

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var  oMainElement = this.HtmlElement.Control.HtmlElement;
    var  oMainControl = this.HtmlElement.Control;

    oMainElement.style.backgroundColor = this.m_oBColor.ToString();

    var oCommentsControl = new CDrawingButtonTabComments(this.m_oDrawing);
    var sCommentsDivId = sDivId + "C";
    this.private_CreateDivElement(oMainElement, sCommentsDivId);
    this.private_FillHtmlElement(oMainControl, sCommentsDivId, 0);
    oCommentsControl.Init(sCommentsDivId, oGameTree);
    this.m_oCommentsButton = oCommentsControl;

    var oNavigatorControl = new CDrawingButtonTabNavigator(this.m_oDrawing);
    var sNavigatorDivId = sDivId + "N";
    var nTop = 0;
    this.private_CreateDivElement(oMainElement, sNavigatorDivId);
    this.private_FillHtmlElement(oMainControl, sNavigatorDivId, 1);
    oNavigatorControl.Init(sNavigatorDivId, oGameTree);
    this.m_oNavigatorButton = oNavigatorControl;

    // TODO: Переделать здесь, когда классы с кнопками переделаются по нормальному
    this.m_oNavigatorButton.m_oParent = this;
    this.m_oCommentsButton.m_oParent  = this;
    this.m_oNavigatorDiv = document.getElementById(_sNavigatorDivId);
    this.m_oCommentsDiv  = document.getElementById(_sCommentsDivId);
    this.Select(this.m_oCommentsButton);

    this.Update_Size();
};
CDrawingNavigatorCommentsTabs.prototype.Update_Size = function()
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    this.HtmlElement.Control.Resize(W, H);
    this.m_oNavigatorButton.Update_Size();
    this.m_oCommentsButton.Update_Size();
};
CDrawingNavigatorCommentsTabs.prototype.private_CreateDivElement = function(oParentElement, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParentElement.appendChild(oElement);
    return oElement;
};
CDrawingNavigatorCommentsTabs.prototype.private_FillHtmlElement = function(oParentControl, sName, nIndex)
{
    var oControl = CreateControlContainer(sName);
    oControl.Bounds.SetParams(0, nIndex * 36 + nIndex, 1000, 0, false, true, false, false, -1, 36);
    oControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right);
    oParentControl.AddControl(oControl);
};
CDrawingNavigatorCommentsTabs.prototype.Select = function(oClass)
{
    if (oClass === this.m_oNavigatorButton)
    {
        this.m_oNavigatorButton.Set_Selected(true);
        this.m_oCommentsButton.Set_Selected(false);

        this.m_oNavigatorDiv.style.visibility = "visible";
        this.m_oCommentsDiv.style.visibility  = "hidden";
    }
    else if (oClass === this.m_oCommentsButton)
    {
        this.m_oNavigatorButton.Set_Selected(false);
        this.m_oCommentsButton.Set_Selected(true);

        this.m_oNavigatorDiv.style.visibility = "hidden";
        this.m_oCommentsDiv.style.visibility  = "visible";
    }
    else
    {
        this.m_oNavigatorButton.Set_Selected(false);
        this.m_oCommentsButton.Set_Selected(false);

        this.m_oNavigatorDiv.style.visibility = "hidden";
        this.m_oCommentsDiv.style.visibility  = "hidden";
    }
};

var EToolbarFloat =
{
    Left   : 1,
    Right  : 2
};

function CDrawingToolbarItem(oControl, nW, nSpace, eAlign)
{
    this.m_oControl = oControl;
    this.m_nW       = nW;
    this.m_nSpace   = nSpace;
    this.m_eAlign   = eAlign;
}
CDrawingToolbarItem.prototype.Get_Control = function(){return this.m_oControl;};
CDrawingToolbarItem.prototype.Get_W = function(){return this.m_nW;};
CDrawingToolbarItem.prototype.Get_Space = function(){return this.m_nSpace;};
CDrawingToolbarItem.prototype.Get_Align = function(){return this.m_eAlign;};

function CDrawingMultiLevelToolbar(oDrawing)
{
    this.m_oDrawing  = oDrawing;

    this.HtmlElement =
    {
        Control         : null,
        SettingsControl : null,
        SettingsElement : null,

        GeneralControl  : null,
        GeneralElement  : null,

        AutoPlayControl : null,
        AutoPlayElement : null,

        TimelineControl : null,
        TimelineElement : null,

        GeneralNavigationElement : null,
        GeneralNavigationControl : null,

        TreeNavigationControl    : null,
        TreeNavigationElement    : null,

        KifuModeElement : null,
        KifuModeControl : null
    };

    this.m_bGeneralNavigation = g_oGlobalSettings.Is_MultiLevelToolbarMainNavigation();
    this.m_bTreeNavigation    = g_oGlobalSettings.Is_MultiLevelToolbarTreeNavigation();
    this.m_bGeneralToolbar    = g_oGlobalSettings.Is_MultiLevelToolbarGeneral();
    this.m_bAutoPlayToolbar   = g_oGlobalSettings.Is_MultiLevelToolbarAutoPlay();
    this.m_bTimelimeToolbar   = g_oGlobalSettings.Is_MultiLevelToolbarTimeline();
    this.m_bKifuModeToolbar   = g_oGlobalSettings.Is_MultiLevelToolbarKifuMode();

    this.m_nW = -1;
    this.m_nH = -1;

    this.m_nLineHeight    = 36;
    this.m_nLineSpace     = 1;
    this.m_nSettingsWidth = 36 * 3 + 2;

    this.m_oSettingsToolbar = new CDrawingToolbar(oDrawing);
    this.m_oSettingsToolbar.Add_Control(new CDrawingButtonAbout(oDrawing), 36, 1, EToolbarFloat.Left);

    // Не даем править настройки в режиме Embed
    if (this.m_oDrawing && this.m_oDrawing.Get_GameTree() && true !== this.m_oDrawing.Get_GameTree().Get_LocalSettings().Is_Embedding())
    {
        this.m_oSettingsToolbar.Add_Control(new CDrawingButtonSettings(oDrawing), 36, 1, EToolbarFloat.Left);
    }
    else
    {
        this.m_nSettingsWidth = 36 * 2 + 1;
    }

    this.m_oSettingsToolbar.Add_Control(new CDrawingButtonToolbarCustomize(oDrawing, this), 36, 1, EToolbarFloat.Left);

    this.m_oGeneralNavigation = new CDrawingToolbar(oDrawing);
    this.m_oGeneralNavigation.Add_Control(new CDrawingButtonBackwardToStart(oDrawing), 36, 1, EToolbarFloat.Left);
    this.m_oGeneralNavigation.Add_Control(new CDrawingButtonBackward5(oDrawing), 36, 1, EToolbarFloat.Left);
    this.m_oGeneralNavigation.Add_Control(new CDrawingButtonBackward(oDrawing), 36, 1, EToolbarFloat.Left);
    this.m_oGeneralNavigation.Add_Control(new CDrawingButtonForward(oDrawing), 36, 1, EToolbarFloat.Left);
    this.m_oGeneralNavigation.Add_Control(new CDrawingButtonForward5(oDrawing), 36, 1, EToolbarFloat.Left);
    this.m_oGeneralNavigation.Add_Control(new CDrawingButtonForwardToEnd(oDrawing), 36, 1, EToolbarFloat.Left);

    this.m_oTreeNavigation = new CDrawingToolbar(oDrawing);
    this.m_oTreeNavigation.Add_Control(new CDrawingButtonNextVariant(oDrawing), 36, 1, EToolbarFloat.Left);
    this.m_oTreeNavigation.Add_Control(new CDrawingButtonPrevVariant(oDrawing), 36, 1, EToolbarFloat.Left);

    this.m_oGeneralToolbar = new CDrawingToolbar(oDrawing);
    this.m_oGeneralToolbar.Add_Control(new CDrawingButtonPass(oDrawing), 73, 1, EToolbarFloat.Left);
    this.m_oGeneralToolbar.Add_Control(new CDrawingButtonBoardMode(oDrawing), 36, 1, EToolbarFloat.Left);
    this.m_oGeneralToolbar.Add_Control(new CDrawingButtonGameInfo(oDrawing), 36, 1, EToolbarFloat.Left);

    this.m_oAutoPlayToolbar = new CDrawingToolbar(oDrawing);
    this.m_oAutoPlayToolbar.Add_Control(new CDrawingButtonAutoPlay(oDrawing), 36, 1, EToolbarFloat.Left);
    this.m_oAutoPlayToolbar.Add_Control(new CDrawingSlider(oDrawing, EDrawingSliderType.AutoPlaySpeed), -1, 1, EToolbarFloat.Left);

    this.m_oTimelineToolbar = new CDrawingToolbar(oDrawing);
    this.m_oTimelineToolbar.Add_Control(new CDrawingSlider(oDrawing, EDrawingSliderType.Timeline), -1, 1, EToolbarFloat.Left);

    this.m_oKifuToolbar = new CDrawingToolbar(oDrawing);
    this.m_oKifuToolbar.Add_Control(new CDrawingButtonKifuWindow(oDrawing), 36, 1, EToolbarFloat.Left);
    this.m_oKifuToolbar.Add_Control(new CDrawingButtonKifuMode(oDrawing), 36, 1, EToolbarFloat.Left);

    this.m_nLevelsCount = 1;
    this.m_aElements = [];

    this.m_pOnChangeCallback = null;
}
CDrawingMultiLevelToolbar.prototype.Init = function(sDivId)
{
    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var oMainElement         = this.HtmlElement.Control.HtmlElement;
    var oMainControl         = this.HtmlElement.Control;

    var sSettingsDivId = sDivId + "SS";
    var sGenNavDivId   = sDivId + "GN";
    var sTreeNavDivId  = sDivId + "TN";
    var sGeneralDivId  = sDivId + "GL";
    var sAutoPlayDivId = sDivId + "AP";
    var sTimelineDivId = sDivId + "TL";
    var sKifuDivId     = sDivId + "KF";

    this.HtmlElement.SettingsElement          = Common.Create_DivElement(oMainElement, sSettingsDivId);
    this.HtmlElement.GeneralNavigationElement = Common.Create_DivElement(oMainElement, sGenNavDivId);
    this.HtmlElement.TreeNavigationElement    = Common.Create_DivElement(oMainElement, sTreeNavDivId);
    this.HtmlElement.GeneralElement           = Common.Create_DivElement(oMainElement, sGeneralDivId);
    this.HtmlElement.AutoPlayElement          = Common.Create_DivElement(oMainElement, sAutoPlayDivId);
    this.HtmlElement.TimelineElement          = Common.Create_DivElement(oMainElement, sTimelineDivId);
    this.HtmlElement.KifuModeElement          = Common.Create_DivElement(oMainElement, sKifuDivId);

    this.HtmlElement.SettingsControl = CreateControlContainer(sSettingsDivId);
    oMainControl.AddControl(this.HtmlElement.SettingsControl);
    this.m_oSettingsToolbar.Init(sSettingsDivId, this.m_oDrawing.Get_GameTree());

    this.HtmlElement.GeneralNavigationControl = CreateControlContainer(sGenNavDivId);
    oMainControl.AddControl(this.HtmlElement.GeneralNavigationControl);
    this.m_oGeneralNavigation.Init(sGenNavDivId, this.m_oDrawing.Get_GameTree());

    this.HtmlElement.TreeNavigationControl = CreateControlContainer(sTreeNavDivId);
    oMainControl.AddControl(this.HtmlElement.TreeNavigationControl);
    this.m_oTreeNavigation.Init(sTreeNavDivId, this.m_oDrawing.Get_GameTree());

    this.HtmlElement.GeneralControl = CreateControlContainer(sGeneralDivId);
    oMainControl.AddControl(this.HtmlElement.GeneralControl);
    this.m_oGeneralToolbar.Init(sGeneralDivId, this.m_oDrawing.Get_GameTree());

    this.HtmlElement.AutoPlayControl = CreateControlContainer(sAutoPlayDivId);
    oMainControl.AddControl(this.HtmlElement.AutoPlayControl);
    this.m_oAutoPlayToolbar.Init(sAutoPlayDivId, this.m_oDrawing.Get_GameTree());

    this.HtmlElement.TimelineControl = CreateControlContainer(sTimelineDivId);
    oMainControl.AddControl(this.HtmlElement.TimelineControl);
    this.m_oTimelineToolbar.Init(sTimelineDivId, this.m_oDrawing.Get_GameTree());

    this.HtmlElement.KifuModeControl = CreateControlContainer(sKifuDivId);
    oMainControl.AddControl(this.HtmlElement.KifuModeControl);
    this.m_oKifuToolbar.Init(sKifuDivId, this.m_oDrawing.Get_GameTree());

    this.private_UpdateElements();
    this.private_UpdateControls();
};
CDrawingMultiLevelToolbar.prototype.Get_Height = function()
{
    var nLevelsCount = Math.max(this.m_nLevelsCount, 1);
    return nLevelsCount * this.m_nLineHeight + (nLevelsCount - 1) * this.m_nLineSpace;
};
CDrawingMultiLevelToolbar.prototype.Update_Size = function(bForce)
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    if (W !== this.m_nW || H !== this.m_nH || true === bForce)
    {
        this.m_nW = W;
        this.m_nH = H;

        this.private_Update();
        this.HtmlElement.Control.Resize(W, H);
        this.m_oSettingsToolbar.Update_Size();

        for (var nControlIndex = 0, nControlsCount = this.m_aElements.length; nControlIndex < nControlsCount; ++nControlIndex)
        {
            var oControl = this.m_aElements[nControlIndex];
            oControl.Update_Size();
        }
    }
};
CDrawingMultiLevelToolbar.prototype.Set_OnChangeCallback = function(pCallback)
{
    this.m_pOnChangeCallback = pCallback;
};
CDrawingMultiLevelToolbar.prototype.Set_MainNavigation = function(bNavigation)
{
    this.m_bGeneralNavigation = bNavigation;
    this.private_Update();
    this.Update_Size(true);
};
CDrawingMultiLevelToolbar.prototype.Set_TreeNavigation = function(bNavigation)
{
    this.m_bTreeNavigation = bNavigation;
    this.private_Update();
    this.Update_Size(true);
};
CDrawingMultiLevelToolbar.prototype.Set_General = function(bGeneral)
{
    this.m_bGeneralToolbar  = bGeneral;
    this.private_Update();
    this.Update_Size(true);
};
CDrawingMultiLevelToolbar.prototype.Set_AutoPlay = function(bAutoPlay)
{
    this.m_bAutoPlayToolbar = bAutoPlay;
    this.private_Update();
    this.Update_Size(true);
};
CDrawingMultiLevelToolbar.prototype.Set_Timeline = function(bTimeline)
{
    this.m_bTimelimeToolbar = bTimeline;
    this.private_Update();
    this.Update_Size(true);
};
CDrawingMultiLevelToolbar.prototype.Set_KifuMode = function(bKifuMode)
{
    this.m_bKifuModeToolbar = bKifuMode;
    this.private_Update();
    this.Update_Size(true);
};
CDrawingMultiLevelToolbar.prototype.private_Update = function()
{
    this.private_UpdateElements();
    this.private_UpdateControls();

    if (this.m_pOnChangeCallback)
        this.m_pOnChangeCallback();
};
CDrawingMultiLevelToolbar.prototype.private_UpdateElements = function()
{
    this.m_aElements = [];

    this.private_UpdateElement(this.m_bGeneralNavigation, this.m_oGeneralNavigation, this.HtmlElement.GeneralNavigationElement);
    this.private_UpdateElement(this.m_bTreeNavigation, this.m_oTreeNavigation, this.HtmlElement.TreeNavigationElement);
    this.private_UpdateElement(this.m_bGeneralToolbar, this.m_oGeneralToolbar, this.HtmlElement.GeneralElement);
    this.private_UpdateElement(this.m_bAutoPlayToolbar, this.m_oAutoPlayToolbar, this.HtmlElement.AutoPlayElement);
    this.private_UpdateElement(this.m_bTimelimeToolbar, this.m_oTimelineToolbar, this.HtmlElement.TimelineElement);
    this.private_UpdateElement(this.m_bKifuModeToolbar, this.m_oKifuToolbar, this.HtmlElement.KifuModeElement);
};
CDrawingMultiLevelToolbar.prototype.private_UpdateElement = function(isUse, oElement, oHtmlElement)
{
    if (true === isUse)
    {
        this.m_aElements.push(oElement);
        oHtmlElement.style.display = "block";
    }
    else
    {
        oHtmlElement.style.display = "none";
    }
};
CDrawingMultiLevelToolbar.prototype.private_UpdateControls = function()
{
    // В одной строке мы помещаем минимум по 1 контролу, причем в первой строке всегда справа контрол с настройками.
    var nWidth = this.HtmlElement.Control.HtmlElement.clientWidth;

    this.m_nLevelsCount = 1;
    // Настройки
    var oSettingsControl = this.HtmlElement.SettingsControl;
    oSettingsControl.Bounds.SetParams(0, 0, 0, 1000, false, true, true, false, this.m_nSettingsWidth, this.m_nLineHeight);
    oSettingsControl.Anchor = (g_anchor_top | g_anchor_right);

    var nLineWidth = nWidth - this.m_oSettingsToolbar.Get_MinWidth();

    var nX = 0;
    var nY = 0;

    for (var nControlIndex = 0, nControlsCount = this.m_aElements.length; nControlIndex < nControlsCount; ++nControlIndex)
    {
        var oControl = this.m_aElements[nControlIndex];
        var nControlMinW = oControl.Get_MinWidth();

        var oElementControl = this.private_GetHtmlControlByControl(oControl);
        if (!oElementControl)
            continue;

        if (nX <= 0.1 || nX + nControlMinW < nLineWidth)
        {
            oElementControl.Bounds.SetParams(nX, nY, 1000, 1000, true, true, true, false, Math.min(nControlMinW, nLineWidth), this.m_nLineHeight);
            oElementControl.Anchor = (g_anchor_top | g_anchor_left);
            nX += nControlMinW;
        }
        else
        {
            nLineWidth = nWidth;
            this.m_nLevelsCount++;
            nX = 0;
            nY += this.m_nLineHeight + this.m_nLineSpace;

            oElementControl.Bounds.SetParams(nX, nY, 1000, 1000, true, true, true, false, Math.min(nControlMinW, nLineWidth - nX), this.m_nLineHeight);
            oElementControl.Anchor = (g_anchor_top | g_anchor_left);

            nX += nControlMinW;
        }
    }
};
CDrawingMultiLevelToolbar.prototype.private_GetHtmlControlByControl = function(oControl)
{
    var oHtmlControl = null;

    if (oControl === this.m_oGeneralNavigation)
        oHtmlControl = this.HtmlElement.GeneralNavigationControl;
    else if (oControl === this.m_oTreeNavigation)
        oHtmlControl = this.HtmlElement.TreeNavigationControl;
    else if (oControl === this.m_oGeneralToolbar)
        oHtmlControl = this.HtmlElement.GeneralControl;
    else if (oControl === this.m_oAutoPlayToolbar)
        oHtmlControl = this.HtmlElement.AutoPlayControl;
    else if (oControl === this.m_oTimelineToolbar)
        oHtmlControl = this.HtmlElement.TimelineControl;
    else if (oControl === this.m_oKifuToolbar)
        oHtmlControl = this.HtmlElement.KifuModeControl;

    return oHtmlControl;
};
