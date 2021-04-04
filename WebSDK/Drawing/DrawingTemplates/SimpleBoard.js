"use strict";

/**
 * Copyright 2021 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     09.01.2021
 * Time     0:10
 */

/**
 *
 * @constructor
 * @extend {CDrawing}
 */
function CSimpleBoardDrawing()
{
	CDrawing.call(this);

}

CSimpleBoardDrawing.prototype = Object.create(CDrawing.prototype);
CSimpleBoardDrawing.prototype.constructor = CSimpleBoardDrawing;