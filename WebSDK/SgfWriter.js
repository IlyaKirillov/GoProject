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
CSgfWriter.prototype.private_WriteMovePos = function(PosValue)
{
    if (0 != PosValue)
        this.private_WritePos(PosValue);
    else
    {
        // Пасс пишем как []
        this.private_WriteString(String.fromCharCode(91, 93));
    }
};
CSgfWriter.prototype.private_NumberToCharCode = function(Value)
{
    if (Value <= 26)
        return g_nSgfReaderCharCodeOffsetLo + Value;
    else
        return g_nSgfReaderCharCodeOffsetHi + Value - 26;
};
CSgfWriter.prototype.private_WritePos = function(PosValue)
{
    var oPos = Common_ValuetoXY(PosValue);
    this.private_WriteString(String.fromCharCode(91, this.private_NumberToCharCode(oPos.X), this.private_NumberToCharCode(oPos.Y), 93));
};
CSgfWriter.prototype.private_WritePos2 = function(PosValue)
{
    var oPos = Common_ValuetoXY(PosValue);
    this.private_WriteString(String.fromCharCode(this.private_NumberToCharCode(oPos.X), this.private_NumberToCharCode(oPos.Y)));
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
    var oBoardSize = oGameTree.Get_Board().Get_Size();

    this.private_WriteCommand("GM", 1);
    this.private_WriteCommand("FF", 4);
    this.private_WriteCommand("CA", "UTF-8");
    this.private_WriteCommand("AP", "WebGoBoard:" + GoBoardApi.Get_Version());
    this.private_WriteCommand("ST", oGameTree.Get_ShowVariants());

    this.private_WriteNonEmptyCommand("RU", oGameTree.Get_Rules());

    this.private_WriteCommand("SZ", oBoardSize.X == oBoardSize.Y ? oBoardSize.X : oBoardSize.X + ":" + oBoardSize.Y);
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

    // AB, AW, AE
    this.private_WriteAddOrRemoveStones(oNode);

    // LB, CR, MA, SQ, TR, RM
    this.private_WriteMarks(oNode);

    for (var nIndex = 0, nCount = oNode.Get_CommandsCount(); nIndex < nCount; nIndex++)
    {
        var oCommand = oNode.Get_Command(nIndex);
        var nCommandType  = oCommand.Get_Type();
        var oCommandValue = oCommand.Get_Value();

        switch (nCommandType)
        {
            case ECommand.AB: break;
            case ECommand.AW: break;
            case ECommand.AE: break;
            case ECommand.B:  this.private_WriteCommandName("B");  this.private_WriteMovePos(oCommandValue); break;
            case ECommand.W:  this.private_WriteCommandName("W");  this.private_WriteMovePos(oCommandValue); break;
            case ECommand.BL: this.private_WriteCommandName("BL"); this.private_WriteReal(oCommandValue); break;
            case ECommand.WL: this.private_WriteCommandName("WL"); this.private_WriteReal(oCommandValue); break;
            case ECommand.RM: break;
            case ECommand.CR: break;
            case ECommand.MA: break;
            case ECommand.SQ: break;
            case ECommand.TR: break;
            case ECommand.LB: break;
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
CSgfWriter.prototype.private_WriteAddOrRemoveStones = function(oNode)
{
    var AB = [], AW = [], AE = [];

    for (var nIndex = 0, nCount = oNode.Get_CommandsCount(); nIndex < nCount; nIndex++)
    {
        var oCommand = oNode.Get_Command(nIndex);
        var nCommandType  = oCommand.Get_Type();
        var oCommandValue = oCommand.Get_Value();

        switch (nCommandType)
        {
            case ECommand.AB:
            case ECommand.AW:
            case ECommand.AE:
            {
                for (var nPos = 0, nPointsCount = oCommandValue.length; nPos < nPointsCount; nPos++)
                {
                    var nPosValue = oCommandValue[nPos];
                    for (var nTempPos = 0, nTempCount = AB.length; nTempPos < nTempCount; nTempPos++)
                    {
                        if (nPosValue === AB[nTempPos])
                        {
                            AB.splice(nTempPos, 1);
                            nTempCount--;
                            nTempPos--;
                        }
                    }

                    for (var nTempPos = 0, nTempCount = AW.length; nTempPos < nTempCount; nTempPos++)
                    {
                        if (nPosValue === AW[nTempPos])
                        {
                            AW.splice(nTempPos, 1);
                            nTempCount--;
                            nTempPos--;
                        }
                    }

                    for (var nTempPos = 0, nTempCount = AE.length; nTempPos < nTempCount; nTempPos++)
                    {
                        if (nPosValue === AE[nTempPos])
                        {
                            AE.splice(nTempPos, 1);
                            nTempCount--;
                            nTempPos--;
                        }
                    }

                    if (ECommand.AB === nCommandType)
                        AB.push(nPosValue);
                    else if (ECommand.AW === nCommandType)
                        AW.push(nPosValue);
                    else if (ECommand.AE === nCommandType)
                        AE.push(nPosValue);
                }

                break;
            }
        }
    }

    if (AB.length > 0)
    {
        this.private_WriteCommandName("AB");
        this.private_WritePosArray(AB);
    }

    if (AW.length > 0)
    {
        this.private_WriteCommandName("AW");
        this.private_WritePosArray(AW);
    }

    if (AE.length > 0)
    {
        this.private_WriteCommandName("AE");
        this.private_WritePosArray(AE);
    }
};
CSgfWriter.prototype.private_WriteMarks = function(oNode)
{
    var Marks = [[], [], [], [], [], []]; // LB, CR, MA, SQ, TR, RM
    var LBvalues = [];
    for (var nIndex = 0, nCount = oNode.Get_CommandsCount(); nIndex < nCount; nIndex++)
    {
        var oCommand = oNode.Get_Command(nIndex);
        var nCommandType  = oCommand.Get_Type();
        var oCommandValue = oCommand.Get_Value();

        var nCurrentMarkPos = -1;
        switch (nCommandType)
        {
            case ECommand.LB: nCurrentMarkPos = 0; oCommandValue = [oCommandValue.Pos]; break;
            case ECommand.CR: nCurrentMarkPos = 1; break;
            case ECommand.MA: nCurrentMarkPos = 2; break;
            case ECommand.SQ: nCurrentMarkPos = 3; break;
            case ECommand.TR: nCurrentMarkPos = 4; break;
            case ECommand.RM: nCurrentMarkPos = 5; break;
        }


        for (var nPos = 0, nPointsCount = oCommandValue.length; nPos < nPointsCount; nPos++)
        {
            var nPosValue = oCommandValue[nPos];
            for (var nMarksIndex = 0, nMarksCount = Marks.length; nMarksIndex < nMarksCount; nMarksIndex++)
            {
                if (nMarksIndex === nCurrentMarkPos)
                {
                    Marks[nMarksIndex].push(nPosValue);
                    if (0 == nMarksIndex)
                        LBvalues.push(oCommand.Get_Value().Text);
                }
                else
                {
                    for (var nTempPos = 0, nTempCount = Marks[nMarksIndex].length; nTempPos < nTempCount; nTempPos++)
                    {
                        if (nPosValue === Marks[nMarksIndex][nTempPos])
                        {
                            Marks[nMarksIndex].splice(nTempPos, 1);
                            if (0 === nMarksIndex)
                                LBvalues.splice(nTempPos, 1);

                            nTempCount--;
                            nTempPos--;
                        }
                    }
                }
            }
        }
    }

    if (Marks[0].length > 0)
    {
        this.private_WriteCommandName("LB");
        for (var nPos = 0, nCount = Marks[0].length; nPos < nCount; nPos++)
        {
            this.private_WriteString("["); this.private_WritePos2(Marks[0][nPos]); this.private_WriteString(":" + LBvalues[nPos] + "]");
        }
    }

    if (Marks[1].length > 0)
    {
        this.private_WriteCommandName("CR");
        this.private_WritePosArray(Marks[1]);
    }

    if (Marks[2].length > 0)
    {
        this.private_WriteCommandName("MA");
        this.private_WritePosArray(Marks[2]);
    }

    if (Marks[3].length > 0)
    {
        this.private_WriteCommandName("SQ");
        this.private_WritePosArray(Marks[3]);
    }

    if (Marks[4].length > 0)
    {
        this.private_WriteCommandName("TR");
        this.private_WritePosArray(Marks[4]);
    }
};