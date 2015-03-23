"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     06.12.14
 * Time     1:52
 */

var ESlideState =
{
    Message : 0,
    Sgf     : 1
};

function CPresentation(oGameTree)
{
    this.m_oGameTree = oGameTree;

    if (oGameTree)
        oGameTree.Set_Drawing(this);

    this.m_oControl = null;
    this.m_aElements = [];

    this.HtmlElement =
    {
        MessageElement : null,
        TextElement    : null,
        PrevButton     : null,
        NextButton     : null,
        NextSgf        : null,
        PrevSgf        : null,
        BoardDisabler  : null
    };

    this.m_nCurSlide    = 0;
    this.m_nSlidesCount = 0;
    this.m_nSlideState  = 0;
}
CPresentation.prototype.Init = function(sDivId, aSlides)
{
    this.private_LoadSlides(aSlides);

    var oGameTree = this.m_oGameTree;

    var oParentControl = CreateControlContainer(sDivId);

    var sBoardDivId   = sDivId + "_Board";
    var sMessageDivId = sDivId + "_Message";
    var sNextDivId    = sDivId + "_Next";

    this.private_CreateDiv(oParentControl.HtmlElement, sBoardDivId);
    var oBoardDisabler = this.private_CreateDiv(oParentControl.HtmlElement, sNextDivId);
    var oMessageDiv = this.private_CreateDiv(oParentControl.HtmlElement, sMessageDivId);
    oMessageDiv.style.backgroundColor = "rgb(255,255,255)";
    oMessageDiv.style['border-radius'] = "6px";
    oMessageDiv.style['-webkit-border-radius'] = "6px";
    oMessageDiv.style['-moz-border-radius'] = "5px";
    oMessageDiv.style['-khtml-border-radius'] = "10px";
    oMessageDiv.style.borderColor = "#e3e3e3";
    oMessageDiv.style.borderWidth = "5px";
    oMessageDiv.style.borderStyle = "ridge";
    oMessageDiv.style.display = "block";

    var oBoardControl = CreateControlContainer(sBoardDivId);
    oBoardControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
    oBoardControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oParentControl.AddControl(oBoardControl);

    var sBoardCenterDivId = sBoardDivId + "_Centred";
    this.private_CreateDiv(oBoardControl.HtmlElement, sBoardCenterDivId);
    var oBoardCenterControl = CreateControlContainer(sBoardDivId);
    oBoardControl.Set_Type(2);
    oBoardControl.AddControl(oBoardCenterControl);

    var oMessageControl = CreateControlContainer(sMessageDivId);
    oMessageControl.Bounds.SetParams(350, 350, 650, 650, false, false, false, false, -1, -1);
    oMessageControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oParentControl.AddControl(oMessageControl);

    var DrawingBoard = new CDrawingBoard(this);
    DrawingBoard.Init(sBoardDivId, oGameTree);
    DrawingBoard.Set_Presentation(this);

    var oNextControl = CreateControlContainer(sNextDivId);
    oNextControl.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
    oNextControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_right | g_anchor_bottom);
    oParentControl.AddControl(oNextControl);

    var sNextCenterDivId = sNextDivId + "_Centred";
    this.private_CreateDiv(oNextControl.HtmlElement, sNextCenterDivId);
    var oNextCenterControl = CreateControlContainer(sNextCenterDivId);
    oNextControl.Set_Type(2);
    oNextControl.AddControl(oNextCenterControl);

    var sNextSgfButton = sNextCenterDivId + "_Next";
    var oNextSgfButtonElement = this.private_CreateButton(oNextCenterControl.HtmlElement, sNextSgfButton);
    oNextSgfButtonElement.value = "Далее";
    oNextSgfButtonElement.style.display = "none";

    var sPrevSgfButton = sNextCenterDivId + "_Prev";
    var oPrevSgfButtonElement = this.private_CreateButton(oNextCenterControl.HtmlElement, sPrevSgfButton);
    oPrevSgfButtonElement.value = "Назад";
    oPrevSgfButtonElement.style.display = "none";

    var oThis = this;
    oNextSgfButtonElement.addEventListener("click", function()
    {
        oThis.HtmlElement.NextSgf.style.display = "none";
        oThis.HtmlElement.PrevSgf.style.display = "none";
        oThis.private_NextStep();
    }, false);

    oPrevSgfButtonElement.addEventListener("click", function()
    {
        oThis.HtmlElement.NextSgf.style.display = "none";
        oThis.HtmlElement.PrevSgf.style.display = "none";
        oThis.private_PrevStep();
    }, false);

    var oNextSgfButtonControl = CreateControlContainer(sNextSgfButton);
    oNextSgfButtonControl.Bounds.SetParams(501,  0, 2, 2, false, false, true, true, -1, 25);
    oNextSgfButtonControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
    oNextCenterControl.AddControl(oNextSgfButtonControl);

    var oPrevSgfButtonControl = CreateControlContainer(sPrevSgfButton);
    oPrevSgfButtonControl.Bounds.SetParams(2,  0, 499, 2, true, false, false, true, -1, 25);
    oPrevSgfButtonControl.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
    oNextCenterControl.AddControl(oPrevSgfButtonControl);


    //---
    var sTextDiv    = sMessageDivId + "_Text";
    var sNextButton = sMessageDivId + "_Next";
    var sPrevButton = sMessageDivId + "_Prev";

    // Создаем TextElement
    var oTextElement = this.private_CreateDiv(oMessageDiv, sTextDiv);
    oTextElement.style.fontFamily = "verdana";
    oTextElement.style.textAlign  = "justify";
    oTextElement.style.alignItems = "center";
    oTextElement.style.overflowY  = "scroll";

    var oNextButtonElement = this.private_CreateButton(oMessageDiv, sNextButton);
    var oPrevButtonElement = this.private_CreateButton(oMessageDiv, sPrevButton);

    oPrevButtonElement.addEventListener("click", function(){oThis.private_PrevStep();}, false);
    oNextButtonElement.addEventListener("click", function(){oThis.private_NextStep();}, false);

    var oTextAreaControl = CreateControlContainer(sTextDiv);
    oTextAreaControl.Bounds.SetParams(0, 0, 1000, 35, false, false, false, true, -1, -1);
    oTextAreaControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    oMessageControl.AddControl(oTextAreaControl);

    var oNextButtonControl = CreateControlContainer(sNextButton);
    oNextButtonControl.Bounds.SetParams(0, 0, 5, 5, false, false, true, true, 100, 25);
    oNextButtonControl.Anchor = (g_anchor_bottom | g_anchor_right);
    oMessageControl.AddControl(oNextButtonControl);

    var oPrevButtonControl = CreateControlContainer(sPrevButton);
    oPrevButtonControl.Bounds.SetParams(5, 0, 0, 5, true, false, false, true, 100, 25);
    oPrevButtonControl.Anchor = (g_anchor_bottom | g_anchor_left);
    oMessageControl.AddControl(oPrevButtonControl);
    //---

    this.HtmlElement.MessageElement = oMessageDiv;
    this.HtmlElement.TextElement    = oTextElement;
    this.HtmlElement.PrevButton     = oPrevButtonElement;
    this.HtmlElement.NextButton     = oNextButtonElement;
    this.HtmlElement.NextSgf        = oNextSgfButtonElement;
    this.HtmlElement.PrevSgf        = oPrevSgfButtonElement;
    this.HtmlElement.BoardDisabler  = oBoardDisabler;

    this.m_aElements.push(DrawingBoard);
    this.m_oControl = oParentControl;
    this.Update_Size();

    this.private_GoToStep(0, 0);
};
CPresentation.prototype.Update_Size = function(bForce)
{
    if (this.m_oControl)
    {
        var W = this.m_oControl.HtmlElement.clientWidth;
        var H = this.m_oControl.HtmlElement.clientHeight;

        this.m_oControl.Resize(W, H);
    }

    for (var Index = 0, Count = this.m_aElements.length; Index < Count; Index++)
        this.m_aElements[Index].Update_Size(bForce);
};
CPresentation.prototype.Get_NodesCountInSlide = function()
{
    if (null === this.m_aSlides[this.m_nCurSlide].SgfPr || undefined === this.m_aSlides[this.m_nCurSlide].SgfPr.Count)
        return 0;

    return this.m_aSlides[this.m_nCurSlide].SgfPr.Count;
};
CPresentation.prototype.On_EndSgfSlide = function()
{
    if (null !== this.m_aSlides[this.m_nCurSlide].SgfPr && true === this.m_aSlides[this.m_nCurSlide].SgfPr.WaitOnEnd)
    {
        this.HtmlElement.BoardDisabler.style.display = "block";
        this.HtmlElement.NextSgf.style.display = "block";
        this.HtmlElement.PrevSgf.style.display = "block";
    }
    else
        this.private_GoToPresentationStep(this.m_nCurSlide, 2);
};
CPresentation.prototype.Register_Board = function(oBoard)
{
};
CPresentation.prototype.Update_Comments = function(sComments)
{

};
CPresentation.prototype.Update_InterfaceState = function()
{

};
CPresentation.prototype.Update_BlackName = function(){};
CPresentation.prototype.Update_WhiteName = function(){};
CPresentation.prototype.Update_BlackRank = function(){};
CPresentation.prototype.Update_WhiteRank = function(){};
CPresentation.prototype.Update_Scores    = function(){};
CPresentation.prototype.Update_Captured  = function(){};
CPresentation.prototype.On_StopAutoPlay  = function(){};
CPresentation.prototype.On_StartAutoPlay = function(){};
CPresentation.prototype.private_LoadSlides = function(aSlides)
{
    var nCount = aSlides.length;
    this.m_nSlidesCount = nCount;
    this.m_aSlides      = [];
    for (var Index = 0; Index < nCount; Index++)
    {
        this.m_aSlides[Index] = {};
        this.m_aSlides[Index].Sgf     = aSlides[Index]['Sgf'];
        this.m_aSlides[Index].Before  = aSlides[Index]['Before'];
        this.m_aSlides[Index].After   = aSlides[Index]['After'];
        this.m_aSlides[Index].Message = aSlides[Index]['Message'];

        if (null === aSlides[Index]['SgfPr'])
            this.m_aSlides[Index].SgfPr = null;
        else
        {
            this.m_aSlides[Index].SgfPr = {};
            this.m_aSlides[Index].SgfPr.Count     = aSlides[Index]['SgfPr']['Count'];
            this.m_aSlides[Index].SgfPr.WaitOnEnd = aSlides[Index]['SgfPr']['WaitOnEnd'];
            this.m_aSlides[Index].SgfPr.Flags     = {};

            if (aSlides[Index]['SgfPr']['Flags'])
            {
                this.m_aSlides[Index].SgfPr.Flags.NewNode         = aSlides[Index]['SgfPr']['Flags']['NewNode'];
                this.m_aSlides[Index].SgfPr.Flags.Move            = aSlides[Index]['SgfPr']['Flags']['Move'];
                this.m_aSlides[Index].SgfPr.Flags.ChangeBoardMode = aSlides[Index]['SgfPr']['Flags']['ChangeBoardMode'];
                this.m_aSlides[Index].SgfPr.Flags.LoadFile        = aSlides[Index]['SgfPr']['Flags']['LoadFile'];
            }
        }
    }
};
CPresentation.prototype.private_NextStep = function()
{
    var nCurSlide = this.m_nCurSlide;
    if (ESlideState.Message === this.m_nSlideState)
    {
        if (null !== this.m_aSlides[nCurSlide].Sgf)
            this.private_GoToStep(nCurSlide, ESlideState.Sgf);
        else
        {
            this.m_nSlideState = ESlideState.Sgf;
            this.private_NextStep();
        }
    }
    else if (ESlideState.Sgf === this.m_nSlideState)
    {
        // Мы в конце последнего слайда
        if (nCurSlide >= this.m_nSlidesCount - 1)
            return;

        if (null !== this.m_aSlides[nCurSlide + 1].Message)
            this.private_GoToStep(nCurSlide + 1, ESlideState.Message);
        else
        {
            this.m_nCurSlide++;
            this.m_nSlideState = ESlideState.Message;
            this.private_NextStep();
        }
    }
};
CPresentation.prototype.private_PrevStep = function()
{
    var nCurSlide = this.m_nCurSlide;
    if (ESlideState.Message === this.m_nSlideState)
    {
        // Мы в начале первого слайда
        if (nCurSlide <= 0)
            return;

        if (null !== this.m_aSlides[nCurSlide - 1].Sgf)
            this.private_GoToStep(nCurSlide - 1, ESlideState.Sgf);
        else
        {
            this.m_nCurSlide--;
            this.m_nSlideState = ESlideState.Sgf;
            this.private_PrevStep();
        }
    }
    else if (ESlideState.Sgf === this.m_nSlideState)
    {
        if (null !== this.m_aSlides[nCurSlide].Message)
            this.private_GoToStep(nCurSlide, ESlideState.Message);
        else
        {
            this.m_nSlideState = ESlideState.Message;
            this.private_PrevStep();
        }
    }
};
CPresentation.prototype.private_GoToStep = function(nSlide, nStep)
{
    if (nSlide < 0 || nSlide >= this.m_nSlidesCount)
        return;

    this.m_nCurSlide   = nSlide;
    this.m_nSlideState = nStep;

    var sSgf     = this.m_aSlides[nSlide].Sgf;
    var oSgfPr   = this.m_aSlides[nSlide].SgfPr;
    var sMessage = this.m_aSlides[nSlide].Message;

    if (ESlideState.Message === nStep)
    {
        this.HtmlElement.BoardDisabler.style.display = "block";
        if (null !== sMessage)
            this.private_ShowMessage(sMessage, 0 === nSlide ? null : "Назад", nSlide === this.m_nSlidesCount - 1 && null === sSgf ? null : "Далее");
        else
            this.private_NextStep();
    }
    else if (ESlideState.Sgf === nStep)
    {
        this.HtmlElement.BoardDisabler.style.display = "none";
        if (null !== sSgf)
        {
            this.private_HideMessage();
            this.m_oGameTree.Reset_EditingFlags();
            this.m_oGameTree.Load_Sgf(sSgf);
            this.m_oGameTree.Set_EditingFlags(oSgfPr.Flags);
            this.m_oGameTree.Focus();
        }
        else
            this.private_NextStep();
    }
};
CPresentation.prototype.private_CreateDiv = function(oParent, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParent.appendChild(oElement);
    return oElement;
};
CPresentation.prototype.private_CreateButton = function(oParent, sName)
{
    var oButton = document.createElement("input");
    oButton.setAttribute("id", sName);
    oButton.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oButton.setAttribute("type", "button");
    oParent.appendChild(oButton);
    return oButton;
};
CPresentation.prototype.private_ShowMessage = function(sText, sBack, sNext)
{
    var oPrevButton = this.HtmlElement.PrevButton;
    var oNextButton = this.HtmlElement.NextButton;

    this.HtmlElement.MessageElement.style.display = "block";

    while (this.HtmlElement.TextElement.firstChild)
        this.HtmlElement.TextElement.removeChild(this.HtmlElement.TextElement.firstChild);

    Common.Set_InnerTextToElement(this.HtmlElement.TextElement, "");

    if ("string" === typeof(sText))
        Common.Set_InnerTextToElement(this.HtmlElement.TextElement, sText);
    else
        this.HtmlElement.TextElement.appendChild(sText);

    if (null === sBack)
        oPrevButton.style.display = "none";
    else
    {
        oPrevButton.style.display = "block";
        oPrevButton.value = sBack;
    }

    if (null === sNext)
        oNextButton.style.display = "none";
    else
    {
        oNextButton.style.display = "block";
        oNextButton.value = sNext;
    }
};
CPresentation.prototype.private_HideMessage = function()
{
    this.HtmlElement.MessageElement.style.display = "none";
};