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
    this.m_oDrawing = oDrawing;
    this.HtmlElement =
    {
        Control  : null,
        TextArea : {Control : null}
    }

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

    var sAreaName = sDivId + "_TextArea";

    // Создаем TextArea
    var oAreaElement = document.createElement("textarea");
    oAreaElement.setAttribute("id", sAreaName);
    oAreaElement.setAttribute("style", "position:absolute;padding:0;margin:0;resize:none;outline: none;-moz-appearance: none;");
    oDivElement.appendChild(oAreaElement);

    oAreaElement['onchange'] = this.private_OnValueChange;
    oAreaElement['onblur']   = this.private_OnValueChange;

    var oDivControl = this.HtmlElement.Control;
    this.HtmlElement.TextArea.Control = CreateControlContainer(sAreaName);
    var oTextAreaControl = this.HtmlElement.TextArea.Control;
    oTextAreaControl.Bounds.SetParams(1, 1, 1, 1, true, true, true, true, -1,-1);
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