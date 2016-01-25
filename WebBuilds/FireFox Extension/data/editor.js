'use strict';

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     14.03.15
 * Time     13:05
 */

var sFilePath = location.search.split('file=')[1];
var oGameTree = null;

window.onload = OnDocumentReady;

function BodyFocus()
{
    if (oGameTree)
        GoBoardApi.Focus(oGameTree);
}

function OnDocumentReady()
{
    var oGameTree = GoBoardApi.Create_GameTree();
    GoBoardApi.Set_Sound(oGameTree, "http://webgoboard.org/Sound");
    GoBoardApi.Create_BoardCommentsButtonsNavigator(oGameTree, "divId");

    if (sFilePath && "" !== sFilePath)
    {
        var sFileText = Decode_UTF8(Decode_Base64_UrlSafe(sFilePath));
        var sExt = sFileText.substr(0, 3);
        sFileText = sFileText.substr(3);
        GoBoardApi.Load_Sgf(oGameTree, sFileText, null, null, sExt);
        document.title = GoBoardApi.Get_MatchName(oGameTree);
    }

    window.onresize = function()
    {
        if (oGameTree)
            GoBoardApi.Update_Size(oGameTree);
    }
}

function Decode_Base64_UrlSafe(sInput)
{
    sInput = sInput.replace(new RegExp("~", 'g'), '+');
    sInput = sInput.replace(new RegExp("-", 'g'), '/');
    sInput = sInput.replace(new RegExp("_", 'g'), '=');
    return atob(sInput);
}

function Decode_UTF8(sUtf8Text)
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