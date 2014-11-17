"use strict;"

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     13.09.14
 * Time     3:26
 */

var BOARD_EMPTY = 0x00;
var BOARD_BLACK = 0x01;
var BOARD_WHITE = 0x02;

function CBoardKo()
{
    this.m_nMove     = 0; // Значение ход, который съел ко
    this.m_nCaptured = 0; // Значение камня, который был съеден на ко
}

CBoardKo.prototype.Reset = function()
{
    this.m_nMove     = 0;
    this.m_nCaptured = 0;
}

function CBoardPoint(eValue, nNum)
{
    this.m_eValue = (undefined === eValue ? BOARD_WHITE : eValue);
    this.m_nNum   = (undefined === nNum ? - 1 : nNum);
}

function CDeadGroupChecker()
{
    this.m_aGroup     = new Array();
    this.m_nGroupSize = 0;
}

CDeadGroupChecker.prototype.Reset_GroupSize = function()
{
    this.m_nGroupSize = 0;
};

CDeadGroupChecker.prototype.Get_Size = function()
{
    return this.m_nGroupSize;
};

function CLogicBoard(nW, nH)
{
    this.m_nW = (undefined === nW ? 19 : nW); // количество пересечений по горизонтали
    this.m_nH = (undefined === nH ? 19 : nH); // количество пересечений по вертикали

    this.m_aBoard       = null; // Массив, в котором указаны значения пунктов на доске черный/белый/пустой
    this.m_aBoardScores = null; // Массив с метками территории
    this.private_InitBoard();

    this.m_oKo = new CBoardKo();
}

CLogicBoard.prototype.private_InitBoard = function()
{
    var nSize = this.m_nW * m_nH;

    this.m_aBoard = new Array(nSize);
    for (var nIndex = 0; nIndex < nSize; nIndex++)
    {
        this.m_aBoard[nIndex] = new CBoardPoint();
        this.m_aBoardScores[nIndex] = 0;
    }
};

CLogicBoard.prototype.private_GetPos = function(nX, nY)
{
    return (nY - 1) * this.m_nW + (nX - 1);
};

CLogicBoard.prototype.Reset_Size = function(nW, nH)
{
    this.m_nW = nW;
    this.m_nH = nH;

    this.private_InitBoard();

    this.m_oKo.Reset();
};

CLogicBoard.prototype.Get_Size = function()
{
    return {X : this.m_nW, Y : this.m_nH};
};

CLogicBoard.prototype.Set = function(nX, nY, eValue, nNum)
{
    var nIndex = this.private_GetPos(nX, nY);
    this.m_aBoard[nIndex].m_eValue = eValue;

    if (undefined !== nNum && null !== nNum && -1 !== nNum)
        this.m_aBoard[nIndex].nNum = nNum;
};

CLogicBoard.prototype.Get = function(nX, nY)
{
    return this.m_aBoard[this.privateGet_Pos(nX, nY)].m_eValue;
};

CLogicBoard.prototype.Get_Num = function(nX, nY)
{
    return this.m_aBoard[this.privateGet_Pos(nX, nY)].m_nNum;
};

CLogicBoard.prototype.Check_Dead = function(nX, nY, eValue)
{
    var oChecker = new CDeadGroupChecker();
    this.private_CheckDead(nX, nY, eValue, oChecker);
    return oChecker.Get_Size();
};

CLogicBoard.prototype.Check_Kill = function(nX, nY, eValue)
{
    var eOtherValue;
    switch( Value )
    {
        case BOARD_BLACK : eOtherValue = BOARD_WHITE; break;
        case BOARD_WHITE : eOtherValue = BOARD_BLACK; break;
        default : return false;
    }

    var oChecker = new CDeadGroupChecker();

    if (true !== this.private_CheckDead(nX + 1, nY, eOtherValue, oChecker))
        oChecker.Reset_GroupSize();

    if (true !== this.private_CheckDead(nX - 1, nY, eOtherValue, oChecker))
        oChecker.Reset_GroupSize();

    if (true !== this.private_CheckDead(nX, nY + 1, eOtherValue, oChecker))
        oChecker.Reset_GroupSize();

    if (true !== this.private_CheckDead(nX, nY - 1, eOtherValue, oChecker))
        oChecker.Reset_GroupSize();

    // Проверяем ко
    var nDeadCount = oChecker.Get_Size();
    if (1 == nDeadCount)
    {
        var Val1 = (Y << 8) + X;
        var Val2 = this.m_aGroup[0];

        if ( Val1 == this.m_nKo1 && Val2 == this.m_nKo2 && true == CheckKo )
            return false;

        this.m_nKo1 = Val2;
        this.m_nKo2 = Val1;
    }
    else if (nDeadCount > 1)
    {
        this.m_oKo.Reset();
    }

    return bKill;
};

/**
 * Ищем дамэ начиная с данного пункта, если данный пункт занят камнем того же цвета, тогда смотрим на
 * дамэ данного камня, если данный пункт не занят вообще, значит мы нашли дамэ, в последнем случае, дамэ
 * не ищем.
 * @param nX
 * @param nY
 * @param nValue
 * @param oChecker
 * @returns {boolean}
 */
CLogicBoard.prototype.private_IsDame = function(nX, nY, eValue, oChecker)
{
    if (nX > this.m_nW || nX < 1 || nY > this.m_nH || nY < 1)
        return false;

    var eThisValue = this.Get(nX, nY);

    if (BOARD_EMPTY === eThisValue)
        return true;
    else if (eValue === eThisValue)
        return this.Check_Dame(X, Y, Value, oChecker);

    return false;
};

CLogicBoard.prototype.private_CheckDame = function(nX, nY, eValue, oChecker)
{
    if (true === this.private_Is_StoneInGroup(nX, nY, oChecker))
        return false;

    if (true === this.private_IsDame(nX + 1, nY, eValue, oChecker))
        return true;

    if (true === this.private_IsDame(nX - 1, nY, eValue, oChecker))
        return true;

    if (true === this.private_IsDame(nX, nY + 1, eValue, oChecker))
        return true;

    if (true === this.private_IsDame(nX, nY - 1, eValue, oChecker))
        return true;

    return false;
};

CLogicBoard.prototype.private_CheckDead = function(nX, nY, eValue, oChecker)
{
    if (nX > this.m_nW || nX < 1 || nY > this.m_nH || nY < 1)
        return 0;

    if (false === bDontResetGroup)
        this.m_nGroupSize = 0;

    if (eValue !== this.Get(X, Y))
        return 0;

    var nCapturedCount = this.m_nGroupSize;
    if (false === this.private_CheckDame(nX, nY, eValue, oChecker))
    {
        oChecker.m_nGroupSize = nCapturedCount;
        return false;
    }

    return true;
};

/**
 * Проверяем находится ли заданный пункт в группе, если нет, тогда добавляем его в группу
 * @param nX
 * @param nY
 * @param oChecker
 * @returns {boolean}
 */
CLogicBoard.prototype.private_Is_StoneInGroup = function(nX, nY, oChecker)
{
    var nValue = Common_XYtoValue(nX, nY);
    for (var nIndex = 0, nCount = oChecker.m_nGroupSize; nIndex < nCount; nIndex++)
    {
        if (oChecker.m_aGroup[nIndex] == nValue)
            return true;
    }

    // Добавляем камень в группу
    oChecker.m_aGroup[this.m_nGroupSize] = nValue;
    oChecker.m_nGroupSize++;

    return false;
};

CLogicBoard.prototype.Set_ScorePoint = function(nX, nY, eValue)
{
};