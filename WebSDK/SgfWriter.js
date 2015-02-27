"use strict";

/**
 * Copyright 2015 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     22.01.15
 * Time     23:58
 */

function CSgfWriter()
{
    this.m_sFile       = null;
    this.m_oGameTree   = null;
    this.m_oColorTable = null;
}
CSgfWriter.prototype.Write = function(oGameTree)
{
    this.m_oGameTree   = oGameTree;
    this.m_sFile       = "";
    this.m_oColorTable = null;

    this.private_Write(oGameTree.Get_FirstNode());
};
CSgfWriter.prototype.private_WriteString = function(sString)
{
    this.m_sFile += sString;
};
CSgfWriter.prototype.private_WriteCommandName = function(sName)
{
    this.private_WriteString(sName);
};
CSgfWriter.prototype.private_WritePos = function(PosValue)
{
    var oPos = Common_ValuetoXY(PosValue);
    this.private_WriteString(String.fromCharCode(91, oPos.X + g_nSgfReaderCharCodeOffset, oPos.Y + g_nSgfReaderCharCodeOffset, 93));
};
CSgfWriter.prototype.private_WritePos2 = function(PosValue)
{
    var oPos = Common_ValuetoXY(PosValue);
    this.private_WriteString(String.fromCharCode(oPos.X + g_nSgfReaderCharCodeOffset, oPos.Y + g_nSgfReaderCharCodeOffset));
};
CSgfWriter.prototype.private_WritePosArray = function(arrPos)
{
    for (var nPos = 0, nCount = arrPos.length; nPos < nCount; nPos++)
    {
        this.private_WritePos(arrPos[nPos]);
    }
};
CSgfWriter.prototype.private_WriteReal = function(nValue)
{
    this.private_WriteString("[" + nValue + "]");
};
CSgfWriter.prototype.private_WriteSimpleText = function(sText)
{
    this.private_WriteString("[" + sText + "]");
};
CSgfWriter.prototype.private_WriteCommand = function(sName, sParam)
{
    this.private_WriteCommandName(sName);
    this.private_WriteSimpleText(sParam);
};
CSgfWriter.prototype.private_WriteNonEmptyCommand = function(sName, sParam)
{
    if (sParam && "" !== sParam)
        this.private_WriteCommand(sName, sParam);
};
CSgfWriter.prototype.private_WriteGameInfo = function()
{
    var oGameTree = this.m_oGameTree;

    this.private_WriteCommand("GM", 1);
    this.private_WriteCommand("FF", 4);
    this.private_WriteCommand("CA", "UTF-8");
    this.private_WriteCommand("AP", "goban.org");
    this.private_WriteCommand("ST", oGameTree.Get_ShowVariants());

    this.private_WriteNonEmptyCommand("RU", oGameTree.Get_Rules());
    this.private_WriteCommand("SZ", oGameTree.Get_Board().Get_Size().X);
    this.private_WriteCommand("KM", oGameTree.Get_Komi());
    this.private_WriteCommand("HA", oGameTree.Get_Handicap());
    this.private_WriteNonEmptyCommand("TM", oGameTree.Get_TimeLimit());
    this.private_WriteNonEmptyCommand("OT", oGameTree.Get_OverTime());
    this.private_WriteNonEmptyCommand("RE", oGameTree.Get_Result());

    this.private_WriteNonEmptyCommand("GN", oGameTree.Get_GameName());
    this.private_WriteNonEmptyCommand("DT", oGameTree.Get_DateTime());
    this.private_WriteNonEmptyCommand("CP", oGameTree.Get_Copyright());
    this.private_WriteNonEmptyCommand("GC", oGameTree.Get_GameInfo());

    this.private_WriteNonEmptyCommand("PB", oGameTree.Get_BlackName());
    this.private_WriteNonEmptyCommand("BR", oGameTree.Get_BlackRating());
    this.private_WriteNonEmptyCommand("BT", oGameTree.Get_BlackTeam());
    this.private_WriteNonEmptyCommand("PW", oGameTree.Get_WhiteName());
    this.private_WriteNonEmptyCommand("WR", oGameTree.Get_WhiteRating());
    this.private_WriteNonEmptyCommand("WT", oGameTree.Get_WhiteTeam());

    this.private_WriteNonEmptyCommand("EV", oGameTree.Get_GameEvent());
    this.private_WriteNonEmptyCommand("RO", oGameTree.Get_GameRound());
    this.private_WriteNonEmptyCommand("PC", oGameTree.Get_GamePlace());
    this.private_WriteNonEmptyCommand("AN", oGameTree.Get_GameAnnotator());
    this.private_WriteNonEmptyCommand("ON", oGameTree.Get_GameFuseki());
    this.private_WriteNonEmptyCommand("SO", oGameTree.Get_GameSource());
    this.private_WriteNonEmptyCommand("US", oGameTree.Get_GameTranscriber());

    // Пробегаемся по всем нодам, чтобы составить таблицу цветов
    var oColorTable = {};
    this.m_oGameTree.Get_FirstNode().Get_ColorTable(oColorTable);

    // цвет с 0 индеском всегда 0x00000000 (прозрачный)
    var nColorTableLen = 1, aColorTable = [];
    for (var nColor in oColorTable)
    {
        oColorTable[nColor] = nColorTableLen;
        aColorTable[nColorTableLen++] = nColor | 0;
    }

    if (nColorTableLen > 1)
    {
        oColorTable[0] = 0;
        aColorTable[0] = 0;

        this.m_oColorTable = oColorTable;
        this.private_WriteColorTable(aColorTable);
    }
};
CSgfWriter.prototype.private_WriteNode = function(oNode)
{
    this.private_WriteString(";");

    if (oNode === this.m_oGameTree.Get_FirstNode())
        this.private_WriteGameInfo();

    for (var nIndex = 0, nCount = oNode.Get_CommandsCount(); nIndex < nCount; nIndex++)
    {
        var oCommand = oNode.Get_Command(nIndex);
        var nCommandType  = oCommand.Get_Type();
        var oCommandValue = oCommand.Get_Value();

        switch (nCommandType)
        {
            case ECommand.AB: this.private_WriteCommandName("AB"); this.private_WritePosArray(oCommandValue); break;
            case ECommand.AW: this.private_WriteCommandName("AW"); this.private_WritePosArray(oCommandValue); break;
            case ECommand.AE: this.private_WriteCommandName("AE"); this.private_WritePosArray(oCommandValue); break;
            case ECommand.B:  this.private_WriteCommandName("B");  this.private_WritePos(oCommandValue); break;
            case ECommand.W:  this.private_WriteCommandName("W");  this.private_WritePos(oCommandValue); break;
            case ECommand.BL: this.private_WriteCommandName("BL"); this.private_WriteReal(oCommandValue); break;
            case ECommand.WL: this.private_WriteCommandName("WL"); this.private_WriteReal(oCommandValue); break;
            case ECommand.RM: this.private_WriteCommandName("RM"); this.private_WritePosArray(oCommandValue); break;
            case ECommand.CR: this.private_WriteCommandName("CR"); this.private_WritePosArray(oCommandValue); break;
            case ECommand.MA: this.private_WriteCommandName("MA"); this.private_WritePosArray(oCommandValue); break;
            case ECommand.SQ: this.private_WriteCommandName("SQ"); this.private_WritePosArray(oCommandValue); break;
            case ECommand.TR: this.private_WriteCommandName("TR"); this.private_WritePosArray(oCommandValue); break;
            case ECommand.LB: this.private_WriteCommandName("LB"); this.private_WriteString("["); this.private_WritePos2(oCommandValue.Pos); this.private_WriteString(":" + oCommandValue.Text + "]"); break;
            case ECommand.PL: this.private_WriteCommandName("PL"); this.private_WriteSimpleText(oCommandValue === BOARD_WHITE ? "W" : "B"); break;
        }
    }

    var sComment = oNode.Get_Comment();
    if ("" !== sComment)
    {
        sComment = sComment.replace(new RegExp("]", "g"), "\\]");

        this.private_WriteCommandName("C");
        this.private_WriteString("[");
        this.private_WriteString(sComment);
        this.private_WriteString("]");
    }

    if (null !== this.m_oColorTable)
    {
        this.private_WriteNodeColorMap(oNode);
    }
};
CSgfWriter.prototype.private_Write = function(oNode)
{
    var oPrevNode = oNode.Get_Prev();
    var bVariant = false;
    if (null === oPrevNode || oPrevNode.Get_NextsCount() > 1)
        bVariant = true;

    if (bVariant)
        this.private_WriteString("(");

    this.private_WriteNode(oNode);
    for (var nIndex = 0, nCount = oNode.Get_NextsCount(); nIndex < nCount; nIndex++)
    {
        this.private_Write(oNode.Get_Next(nIndex));
    }

    if (bVariant)
        this.private_WriteString(")");
};
CSgfWriter.prototype.private_WriteColorTable = function(aColorTable)
{
    var oStream = new CStreamWriter();
    oStream.Write_String("SGFCT");           // SGF color table (сигнатура)
    oStream.Write_Short(1);                  // Версия
    oStream.Write_Long(aColorTable.length); // Количество цветов в таблице

    for (var nColorIndex = 0, nColorsCount = aColorTable.length; nColorIndex < nColorsCount; nColorIndex++)
    {
        oStream.Write_Long(aColorTable[nColorIndex]);
    }

    var sOutput = Common.Encode_Base64(oStream.Get_Bytes());
    this.private_WriteCommand("CT", sOutput);
};
CSgfWriter.prototype.private_WriteNodeColorMap = function(oNode)
{
    // TODO: Тут пока рассчет на то что в таблице цветов не более 255

    var oStream = new CStreamWriter();
    oStream.Write_String("SGFCM");   // SGF color map (сигнатура)
    oStream.Write_Short(1);          // версия

    var oSize = this.m_oGameTree.Get_Board().Get_Size();
    var nW = oSize.X, nH = oSize.Y;

    oStream.Write_Short(nW);
    oStream.Write_Short(nH);

    // Проверяем есть ли в данной ноде хоть какие-либо цвета
    var bColorMap = false;
    for (var nY = 0; nY < nH; nY++)
    {
        for (var nX = 0; nX < nW; nX++)
        {
            var oColor = oNode.m_oColorMap[Common_XYtoValue(nX + 1, nY + 1)];
            if (!oColor)
                oStream.Write_Byte(0);
            else
            {
                var nColor = oColor.ToLong();
                if (undefined !== this.m_oColorTable[nColor])
                {
                    oStream.Write_Byte(this.m_oColorTable[nColor]);
                    bColorMap = true;
                }
                else
                    oStream.Write_Byte(0);
            }
        }
    }

    if (true === bColorMap)
    {
        var sOutput = Common.Encode_Base64(oStream.Get_Bytes());
        this.private_WriteCommand("CM", sOutput);
    }
};