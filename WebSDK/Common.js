/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     18.11.14
 * Time     0:38
 */

function CPos()
{
    X = 0;
    Y = 0;
};

function CColor(r, g, b, a)
{
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = ( typeof(a) === "undefined" ? 255 : a);
}

CColor.prototype =
{
    ToString : function()
    {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a / 255 +")";
    }
};

function Common_ValuetoXY(Value)
{
    var Pos = new CPos();
    Pos.X = Value & 0xFF;
    Pos.Y = (Value >> 8) & 0xFF;
    return Pos;
}

function Common_XYtoValue(X, Y)
{
    return (Y << 8) + X;
};

function Common_CopyArray(arrSrc)
{
    var arrDst = [];
    for (var Pos = 0, Count = arrSrc.length; Pos < Count; Pos++)
        arrDst.push(arrSrc[Pos]);

    return arrDst;
}