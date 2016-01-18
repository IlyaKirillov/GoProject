"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     24.01.15
 * Time     20:52
 */

function CStreamWriter()
{
    this.m_pData      = null;
    this.m_pImageData = null;
    this.m_nLength    = 0;
    this.m_nPos       = 0;

    this.Init();
}

CStreamWriter.prototype.Init = function()
{
    var oContext = document.createElement('canvas').getContext('2d');

    this.m_nLength    = 1024 * 1024 * 5;
    this.m_pImageData = oContext.createImageData(this.m_nLength / 4, 1);
    this.m_pData      = this.m_pImageData.data;
    this.m_nPos       = 0;
};
CStreamWriter.prototype.private_CheckSize = function(nCount)
{
    if (this.m_nPos + nCount >= this.m_nLength)
    {
        var oContext = document.createElement('canvas').getContext('2d');

        var pOldData      = this.m_pData;
        this.m_nLength   *= 2;
        this.m_pImageData = oContext.createImageData(this.m_nLength / 4, 1);
        this.m_pData      = this.m_pImageData.data;

        var pNewData = this.m_pData;

        for (var nPos = 0; nPos < this.m_pPos; nPos++)
            pNewData[nPos] = pOldData[nPos];
    }
};
CStreamWriter.prototype.Get_Bytes = function()
{
    var oArray = new Uint8Array(this.m_nPos);
    for (var nPos = 0; nPos < this.m_nPos; nPos++)
        oArray[nPos] = this.m_pData[nPos];

    return oArray;
};
CStreamWriter.prototype.Get_CurPosition = function()
{
    return this.m_nPos;
};
CStreamWriter.prototype.Seek = function(nPos)
{
    this.m_nPos = nPos;
};
CStreamWriter.prototype.Skip = function(nBytes)
{
    this.m_nPos += nBytes;
};
CStreamWriter.prototype.Write_Byte = function(nByte)
{
    this.private_CheckSize(1);
    this.m_pData[this.m_nPos++] = nByte;
};
CStreamWriter.prototype.Write_String = function(sString)
{
    var nLen = sString.length;
    this.private_CheckSize(nLen);
    for (var nPos = 0; nPos < nLen; nPos++)
        this.m_pData[this.m_nPos++] = sString.charCodeAt(nPos);
};
CStreamWriter.prototype.Write_String2 = function(sString)
{
    this.Write_Long(sString.length);
    this.Write_String(sString);
};
CStreamWriter.prototype.Write_Bytes = function(pBytes, nOffset, nCount)
{
    var nStartPos = nOffset || 0;
    var nEndPos   = nCount || pBytes.length;

    this.private_CheckSize(nEndPos - nStartPos);

    for (var nPos = nStartPos; nPos < nEndPos; nPos++)
        this.m_pData[this.m_nPos++] = pBytes[nPos];
};
CStreamWriter.prototype.Write_Short = function(nShort)
{
    this.private_CheckSize(2);
    this.m_pData[this.m_nPos++] = nShort & 0xFF;
    this.m_pData[this.m_nPos++] = (nShort >> 8) & 0xFF;
};
CStreamWriter.prototype.Write_Long = function(nInt32)
{
    this.private_CheckSize(4);
    this.m_pData[this.m_nPos++] = nInt32 & 0xFF;
    this.m_pData[this.m_nPos++] = (nInt32 >> 8) & 0xFF;
    this.m_pData[this.m_nPos++] = (nInt32 >> 16) & 0xFF;
    this.m_pData[this.m_nPos++] = (nInt32 >> 24) & 0xFF;
};

function CStreamReader(data, size)
{
    this.m_pData = data;
    this.m_nSize = size;
    this.m_nPos  = 0;
}
CStreamReader.prototype.Is_EOF = function()
{
    if (this.m_nPos < this.m_nSize)
        return false;

    return true;
};
CStreamReader.prototype.Get_Byte = function()
{
    if (this.m_nPos >= this.m_nSize)
        return 0;
    return this.m_pData[this.m_nPos++];
};
CStreamReader.prototype.Get_Short = function()
{
    if (this.m_nPos + 1 >= this.m_nSize)
        return 0;
    return (this.m_pData[this.m_nPos++] | this.m_pData[this.m_nPos++] << 8);
};
CStreamReader.prototype.Get_Long = function()
{
    if (this.m_nPos + 3 >= this.m_nSize)
        return 0;
    return (this.m_pData[this.m_nPos++] | this.m_pData[this.m_nPos++] << 8 | this.m_pData[this.m_nPos++] << 16 | this.m_pData[this.m_nPos++] << 24);
};
CStreamReader.prototype.Get_String = function(nLen)
{
    if (this.m_nPos + nLen > this.m_nSize)
        return "";

    var sStr = [];
    for (var nIndex = 0; nIndex < nLen; nIndex++)
        sStr.push(String.fromCharCode(this.m_pData[this.m_nPos + nIndex]));

    this.m_nPos += nLen;
    return sStr.join("");
};
CStreamReader.prototype.Get_String2 = function()
{
    var nLen = this.Get_Long();
    return this.Get_String(nLen);
};
