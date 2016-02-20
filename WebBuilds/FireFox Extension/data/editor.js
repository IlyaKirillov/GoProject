'use strict';

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     14.03.15
 * Time     13:05
 */

var sFilePath  = location.search.split('file=')[1];
var oGameTree  = null;
var bFreshLoad = true;

window.onload         = OnDocumentReady;
window.onbeforeunload = OnDocumentClose;
window.onresize       = OnDocumentResize;

function BodyFocus()
{
    if (oGameTree)
        GoBoardApi.Focus(oGameTree);
}

function LoadFromCache()
{
    var oFilesInfo = GetCachesFiles();
    GoBoardApi.Load_Sgf(oGameTree, oFilesInfo[sFilePath].File, null, oFilesInfo[sFilePath].MoveRef);
    document.title = GoBoardApi.Get_MatchName(oGameTree);

    document.getElementById("divCachedFile").style.display = "none";
    document.getElementById("idBlurDiv").style.display     = "none";

    bFreshLoad = false;
}

function FreshLoad()
{
    var sFileText  = Decode_UTF8(Decode_Base64_UrlSafe(sFilePath));
    var sExt       = sFileText.substr(0, 3);
    sFileText      = sFileText.substr(3);
    GoBoardApi.Load_Sgf(oGameTree, sFileText, null, null, sExt);
    document.title = GoBoardApi.Get_MatchName(oGameTree);

    document.getElementById("divCachedFile").style.display = "none";
    document.getElementById("idBlurDiv").style.display     = "none";
}

function OnDocumentReady()
{
    document.getElementById("idButtonCacheLoad").onclick = LoadFromCache;
    document.getElementById("idButtonFreshLoad").onclick = FreshLoad;

    oGameTree = GoBoardApi.Create_GameTree();
    GoBoardApi.Set_Sound(oGameTree, "http://webgoboard.org/Sound");
    GoBoardApi.Create_BoardCommentsButtonsNavigator(oGameTree, "divId");

    var oFilesInfo = GetCachesFiles();
    if (sFilePath && "" !== sFilePath)
    {
        if (oFilesInfo && oFilesInfo[sFilePath])
        {
            document.getElementById("divCachedFile").style.display = "block";
            document.getElementById("idBlurDiv").style.display     = "block";
        }
        else
        {
            FreshLoad();
        }
    }
    else
    {
        if (oFilesInfo && oFilesInfo["default"])
        {
            GoBoardApi.Load_Sgf(oGameTree, oFilesInfo["default"].File, null, oFilesInfo["default"].MoveRef);
        }
    }
}

function OnDocumentClose()
{
    if (true === bFreshLoad && true !== GoBoardApi.Is_Modified(oGameTree))
        return;

    var oFilesInfo = GetCachesFiles();
    if (!oFilesInfo)
        oFilesInfo = {};

    var sSgf     = GoBoardApi.Save_Sgf(oGameTree);
    var sMoveRef = GoBoardApi.Get_MoveReference(oGameTree, false);
    if (sFilePath && "" !== sFilePath)
    {
        var nCurIndex = -1;
        if (oFilesInfo[sFilePath])
            nCurIndex = oFilesInfo[sFilePath].Index;

        for (var sCurPath in oFilesInfo)
        {
            if (sCurPath === "default")
                continue;

            if (oFilesInfo[sCurPath].Index < nCurIndex || -1 === nCurIndex)
                oFilesInfo[sCurPath].Index++;

            if (oFilesInfo[sCurPath].Index > 10)
                delete oFilesInfo[sCurPath];
        }

        oFilesInfo[sFilePath] =
        {
            Index   : 0,
            File    : sSgf,
            MoveRef : sMoveRef
        };
    }
    else
    {
        oFilesInfo["default"] =
        {
            File    : sSgf,
            MoveRef : sMoveRef
        };
    }

    SetCachedFiles(oFilesInfo);
}

function OnDocumentResize()
{
    if (oGameTree)
        GoBoardApi.Update_Size(oGameTree);
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

function GetCachesFiles()
{
    var sFilesInfo = localStorage.getItem("WebGoBoard_FireFoxExtension_Cache");
    return JSON.parse(sFilesInfo);
}

function SetCachedFiles(oFilesInfo)
{
    localStorage.setItem("WebGoBoard_FireFoxExtension_Cache", JSON.stringify(oFilesInfo));
}