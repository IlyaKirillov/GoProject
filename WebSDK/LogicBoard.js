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
CBoardPoint.prototype.CopyFrom = function(OtherPoint)
{
    this.m_eValue = OtherPoint.m_eValue;
    this.m_nNum   = OtherPoint.m_nNum;
};
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

function CBoundaryScoreCounter()
{
    this.m_aPoints = {};
}
CBoundaryScoreCounter.prototype.Clear = function()
{
    this.m_aPoints = {};
};
CBoundaryScoreCounter.prototype.Is_PointIn = function(X, Y)
{
    var Place = Common_XYtoValue(X, Y);
    if (undefined !== this.m_aPoints[Place])
        return true;

    this.m_aPoints[Place] = 1;
    return false;
};
CBoundaryScoreCounter.prototype.Remove = function(X, Y)
{
    var Place = Common_XYtoValue(X, Y);
    if (undefined !== this.m_aPoints[Place])
        delete this.m_aPoints[Place];
};

function CLogicGroup()
{
    this.m_oStones = {};
    this.m_nValue  = null;
}
CLogicGroup.prototype.Is_PointIn = function(X, Y, Value)
{
    if (BOARD_EMPTY === Value)
        return null;

    var PosValue = Common_XYtoValue(X, Y);
    if (null === this.m_nValue)
    {
        this.m_nValue = Value;
        this.m_oStones[PosValue] = 1;
        return false;
    }

    if (Value !== this.m_nValue)
        return null;

    if (undefined !== this.m_oStones[PosValue])
        return true;

    this.m_oStones[PosValue] = 1;
    return false;
};
CLogicGroup.prototype.Get_PointsArray = function()
{
    var aArray = [];
    for (var Pos in this.m_oStones)
    {
        aArray.push(Pos);
    }
    return aArray;
};
CLogicGroup.prototype.Get_Value = function()
{
    return this.m_nValue;
};


function CAreaScoreCounter()
{
    this.m_oArea  = {};
    this.m_nOwner = BOARD_EMPTY;
}

CAreaScoreCounter.prototype.Clear = function()
{
    this.m_oArea  = {};
    this.m_nOwner = BOARD_EMPTY;
};
/**
 * Проверяем находится ли заданный пункт в области. Если нет, тогда добавляем его туда.
 * @param X
 * @param Y
 * @returns {boolean}
 */
CAreaScoreCounter.prototype.Is_PointIn = function(X, Y)
{
    var Place = Common_XYtoValue(X, Y);
    if (undefined !== this.m_oArea[Place])
        return true;

    this.m_oArea[Place] = 1;
    return false;
};
CAreaScoreCounter.prototype.Set_Owner = function(nValue)
{
    this.m_nOwner = nValue;
};
CAreaScoreCounter.prototype.Get_Owner = function()
{
    return this.m_nOwner;
};
CAreaScoreCounter.prototype.Update_Board = function(Board, nForceValue)
{
    var Value = (undefined === nForceValue ? this.m_nOwner : nForceValue);

    for (var Place in this.m_oArea)
    {
        var Pos = Common_ValuetoXY(Place | 0);
        Board.Set_ScorePoint(Pos.X, Pos.Y, Value);
    }
};
function CLogicBoard(nW, nH)
{
    this.m_nW = (undefined === nW ? 19 : nW); // количество пересечений по горизонтали
    this.m_nH = (undefined === nH ? 19 : nH); // количество пересечений по вертикали

    this.m_aBoard       = null; // Массив, в котором указаны значения пунктов на доске черный/белый/пустой
    this.private_InitBoard();

    this.m_oKo = new CBoardKo();

    this.m_aBoardScores = null; // Массив с метками территории
    this.m_oArea        = new CAreaScoreCounter();
    this.m_oBoundary    = new CBoundaryScoreCounter();

}
CLogicBoard.prototype.Copy = function()
{
    var oNewLB = new CLogicBoard(this.m_nW, this.m_nH);

    for (var Index = 0, nCount = this.m_aBoard.length; Index < nCount; Index++)
        oNewLB.m_aBoard[Index].CopyFrom(this.m_aBoard[Index]);

    oNewLB.m_oKo.CopyFrom(this.m_oKo);
    return oNewLB;
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
CLogicBoard.prototype.Get_HandiPoints = function()
{
    var aPoints = [];

    var aPointsX = this.private_GetLineHandiPoints(this.m_nW);
    var aPointsY = this.private_GetLineHandiPoints(this.m_nH);

    for (var nX = 0; nX < aPointsX.length; nX++)
    {
        for (var nY = 0; nY < aPointsY.length; nY++)
        {
            aPoints.push([aPointsX[nX], aPointsY[nY]]);
        }
    }

    if (((9 == this.m_nW || 11 == this.m_nW) && 1 == this.m_nH % 2)
        || ((9 == this.m_nH || 11 == this.m_nH) && 1 == this.m_nW % 2))
        aPoints.push([(this.m_nW - 1) / 2, (this.m_nH - 1) / 2]);

    return aPoints;
};
CLogicBoard.prototype.private_GetLineHandiPoints = function(nSize)
{
    var aPoints = [];
    if (5 == nSize)
        aPoints = [2];
    else if (7 == nSize)
        aPoints = [3];
    else if (8 == nSize)
        aPoints = [2, 5];
    else if (9 == nSize)
        aPoints = [2, 6];
    else if (10 == nSize)
        aPoints = [3, 6];
    else if (11 == nSize)
        aPoints = [3, 7];
    else if (nSize >= 12)
    {
        if (1 == nSize % 2)
            aPoints = [3, (nSize - 1) / 2, nSize - 4];
        else
            aPoints = [3, nSize - 4];
    }
    return aPoints;
};
CLogicBoard.prototype.Is_HandiPoint = function(nX, nY)
{
    if (this.m_nW === this.m_nH)
    {
        var aPoints = this.Get_HandiPoints();
        for (var nIndex = 0, nCount = aPoints.length; nIndex < nCount; nIndex++)
        {
            if (nX - 1 === aPoints[nIndex][0] && nY - 1 === aPoints[nIndex][1])
                return true;
        }
    }

    return false;
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
CLogicBoard.prototype.private_InitBoard = function()
{
    var nSize = this.m_nW * this.m_nH;

    this.m_aBoard = new Array(nSize);
    for (var nIndex = 0; nIndex < nSize; nIndex++)
    {
        this.m_aBoard[nIndex] = new CBoardPoint();
    }
};
CLogicBoard.prototype.private_GetPos = function(nX, nY)
{
    return (nY - 1) * this.m_nW + (nX - 1);
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
CLogicBoard.prototype.Init_CountScores = function()
{
    this.m_aBoardScores = [];
    for (var Y = 1; Y <= this.m_nH; Y++)
    {
        for (var X = 1; X <= this.m_nW; X++)
        {
            this.m_aBoardScores[this.private_GetPos(X, Y)] = BOARD_EMPTY;
        }
    }

    this.private_CheckAllEmptyAreas(false);
};
CLogicBoard.prototype.Set_ScorePoint = function(nX, nY, eValue)
{
    this.m_aBoardScores[this.private_GetPos(nX, nY)] = eValue;
};
CLogicBoard.prototype.Get_ScorePoint = function(nX, nY)
{
    return this.m_aBoardScores[this.private_GetPos(nX, nY)]
};
CLogicBoard.prototype.Count_Scores = function(oDrawingBoard)
{
    var nBlackScores = 0;
    var nWhiteScores = 0;

    for (var Y = 1; Y <= this.m_nH; Y++)
    {
        for (var X = 1; X <= this.m_nW; X++)
        {
            var oMark = null;
            var nOwner = this.Get_ScorePoint(X, Y);

            if (BOARD_BLACK === nOwner)
            {
                oMark = new CDrawingMark(X, Y, EDrawingMark.Tb, "");
                if (BOARD_WHITE === this.Get(X, Y))
                    nBlackScores += 2;
                else
                    nBlackScores++;
            }
            else if (BOARD_WHITE === nOwner)
            {
                oMark = new CDrawingMark(X, Y, EDrawingMark.Tw, "");
                if (BOARD_BLACK === this.Get(X, Y))
                    nWhiteScores += 2;
                else
                    nWhiteScores++;
            }

            if (null === oMark)
                oDrawingBoard.Remove_Mark(X, Y);
            else
                oDrawingBoard.Add_Mark(oMark);
        }
    }

    return {Black : nBlackScores, White : nWhiteScores};
};
CLogicBoard.prototype.Select_DeadGroup = function(X, Y)
{
    var Value = this.Get(X, Y);
    if (BOARD_EMPTY === Value)
        return;

    this.m_oBoundary.Clear();
    var nOwner = this.Get_ScorePoint(X, Y);
    if (BOARD_BLACK !== nOwner && BOARD_WHITE !== nOwner)
    {
        // Сначала найдем область в которую мы заносим пустые пункты и пункты заданного цвета.
        this.m_oArea.Clear();
        this.private_CheckBoundary(X, Y, Value);

        for (var Place in this.m_oBoundary.m_aPoints)
        {
            var Pos = Common_ValuetoXY(Place | 0);
            this.m_oArea.Clear();
            this.private_CheckEmptyAreaByXYAndValue(Pos.X, Pos.Y, BOARD_DRAW - Value);
            this.m_oArea.Update_Board(this, BOARD_DRAW);
        }

        this.private_CheckAllEmptyAreas(true);

        this.m_oArea.Clear();
        this.private_CheckBoundary(X, Y, Value);
        this.m_oArea.Update_Board(this, BOARD_DRAW - Value);
    }
    else
    {
        this.m_oArea.Clear();
        this.private_CheckBoundary(X, Y, Value);
        this.m_oArea.Update_Board(this, BOARD_DRAW);
        this.private_CheckAllEmptyAreas(true);
    }
};
CLogicBoard.prototype.private_CheckEmptyAreaByXY = function(X, Y)
{
    if (X > this.m_nW || X < 1 || Y > this.m_nH || Y < 1)
        return;

    var nCurValue = this.Get(X, Y);
    if (BOARD_EMPTY !== this.Get(X, Y))
    {
        var nOwner = this.m_oArea.Get_Owner();
        switch (nOwner)
        {
            case BOARD_EMPTY:
            {
                this.m_oArea.Set_Owner(nCurValue);
                break;
            }
            case BOARD_BLACK:
            case BOARD_WHITE:
            {
                if (nOwner !== nCurValue)
                    this.m_oArea.Set_Owner(BOARD_DRAW);
                break;
            }
            case BOARD_DRAW:
                break;
        }
        return;
    }

    if (false === this.m_oArea.Is_PointIn(X, Y))
    {
        this.private_CheckEmptyAreaByXY(X + 1, Y);
        this.private_CheckEmptyAreaByXY(X - 1, Y);
        this.private_CheckEmptyAreaByXY(X, Y + 1);
        this.private_CheckEmptyAreaByXY(X, Y - 1);
    }
};
CLogicBoard.prototype.private_CheckBoundary = function(X, Y, Value)
{
    if (X > this.m_nW || X < 1 || Y > this.m_nH || Y < 1)
        return;

    if ((BOARD_DRAW - Value) === this.Get(X, Y))
    {
        if (Value === this.Get_ScorePoint(X, Y))
            this.m_oBoundary.Is_PointIn(X, Y);

        return;
    }

    if (true !== this.m_oArea.Is_PointIn(X, Y))
    {
        this.private_CheckBoundary(X + 1, Y, Value);
        this.private_CheckBoundary(X - 1, Y, Value);
        this.private_CheckBoundary(X, Y + 1, Value);
        this.private_CheckBoundary(X, Y - 1, Value);
    }
};
CLogicBoard.prototype.private_CheckEmptyAreaByXYAndValue = function(X, Y, Value)
{
    if (X > this.m_nW || X < 1 || Y > this.m_nH || Y < 1)
        return;

    if ((BOARD_DRAW - Value) === this.Get(X, Y))
        return;
    else if (Value === this.Get(X, Y))
        this.m_oBoundary.Remove(X, Y);

    if (true !== this.m_oArea.Is_PointIn(X, Y))
    {
        this.private_CheckEmptyAreaByXYAndValue(X + 1, Y, Value);
        this.private_CheckEmptyAreaByXYAndValue(X - 1, Y, Value);
        this.private_CheckEmptyAreaByXYAndValue(X, Y + 1, Value);
        this.private_CheckEmptyAreaByXYAndValue(X, Y - 1, Value);
    }
};
CLogicBoard.prototype.private_CheckAllEmptyAreas = function(bCheckDraw)
{
    for (var Y = 1; Y <= this.m_nH; Y++)
    {
        for (var X = 1; X <= this.m_nW; X++)
        {
            if (BOARD_EMPTY === this.Get(X, Y) && (BOARD_EMPTY === this.Get_ScorePoint(X, Y) || (true === bCheckDraw && BOARD_DRAW === this.Get_ScorePoint(X, Y))))
            {
                this.m_oArea.Clear();
                this.private_CheckEmptyAreaByXY( X, Y );
                this.m_oArea.Update_Board(this);
            }
        }
    }
};
CLogicBoard.prototype.Init_ScoreEstimate = function()
{
    this.private_InitScoreEstimate();
};
CLogicBoard.prototype.Estimate_Scores = function(oDrawingBoard)
{
    var nDilations = 5;
    var nPreErosions = 3, nPostErosions = 23;

    this.private_EstimateScores();

    for (var nIndex = 0; nIndex < nDilations; nIndex++)
    {
        this.private_MakeDilation();
    }

    for (var nIndex = 0; nIndex < nPreErosions; nIndex++)
    {
        this.private_MakeErosion();
    }

    var nBlackPotentialPoints = 0;
    var nWhitePotentialPoints = 0;

    for (var Y = 1; Y <= this.m_nH; Y++)
    {
        for (var X = 1; X <= this.m_nW; X++)
        {
            var oMark = null;
            var nValue = this.m_aScoreEstimate[Y][X];

            if (nValue > 0 && BOARD_BLACK !== this.Get(X, Y))
            {
                oMark = new CDrawingMark(X, Y, EDrawingMark.Tb, "");
                if (BOARD_WHITE === this.Get(X, Y))
                    nBlackPotentialPoints += 2;
                else
                    nBlackPotentialPoints++;
            }
            else if (nValue < 0 && BOARD_WHITE !== this.Get(X, Y))
            {
                oMark = new CDrawingMark(X, Y, EDrawingMark.Tw, "");
                if (BOARD_BLACK === this.Get(X, Y))
                    nWhitePotentialPoints += 2;
                else
                    nWhitePotentialPoints++;
            }

            if (null === oMark)
                oDrawingBoard.Remove_Mark(X, Y);
            else
                oDrawingBoard.Add_Mark(oMark);
        }
    }

    for (var nIndex = 0; nIndex < nPostErosions; nIndex++)
    {
        this.private_MakeErosion();
    }

    var nBlackRealPoints = 0;
    var nWhiteRealPoints = 0;

    for (var Y = 1; Y <= this.m_nH; Y++)
    {
        for (var X = 1; X <= this.m_nW; X++)
        {
            var oMark = null;
            var nValue = this.m_aScoreEstimate[Y][X];

            if (nValue > 0 && BOARD_BLACK !== this.Get(X, Y))
            {
                oMark = new CDrawingMark(X, Y, EDrawingMark.Tb2, "");
                if (BOARD_WHITE === this.Get(X, Y))
                    nBlackRealPoints += 2;
                else
                    nBlackRealPoints++;
            }
            else if (nValue < 0 && BOARD_WHITE !== this.Get(X, Y))
            {
                oMark = new CDrawingMark(X, Y, EDrawingMark.Tw2, "");
                if (BOARD_BLACK === this.Get(X, Y))
                    nWhiteRealPoints += 2;
                else
                    nWhiteRealPoints++;
            }

            if (null !== oMark)
                oDrawingBoard.Add_Mark(oMark);
        }
    }

    return {BlackReal : nBlackRealPoints, BlackPotential : nBlackPotentialPoints, WhiteReal : nWhiteRealPoints, WhitePotential : nWhitePotentialPoints};
};
CLogicBoard.prototype.private_GetGroup = function(X, Y)
{
    var oGroup = new CLogicGroup();
    this.private_GetGroupIteration(X, Y, oGroup);
    return oGroup;
};
CLogicBoard.prototype.private_GetGroupIteration = function(X, Y, oGroup)
{
    if (X < 1 || X > this.m_nW || Y < 1 || Y > this.m_nH)
        return;

    if (false !== oGroup.Is_PointIn(X, Y, this.Get(X, Y)))
        return;

    this.private_GetGroupIteration(X + 1, Y, oGroup);
    this.private_GetGroupIteration(X - 1, Y, oGroup);
    this.private_GetGroupIteration(X, Y + 1, oGroup);
    this.private_GetGroupIteration(X, Y - 1, oGroup);

    // Также считаем, что камни в одной группе, если они соединены с помощью косуми

    if (X > 1 && Y > 1 && BOARD_EMPTY === this.Get(X - 1, Y) && BOARD_EMPTY === this.Get(X, Y - 1))
        this.private_GetGroupIteration(X - 1, Y - 1, oGroup);

    if (X < this.m_nW && Y > 1 && BOARD_EMPTY === this.Get(X + 1, Y) && BOARD_EMPTY === this.Get(X, Y - 1))
        this.private_GetGroupIteration(X + 1, Y - 1, oGroup);

    if (X < this.m_nW && Y < this.m_nH && BOARD_EMPTY === this.Get(X + 1, Y) && BOARD_EMPTY === this.Get(X, Y + 1))
        this.private_GetGroupIteration(X + 1, Y + 1, oGroup);

    if (X > 1 && Y < this.m_nH && BOARD_EMPTY === this.Get(X - 1, Y) && BOARD_EMPTY === this.Get(X, Y + 1))
        this.private_GetGroupIteration(X - 1, Y + 1, oGroup);
};
CLogicBoard.prototype.Mark_DeadGroupForEstimate = function(X, Y)
{
    var Value = this.Get(X, Y);

    if (BOARD_EMPTY === Value)
        return;

    var oGroup = this.private_GetGroup(X, Y);
    var aGroup = oGroup.Get_PointsArray();

    var ValueSE = this.Get_SE(X, Y);
    var NewValue = (ValueSE !== Value ? Value : (BOARD_BLACK === Value ? BOARD_WHITE : BOARD_BLACK));
    for (var Index = 0, Count = aGroup.length; Index < Count; Index++)
    {
        var oPos = Common_ValuetoXY(aGroup[Index]);
        this.Set_SE(oPos.X, oPos.Y, NewValue);
    }
};
CLogicBoard.prototype.Get_SE = function(X, Y)
{
    if (undefined === this.m_aBoardSE || undefined === this.m_aBoardSE[Y] || undefined === this.m_aBoardSE[Y][X])
        return BOARD_EMPTY;

    return this.m_aBoardSE[Y][X];
};
CLogicBoard.prototype.Set_SE = function(X, Y, Value)
{
    if (undefined === this.m_aBoardSE)
        this.m_aBoardSE = [];

    if (undefined === this.m_aBoardSE[Y])
        this.m_aBoardSE[Y] = [];

    this.m_aBoardSE[Y][X] = Value;
};
CLogicBoard.prototype.private_InitScoreEstimate = function()
{
    for (var Y = 1; Y <= this.m_nH; Y++)
    {
        for (var X = 1; X <= this.m_nW; X++)
        {
            this.Set_SE(X, Y, this.Get(X, Y));
        }
    }
};
CLogicBoard.prototype.private_EstimateScores = function()
{
    this.m_aScoreEstimate = [];

    for (var Y = 0; Y <= this.m_nH + 1; Y++)
    {
        this.m_aScoreEstimate[Y] = [];
        for (var X = 0; X <= this.m_nW + 1; X++)
        {
            if (0 === X || this.m_nW + 1 === X || 0 === Y || this.m_nH + 1 === Y)
            {
                this.m_aScoreEstimate[Y][X] = 0;

                var aResult = this.private_GetNearestStones(X, Y);
                var Count = aResult.Stones.length;
                if (Count > 0)
                {
                    var bWhite = false, bBlack = false;
                    for (var Index = 0; Index < Count; Index++)
                    {
                        if (BOARD_BLACK === aResult.Stones[Index].Value)
                            bBlack = true;
                        if (BOARD_WHITE === aResult.Stones[Index].Value)
                            bWhite = true;
                    }

                    if (true !== bWhite || true !== bBlack)
                    {
                        if (bWhite)
                            this.m_aScoreEstimate[Y][X] = -128;
                        else
                            this.m_aScoreEstimate[Y][X] = 128;
                    }
                }
            }
            else
            {
                var Value = this.Get_SE(X, Y);

                if (BOARD_BLACK === Value)
                    this.m_aScoreEstimate[Y][X] = 128;
                else if (BOARD_WHITE === Value)
                    this.m_aScoreEstimate[Y][X] = -128;
                else
                    this.m_aScoreEstimate[Y][X] = 0;
            }
        }
    }
};
CLogicBoard.prototype.private_GetNearestStones = function(X, Y)
{
    var Diff = 100;
    var aResult = [];

    var MaxDiff = 4;

    for (var nX = X - MaxDiff; nX <= X + MaxDiff; nX++)
    {
        for (var nY = Y - MaxDiff; nY <= Y + MaxDiff; nY++)
        {
            if (nX < 1 || nX > this.m_nW || nY < 1 || nY > this.m_nH || Math.abs(X - nX) + Math.abs(Y - nY) > MaxDiff)
                continue;

            var Value = this.Get_SE(nX, nY);

            if (BOARD_EMPTY === Value)
                continue;

            var CurDiff = Math.abs(X - nX) + Math.abs(Y - nY);

            if (CurDiff < Diff)
            {
                Diff = CurDiff;
                aResult = [];
                aResult.push({X : nX, Y : nY, Value : Value});
            }
            else if (CurDiff === Diff)
                aResult.push({X : nX, Y : nY, Value : Value});
        }
    }

    return {Stones : aResult, Diff : Diff};
};
CLogicBoard.prototype.private_MakeDilation = function()
{
    var aNewSE = [];
    for (var Y = 0; Y <= this.m_nH + 1; Y++)
    {
        aNewSE[Y] = [];
        for (var X = 0; X <= this.m_nW + 1; X++)
        {
            var aValue = [];
            aValue[0] = (X > 0             ? this.m_aScoreEstimate[Y][X - 1] : 0);
            aValue[1] = (X < this.m_nW + 1 ? this.m_aScoreEstimate[Y][X + 1] : 0);
            aValue[2] = (Y > 0             ? this.m_aScoreEstimate[Y - 1][X] : 0);
            aValue[3] = (Y < this.m_nH + 1 ? this.m_aScoreEstimate[Y + 1][X] : 0);

            var nSum = 0;
            var bPositive = false, bNegative = false;
            for (var Index = 0; Index < 4; Index++)
            {
                if (aValue[Index] > 0)
                {
                    bPositive = true;
                    nSum++;
                }
                else if (aValue[Index] < 0)
                {
                    bNegative = true;
                    nSum--;
                }
            }

            var CurValue = this.m_aScoreEstimate[Y][X];
            if ((CurValue >= 0 && false === bNegative) || (CurValue <= 0 && false === bPositive))
                aNewSE[Y][X] = CurValue + nSum;
            else
                aNewSE[Y][X] = CurValue;
        }
    }

    this.m_aScoreEstimate = aNewSE;
};
CLogicBoard.prototype.private_MakeErosion = function()
{
    var aNewSE = [];
    for (var Y = 0; Y <= this.m_nH + 1; Y++)
    {
        aNewSE[Y] = [];
        for (var X = 0; X <= this.m_nW + 1; X++)
        {
            var aValue = [];
            aValue[0] = (X > 0             ? this.m_aScoreEstimate[Y][X - 1] : null);
            aValue[1] = (X < this.m_nW + 1 ? this.m_aScoreEstimate[Y][X + 1] : null);
            aValue[2] = (Y > 0             ? this.m_aScoreEstimate[Y - 1][X] : null);
            aValue[3] = (Y < this.m_nH + 1 ? this.m_aScoreEstimate[Y + 1][X] : null);

            var nPosSum = 0, nNegSum = 0;
            for (var Index = 0; Index < 4; Index++)
            {
                if (null !== aValue[Index])
                {
                    if (aValue[Index] >= 0)
                        nPosSum++;
                    if (aValue[Index] <= 0)
                        nNegSum--;
                }
            }

            var CurValue = this.m_aScoreEstimate[Y][X];
            if (CurValue > 0 && 0 !== nNegSum)
                aNewSE[Y][X] = Math.max(CurValue + nNegSum, 0);
            else if (CurValue < 0 && 0 !== nPosSum)
                aNewSE[Y][X] = Math.min(CurValue + nPosSum, 0);
            else
                aNewSE[Y][X] = CurValue;
        }
    }

    this.m_aScoreEstimate = aNewSE;
};

/**
 * Специальный класс для получения кифу партии.
 * @constructor
 */
function CKifuLogicBoard()
{
    CKifuLogicBoard.superclass.constructor.call(this, 1, 1);
    this.m_aRepetitions = null;
}
CommonExtend(CKifuLogicBoard, CLogicBoard);

/**
 *
 * @param oLogicBoard - стартовое состояние логической доски
 * @param oNode       - нода, с которой мы начинаем заполнение кифу
 */
CKifuLogicBoard.prototype.Load_FromNode = function(oLogicBoard, oNode)
{
    this.m_nW = oLogicBoard.m_nW;
    this.m_nH = oLogicBoard.m_nH;

    this.m_aBoard = null;
    this.private_InitBoard();

    var nMoveNumber = 0;

    for (var Index = 0, nCount = this.m_aBoard.length; Index < nCount; Index++)
    {
        this.m_aBoard[Index].CopyFrom(oLogicBoard.m_aBoard[Index]);

        if (nMoveNumber < this.m_aBoard[Index].Get_Num())
            nMoveNumber = this.m_aBoard[Index].Get_Num();

        this.m_aBoard[Index].Set_Num(-1);
    }

    // Считаем, что команды текущей ноды уже выполнены
    while (oNode.Get_NextsCount() > 0)
    {
        oNode = oNode.Get_Next(oNode.Get_NextCur());

        var CommandsCount = oNode.Get_CommandsCount();
        for (var CommandIndex = 0; CommandIndex < CommandsCount; CommandIndex++)
        {
            var Command       = oNode.Get_Command(CommandIndex);
            var Command_Type  = Command.Get_Type();
            var Command_Value = Command.Get_Value();
            var Command_Count = Command.Get_Count();

            switch (Command_Type)
            {
            case ECommand.B:
            {
                this.Add_ToKifu(Command_Value, BOARD_BLACK, ++nMoveNumber);
                break;
            }
            case ECommand.W:
            {
                this.Add_ToKifu(Command_Value, BOARD_WHITE, ++nMoveNumber);
                break;
            }
            case ECommand.AB:
            {
                for (var Index = 0; Index < Command_Count; Index++)
                {
                    this.Add_ToKifu(Command_Value[Index], BOARD_BLACK, -1);
                }
                break;
            }
            case ECommand.AW:
            {
                for (var Index = 0; Index < Command_Count; Index++)
                {
                    this.Add_ToKifu(Command_Value[Index], BOARD_WHITE, -1);
                }
                break;
            }
            case ECommand.AE:
            {
                for (var Index = 0; Index < Command_Count; Index++)
                {
                    this.Add_ToKifu(Command_Value[Index], BOARD_EMPTY, -1);
                }
                break;
            }
            }
        }
    }
};
CKifuLogicBoard.prototype.Add_ToKifu = function(nCommandValue, nValue, nMoveNumber)
{
    if (nCommandValue <= 0)
        return;

    var Pos = Common_ValuetoXY(nCommandValue);

    var nPrevValue = this.Get(Pos.X, Pos.Y);

    if (BOARD_EMPTY !== nPrevValue)
    {
        if (-1 === nMoveNumber)
            return;

        var nPosValue = this.private_GetPos(Pos.X, Pos.Y);
        if (!this.m_aRepetitions || this.m_aRepetitions.length === undefined)
            this.m_aRepetitions = [];

        for (var nIndex = 0, nCount = this.m_aRepetitions.length; nIndex < nCount; ++nIndex)
        {
            if (nPosValue === this.m_aRepetitions[nIndex].nPosValue)
            {
                this.m_aRepetitions[nIndex].aReps.push({nValue : nValue, nMoveNumber : nMoveNumber});
                return;
            }
        }

        this.m_aRepetitions.push({nPosValue : nPosValue, nValue : nPrevValue, nMoveNumber : this.Get_Num(Pos.X, Pos.Y), aReps : [{nValue : nValue, nMoveNumber : nMoveNumber}]});
    }
    else
    {
        this.Set(Pos.X, Pos.Y, nValue, nMoveNumber);
    }
};
