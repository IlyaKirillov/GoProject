/**
 * Copyright 2015 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     29.03.15
 * Time     19:42
 */

function CDrawingVerticalTabs()
{
    this.m_aTabs = [];
    this.m_oCurTab = null;
    this.m_aContens = [];
}

CDrawingVerticalTabs.prototype.Init = function(sDivId, aTabNames, nSelectedIndex, nHeadersWidth)
{
    var nW = (nHeadersWidth ? nHeadersWidth : 200);

    var oMainElement = document.getElementById(sDivId);

    var oTabHeaders = document.createElement("div");
    oTabHeaders.style.position    = "absolute";
    oTabHeaders.style.left        = "0px";
    oTabHeaders.style.top         = "0px";
    oTabHeaders.style.bottom      = "0px";
    oTabHeaders.style.width       = (nW - 1) + "px";
    oTabHeaders.style.borderRight = "1px solid #cbcbcb";

    oMainElement.appendChild(oTabHeaders);

    var oTabContent = document.createElement("div");
    oTabContent.style.position = "absolute";
    oTabContent.style.left     = nW + "px";
    oTabContent.style.top      = "0px";
    oTabContent.style.bottom   = "0px";
    oTabContent.style.right    = "0px";
    oMainElement.appendChild(oTabContent);

    for (var nIndex = 0, nCount = aTabNames.length; nIndex < nCount; nIndex++)
    {
        this.private_CreateTabHeader(oTabHeaders, aTabNames[nIndex], oTabContent);
    }

    var oTab = this.m_aTabs[(nSelectedIndex ? nSelectedIndex : 0)];
    if (oTab)
        this.private_SelectTab(oTab);
};
CDrawingVerticalTabs.prototype.Get_TabContent = function(nIndex)
{
    return this.m_aContens[nIndex];
};
CDrawingVerticalTabs.prototype.private_CreateTabHeader = function(sParentDiv, sName, oParentContent)
{
    var oWrapperDiv = document.createElement("div");
    sParentDiv.appendChild(oWrapperDiv);
    oWrapperDiv.style.color                  = "rgb(68, 68, 68)";

    var oThis = this;
    oWrapperDiv.addEventListener("mouseenter", function()
    {
        if (oThis.m_oCurTab !== this)
        {
            this.style.backgroundColor = "rgb(241, 241, 241)";
        }

    }, false);

    oWrapperDiv.addEventListener("mouseleave", function()
    {
        if (oThis.m_oCurTab !== this)
        {
            this.style.backgroundColor = "";
        }

    }, false);

    oWrapperDiv.addEventListener("click", function()
    {
        oThis.private_SelectTab(this);
    }, false);

    var oMarginDiv = document.createElement("div");
    oWrapperDiv.appendChild(oMarginDiv);
    oMarginDiv.style.padding = "7px 2px 7px 20px";

    var oContentDiv = document.createElement("div");
    oMarginDiv.appendChild(oContentDiv);

    oContentDiv.style['-webkit-user-select'] = "none";
    oContentDiv.style.borderCollapse         = "collapse";
    oContentDiv.style.boxSizing              = "border-box";
    oContentDiv.style.cursor                 = "pointer";
    oContentDiv.style.display                = "block";
    oContentDiv.style.fontFamily             = "Helvetica Neue', Helvetica, Arial, sans-serif";
    oContentDiv.style.fontSize               = "16px";
    oContentDiv.style.height                 = "17px";
    oContentDiv.style.lineHeight             = "17.142858505249px";
    oContentDiv.style.width                  = "177px";

    Common.Set_InnerTextToElement(oContentDiv, sName);

    var oContentDiv = document.createElement("div");
    oContentDiv.style.display = "none";
    oContentDiv.style.width   = "100%";
    oContentDiv.style.height  = "100%";
    oParentContent.appendChild(oContentDiv);

    this.m_aContens.push(oContentDiv);
    this.m_aTabs.push(oWrapperDiv);
};
CDrawingVerticalTabs.prototype.private_SelectTab = function(oTab)
{
    if (this.m_oCurTab === oTab)
        return;

    if (null !== this.m_oCurTab)
    {
        this.m_oCurTab.style.backgroundColor = "";
        this.m_oCurTab.style.color           = "rgb(68, 68, 68)";

        var nOldIndex = this.private_GetTabIndex(this.m_oCurTab);
        if (this.m_aContens[nOldIndex])
            this.m_aContens[nOldIndex].style.display = "none";
    }

    this.m_oCurTab = oTab;

    oTab.style.backgroundColor = "#7d858c";
    oTab.style.color           = "#fff";

    var nNewIndex = this.private_GetTabIndex(this.m_oCurTab);
    if (this.m_aContens[nNewIndex])
        this.m_aContens[nNewIndex].style.display = "block";
};
CDrawingVerticalTabs.prototype.private_GetTabIndex = function(oTab)
{
    for (var nIndex = 0, nCount = this.m_aTabs.length; nIndex < nCount; nIndex++)
    {
        if (oTab === this.m_aTabs[nIndex])
            return nIndex;
    }

    return -1;
};