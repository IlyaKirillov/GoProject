"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     29.11.14
 * Time     3:00
 */

function CInterfaceState()
{
    this.Backward      = true;
    this.Forward       = true;
    this.NextVariant   = true;
    this.PrevVariant   = true;
    this.BoardMode     = EBoardMode.Move;
    this.TimelinePos   = 0;
    this.AutoPlaySpeed = null;
};