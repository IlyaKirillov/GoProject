"use strict;"

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     13.09.14
 * Time     3:26
 */

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
CBoardKo.prototype.Copy = function()
{
    var NewKo = new CBoardKo();
    NewKo.CopyFrom(this);
    return NewKo;
};
CBoardKo.prototype.CopyFrom = function(OtherKo)
{
    this.m_nMove     = OtherKo.m_nMove;
    this.m_nCaptured = OtherKo.m_nCaptured;
};
CBoardKo.prototype.Check = function(nMove, nCaptured)
{
    if (nCaptured === this.m_nMove && nMove === this.m_nCaptured)
        return true;

    return false;
};
CBoardKo.prototype.Set = function(nMove, nCaptured)
{
    this.m_nMove     = nMove;
    this.m_nCaptured = nCaptured;
};

function CBoardPoint(eValue, nNum)
{
    //this.m_eValue = Math.floor((Math.random() * 3));// (undefined === eValue ? BOARD_EMPTY : eValue);
    this.m_eValue = (undefined === eValue ? BOARD_EMPTY : eValue);
    this.m_nNum   = (undefined === nNum ? - 1 : nNum);
}
CBoardPoint.prototype.Clear = function()
{
    this.m_eValue = BOARD_EMPTY;
    this.m_nNum   = -1;
};
CBoardPoint.prototype.Set_Value = function(eValue)
{
    this.m_eValue = eValue;
};
CBoardPoint.prototype.Set_Num = function(Num)
{
    this.m_nNum = Num;
};
CBoardPoint.prototype.Get_Value = function()
{
    return this.m_eValue;
};
CBoardPoint.prototype.Get_Num = function()
{
    return this.m_nNum;
};

function CDeadGroupChecker()
{
    this.m_aCurrentGroup = [];
    this.m_aSavedGroup   = [];
}
CDeadGroupChecker.prototype.Reset_Current = function()
{
    this.m_aCurrentGroup = [];
};
CDeadGroupChecker.prototype.Save_Current = function()
{
    // Здесь мы не проверяем совпали ли группы. Это должно происходить выше.
    this.m_aSavedGroup = this.m_aSavedGroup.concat(this.m_aCurrentGroup);
    this.m_aCurrentGroup = [];
};
CDeadGroupChecker.prototype.Get_Size = function()
{
    return this.m_aSavedGroup.length;
};
CDeadGroupChecker.prototype.Get_Value = function(Index)
{
    return this.m_aSavedGroup[Index];
};
/**
 * Проверяем находится ли заданный пункт в группе, если нет, тогда добавляем его в группу
 * @param nX
 * @param nY
 * @returns {boolean}
 */
CDeadGroupChecker.prototype.Is_StoneInCurrentGroup = function(nX, nY)
{
    var nValue = Common_XYtoValue(nX, nY);
    for (var nIndex = 0, nCount = this.m_aCurrentGroup.length; nIndex < nCount; nIndex++)
    {
        if (this.m_aCurrentGroup[nIndex] == nValue)
            return true;
    }

    // Добавляем камень в группу
    this.m_aCurrentGroup.push(nValue);
    return false;
};
CDeadGroupChecker.prototype.Is_StoneInSavedGroup = function(nX, nY)
{
    var nValue = Common_XYtoValue(nX, nY);
    for (var nIndex = 0, nCount = this.m_aSavedGroup.length; nIndex < nCount; nIndex++)
    {
        if (this.m_aSavedGroup[nIndex] == nValue)
            return true;
    }
    return false;
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
    var nSize = this.m_nW * this.m_nH;

    this.m_aBoard = new Array(nSize);
    for (var nIndex = 0; nIndex < nSize; nIndex++)
    {
        this.m_aBoard[nIndex] = new CBoardPoint();
    }
};

CLogicBoard.prototype.Clear = function()
{
    var nSize = this.m_nW * this.m_nH;
    for (var nIndex = 0; nIndex < nSize; nIndex++)
    {
        this.m_aBoard[nIndex].Clear();
    }
};

CLogicBoard.prototype.Get_Ko = function()
{
    return this.m_oKo.Copy();
};
CLogicBoard.prototype.Set_Ko = function(Ko)
{
    this.m_oKo.CopyFrom(Ko);
};
CLogicBoard.prototype.Reset_Ko = function()
{
    this.m_oKo.Reset();
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
    this.m_aBoard[nIndex].Set_Value(eValue);

    if (undefined !== nNum && null !== nNum && -1 !== nNum)
        this.m_aBoard[nIndex].Set_Num(nNum);
};

CLogicBoard.prototype.Get = function(nX, nY)
{
    return this.m_aBoard[this.private_GetPos(nX, nY)].Get_Value();
};

CLogicBoard.prototype.Get_Num = function(nX, nY)
{
    return this.m_aBoard[this.private_GetPos(nX, nY)].Get_Num();
};

CLogicBoard.prototype.Check_Dead = function(nX, nY, eValue)
{
    var oChecker = new CDeadGroupChecker();
    this.private_CheckDead(nX, nY, eValue, oChecker);

    if (oChecker.Get_Size() > 0)
        return oChecker;
    else
        return null;
};

CLogicBoard.prototype.Check_Kill = function(nX, nY, eValue, bCheckKo)
{
    var eOtherValue;
    switch(eValue)
    {
        case BOARD_BLACK : eOtherValue = BOARD_WHITE; break;
        case BOARD_WHITE : eOtherValue = BOARD_BLACK; break;
        default : return null;
    }

    var oChecker = new CDeadGroupChecker();

    if (true !== oChecker.Is_StoneInSavedGroup(nX + 1, nY))
        this.private_CheckDead(nX + 1, nY, eOtherValue, oChecker);

    if (true !== oChecker.Is_StoneInSavedGroup(nX - 1, nY))
        this.private_CheckDead(nX - 1, nY, eOtherValue, oChecker);

    if (true !== oChecker.Is_StoneInSavedGroup(nX, nY + 1))
        this.private_CheckDead(nX, nY + 1, eOtherValue, oChecker);

    if (true !== oChecker.Is_StoneInSavedGroup(nX, nY - 1))
        this.private_CheckDead(nX, nY - 1, eOtherValue, oChecker);

    // Проверяем ко
    var nDeadCount = oChecker.Get_Size();
    if (1 == nDeadCount)
    {
        var nMove     = Common_XYtoValue(nX, nY);
        var nCaptured = oChecker.Get_Value(0);

        if (this.m_oKo.Check(nMove, nCaptured) && true == bCheckKo)
            return null;

        this.m_oKo.Set(nMove, nCaptured);
    }
    else if (nDeadCount > 1)
    {
        this.m_oKo.Reset();
    }
    else if (nDeadCount <= 0)
        return null;

    return oChecker;
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
        return this.private_CheckDame(nX, nY, eValue, oChecker);

    return false;
};

CLogicBoard.prototype.private_CheckDame = function(nX, nY, eValue, oChecker)
{
    if (true === oChecker.Is_StoneInCurrentGroup(nX, nY))
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

    if (eValue !== this.Get(nX, nY))
        return 0;

    if (true === this.private_CheckDame(nX, nY, eValue, oChecker))
    {
        oChecker.Reset_Current();
        return false;
    }
    else
    {
        oChecker.Save_Current();
        return true;
    }
};

CLogicBoard.prototype.Set_ScorePoint = function(nX, nY, eValue)
{
};

CLogicBoard.prototype.Get_ScorePoint = function(nX, nY)
{
    return BOARD_EMPTY;
};

CLogicBoard.prototype.Count_Scores = function()
{
    return {Black : 0, White : 0};
};