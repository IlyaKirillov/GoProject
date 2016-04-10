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
}

function CColor(r, g, b, a)
{
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = ( typeof(a) === "undefined" ? 255 : a);
}

CColor.prototype.ToString = function()
{
    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a / 255 + ")";
};
CColor.prototype.Compare = function(oColor)
{
    if (this.r !== oColor.r || this.g !== oColor.g || this.b !== oColor.b || this.a !== oColor.a)
        return false;

    return true;
};
CColor.prototype.Copy = function()
{
    return new CColor(this.r, this.g, this.b, this.a);
};
CColor.prototype.ToLong = function()
{
    return ((this.r << 24 & 0xFF000000 ) | (this.g << 16 & 0x00FF0000) | (this.b << 8 & 0x0000FF00) | (this.a & 0x000000FF));
};
CColor.prototype.FromLong = function(nLong)
{
    this.r = (nLong >> 24) & 0xFF;
    this.g = (nLong >> 16) & 0xFF;
    this.b = (nLong >> 8) & 0xFF;
    this.a = (nLong      ) & 0xFF;
};
CColor.prototype.Set = function(r, g, b)
{
    this.r = r;
    this.g = g;
    this.b = b;
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

function Common_PosValueToString(Value, nSizeX, nSizeY)
{
    var oPos = Common_ValuetoXY(Value);
    return Common_XYtoString(oPos.X, oPos.Y, nSizeX, nSizeY);
}

function Common_XYtoString(X, Y, nSizeX, nSizeY)
{
    var Res = Common_X_to_String(X, nSizeX);
    Res += (nSizeY + 1 - Y);
    return Res;
}

function Common_X_to_String(_X, nSize)
{
    var Res;
    var X = Math.max(0, Math.min(_X - 1, nSize - 1));

    if (X < 8)
        Res = String.fromCharCode('A'.charCodeAt(0) + X);
    else if (X <= 24)
        Res = String.fromCharCode('A'.charCodeAt(0) + X + 1);
    else if (X < 33)
        Res = String.fromCharCode('A'.charCodeAt(0) + X - 25, 'A'.charCodeAt(0) + X - 25);
    else if (X < 50)
        Res = String.fromCharCode('A'.charCodeAt(0) + X - 24, 'A'.charCodeAt(0) + X - 24);
    else
        Res = String.fromCharCode('A'.charCodeAt(0) + X - 50, 'A'.charCodeAt(0) + X - 50, 'A'.charCodeAt(0) + X - 50);

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

function Common_UTF8_Decode(sUtf8Text)
{
    var sString = "";
    var nPos = 0;
    var nCharCode1 = 0, nCharCode2 = 0, nCharCode3 = 0;

    var nLen = sUtf8Text.length;
    while (nPos < nLen)
    {
        nCharCode1 = sUtf8Text.charCodeAt(nPos);

        if (nCharCode1 < 128)
        {
            sString += String.fromCharCode(nCharCode1);
            nPos++;
        }
        else if((nCharCode1 > 191) && (nCharCode1 < 224))
        {
            nCharCode2 = sUtf8Text.charCodeAt(nPos + 1);
            sString += String.fromCharCode(((nCharCode1 & 31) << 6) | (nCharCode2 & 63));
            nPos += 2;
        }
        else
        {
            nCharCode2 = sUtf8Text.charCodeAt(nPos + 1);
            nCharCode3 = sUtf8Text.charCodeAt(nPos + 2);
            sString += String.fromCharCode(((nCharCode1 & 15) << 12) | ((nCharCode2 & 63) << 6) | (nCharCode3 & 63));
            nPos += 3;
        }
    }

    return sString;
}

function Common_UTF8_Encode(sUtf8Text)
{
    var sString = "";
    var nPos = 0;
    var nCharCode1 = 0, nCharCode2 = 0, nCharCode3 = 0;

    var nLen = sUtf8Text.length;
    while (nPos < nLen)
    {
        nCharCode1 = sUtf8Text.charCodeAt(nPos);

        if (nCharCode1 < 128)
        {
            sString += String.fromCharCode(nCharCode1);
            nPos++;
        }
        else if((nCharCode1 > 191) && (nCharCode1 < 224))
        {
            nCharCode2 = sUtf8Text.charCodeAt(nPos + 1);
            sString += String.fromCharCode(((nCharCode1 & 31) << 6) | (nCharCode2 & 63));
            nPos += 2;
        }
        else
        {
            nCharCode2 = sUtf8Text.charCodeAt(nPos + 1);
            nCharCode3 = sUtf8Text.charCodeAt(nPos + 2);
            sString += String.fromCharCode(((nCharCode1 & 15) << 12) | ((nCharCode2 & 63) << 6) | (nCharCode3 & 63));
            nPos += 3;
        }
    }

    return sString;
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

        o.root.onDragStart  = function(){};//= new Function();
        o.root.onDragEnd    = function(){};//= new Function();
        o.root.onDrag       = function(){};//= new Function();
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
        check_MouseMoveEvent(e);

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

        if (o.xMapper)      nx = o.xMapper(y);
        else if (o.yMapper) ny = o.yMapper(x);

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

var Common_RequestAnimationFrame = (window['requestAnimationFrame'] ? window['requestAnimationFrame'] : (function()
{
    return window['webkitRequestAnimationFrame'] ||
           window['oRequestAnimationFrame']      ||
           window['msRequestAnimationFrame']     ||
           function(callback)
           {
               window.setTimeout(callback, 1000 / 60);
           };
})());

function CCommon()
{
}
CCommon.prototype.Get_Browser = function()
{
    var sBrowser = "";

    var sBrowserName = navigator.userAgent;
    if (-1 != sBrowserName.indexOf("Opera"))
        sBrowser = "Opera";
    else if (-1 != sBrowserName.indexOf("Chrome"))
        sBrowser = "Chrome";
    else if (-1 != sBrowserName.indexOf("MSIE"))
        sBrowser = "IE";
    else if (-1 != sBrowserName.indexOf("Safari"))
        sBrowser = "Safari";
    else if (-1 != sBrowserName.indexOf("Mozilla"))
        sBrowser = "Mozilla";

    return sBrowser;
};
CCommon.prototype.SaveAs = function(oBlob, sName, sMimeType)
{
    if (typeof navigator !== "undefined" && navigator['msSaveOrOpenBlob'])
        return navigator['msSaveOrOpenBlob'](oBlob, sName);

    var oLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    var oURL = (window['URL'] || window['webkitURL'] || window).createObjectURL(oBlob);
    oLink['href']     = oURL;
    oLink['download'] = sName;

    if (sMimeType)
        oLink['type'] = sMimeType;

    this.Click(oLink);
};
CCommon.prototype.OpenFileDialog = function(oGameTree)
{
    var aBody = document.getElementsByTagName('body');

    if (aBody.length > 0)
    {
        var oBody  = aBody[0];
        var oInput = document.createElement("input");
        oBody.appendChild(oInput); // в IE без этого не будет работать

        oInput.type          = "file";
        oInput.multiple      = false;
        oInput.accept        = ".sgf,.gib,.ngf";
        oInput.style.display = "none";

        oInput.addEventListener("change", function (oEvent)
        {
            var aFiles = oEvent.target.files;

            if (aFiles.length > 0)
            {
                var oFile      = aFiles[0];
                var sExt       = oFile.name.split('.').pop().toLowerCase();
                var oReader    = new FileReader();
                oReader.onload = function (oEvent2)
                {
                    oGameTree.Load_Sgf(oEvent2.target.result, null, null, sExt);
                    oGameTree.Focus();
                };

                oReader.readAsText(oFile);
                oGameTree.Focus();
            }
        }, false);

        this.Click(oInput);
        oBody.removeChild(oInput);
    }
};
CCommon.prototype.Click = function(oNode)
{
    var oEvent = document.createEvent("MouseEvents");
    oEvent.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    oNode.dispatchEvent(oEvent);
};
CCommon.prototype.Get_LocalStorageItem = function(_name)
{
    if (undefined !== window.localStorage)
    {
        var name = "HTMLGoBoard" + _name;
        return localStorage.getItem(name);
    }
    return "";
};
CCommon.prototype.Set_LocalStorageItem = function(_name, value)
{
    if (undefined !== window.localStorage)
    {
        var name = "HTMLGoBoard" + _name;
        localStorage.setItem(name, value);
    }
};
CCommon.prototype.Encode_Base64 = function(aBytes)
{
    var sOutput = "";
    var nByte1, nByte2, nByte3 = 0;
    var nEnc1, nEnc2, nEnc3, nEnc4 = 0;
    var nPos = 0;

    do
    {
        nByte1 = aBytes[nPos++];
        nByte2 = aBytes[nPos++];
        nByte3 = aBytes[nPos++];

        nEnc1 = nByte1 >> 2;
        nEnc2 = ((nByte1 &  3) << 4) | (nByte2 >> 4);
        nEnc3 = ((nByte2 & 15) << 2) | (nByte3 >> 6);
        nEnc4 = nByte3 & 63;

        if (isNaN(nByte2))
        {
            nEnc3 = nEnc4 = 64;
        }
        else if (isNaN(nByte3))
        {
            nEnc4 = 64;
        }

        sOutput = sOutput + g_oBase64String.charAt(nEnc1) + g_oBase64String.charAt(nEnc2) + g_oBase64String.charAt(nEnc3) + g_oBase64String.charAt(nEnc4);
    } while (nPos < aBytes.length);

    return sOutput;
};
CCommon.prototype.Decode_Base64 = function(_sInput)
{
    var nByte1, nByte2, nByte3 = 0;
    var nEnc1, nEnc2, nEnc3, nEnc4 = "";
    var nPos = 0;

    // Удаляем все невалидные символы A-Z, a-z, 0-9, +, /, or =
    var sInput = _sInput.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    var aOut = [];

    do
    {
        nEnc1 = g_oBase64String.indexOf(sInput.charAt(nPos++));
        nEnc2 = g_oBase64String.indexOf(sInput.charAt(nPos++));
        nEnc3 = g_oBase64String.indexOf(sInput.charAt(nPos++));
        nEnc4 = g_oBase64String.indexOf(sInput.charAt(nPos++));

        nByte1 = (nEnc1 << 2) | (nEnc2 >> 4);
        nByte2 = ((nEnc2 & 15) << 4) | (nEnc3 >> 2);
        nByte3 = ((nEnc3 & 3) << 6) | nEnc4;

        aOut.push(nByte1);

        if (nEnc3 != 64)
            aOut.push(nByte2);

        if (nEnc4 != 64)
            aOut.push(nByte3);

    } while (nPos < sInput.length);

    return aOut;
};
CCommon.prototype.Encode_Base64_UrlSafe = function(aBytes)
{
    var sOutput = this.Encode_Base64(aBytes);
    sOutput = sOutput.replace(new RegExp("\\+", 'g'), '~');
    sOutput = sOutput.replace(new RegExp("\\/", 'g'), '-');
    sOutput = sOutput.replace(new RegExp("=", 'g'), '_');
    return sOutput;
};
CCommon.prototype.Decode_Base64_UrlSafe = function(sInput)
{
    sInput = sInput.replace(new RegExp("~", 'g'), '+');
    sInput = sInput.replace(new RegExp("-", 'g'), '/');
    sInput = sInput.replace(new RegExp("_", 'g'), '=');
    return this.Decode_Base64(sInput);
};
CCommon.prototype.Set_InnerTextToElement = function(oElement, sText)
{
    if (oElement.innerText)
        oElement.innerText = sText;
    else
        oElement.textContent = sText;
};
CCommon.prototype.Is_NodeDescendant = function(oParent, oChild, _nDepth)
{
    if (!oParent || !oChild)
        return false;

    var nDepth = (_nDepth ? _nDepth : 0);

    var oNode = oChild.parentNode;
    while (oNode != null)
    {
        if (oNode == oParent)
        {
            return true;
        }

        nDepth--;
        if (nDepth < 0)
            return false;

        oNode = oNode.parentNode;
    }
    return false;
};
CCommon.prototype.Create_DivElement = function(oParentElement, sName)
{
    var oElement = document.createElement("div");
    oElement.setAttribute("id", sName);
    oElement.setAttribute("style", "position:absolute;padding:0;margin:0;");
    oElement.setAttribute("oncontextmenu", "return false;");
    oParentElement.appendChild(oElement);
    return oElement;
};

var g_oBase64String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

var Common = new CCommon();




