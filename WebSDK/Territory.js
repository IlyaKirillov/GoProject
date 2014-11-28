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
CTerritory.prototype.Fill_PointsToLogicBoard = function(LogicBoard)
{
    for (var Place in this.m_aPoints)
    {
        var Pos = Common_ValuetoXY(parseInt(Place));
        Board.Set_ScorePoint(Pos.X, Pos.X, this.m_aPoints[Pos]);
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