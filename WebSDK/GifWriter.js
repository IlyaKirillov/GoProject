"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     24.01.15
 * Time     14:47
 */

function CGifWriter()
{
    this.m_pStream        = null;
    this.m_bFirstFrame    = true;
    this.m_pPixels        = null;
    this.m_pColorTable    = null;
    this.m_oColorMap      = {};
    this.m_nTranspIndex   = 0;        // В таблице он идет всегда первым
    this.m_sComment       = String.fromCharCode(71, 101, 110, 101, 114, 97, 116, 101, 100, 32, 98, 121, 32, 103, 111, 98, 97, 110, 46, 111, 114, 103);
    this.m_nDelay         = 0;
    this.m_pIndexedPixels = null;
    this.m_nW             = 0;
    this.m_nH             = 0;
    this.m_nRepeat        = 0;        // количество повторений (0 - бесконечно)
    this.m_nFrameIndex    = 0;
};

CGifWriter.prototype.Add_ContextFrame = function(oContext, X, Y, W, H, FrameAreas)
{
    if (this.m_bFirstFrame)
    {
        this.m_nW = oContext.canvas.width;
        this.m_nH = oContext.canvas.height;
    }

    this.m_pPixels = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height).data;

    this.private_IndexPixels(X, Y, W, H, FrameAreas);

    if (this.m_bFirstFrame)
    {
        this.private_WriteLogicalScreenDescriptor();
        this.private_WriteColorTable();
        this.private_WriteAppExt();
        this.private_WriteCommentExt();
    }

    this.private_WriteGraphicControlExt();
    this.private_WriteImageDescriptor(X, Y, W, H);
    this.private_WriteFrame();

    this.m_bFirstFrame = false;
    console.log("Frame " + this.m_nFrameIndex);
    this.m_nFrameIndex++;
};
CGifWriter.prototype.Set_Delay = function(nDelay)
{
    this.m_nDelay = Math.floor(nDelay / 10);
};
CGifWriter.prototype.Start = function()
{
    this.m_pStream = new CStreamWriter();
    this.m_pStream.Write_String("GIF89a");
};
CGifWriter.prototype.Finish = function()
{
    this.m_pStream.Write_Byte(0x3b);
};
CGifWriter.prototype.Get_Stream = function()
{
    return this.m_pStream;
};
CGifWriter.prototype.private_IndexPixels = function(X, Y, W, H, Areas)
{
    if (this.m_bFirstFrame)
    {
        // TrueColor
        var sTestString = "ff0000e0b65ce0b65ce0b65ce0b65ce0b75ce0b75ce1b75ce0b75ce0b75de1b75de1b75de1b85de2b85de2b85de2b85de2b85de3b85de3b85de3b95de3b95de3b95de3b95ee3b95ee3b95ee4b95ee4ba5ee4ba5ee4ba5ee4ba5ee5ba5ee5ba5ee5ba5ee5ba5ee5bb5ee5bb5ee5ba5ee5bb5ee5bb5ee5ba5ee5ba5fe1bc6dddbc75e1bb6ae4bb64e5bb5fe6bb5fe6bb5fe6bb5ee6bb5ee6bb5fe6bb5edeb65cdeb55cdfb55cdeb55cdeb55bdeb45bddb45bddb45bddb45bddb35bddb35bdcb35bdcb35bdbb35ddcb35adcb35adbb35adbb25adbb25adab25adab25adab15ad9b15ad9b15adab159d9b159d9b159d9b059d9b059d8b059d8b059d8af58d8b059d7b059d7af59d7af58d7af58d7ae58d6af58d6ae58d6ae58d5ae58d5ae58d5ae58d4ae5ad4ad58d5ad57d5ad57d4ad57d4ad57d4ac57d3ac57d4ac57d4ac57d3ac57d3ac57d3ac57d2ac57d2ac57d3ab56d2ab56d2ab56d2ab56d2ab56d2aa56d1aa56d1aa56d1aa56d1aa55d0aa55cfa956d0a955cfa855cfa855cba554c9a65bbea87ac5b38cd5c197cdc4b0e2d0aaead6abeed9adf1dcaef3ddaff3ddaffaf0dbfefefefdfdfdfafafaf8f8f8f5f5f5f1f1f1eeeeeeebebebe8e8e8e4e4e4e1e1e1dedededadadad6d6d6d3d3d3d0d0d0d0d0d0cfcfcfcecececececdcdcdcdcdcdcccfccc5cccbcbcacacacacac9c8c8c8cac8c3c7c7c7c6c6c5c4c4c4c3c3c2c2c1c1c0c0c0bfbebebdbdbdbbbbbab3b3b2bcb6a9b4ad9da7a49d9c9c9c9494948e8e8e8888888282827c7c7c7474746e6e6e6767677b756aa39370b99a59c29e50c09c4ebc994db9964bb6944ab29149af8e48ac8b47a88945a68744a28443a082429d7f40997c3f967a3d91753b876e387a6434735d2f6f5b2e6b572c64522a6359435e5e5e5757575050504a4a4a404040363636413c31524324423821352d1a2c2c2c2725212222221f1d191c171016161413131212121112111111111111111011101010101010100f0f0f0f0f0f0f0f0e0e0e0e0d0d0d0d0d0d0d0c0c0b0b0b0a0909090d0a07640909ef02023e0000000000000000000000000000";

        // BlackWhite
        //var sTestString = "ff0000000000ffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"

        this.private_LoadColorTableFromString(sTestString);
    }

    this.m_pIndexedPixels = [];
    var oMap = this.m_oColorMap;
    var pPixels = this.m_pPixels;

    for (var nY = Y; nY < Y + H; nY++)
    {
        for (var nX = X; nX < X + W; nX++)
        {
            var nDstIndex = (nX - X) + (nY - Y) * W;

            if (true === this.private_IsPointInFrameAreas(nX, nY, Areas))
            {
                var nSrcIndex = (nX + nY * this.m_nW) * 4;

                var r = pPixels[nSrcIndex + 0] & 0xff;
                var g = pPixels[nSrcIndex + 1] & 0xff;
                var b = pPixels[nSrcIndex + 2] & 0xff;

                var nColorValue = r << 16 | g << 8 | b;
                if (undefined === oMap[nColorValue])
                    oMap[nColorValue] = this.private_FindBestColorIndex(r, g, b);

                this.m_pIndexedPixels[nDstIndex] = oMap[nColorValue];
            }
            else
                this.m_pIndexedPixels[nDstIndex] = this.m_nTranspIndex;
        }
    }
};
CGifWriter.prototype.private_IsPointInFrameAreas = function(X, Y, Areas)
{
    for (var nIndex = 0, nCount = Areas.length; nIndex < nCount; nIndex++)
    {
        var oArea = Areas[nIndex];

        if (X >= oArea.X0 && X <= oArea.X1 && Y >= oArea.Y0 && Y <= oArea.Y1)
            return true;
    }

    return false;
};
CGifWriter.prototype.private_FindBestColorIndex = function(r, g, b)
{
    var pColorTable = this.m_pColorTable;
    var nMinIndex = 0;
    var nDiffMin = 16777216; // 256 * 256 * 256

    // Прозрачный цвет не учитываем
    for (var nIndex = 1; nIndex < 256; nIndex++)
    {
        var nOffsetIndex = nIndex * 3;
        var nDiffR = r - (pColorTable[nOffsetIndex + 0] & 0xff);
        var nDiffG = g - (pColorTable[nOffsetIndex + 1] & 0xff);
        var nDiffB = b - (pColorTable[nOffsetIndex + 2] & 0xff);

        var nDiff = nDiffR * nDiffR + nDiffG * nDiffG + nDiffB * nDiffB;
        if (nDiff < nDiffMin)
        {
            nDiffMin  = nDiff;
            nMinIndex = nIndex;
        }
    }

    return nMinIndex;
};
CGifWriter.prototype.private_WriteLogicalScreenDescriptor = function()
{
    this.m_pStream.Write_Short(this.m_nW);
    this.m_pStream.Write_Short(this.m_nH);
    this.m_pStream.Write_Byte(247);
    this.m_pStream.Write_Byte(0);
    this.m_pStream.Write_Byte(0);
};
CGifWriter.prototype.private_WriteColorTable = function()
{
    this.m_pStream.Write_Bytes(this.m_pColorTable);
    var nLeftBytes = (3 * 256) - this.m_pColorTable.length;
    for (var nPos = 0; nPos < nLeftBytes; nPos++)
        this.m_pStream.Write_Byte(0);
};
CGifWriter.prototype.private_WriteAppExt = function()
{
    this.m_pStream.Write_Byte(0x21);
    this.m_pStream.Write_Byte(0xff);
    this.m_pStream.Write_Byte(11);
    this.m_pStream.Write_String("NETSCAPE" + "2.0");

    // Sub-block
    this.m_pStream.Write_Byte(3);
    this.m_pStream.Write_Byte(1);
    this.m_pStream.Write_Short(this.m_nRepeat);
    this.m_pStream.Write_Byte(0);
};
CGifWriter.prototype.private_WriteGraphicControlExt = function()
{
    this.m_pStream.Write_Byte(0x21);
    this.m_pStream.Write_Byte(0xf9);
    this.m_pStream.Write_Byte(4);
    this.m_pStream.Write_Byte(5);                   // Dispose = 1, Transparency = 1 (не очищаем предыдущий слайд, используем прозрачность)
    this.m_pStream.Write_Short(this.m_nDelay);      // Delay
    this.m_pStream.Write_Byte(this.m_nTranspIndex); // Индекс прозрачного цвета
    this.m_pStream.Write_Byte(0);
};
CGifWriter.prototype.private_WriteCommentExt = function()
{
    this.m_pStream.Write_Byte(0x21);
    this.m_pStream.Write_Byte(0xfe);
    this.m_pStream.Write_Byte(this.m_sComment.length);
    this.m_pStream.Write_String(this.m_sComment);
    this.m_pStream.Write_Byte(0);
};
CGifWriter.prototype.private_WriteImageDescriptor = function(X, Y, W, H)
{
    this.m_pStream.Write_Byte(0x2c);
    this.m_pStream.Write_Short(undefined !== X ? X : 0);         // Left
    this.m_pStream.Write_Short(undefined !== Y ? Y : 0);         // Top
    this.m_pStream.Write_Short(undefined !== W ? W : this.m_nW); // Width
    this.m_pStream.Write_Short(undefined !== H ? H : this.m_nH); // Height
    this.m_pStream.Write_Byte(0);                                // Flags (у нас всегда только 1 глобальная таблица)
};
CGifWriter.prototype.private_WriteFrame = function()
{
    var oFrameEncoder = new CLZWEncoder(this.m_nW, this.m_nH, this.m_pIndexedPixels, 8);
    oFrameEncoder.Encode(this.m_pStream);
};
CGifWriter.prototype.private_LoadColorTableFromString = function(sString)
{
    var nLen = 256 * 2 * 3;

    if (nLen !== sString.length)
        return;

    var nTableLen = 256 * 3;
    this.m_pColorTable = new Array(nTableLen);
    for (var nTableIndex = 0, nStringIndex = 0; nTableIndex < nTableLen; nTableIndex += 3, nStringIndex += 6)
    {
        this.m_pColorTable[nTableIndex + 0] = parseInt(sString[nStringIndex + 0] + sString[nStringIndex + 1], 16);
        this.m_pColorTable[nTableIndex + 1] = parseInt(sString[nStringIndex + 2] + sString[nStringIndex + 3], 16);
        this.m_pColorTable[nTableIndex + 2] = parseInt(sString[nStringIndex + 4] + sString[nStringIndex + 5], 16);
    }
};

var LZW_EOF      = -1;
var LZW_HASHSIZE = 5003;
var LZW_BITS     = 12;
var LZW_MAXBITS  = LZW_BITS;
var LZW_MAXCODE  = 1 << LZW_BITS;

function CLZWEncoder(nW, nH, pData, nColorDepth)
{
    this.m_nW            = nW;
    this.m_nH            = nH;
    this.m_pData         = pData;
    this.m_nInitCodeSize = Math.max(2, nColorDepth);

    this.m_nRemaining    = 0;
    this.m_nCurPixel     = 0;
    this.m_aHashTable    = [];

    this.m_nInitBits     = 0;
    this.m_bClear        = false;
    this.m_nBits         = 0;
    this.m_nMaxCode      = 0;
    this.m_nEofCode      = 0;
    this.m_nFreeEntry    = 0;

    this.m_nCurAccum     = 0;
    this.m_nCurBits      = 0;
    this.m_aMasks        = [0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F, 0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF, 0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF];
    this.m_nCount        = 0;
    this.m_aAccum        = [];

}
CLZWEncoder.prototype.Encode = function(pStream)
{
    pStream.Write_Byte(this.m_nInitCodeSize);
    this.m_nRemaining = this.m_nW * this.m_nH;
    this.m_nCurPixel  = 0;
    this.private_Compress(this.m_nInitCodeSize + 1, pStream);
    pStream.Write_Byte(0);
};
CLZWEncoder.prototype.private_Compress = function(nInitBits, pStream)
{
    this.m_nInitBits  = nInitBits;
    this.m_bClear     = false;
    this.m_nBits      = nInitBits;
    this.m_nMaxCode   = this.private_MaxCode(this.m_nBits);

    var nClearCode = 1 << (nInitBits - 1);
    this.m_nEofCode   = nClearCode + 1;
    this.m_nFreeEntry = nClearCode + 2;

    this.m_nCount = 0;
    var nEntry = this.private_GetNextPixel();

    var nHashShift = 0;
    var nFCode;
    for (nFCode = LZW_HASHSIZE; nFCode < 65536; nFCode *= 2)
        ++nHashShift;

    nHashShift = 8 - nHashShift;

    var nHashSizeReg = LZW_HASHSIZE;
    this.private_ClearHash(nHashSizeReg);

    this.private_Output(nClearCode, pStream);

    var nChar;
    var aCodeTable = [];

    while (LZW_EOF !== (nChar = this.private_GetNextPixel()))
    {
        nFCode = (nChar << LZW_MAXBITS) + nEntry;
        var nHashIndex = (nChar << nHashShift) ^ nEntry;

        if (nFCode === this.m_aHashTable[nHashIndex])
        {
            nEntry = aCodeTable[nHashIndex];
            continue;
        }
        else if (this.m_aHashTable[nHashIndex] >= 0)
        {
            var nDisp = nHashSizeReg - nHashIndex;

            var bContinue = false;
            if (0 === nHashIndex)
                nDisp = 1;
            do
            {
                if ((nHashIndex -= nDisp) < 0)
                    nHashIndex += nHashSizeReg;

                if (nFCode === this.m_aHashTable[nHashIndex])
                {
                    nEntry = aCodeTable[nHashIndex];
                    bContinue = true;
                    break;
                }
            } while (this.m_aHashTable[nHashIndex] >= 0);

            if (bContinue)
                continue;
        }

        this.private_Output(nEntry, pStream);
        nEntry = nChar;

        if (this.m_nFreeEntry < LZW_MAXCODE)
        {
            aCodeTable[nHashIndex] = this.m_nFreeEntry++;
            this.m_aHashTable[nHashIndex] = nFCode;
        }
        else
        {
            this.private_ClearHash(LZW_HASHSIZE);
            this.m_nFreeEntry = nClearCode + 2;
            this.m_bClear     = true;
            this.private_Output(nClearCode, pStream);
        }
    }

    this.private_Output(nEntry, pStream);
    this.private_Output(this.m_nEofCode, pStream);
};
CLZWEncoder.prototype.private_MaxCode = function(nBits)
{
    return (1 << nBits) - 1;
};
CLZWEncoder.prototype.private_GetNextPixel = function()
{
    if (0 === this.m_nRemaining)
        return LZW_EOF;

    --this.m_nRemaining;
    return (this.m_pData[this.m_nCurPixel++] & 0xff);
};
CLZWEncoder.prototype.private_ClearHash = function(nHashSize)
{
    for (var nIndex = 0; nIndex < nHashSize; nIndex++)
        this.m_aHashTable[nIndex] = -1;
};
CLZWEncoder.prototype.private_Output = function(nCode, pStream)
{
    this.m_nCurAccum &= this.m_aMasks[this.m_nCurBits];

    if (this.m_nCurBits > 0)
        this.m_nCurAccum |= (nCode << this.m_nCurBits);
    else
        this.m_nCurAccum = nCode;

    this.m_nCurBits += this.m_nBits;

    while (this.m_nCurBits >= 8)
    {
        this.private_CharOut((this.m_nCurAccum & 0xff), pStream);
        this.m_nCurAccum >>= 8;
        this.m_nCurBits -= 8;
    }

    if (this.m_nFreeEntry > this.m_nMaxCode || this.m_bClear)
    {
        if (this.m_bClear)
        {
            this.m_nBits    = this.m_nInitBits;
            this.m_nMaxCode = this.private_MaxCode(this.m_nBits);
            this.m_bClear   = false;
        }
        else
        {
            this.m_nBits++;
            if (this.m_nBits == LZW_MAXBITS)
                this.m_nMaxCode = LZW_MAXCODE;
            else
                this.m_nMaxCode = this.private_MaxCode(this.m_nBits);
        }
    }

    if (nCode === this.m_nEofCode)
    {
        while (this.m_nCurBits > 0)
        {
            this.private_CharOut((this.m_nCurAccum & 0xff), pStream);
            this.m_nCurAccum >>= 8;
            this.m_nCurBits -= 8;
        }

        this.private_FlushChar(pStream);
    }
};
CLZWEncoder.prototype.private_CharOut = function(nChar, pStream)
{
    this.m_aAccum[this.m_nCount++] = nChar;
    if (this.m_nCount >= 254)
        this.private_FlushChar(pStream);
};
CLZWEncoder.prototype.private_FlushChar = function(pStream)
{
    if (this.m_nCount > 0)
    {
        pStream.Write_Byte(this.m_nCount);
        pStream.Write_Bytes(this.m_aAccum, 0, this.m_nCount);
        this.m_nCount = 0;
    }
};