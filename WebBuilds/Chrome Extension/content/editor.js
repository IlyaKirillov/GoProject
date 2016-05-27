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

    if (oFilesInfo[sFilePath].StartNodeRef)
        GoBoardApi.Set_StartNodeByReference(oGameTree, oFilesInfo[sFilePath].StartNodeRef);

    document.title = GoBoardApi.Get_MatchName(oGameTree);

    document.getElementById("divCachedFile").style.display = "none";
    document.getElementById("idBlurDiv").style.display = "none";

    bFreshLoad = false;
    BodyFocus();
}

function FreshLoad()
{
    var sExt = sFilePath.split('.').pop().toLowerCase();
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", sFilePath, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var sFileText = rawFile.responseText;
                GoBoardApi.Load_Sgf(oGameTree, sFileText, null, null, sExt);
                document.title = GoBoardApi.Get_MatchName(oGameTree);
            }
        }
    };
    rawFile.send(null);

    document.getElementById("divCachedFile").style.display = "none";
    document.getElementById("idBlurDiv").style.display = "none";
    BodyFocus();
}

function OnDocumentReady()
{
    document.getElementById("divId").onfocus             = BodyFocus;
    document.getElementById("idButtonCacheLoad").onclick = LoadFromCache;
    document.getElementById("idButtonFreshLoad").onclick = FreshLoad;

    oGameTree = GoBoardApi.Create_GameTree();
    GoBoardApi.Set_Sound(oGameTree, "http://webgoboard.com/Sound");
    GoBoardApi.Create_BoardCommentsButtonsNavigator(oGameTree, "divId");

    var oFilesInfo = GetCachesFiles();
    if (sFilePath && "" !== sFilePath)
    {
        sFilePath = decodeURIComponent(sFilePath);
        if (oFilesInfo && oFilesInfo[sFilePath])
        {
            document.getElementById("divCachedFile").style.display = "block";
            document.getElementById("idBlurDiv").style.display = "block";
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

    var sSgf          = GoBoardApi.Save_Sgf(oGameTree);
    var sMoveRef      = GoBoardApi.Get_MoveReference(oGameTree, false);
    var sStartNodeRef = GoBoardApi.Get_MoveReference(oGameTree, false, 1);
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
            Index        : 0,
            File         : sSgf,
            MoveRef      : sMoveRef,
            StartNodeRef : sStartNodeRef
        };
    }
    else
    {
        oFilesInfo["default"] =
        {
            File         : sSgf,
            MoveRef      : sMoveRef,
            StartNodeRef : sStartNodeRef
        };
    }

    SetCachedFiles(oFilesInfo);
}

function OnDocumentResize()
{
    if (oGameTree)
        GoBoardApi.Update_Size(oGameTree);
}

function GetCachesFiles()
{
    var sFilesInfo = localStorage.getItem("WebGoBoard_ChromeExtension_Cache");
    return JSON.parse(sFilesInfo);
}

function SetCachedFiles(oFilesInfo)
{
    localStorage.setItem("WebGoBoard_ChromeExtension_Cache", JSON.stringify(oFilesInfo));
}