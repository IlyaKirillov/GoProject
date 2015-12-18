const {Cc,Ci,Cm,Cr,Cu} = require("chrome");
var self    = require("sdk/self");
var tabs    = require("sdk/tabs");
var base64  = require("sdk/base64");

Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/NetUtil.jsm');

const SGF_CONTENT_TYPE = 'application/x-go-sgf';

var oHttpObserver =
{
    observe: function(subject, topic, data)
    {
        if ("http-on-examine-response" == topic || "http-on-examine-merged-response" == topic || "http-on-examine-cached-response" == topic)
        {
            var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
            var contentType = httpChannel.getResponseHeader("Content-Type");
            // httpChannel.loadFlags && httpChannel.LOAD_DOCUMENT_URI && httpChannel.loadFlags & httpChannel.LOAD_DOCUMENT_URI - проверка, чтобы обрабатывались только запросы 'main_frame', 'sub_frame' как в Хроме
            if (contentType && -1 != contentType.indexOf(SGF_CONTENT_TYPE) && httpChannel.loadFlags && httpChannel.LOAD_DOCUMENT_URI && httpChannel.loadFlags & httpChannel.LOAD_DOCUMENT_URI)
            {
                var loadContext = null;
                try
                {
                    loadContext = subject.QueryInterface(Ci.nsIChannel).notificationCallbacks.getInterface(Ci.nsILoadContext);
                }
                catch (ex)
                {
                    try
                    {
                        loadContext = subject.loadGroup.notificationCallbacks.getInterface(Ci.nsILoadContext);
                    }
                    catch (ex)
                    {
                        loadContext = null;
                    }
                }

                var newListener = new CSgfListener(loadContext, null, "sgf");
                subject.QueryInterface(Ci.nsITraceableChannel);
                subject.setNewListener(newListener);
            }
        }
    }
};

function CSgfListener(loadContext, tab, ext)
{
    this.ext         = ext;
    this.tab         = tab;
    this.loadContext = loadContext;
    this.receivedData = [];
}

CSgfListener.prototype =
{
    onDataAvailable: function(request, context, inputStream, offset, count)
    {
        var binaryInputStream  = Cc["@mozilla.org/binaryinputstream;1"].createInstance(Ci.nsIBinaryInputStream);
        var storageStream      = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
        var binaryOutputStream = Cc["@mozilla.org/binaryoutputstream;1"].createInstance(Ci.nsIBinaryOutputStream);

        binaryInputStream.setInputStream(inputStream);
        storageStream.init(8192, count, null);
        binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));

        var data = binaryInputStream.readBytes(count);
        this.receivedData.push(data);
        binaryOutputStream.writeBytes(data, count);
    },

    onStartRequest: function(request, context)
    {
    },

    onStopRequest: function(request, context, statusCode)
    {
        var sExt = (this.ext ? this.ext : "sgf");
        var sData = "";
        for (var nIndex = 0, nCount = this.receivedData.length; nIndex < nCount; nIndex++)
        {
            sData += this.receivedData[nIndex];
        }

        var sFileText = Encode_Base64_UrlSafe(Encode_UTF8(sExt + Decode_UTF8(sData)));
        var sUrl = self.data.url('editor.html') + '?file=' + sFileText;

        if (null !== this.tab)
        {
            this.tab.url = sUrl;
        }
        else
        {
            var loadContext = this.loadContext;
            if (loadContext && loadContext.associatedWindow && loadContext.associatedWindow.location && loadContext.associatedWindow.location == loadContext.associatedWindow.top.location)
            {
                loadContext.associatedWindow.location = sUrl;
            }
            else
            {
                tabs.open(sUrl);
            }
        }
    },

    QueryInterface: function (aIID)
    {
        if (aIID.equals(Ci.nsIStreamListener) || aIID.equals(Ci.nsISupports))
        {
            return this;
        }
        throw Cr.NS_NOINTERFACE;
    }
}


var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
observerService.addObserver(oHttpObserver, "http-on-examine-response", false);
observerService.addObserver(oHttpObserver, "http-on-examine-cached-response", false);
observerService.addObserver(oHttpObserver, "http-on-examine-merged-response", false);

require("sdk/tabs").on("ready", OnTabReady);

function OnTabReady(tab)
{
    var sUrl = tab.url.toString();
    if (0 === sUrl.indexOf("file:///"))
    {
        var nLen = sUrl.length;
        var sExt = sUrl.substr(nLen - 4);
        if (sExt === ".sgf" || sExt === ".SGF")
        {
            sExt = "sgf";
        }
        else if (sExt === ".gib" || sExt === ".GIB")
        {
            sExt = "gib";
        }
        else if (sExt === ".ngf" || sExt === ".NGF")
        {
            sExt = "ngf";
        }
        else
            sExt = "";

        if ("" !== sExt)
        {
            var ioService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
            var channel = ioService.newChannel(sUrl, null, null);
            channel.asyncOpen(new CSgfListener(null, tab, sExt), null);
        }
    }
}

function Encode_Base64(aBytes)
{
    return base64.encode(aBytes);
}

function Encode_Base64_UrlSafe(aBytes)
{
    var sOutput = Encode_Base64(aBytes);
    sOutput = sOutput.replace(new RegExp("\\+", 'g'), '~');
    sOutput = sOutput.replace(new RegExp("\\/", 'g'), '-');
    sOutput = sOutput.replace(new RegExp("=", 'g'), '_');
    return sOutput;
};

function Encode_UTF8(sString)
{
    sString = sString.replace(/\r\n/g,"\n");
    var sUtf8Text = "";

    for (var nPos = 0, nLen = sString.length; nPos < nLen; nPos++)
    {
        var nCharCode = sString.charCodeAt(nPos);

        if (nCharCode < 128)
        {
            sUtf8Text += String.fromCharCode(nCharCode);
        }
        else if((nCharCode > 127) && (nCharCode < 2048))
        {
            sUtf8Text += String.fromCharCode((nCharCode >> 6) | 192);
            sUtf8Text += String.fromCharCode((nCharCode & 63) | 128);
        }
        else
        {
            sUtf8Text += String.fromCharCode((nCharCode >> 12) | 224);
            sUtf8Text += String.fromCharCode(((nCharCode >> 6) & 63) | 128);
            sUtf8Text += String.fromCharCode((nCharCode & 63) | 128);
        }

    }

    return sUtf8Text;
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

var {ActionButton} = require("sdk/ui/button/action");

var button = ActionButton(
{
    id    : "MainButtonId",
    label : "Web Go Board",
    icon  :
    {
        "16": self.data.url('icon16.png'),
        "18": self.data.url('icon18.png'),
        "32": self.data.url('icon32.png'),
        "64": self.data.url('icon64.png')
    },

    onClick: function(state)
    {
        tabs.open(self.data.url('editor.html'));
    }
});

let { window: {navigator} } = require('sdk/addon/window');
var bIsAndroid = navigator.platform.toLowerCase().indexOf("android") > -1;

if (!bIsAndroid)
{
function ClearMimeTypes(sExt)
{
    var handlerService = Cc['@mozilla.org/uriloader/handler-service;1'].getService(Ci.nsIHandlerService);
    var mimeService = Cc['@mozilla.org/mime;1'].getService(Ci.nsIMIMEService);
    var CONTENT_TYPE = '';
    var TYPE_EXTENSION = sExt;

    try
    {
        var handlerInfo = mimeService.getFromTypeAndExtension(CONTENT_TYPE, TYPE_EXTENSION);
        if (handlerInfo)
        {
            handlerService.remove(handlerInfo);
        }
    }
    catch(ex)
    {
    }
}

ClearMimeTypes("sgf");
ClearMimeTypes("ngf");
ClearMimeTypes("gib");



}