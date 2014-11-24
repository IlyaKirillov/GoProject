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

function Common_FindPosition( oElement )
{
    if( typeof( oElement.offsetParent ) != 'undefined' )
    {
        for( var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent )
        {
            posX += oElement.offsetLeft;
            posY += oElement.offsetTop;
        }
        return { X:posX, Y:posY };
    }
    else
    {
        return { X:oElement.x, Y:oElement.y };
    }
}

function Common_XYtoString(X,Y)
{
    var Res = new String();
    switch(X)
    {
        case 1: Res = "A"; break;
        case 2: Res = "B"; break;
        case 3: Res = "C"; break;
        case 4: Res = "D"; break;
        case 5: Res = "E"; break;
        case 6: Res = "F"; break;
        case 7: Res = "G"; break;
        case 8: Res = "H"; break;
        case 9: Res = "J"; break;
        case 10: Res = "K"; break;
        case 11: Res = "L"; break;
        case 12: Res = "M"; break;
        case 13: Res = "N"; break;
        case 14: Res = "O"; break;
        case 15: Res = "P"; break;
        case 16: Res = "Q"; break;
        case 17: Res = "R"; break;
        case 18: Res = "S"; break;
        case 19: Res = "T"; break;
    }
    Res += Y;
    return Res;
}

function Common_X_to_String(X)
{
    var Res = new String();
    switch(X)
    {
        case 1: Res = "A"; break;
        case 2: Res = "B"; break;
        case 3: Res = "C"; break;
        case 4: Res = "D"; break;
        case 5: Res = "E"; break;
        case 6: Res = "F"; break;
        case 7: Res = "G"; break;
        case 8: Res = "H"; break;
        case 9: Res = "J"; break;
        case 10: Res = "K"; break;
        case 11: Res = "L"; break;
        case 12: Res = "M"; break;
        case 13: Res = "N"; break;
        case 14: Res = "O"; break;
        case 15: Res = "P"; break;
        case 16: Res = "Q"; break;
        case 17: Res = "R"; break;
        case 18: Res = "S"; break;
        case 19: Res = "T"; break;
        case 20: Res = "a"; break;
        case 21: Res = "b"; break;
        case 22: Res = "c"; break;
        case 23: Res = "d"; break;
        case 24: Res = "e"; break;
        case 25: Res = "f"; break;
        case 26: Res = "g"; break;
        case 27: Res = "h"; break;
        case 28: Res = "j"; break;
        case 29: Res = "k"; break;
        case 30: Res = "l"; break;
        case 31: Res = "m"; break;
        case 32: Res = "n"; break;
        case 33: Res = "o"; break;
        case 34: Res = "p"; break;
        case 35: Res = "q"; break;
        case 36: Res = "r"; break;
        case 37: Res = "s"; break;
        case 38: Res = "t"; break;
    }
    return Res;
}

function Common_IsInt(Value)
{
    if ( "string" != typeof(Value) )
        return false;

    for ( var Index = 0; Index < Value.length; Index++ )
    {
        var CharCode = Value.charCodeAt(Index);
        if ( CharCode < 48 || CharCode > 57 )
            return false;
    }

    return true;
}

function Common_SortIncrease(First, Second)
{
    if (First > Second)
        return 1;
    else if (Second > First)
        return -1;
    else
        return 0;
}