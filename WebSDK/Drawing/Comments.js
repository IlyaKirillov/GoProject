"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     30.11.14
 * Time     0:49
 */

function CDrawingComments(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;
    this.HtmlElement =
    {
        Control  : null,
        TextArea : {Control : null}
    };

    var oThis = this;

    this.private_OnValueChange = function()
    {
        oThis.private_OnChangeComment();
    };
}

CDrawingComments.prototype.Init = function(sDivId, oGameTree)
{
    this.m_oGameTree = oGameTree;

    this.HtmlElement.Control = CreateControlContainer(sDivId);
    var oDivElement = this.HtmlElement.Control.HtmlElement;

    oDivElement.style.background = new CColor(217, 217, 217, 255).ToString();
    oDivElement.style.boxSizing = "content-box";

    var sAreaName = sDivId + "_TextArea";

    // Создаем TextArea
    var oAreaElement = document.createElement("textarea");
    oAreaElement.setAttribute("id", sAreaName);
    oAreaElement.setAttribute("style", "position:absolute;padding:0;margin:0;resize:none;outline: none;-moz-appearance: none;padding:2px;");
    oDivElement.appendChild(oAreaElement);

    oAreaElement['onchange'] = this.private_OnValueChange;
    oAreaElement['onblur']   = this.private_OnValueChange;
    oAreaElement.style.outline = "none";
    oAreaElement.style.margin  = "0px";
    oAreaElement.style.border  = "1px solid rgb(172,172,172)";

    var oDivControl = this.HtmlElement.Control;
    this.HtmlElement.TextArea.Control = CreateControlContainer(sAreaName);
    var oTextAreaControl = this.HtmlElement.TextArea.Control;
    oTextAreaControl.Bounds.SetParams(6, 0, 12, 6, true, true, true, true, -1,-1);
    oTextAreaControl.Anchor = (g_anchor_top | g_anchor_left | g_anchor_bottom | g_anchor_right);
    oDivControl.AddControl(oTextAreaControl);

    if (this.m_oDrawing)
        this.m_oDrawing.Register_Comments(this);

    this.Update_Size();
};
CDrawingComments.prototype.Update_Comments = function(sComments)
{
    this.HtmlElement.TextArea.Control.HtmlElement.value = sComments;
};
CDrawingComments.prototype.Update_Size = function()
{
    var W = this.HtmlElement.Control.HtmlElement.clientWidth;
    var H = this.HtmlElement.Control.HtmlElement.clientHeight;

    this.HtmlElement.Control.Resize(W, H);
};
CDrawingComments.prototype.private_OnChangeComment = function()
{
    this.m_oGameTree.Set_Comment(this.HtmlElement.TextArea.Control.HtmlElement.value);
};

function CDrawingPlayerInfo(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_nPlayer   = BOARD_EMPTY;
    this.m_oGameTree = null;

    this.HtmlElement =
    {
        Control   : null,

        NameDiv   : null,
        ScoresDiv : null,
        Image     : null
    };

    this.m_oImage  = null;
    this.m_sName   = "";
    this.m_sRank   = "";
    this.m_dScores = 0;
    this.m_bScores = false;
}
CDrawingPlayerInfo.prototype.Init = function(sDivId, oGameTree, nPlayer)
{
    this.m_nPlayer   = nPlayer;
    this.m_oGameTree = oGameTree;

    this.HtmlElement.Control          = CreateControlContainer(sDivId);
    var oDivElement                   = this.HtmlElement.Control.HtmlElement;
    oDivElement.style.backgroundColor = new CColor(217, 217, 217, 255).ToString();

    this.HtmlElement.NameDiv   = document.createElement("div");
    this.HtmlElement.ScoresDiv = document.createElement("div");
    this.HtmlElement.Image     = document.createElement("canvas");

    var oImage     = this.HtmlElement.Image;
    var oNameDiv   = this.HtmlElement.NameDiv;
    var oScoresDiv = this.HtmlElement.ScoresDiv;

    oDivElement.appendChild(oImage);
    oDivElement.appendChild(oNameDiv);
    oDivElement.appendChild(oScoresDiv);

    oNameDiv.style.paddingLeft   = "25px";
    oScoresDiv.style.paddingLeft = "25px";
    oNameDiv.style.fontSize      = "14pt";
    oScoresDiv.style.fontSize    = "10pt";

    oImage.setAttribute("id", sDivId + "_Image");
    oImage.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oImage.setAttribute("oncontextmenu", "return false;");
    oImage.style.left            = "0px";
    oImage.style.top             = "0px";
    oImage.style.width           = 25 + "px";
    oImage.style.height          = 25 + "px";
    oImage.width                 = 25;
    oImage.height                = 25;

    var Canvas = oImage.getContext("2d");

    var Size = 25;

    Canvas.clearRect(0, 0, 25, 25);

    var X = Math.ceil(0.5 * Size + 0.5);
    var Y = Math.ceil(0.5 * Size + 0.5);
    var R = Math.ceil(0.25 * Size + 0.5);
    if (BOARD_WHITE === nPlayer)
    {
        Canvas.fillStyle   = (new CColor(255, 255, 255)).ToString();
        Canvas.strokeStyle = (new CColor(0, 0, 0)).ToString();
    }
    else if (BOARD_BLACK === nPlayer)
    {
        Canvas.fillStyle   = (new CColor(0, 0, 0)).ToString();
        Canvas.strokeStyle = (new CColor(0, 0, 0)).ToString();
    }
    Canvas.beginPath();
    Canvas.arc(X, Y, R, 0, 2 * Math.PI, false);
    Canvas.fill();
    Canvas.stroke();

    if (this.m_oDrawing)
    {
        if (BOARD_BLACK === nPlayer)
            this.m_oDrawing.Register_BlackInfo(this);
        else if (BOARD_WHITE === nPlayer)
            this.m_oDrawing.Register_WhiteInfo(this);
    }

    this.private_Update();
};
CDrawingPlayerInfo.prototype.Update_Size = function()
{
    this.private_Update();

    var TextWidth = this.m_dTextWidth;
    var RealWidth = this.HtmlElement.Control.HtmlElement.clientWidth - 25;

    var nOffset = 0;
    if (RealWidth < TextWidth)
        nOffset = 0;
    else
        nOffset = (RealWidth - TextWidth) / 2;

    this.HtmlElement.Image.style.left            = nOffset + "px";
    nOffset += 25;
    this.HtmlElement.NameDiv.style.paddingLeft   = nOffset + "px";
    this.HtmlElement.ScoresDiv.style.paddingLeft = nOffset + "px";

    this.HtmlElement.NameDiv.style.overflow            = "hidden";
    this.HtmlElement.NameDiv.style.textOverflow        = "ellipsis";
    this.HtmlElement.NameDiv.style['-o-text-overflow'] = "ellipsis";
    this.HtmlElement.NameDiv.style.height              = 25 + "px";
    this.HtmlElement.NameDiv.style.lineHeight          = 25 + "px";
    this.HtmlElement.NameDiv.style.fontFamily          = '"Times New Roman", Times, serif';

    this.HtmlElement.ScoresDiv.style.overflow            = "hidden";
    this.HtmlElement.ScoresDiv.style.textOverflow        = "ellipsis";
    this.HtmlElement.ScoresDiv.style['-o-text-overflow'] = "ellipsis";
    this.HtmlElement.ScoresDiv.style.height              = 25 + "px";
    this.HtmlElement.ScoresDiv.style.lineHeight          = 25 + "px";
    this.HtmlElement.ScoresDiv.style.fontFamily          = '"Times New Roman", Times, serif';
};
CDrawingPlayerInfo.prototype.Update_Name = function(sName)
{
    this.m_sName = sName;
    this.private_Update();
};
CDrawingPlayerInfo.prototype.Update_Rank = function(sRank)
{
    this.m_sRank = sRank;
    this.private_Update();
};
CDrawingPlayerInfo.prototype.Update_Captured = function(dCaptured)
{
    this.m_bScores = false;
    this.m_dScores = dCaptured;
    this.private_Update();
};
CDrawingPlayerInfo.prototype.Update_Scores = function(dScores)
{
    this.m_bScores = true;
    this.m_dScores = dScores;
    this.private_Update();
};
CDrawingPlayerInfo.prototype.private_Update = function()
{
    var oNameDiv   = this.HtmlElement.NameDiv;
    var oScoresDiv = this.HtmlElement.ScoresDiv;

    var sNameText   = ("" === this.m_sName ? (BOARD_BLACK === this.m_nPlayer ? "Black " : "White ") : this.m_sName) + ("" === this.m_sRank ? "" : "[" + this.m_sRank +  "]");
    var sScoresText = (true === this.m_bScores ? "Scores " : "Captured ") + this.m_dScores;

    Common.Set_InnerTextToElement(oNameDiv, sNameText);
    Common.Set_InnerTextToElement(oScoresDiv, sScoresText);

    var Canvas = document.createElement("canvas").getContext("2d");
    Canvas.font = "14pt Times New Roman";
    this.m_dTextWidth = Canvas.measureText(sNameText).width;
};

function CDrawingViewerScores(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;

    this.HtmlElement =
    {
        Control    : null,
        ScoresWDiv : null,
        ScoresBDiv : null,
        ImageW     : null,
        ImageB     : null
    };

    this.m_dScoresW = 0;
    this.m_dScoresB = 0;
}
CDrawingViewerScores.prototype.Init = function(sDivId, oGameTree)
{
    this.m_oGameTree = oGameTree;

    this.HtmlElement.Control          = CreateControlContainer(sDivId);
    var oDivElement                   = this.HtmlElement.Control.HtmlElement;
    oDivElement.style.backgroundColor = new CColor(217, 217, 217, 255).ToString();

    this.HtmlElement.ScoresWDiv = document.createElement("div");
    this.HtmlElement.ImageW     = document.createElement("canvas");
    this.HtmlElement.ScoresBDiv = document.createElement("div");
    this.HtmlElement.ImageB     = document.createElement("canvas");

    oDivElement.appendChild(this.HtmlElement.ScoresWDiv);
    oDivElement.appendChild(this.HtmlElement.ImageW);
    oDivElement.appendChild(this.HtmlElement.ScoresBDiv);
    oDivElement.appendChild(this.HtmlElement.ImageB);

    this.HtmlElement.ImageW.style.position = "absolute";
    this.HtmlElement.ImageW.style.left     = "0px";
    this.HtmlElement.ImageW.style.top      = "0px";

    this.HtmlElement.ScoresWDiv.style.position     = "absolute";
    this.HtmlElement.ScoresWDiv.style.left         = "25px";
    this.HtmlElement.ScoresWDiv.style.top          = "0px";
    this.HtmlElement.ScoresWDiv.style.overflow     = "hidden";
    this.HtmlElement.ScoresWDiv.style.textOverflow = "ellipsis";
    this.HtmlElement.ScoresWDiv.style.height       = "25px";
    this.HtmlElement.ScoresWDiv.style.fontFamily   = '"Times New Roman", Times, serif';
    this.HtmlElement.ScoresWDiv.style.fontSize     = "16px";
    this.HtmlElement.ScoresWDiv.style.lineHeight   = "25px";

    this.HtmlElement.ImageB.style.position = "absolute";
    this.HtmlElement.ImageB.style.left     = "61px";
    this.HtmlElement.ImageB.style.top      = "0px";

    this.HtmlElement.ScoresBDiv.style.position     = "absolute";
    this.HtmlElement.ScoresBDiv.style.left         = "86px";
    this.HtmlElement.ScoresWDiv.style.top          = "0px";
    this.HtmlElement.ScoresBDiv.style.overflow     = "hidden";
    this.HtmlElement.ScoresBDiv.style.textOverflow = "ellipsis";
    this.HtmlElement.ScoresBDiv.style.height       = "25px";
    this.HtmlElement.ScoresBDiv.style.fontFamily   = '"Times New Roman", Times, serif';
    this.HtmlElement.ScoresBDiv.style.fontSize     = "16px";
    this.HtmlElement.ScoresBDiv.style.lineHeight   = "25px";

    this.private_DrawColor(this.HtmlElement.ImageW, false);
    this.private_DrawColor(this.HtmlElement.ImageB, true);

    this.private_Update();
};
CDrawingViewerScores.prototype.private_DrawColor = function(oImage, bBlack)
{
    oImage.setAttribute("oncontextmenu", "return false;");
    oImage.style.padding = "0px";
    oImage.style.margin  = "0px";
    oImage.style.width   = 25 + "px";
    oImage.style.height  = 25 + "px";
    oImage.width         = 25;
    oImage.height        = 25;

    var Canvas = oImage.getContext("2d");
    var Size = 25;
    Canvas.clearRect(0, 0, 25, 25);

    var X = Math.ceil(0.5 * Size + 0.5);
    var Y = Math.ceil(0.5 * Size + 0.5);
    var R = Math.ceil(0.25 * Size + 0.5);
    if (bBlack)
    {
        Canvas.fillStyle   = (new CColor(0, 0, 0)).ToString();
        Canvas.strokeStyle = (new CColor(0, 0, 0)).ToString();
    }
    else
    {
        Canvas.fillStyle   = (new CColor(255, 255, 255)).ToString();
        Canvas.strokeStyle = (new CColor(0, 0, 0)).ToString();
    }

    Canvas.beginPath();
    Canvas.arc(X, Y, R, 0, 2 * Math.PI, false);
    Canvas.fill();
    Canvas.stroke();
};
CDrawingViewerScores.prototype.Update_Size = function()
{
    this.private_Update();
};
CDrawingViewerScores.prototype.Update_Scores = function(dWhite, dBlack)
{
    this.m_dScoresW = dWhite;
    this.m_dScoresB = dBlack;
    this.private_Update();
};
CDrawingViewerScores.prototype.private_Update = function()
{
    Common.Set_InnerTextToElement(this.HtmlElement.ScoresWDiv, "" + this.m_dScoresW);
    Common.Set_InnerTextToElement(this.HtmlElement.ScoresBDiv, "" + this.m_dScoresB);
};

function CDrawingViewerTitle(oDrawing)
{
    this.m_oDrawing  = oDrawing;
    this.m_oGameTree = null;

    this.HtmlElement =
    {
        Control  : null,
        TitleDiv : null
    };

    this.m_sTitle = "White vs. Black";
}
CDrawingViewerTitle.prototype.Init = function(sDivId, oGameTree)
{
    this.m_oGameTree = oGameTree;

    this.HtmlElement.Control          = CreateControlContainer(sDivId);
    var oDivElement                   = this.HtmlElement.Control.HtmlElement;
    oDivElement.style.backgroundColor = new CColor(217, 217, 217, 255).ToString();

    this.HtmlElement.TitleDiv = document.createElement("div");
    oDivElement.appendChild(this.HtmlElement.TitleDiv);

    this.HtmlElement.TitleDiv.style.position     = "absolute";
    this.HtmlElement.TitleDiv.style.left         = "0px";
    this.HtmlElement.TitleDiv.style.top          = "0px";
    this.HtmlElement.TitleDiv.style.overflow     = "hidden";
    this.HtmlElement.TitleDiv.style.textOverflow = "ellipsis";
    this.HtmlElement.TitleDiv.style.fontFamily   = '"Times New Roman", Times, serif';
    this.HtmlElement.TitleDiv.style.fontSize     = "16px";
    this.HtmlElement.TitleDiv.style.height       = "25px";
    this.HtmlElement.TitleDiv.style.lineHeight   = "25px";
    this.HtmlElement.TitleDiv.style.width        = "100%";
    this.HtmlElement.TitleDiv.style.textAlign    = "center";

    this.private_Update();
};
CDrawingViewerTitle.prototype.Set_Title = function(sTitle)
{
    this.m_sTitle = sTitle;
    this.private_Update();
};
CDrawingViewerTitle.prototype.Update_Size = function()
{
    this.private_Update();
};
CDrawingViewerTitle.prototype.private_Update = function()
{
    Common.Set_InnerTextToElement(this.HtmlElement.TitleDiv, "" + this.m_sTitle);
};