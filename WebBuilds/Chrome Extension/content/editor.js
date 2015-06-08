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

window.onload   = OnDocumentReady;

function BodyFocus()
{
    if (oGameTree)
        GoBoardApi.Focus(oGameTree);
}

function OnDocumentReady()
{
    var oGameTree = GoBoardApi.Create_GameTree();
    GoBoardApi.Set_Sound(oGameTree, "http://goban.org/Sound");
    GoBoardApi.Create_BoardCommentsButtonsNavigator(oGameTree, "divId");

    if (sFilePath && "" !== sFilePath)
    {
        sFilePath = decodeURIComponent(sFilePath);

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
    }

    window.onresize = function()
    {
        if (oGameTree)
            GoBoardApi.Update_Size(oGameTree);
    }
}