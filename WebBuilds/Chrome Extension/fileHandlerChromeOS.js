/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     14.03.15
 * Time     13:05
 */

(function()
{
    'use strict';

    if (!chrome.fileBrowserHandler)
    {
        // Not on Chromium OS, bail out
        return;
    }

    chrome.fileBrowserHandler.onExecute.addListener(onExecuteFileBrowserHandler);

    function onExecuteFileBrowserHandler(id, details)
    {
        if (id !== 'open-in-WebGoBoard')
        {
            return;
        }

        var fileEntries = details.entries;

        // "tab_id" is the currently documented format, but it is inconsistent with
        // the other Chrome APIs that use "tabId" (http://crbug.com/179767)
        var tabId = details.tab_id || details.tabId;
        if (tabId > 0)
        {
            chrome.tabs.get(tabId, function(tab)
            {
                openViewer(tab && tab.windowId, fileEntries);
            });
        }
        else
        {
            // Re-use existing window, if available.
            chrome.windows.getLastFocused(function(chromeWindow)
            {
                var windowId = chromeWindow && chromeWindow.id;
                if (windowId)
                {
                    chrome.windows.update(windowId, { focused: true });
                }
                openViewer(windowId, fileEntries);
            });
        }
    }

    function openViewer(windowId, fileEntries)
    {
        if (!fileEntries.length)
        {
            return;
        }

        var fileEntry = fileEntries.shift();
        var url = fileEntry.toURL();
        // Use drive: alias to get shorter (more human-readable) URLs.
        url = url.replace(/^filesystem:chrome-extension:\/\/[a-p]{32}\/external\//, 'drive:');
        url = Get_EditorURL(url);

        if (windowId)
        {
            chrome.tabs.create({windowId: windowId, active: true, url: url}, function()
            {
                openViewer(windowId, fileEntries);
            });
        }
        else
        {
            chrome.windows.create({type: 'normal', focused: true, url: url}, function(chromeWindow)
            {
                openViewer(chromeWindow.id, fileEntries);
            });
        }
    }
})();
