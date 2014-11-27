"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     27.11.14
 * Time     1:27
 */

function CDrawingToolbar()
{
    this.m_oGameTree = null;

    this.HtmlElement =
    {
        Control : null,
        Buttons : []
    };

    this.m_aButtons = [];
}

CDrawingToolbar.prototype.Init = function(sDivId, oGameTree, oSettings)
{
    this.m_oGameTree = oGameTree;

    this.HtmlElement.Control = CreateControlContainer(sDivId);

};