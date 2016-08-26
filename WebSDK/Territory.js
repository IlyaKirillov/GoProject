/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     18.11.14
 * Time     0:35
 */

function CTerritory(Use, Points)
{
    this.m_bUse      = Use;
    this.m_aPoints   = Points;
    this.m_bForceUse = false;
}

CTerritory.prototype.CopyFrom = function(oTerritory)
{
	this.m_bUse = oTerritory.m_bUse;
	this.m_bForceUse = oTerritory.m_bForceUse;

	this.m_aPoints = {};
	for (var sId in oTerritory.m_aPoints)
	{
		this.m_aPoints[sId] = oTerritory.m_aPoints[sId];
	}
};
CTerritory.prototype.Is_Use = function()
{
    if (true === this.Is_ForceUse())
        return true;

    return this.m_bUse;
};
CTerritory.prototype.Is_ForceUse = function()
{
    return this.m_bForceUse;
};
CTerritory.prototype.Set_Use = function(Use)
{
    this.m_bUse = Use;
};
CTerritory.prototype.Set_ForceUse = function(Use)
{
    this.m_bForceUse = Use;
};
CTerritory.prototype.Add_Point = function(Pos, Value)
{
    this.m_aPoints["" + Pos] = Value;
};
CTerritory.prototype.Remove_Point = function(Pos)
{
    delete this.m_aPoints["" + Pos];
};
CTerritory.prototype.Clear_Points = function()
{
    this.m_aPoints = {};
};
CTerritory.prototype.Fill_PointsToLogicBoard = function(LogicBoard)
{
    for (var Place in this.m_aPoints)
    {
        var Pos = Common_ValuetoXY(parseInt(Place));
        LogicBoard.Set_ScorePoint(Pos.X, Pos.Y, this.m_aPoints[Place]);
    }
};
CTerritory.prototype.Fill_PointsFromLogicBoard = function(LogicBoard)
{
    this.Clear_Points();

    var oBoardSize = LogicBoard.Get_Size();
    for (var Y = 1; Y <= oBoardSize.Y; Y++)
    {
        for (var X = 1; X <= oBoardSize.X; X++)
        {
            var Value = LogicBoard.Get_ScorePoint(X, Y);
            var Place = Common_XYtoValue(X, Y);

            if (BOARD_BLACK === Value || BOARD_WHITE === Value)
                this.Add_Point(Place, Value);
        }
    }
};