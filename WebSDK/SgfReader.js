/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     24.11.14
 * Time     18:59
 */

var g_nSgfReaderCharCodeOffset = 'a'.charCodeAt(0) - 1;

function CSgfReader(oGameTree)
{
    this.m_oGameTree     = oGameTree;

    this.m_sSGF          = [];
    this.m_nPos          = 0;
    this.m_nVariantDepth = 0;
    this.m_arrVariant    = [];
    this.m_bValidNode    = true;
    this.m_nLength       = 0;
}

CSgfReader.prototype.Load = function(SGF)
{
    if (undefined !== SGF && "" !== SGF)
    {
        this.private_Init();
        this.private_Normalize(SGF);

        if (!this.private_Parse())
            alert("Error occurs, while read SGF");
    }
};
CSgfReader.prototype.private_Init = function()
{
    this.m_sSGF          = [];
    this.m_nPos          = 0;
    this.m_nVariantDepth = 0;
    this.m_arrVariant    = [];
    this.m_bValidNode    = true;
    this.m_nLength       = 0;
};
CSgfReader.prototype.private_Normalize = function(SGF)
{
    var nPos = 0;
    var nLen = SGF.length;
    var sRes = [];

    // Внутри комментариев не удаляем ничего. В остальных случаях удаляем
    // любой не ASCII символ.
    var bComment = false;
    while (nPos < nLen)
    {
        if (bComment || SGF.charCodeAt(nPos) > 32 )
        {
            sRes.push(SGF.charAt(nPos));
        }

        if (sRes.length >= 3 && '[' == sRes[sRes.length - 1])
        {
            var sCommand = sRes[sRes.length - 3] + sRes[sRes.length - 2];
            if (('C' == sRes[sRes.length - 2] && "UC" != sCommand) || "AN" == sCommand || "BR" == sCommand || "BT" == sCommand || "CP" == sCommand || "DT" == sCommand || "EV" == sCommand || "GN" == sCommand || "GC" == sCommand || "ON" == sCommand || "OT" == sCommand || "PB" == sCommand || "PC" == sCommand || "PW" == sCommand || "RE" == sCommand || "RO" == sCommand || "RU" == sCommand || "SO" == sCommand || "TM" == sCommand || "US" == sCommand || "WR" == sCommand || "WT" == sCommand)
                bComment = true;
        }
        else if (bComment && sRes.length >= 1 && ']' == sRes[sRes.length - 1])
        {
            if (sRes.length < 2 || '\\' != sRes[sRes.length - 2])
                bComment = false;
        }

        nPos++;
    }

    this.m_sSGF    = sRes;
    this.m_nLength = this.m_sSGF.length;
};
CSgfReader.prototype.private_Parse = function()
{
    this.m_oGameTree.Reset();

    // Любой sgf файл должен начинаться с комбинации "(;"
    if ('(' === this.m_sSGF[0] && ';' === this.m_sSGF[1])
    {
        this.m_nPos++;

        while (this.m_nPos < this.m_nLength && (')' !== this.m_sSGF[this.m_nPos] || 0 !== this.m_nVariantDepth))
        {
            var Char = this.m_sSGF[this.m_nPos];

            if (';' === Char)
            {
                // Первая нода создается автоматически
                if (1 != this.m_nPos)
                    this.m_oGameTree.Add_NewNode(false, false);
                else
                    this.m_oGameTree.Set_CurNode(this.m_oGameTree.Get_FirstNode());

                if (!this.private_ReadNode())
                    return false;
            }
            else if ('(' === Char)
            {
                this.m_arrVariant[this.m_nVariantDepth] = this.m_oGameTree.Get_CurNode();
                this.m_nVariantDepth++;
                this.m_nPos++;
            }
            else if (')' === Char)
            {
                this.m_nVariantDepth--;
                this.m_oGameTree.Set_CurNode(this.m_arrVariant[this.m_nVariantDepth]);
                this.m_nPos++;
            }
            else
                return false;
        }
    }
    else
        return false;

    return true;
};
CSgfReader.prototype.private_ReadNode = function()
{
    this.m_nPos++;

    var Char  = this.m_sSGF[this.m_nPos];
    var Char2 = this.m_sSGF[this.m_nPos + 1];

    while (undefined !== Char && ')' !== Char && ';' !== Char && '(' !== Char)
    {
        switch (Char)
        {
            case 'A':
            {
                switch (Char2)
                {
                    case 'B': this.private_ReadAddOrRemoveStone(BOARD_BLACK); break;
                    case 'E': this.private_ReadAddOrRemoveStone(BOARD_EMPTY); break;
                    case 'W': this.private_ReadAddOrRemoveStone(BOARD_WHITE); break;
                    case 'N': this.private_ReadAN(); break;
                    case 'P': this.private_ReadAP(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'B':
            {
                switch (Char2)
                {
                    case '[': this.private_ReadMove(BOARD_BLACK); break;
                    case 'R': this.private_ReadBR(); break;
                    case 'T': this.private_ReadBT(); break;
                    case 'L': this.private_ReadBL(); break;
                    default : this.private_ReadUnknown(); break;
                }

                break;
            }
            case 'C':
            {
                switch (Char2)
                {
                    case '[': this.private_ReadComments(); break;
                    case 'A': this.private_ReadCA(); break;
                    case 'P': this.private_ReadCP(); break;
                    case 'R': this.private_ReadMark(EDrawingMark.Cr); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'D':
            {
                switch (Char2)
                {
                    case 'D': this.private_ReadDT(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'E':
            {
                switch (Char2)
                {
                    case 'V': this.private_ReadEV(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'F':
            {
                switch (Char2)
                {
                    case 'F': this.private_ReadFF(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'G':
            {
                switch (Char2)
                {
                    case 'N': this.private_ReadGN(); break;
                    case 'C': this.private_ReadGC(); break;
                    case 'M': this.private_ReadGM(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'H':
            {
                switch (Char2)
                {
                    case 'A': this.private_ReadHA(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'K':
            {
                switch (Char2)
                {
                    case 'M': this.private_ReadKM(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'L':
            {
                switch (Char2)
                {
                    case 'B': this.private_ReadLB(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'M':
            {
                switch (Char2)
                {
                    case 'A': this.private_ReadMark(EDrawingMark.X); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'O':
            {
                switch (Char2)
                {
                    case 'N': this.private_ReadON(); break;
                    case 'T': this.private_ReadOT(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'P':
            {
                switch (Char2)
                {
                    case 'B': this.private_ReadPB(); break;
                    case 'C': this.private_ReadPC(); break;
                    case 'W': this.private_ReadPW(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'R':
            {
                switch (Char2)
                {
                    case 'E': this.private_ReadRE(); break;
                    case 'O': this.private_ReadRO(); break;
                    case 'U': this.private_ReadRU(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'S':
            {
                switch (Char2)
                {
                    case 'Q': this.private_ReadMark(EDrawingMark.Sq); break;
                    case 'T': this.private_ReadST(); break;
                    case 'Z': this.private_ReadSZ(); break;
                    case 'O': this.private_ReadSO(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'T':
            {
                switch (Char2)
                {
                    case 'R': this.private_ReadMark(EDrawingMark.Tr); break;
                    case 'M': this.private_ReadTM(); break;
                    case 'B': this.private_ReadTerritory(BOARD_BLACK); break;
                    case 'W': this.private_ReadTerritory(BOARD_WHITE); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'U':
            {
                switch (Char2)
                {
                    case 'S': this.private_ReadUS(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }
            case 'W':
            {
                switch (Char2)
                {
                    case '[': this.private_ReadMove(BOARD_WHITE); break;
                    case 'R': this.private_ReadWR(); break;
                    case 'T': this.private_ReadWT(); break;
                    case 'L': this.private_ReadWL(); break;
                    default : this.private_ReadUnknown(); break;
                }
                break;
            }

            default : this.private_ReadUnknown(); break;
        }

        if ( !this.m_bValidNode )
            return false;

        Char  = this.m_sSGF[this.m_nPos];
        Char2 = this.m_sSGF[this.m_nPos + 1];
    }

    return true;
};
CSgfReader.prototype.private_ReadSimpleText = function(EndChar)
{
    if (undefined === EndChar)
        EndChar = ']';

    var sResult = "";
    while (undefined !== this.m_sSGF[this.m_nPos] && EndChar !== this.m_sSGF[this.m_nPos])
    {
        sResult += this.m_sSGF[this.m_nPos];
        this.m_nPos++;
    }

    if (undefined === this.m_sSGF[this.m_nPos])
        this.m_bValidNode = false;

    this.m_nPos++;

    return sResult;
};
CSgfReader.prototype.private_ReadReal = function(EndChar)
{
    var Real = parseFloat(this.private_ReadSimpleText(EndChar));
    return isNaN(Real) ? 0 : Real;
};
CSgfReader.prototype.private_ReadNumber = function(EndChar)
{
    var Number = parseInt(this.private_ReadSimpleText(EndChar));
    return isNaN(Number) ? 0 : Number;
};
CSgfReader.prototype.private_ReadUnknown = function()
{
    while (true)
    {
        while(undefined !== this.m_sSGF[this.m_nPos] && ']' !== this.m_sSGF[this.m_nPos] && this.m_nPos < this.m_nLength)
        {
            this.m_nPos++;

            while (']' === this.m_sSGF[this.m_nPos] && '\\' === this.m_sSGF[this.m_nPos - 1])
                this.m_nPos++
        }

        this.m_nPos++;
        if ('[' !== this.m_sSGF[this.m_nPos])
            break;
    }
};
CSgfReader.prototype.private_ReadAddOrRemoveStone = function(Value)
{
    this.m_nPos += 3;
    var arrPos = [];

    // Проверяем пустой массив
    if (']' === this.m_sSGF[this.m_nPos])
        return;

    while (true)
    {
        var sX = this.m_sSGF[this.m_nPos]; this.m_nPos++;
        var sY = this.m_sSGF[this.m_nPos]; this.m_nPos++;

        var X = sX.charCodeAt(0) - g_nSgfReaderCharCodeOffset;
        var Y = sY.charCodeAt(0) - g_nSgfReaderCharCodeOffset;

        arrPos.push(Common_XYtoValue(X, Y));

        if (']' !== this.m_sSGF[this.m_nPos])
        {
            this.m_bValidNode = false;
            return;
        }

        this.m_nPos++;
        if ('[' !== this.m_sSGF[this.m_nPos])
        {
            break;
        }
        this.m_nPos++;
    }

    this.m_oGameTree.AddOrRemove_Stones(Value, arrPos);
};
CSgfReader.prototype.private_ReadAN = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Annotator(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadAP = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Application(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadMove = function(Value)
{
    this.m_nPos += 2;

    // [] - означает пас
    if ( ']' == this.m_sSGF[this.m_nPos] )
        this.m_oGameTree.Add_Move(0, 0, Value);
    else
    {
        var sX = this.m_sSGF[this.m_nPos]; this.m_nPos++;
        var sY = this.m_sSGF[this.m_nPos]; this.m_nPos++;

        // [tt] для досок размером меньше 19х19 тоже является пасом
        var oBoardSize = this.m_oGameTree.Get_Board().Get_Size();
        if ('t' === sX && 't' === sY && oBoardSize.X <= 19 && oBoardSize.Y <= 19)
            this.m_oGameTree.Add_Move(0, 0, Value);
        else
        {
            var X = sX.charCodeAt(0) - g_nSgfReaderCharCodeOffset;
            var Y = sY.charCodeAt(0) - g_nSgfReaderCharCodeOffset;

            this.m_oGameTree.Add_Move(X, Y, Value);

            if (']' !== this.m_sSGF[this.m_nPos])
                this.m_bValidNode = false;
        }
    }

    this.m_nPos++;
};
CSgfReader.prototype.private_ReadBR = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_BlackRating(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadBT = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_BlackTeam(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadBL = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Add_BlackTimeLeft(this.private_ReadReal());
};
CSgfReader.prototype.private_ReadComments = function()
{
    this.m_nPos += 2;

    var sComment = "";

    // TODO: Реализовать чтение кодировки
    var bUTF8 = false;
    if (!bUTF8)
    {
        while (']' !== this.m_sSGF[this.m_nPos] || '\\' === this.m_sSGF[this.m_nPos - 1])
        {
            if (']' === this.m_sSGF[this.m_nPos + 1] && '\\' === this.m_sSGF[this.m_nPos])
            {
                sComment += "]";
                this.m_nPos++;
            }
//            else if (0x000D == this.m_sSGF[this.m_nPos].charCodeAt(0))
//                sComment += "<br>\n";
//            else if (0x000A == this.m_sSGF[this.m_nPos].charCodeAt(0))
//                sComment += "<br>\n";
//            else if (0x0085 == this.m_sSGF[this.m_nPos].charCodeAt(0))
//                sComment += "<br>\n";
            else
                sComment += this.m_sSGF[this.m_nPos];
            this.m_nPos++;
        }
        this.m_nPos++;
        this.m_oGameTree.Add_Comment(sComment);
    }
    else
    {
        while (']' !== this.m_sSGF[this.m_nPos] && this.m_nPos < this.m_nLength)
        {
            sComment += this.m_sSGF[this.m_nPos];
            this.m_nPos++;
        }

        this.m_nPos++;
        this.m_oGameTree.Add_Comment(Common_UTF8_Decode(Common_EncodeString(sComment, "cp1251")));
    }
};
CSgfReader.prototype.private_ReadCA = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Charset(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadCP = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Copyright(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadMark = function(Type)
{
    var Count = 0;

    this.m_nPos += 3;
    var arrPos = [];

    // Проверяем пустой массив
    if (']' === this.m_sSGF[this.m_nPos])
        return;

    while (true)
    {
        var sX = this.m_sSGF[this.m_nPos]; this.m_nPos++;
        var sY = this.m_sSGF[this.m_nPos]; this.m_nPos++;

        var X = sX.charCodeAt(0) - g_nSgfReaderCharCodeOffset;
        var Y = sY.charCodeAt(0) - g_nSgfReaderCharCodeOffset;

        arrPos[Count] = Common_XYtoValue(X, Y);
        Count++;

        if (']' !== this.m_sSGF[this.m_nPos])
        {
            this.m_bValidNode = false;
            return;
        }

        this.m_nPos++;
        if ('[' !== this.m_sSGF[this.m_nPos])
            break;

        this.m_nPos++;
    }

    this.m_oGameTree.Add_Mark(Type, arrPos);
};
CSgfReader.prototype.private_ReadDT = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_DateTime(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadEV = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Event(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadFF = function()
{
    // TODO: реализовать
    this.private_ReadUnknown();
};
CSgfReader.prototype.private_ReadGN = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_GameName(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadGC = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_GameInfo(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadGM = function()
{
    this.m_nPos += 3;
    var Number = this.private_ReadNumber();

    // Должно быть 1
    if (1 !== Number)
        this.m_bValidNode = false;
};
CSgfReader.prototype.private_ReadHA = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Handicap(this.private_ReadNumber());
};
CSgfReader.prototype.private_ReadKM = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Komi(this.private_ReadReal());
};
CSgfReader.prototype.private_ReadLB = function()
{
    this.m_nPos += 3;

    while (true)
    {
        var sX = this.m_sSGF[this.m_nPos]; this.m_nPos++;
        var sY = this.m_sSGF[this.m_nPos]; this.m_nPos++;
        var X = sX.charCodeAt(0) - g_nSgfReaderCharCodeOffset;
        var Y = sY.charCodeAt(0) - g_nSgfReaderCharCodeOffset;

        this.m_nPos++;

        var sText = "";
        while(']' !== this.m_sSGF[this.m_nPos] && this.m_nPos < this.m_nLength)
        {
            sText += this.m_sSGF[this.m_nPos];
            this.m_nPos++;
        }

        this.m_oGameTree.Add_TextMark(sText, Common_XYtoValue(X, Y));

        if (']' !== this.m_sSGF[this.m_nPos])
        {
            this.m_bValidNode = false;
            return;
        }

        this.m_nPos++;
        if ('[' !== this.m_sSGF[this.m_nPos])
            break;

        this.m_nPos++;
    }
};
CSgfReader.prototype.private_ReadON = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_GameFuseki(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadOT = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_OverTime(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadPB = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Black(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadPC = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Place(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadPW = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_White(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadRE = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Result(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadRO = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Round(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadRU = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Rules(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadST = function()
{
    this.m_nPos += 3;
    var Number = this.private_ReadNumber();

    switch(Number)
    {
        case 0:  this.m_oGameTree.Set_ShowVariants(EShowVariants.Next); break;
        case 1:  this.m_oGameTree.Set_ShowVariants(EShowVariants.Curr); break;
        default: this.m_oGameTree.Set_ShowVariants(EShowVariants.None); break;
    }
};
CSgfReader.prototype.private_ReadSZ = function()
{
    this.m_nPos += 3;
    var nSize = this.private_ReadNumber();
    if (nSize <= 0)
        nSize = 19;

    this.m_oGameTree.Set_BoardSize(nSize, nSize);
};
CSgfReader.prototype.private_ReadSO = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_GameSource(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadTM = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_TimeLimit(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadTerritory = function(Value)
{
    var Count = 0;

    this.m_nPos += 3;
    var arrPos = [];

    // Проверяем пустой массив
    if (']' === this.m_sSGF[this.m_nPos])
        return;

    while (true)
    {
        var sX = this.m_sSGF[this.m_nPos]; this.m_nPos++;
        var sY = this.m_sSGF[this.m_nPos]; this.m_nPos++;

        var X = sX.charCodeAt(0) - g_nSgfReaderCharCodeOffset;
        var Y = sY.charCodeAt(0) - g_nSgfReaderCharCodeOffset;

        arrPos[Count] = Common_XYtoValue(X, Y);
        Count++;

        if (']' !== this.m_sSGF[this.m_nPos])
        {
            this.m_bValidNode = false;
            return;
        }

        this.m_nPos++;
        if ('[' !== this.m_sSGF[this.m_nPos])
        {
            break;
        }
        this.m_nPos++;
    }

    this.m_oGameTree.Add_TerritoryPoint(Value, arrPos);
};
CSgfReader.prototype.private_ReadUS = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_Transcriber(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadWR = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_WhiteRating(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadWT = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Set_WhiteTeam(this.private_ReadSimpleText());
};
CSgfReader.prototype.private_ReadWL = function()
{
    this.m_nPos += 3;
    this.m_oGameTree.Add_WhiteTimeLeft(this.private_ReadReal());
};