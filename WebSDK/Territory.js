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
    this.m_bUse    = Use;
    this.m_aPoints = Points;
}

CTerritory.prototype.Is_Use = function()
{
    return this.m_bUse;
};
CTerritory.prototype.Set_Use = function(Use)
{
    this.m_bUse = Use;
};
CTerritory.prototype.Add_Point = function(Pos, Value)
{
    this.m_aPoints["" + Pos] = Value;
};
CTerritory.prototype.Clear_Points = function()
{
    this.m_aPoints = {};
};
CTerritory.prototype.Fill_Points = function(LogicBoard)
{
    for (var Place in this.m_aPoints)
    {
        var Pos = Common_ValuetoXY(parseInt(Place));
        Board.Set_ScorePoint(Pos.X, Pos.X, this.m_aPoints[Pos]);
    }
};