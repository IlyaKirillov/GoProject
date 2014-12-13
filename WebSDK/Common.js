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

function Common_UTF8_Decode(utftext)
{
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while (i < utftext.length)
    {
        c = utftext.charCodeAt(i);

        if (c < 128)
        {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224))
        {
            c2 = utftext.charCodeAt(i+1);
            var charCode = ((c & 31) << 6) | (c2 & 63);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else
        {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            var charCode = ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

function Common_EncodeString(string, Encoding)
{
    var Enc = Encodings[Encoding];
    var Len = string.length;
    var Bytes = "";
    for (var Index = 0; Index < Len; Index++)
    {
        for (var Code = 0; Code < 256; Code++)
        {
            if (Enc.charCodeAt(Code) === string.charCodeAt(Index))
            {
                Bytes += String.fromCharCode(Code);
                break;
            }
        }
    }

    return Bytes;
}

var Common_DragHandler =
{
    Obj : null,

    Init : function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
    {
        o.onmousedown   = Common_DragHandler.Start;

        o.hmode         = bSwapHorzRef ? false : true ;
        o.vmode         = bSwapVertRef ? false : true ;

        o.root = oRoot && oRoot != null ? oRoot : o ;

        if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
        if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "350px";
        if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
        if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

        o.minX  = typeof minX != 'undefined' ? minX : null;
        o.minY  = typeof minY != 'undefined' ? minY : null;
        o.maxX  = typeof maxX != 'undefined' ? maxX : null;
        o.maxY  = typeof maxY != 'undefined' ? maxY : null;

        o.xMapper = fXMapper ? fXMapper : null;
        o.yMapper = fYMapper ? fYMapper : null;

        o.root.onDragStart  = new Function();
        o.root.onDragEnd    = new Function();
        o.root.onDrag       = new Function();
    },

    Start : function(e)
    {
        var o = Common_DragHandler.Obj = this;
        e = Common_DragHandler.FixE(e);
        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
        o.root.onDragStart(x, y);

        o.lastMouseX    = e.clientX;
        o.lastMouseY    = e.clientY;

        if (o.hmode) {
            if (o.minX != null) o.minMouseX = e.clientX - x + o.minX;
            if (o.maxX != null) o.maxMouseX = o.minMouseX + o.maxX - o.minX;
        } else {
            if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
            if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
        }

        if (o.vmode) {
            if (o.minY != null) o.minMouseY = e.clientY - y + o.minY;
            if (o.maxY != null) o.maxMouseY = o.minMouseY + o.maxY - o.minY;
        } else {
            if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
            if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
        }

        document.onmousemove = Common_DragHandler.Drag;
        document.onmouseup   = Common_DragHandler.End;

        return false;
    },

    Drag : function(e)
    {
        e = Common_DragHandler.FixE(e);
        var o = Common_DragHandler.Obj;

        var ey  = e.clientY;
        var ex  = e.clientX;
        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
        var nx, ny;

        if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
        if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
        if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
        if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

        nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
        ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

        if (o.xMapper)      nx = o.xMapper(y)
        else if (o.yMapper) ny = o.yMapper(x)

        if (o.minX != null) nx = Math.max( nx, o.minX );
        if (o.maxX != null) nx = Math.min( nx, o.maxX );
        if (o.minY != null) ny = Math.max( ny, o.minY );
        if (o.maxY != null) ny = Math.min( ny, o.maxY );

        Common_DragHandler.Obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
        Common_DragHandler.Obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
        Common_DragHandler.Obj.lastMouseX = ex;
        Common_DragHandler.Obj.lastMouseY = ey;
        Common_DragHandler.Obj.root.onDrag(nx, ny);

        return false;
    },

    End : function()
    {
        document.onmousemove = null;
        document.onmouseup   = null;
        Common_DragHandler.Obj.root.onDragEnd(parseInt(Common_DragHandler.Obj.root.style[Common_DragHandler.Obj.hmode ? "left" : "right"]), parseInt(Common_DragHandler.Obj.root.style[Common_DragHandler.Obj.vmode ? "top" : "bottom"]));
        Common_DragHandler.Obj = null;
    },

    FixE : function(e)
    {
        if (typeof e == 'undefined') e = window.event;
        if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
        if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
        return e;
    }
};

function CommonExtend(Child, Parent)
{
    var F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}