'use strict';

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     14.03.15
 * Time     13:05
 */


function Get_EditorURL(sFileUrl)
{
    if (sFileUrl)
        return chrome.extension.getURL('content/editor.html') + '?file=' + encodeURIComponent(sFileUrl);
    else
        return chrome.extension.getURL('content/editor.html');
}

function Get_HeaderFromHeaders(aHeaders, sHeaderName)
{
    for (var nIndex = 0, nCount = aHeaders.length; nIndex < nCount; nIndex++)
    {
        var oHeader = aHeaders[nIndex];
        if (oHeader.name.toLowerCase() === sHeaderName)
            return oHeader;
    }

    return null;
}

function Is_SgfFile(oDetails)
{
    var oHeader = Get_HeaderFromHeaders(oDetails.responseHeaders, 'content-type');
    if (oHeader)
    {
        var sHeaderValue = oHeader.value.toLowerCase().split(';',1)[0].trim();
        return ((sHeaderValue === 'application/x-go-sgf' || (sHeaderValue === 'application/octet-stream' && oDetails.url.toLowerCase().indexOf('.sgf') > 0)) ? true : false);
    }
}

chrome.webRequest.onHeadersReceived.addListener(
    function(oDetails)
    {
        if ('GET' !== oDetails.method)
        {
            // Don't intercept POST requests until http://crbug.com/104058 is fixed.
            return;
        }

        if (!Is_SgfFile(oDetails))
        {
            return;
        }

        var oUrl = Get_EditorURL(oDetails.url);

        if ('main_frame' === oDetails.type)
            return { redirectUrl: oUrl };
        else
        {
            // В IFrame открываем в параллельной вкладке доску и не блокируем IFrame
            chrome.tabs.create({url: oUrl});
        }
    },
    {
        urls: [
            '<all_urls>'
        ],
        types: ['main_frame', 'sub_frame']
    },
    ['blocking','responseHeaders']
);

chrome.webRequest.onBeforeRequest.addListener(
    function(oDetails)
    {
        var oUrl = Get_EditorURL(oDetails.url);
        return { redirectUrl: oUrl };
    },
    {
        urls:
        [
            'ftp://*/*.sgf',
            'ftp://*/*.SGF',
            'ftp://*/*.gib',
            'ftp://*/*.GIB',
            'ftp://*/*.ngf',
            'ftp://*/*.NGF'
        ],
        types: ['main_frame']
    },
    ['blocking']
);

chrome.webRequest.onBeforeRequest.addListener(
    function(oDetails)
    {
        var oUrl = Get_EditorURL(oDetails.url);
        return { redirectUrl: oUrl };
    },
    {
        urls:
        [
            'file://*/*.sgf',
            'file://*/*.SGF',
            'file://*/*.gib',
            'file://*/*.GIB',
            'file://*/*.ngf',
            'file://*/*.NGF'
        ],
        types: ['main_frame']
    },
    ['blocking']
);

chrome.browserAction.onClicked.addListener(function()
{
    chrome.tabs.create({url: Get_EditorURL()});
});
