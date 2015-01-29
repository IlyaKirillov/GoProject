"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     24.01.15
 * Time     20:52
 */

function CMemory()
{
    this.m_pData      = null;
    this.m_pImageData = null;
    this.m_nLength    = 0;
    this.m_nPos       = 0;

    this.Init();
};

CMemory.prototype.Init = function()
{
    var oContext = document.createElement('canvas').getContext('2d');

    this.m_nLength    = 1024 * 1024 * 5;
    this.m_pImageData = oContext.createImageData(this.m_nLength / 4, 1);
    this.m_pData      = this.m_pImageData.data;
    this.m_nPos       = 0;
};
CMemory.prototype.private_CheckSize = function(nCount)
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
CMemory.prototype.Get_Bytes = function()
{
    var oArray = new Uint8Array(this.m_nPos);
    for (var nPos = 0; nPos < this.m_nPos; nPos++)
        oArray[nPos] = this.m_pData[nPos];

    return oArray;
};
CMemory.prototype.Get_CurPosition = function()
{
    return this.m_nPos;
};
CMemory.prototype.Seek = function(nPos)
{
    this.m_nPos = nPos;
}
CMemory.prototype.Skip = function(nBytes)
{
    this.m_nPos += nBytes;
};
CMemory.prototype.Write_Byte = function(nByte)
{
    this.private_CheckSize(1);
    this.m_pData[this.m_nPos++] = nByte;
};
CMemory.prototype.Write_String = function(sString)
{
    var nLen = sString.length;
    this.private_CheckSize(nLen);
    for (var nPos = 0; nPos < nLen; nPos++)
        this.m_pData[this.m_nPos++] = sString.charCodeAt(nPos);
};
CMemory.prototype.Write_Bytes = function(pBytes, nOffset, nCount)
{
    var nStartPos = nOffset || 0;
    var nEndPos   = nCount || pBytes.length;

    this.private_CheckSize(nEndPos - nStartPos);

    for (var nPos = nStartPos; nPos < nEndPos; nPos++)
        this.m_pData[this.m_nPos++] = pBytes[nPos];
};
CMemory.prototype.Write_Short = function(nShort)
{
    this.private_CheckSize(2);
    this.m_pData[this.m_nPos++] = nShort & 0xFF;
    this.m_pData[this.m_nPos++] = (nShort >> 8) & 0xFF;
};
