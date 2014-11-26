"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     22.11.14
 * Time     0:29
 */

/*
 Апи для работы с данной библиотекой.
 */
function CGoBoardApi()
{

}

/*
 Создаем основной объект GameTree, который будет хранит саму партию.
 */
CGoBoardApi.prototype.Create_GameTree = function()
{
    return new CGameTree();
};

/*
 Создаем графическую доску в заданной div и привязываем ее к GameTree.
 */
CGoBoardApi.prototype.Create_SimpleBoard = function(oGameTree, sDivId)
{
    var DrawingBoard = new CDrawingBoard();
    DrawingBoard.Init(sDivId, oGameTree);
    DrawingBoard.Update_Size();
    DrawingBoard.Focus();
};

/*
 Загружаем Sgf в GameTree.
 */
CGoBoardApi.prototype.Load_Sgf = function(oGameTree, sSgfFile)
{
    oGameTree.Load_Sgf(sSgfFile);
};

/*
 Функция обновления размеров всех графических объектов.
 */
CGoBoardApi.prototype.Update_Size = function(oGameTree)
{
    var oDrawingBoard = oGameTree.m_oDrawingBoard;
    if (oDrawingBoard)
        oDrawingBoard.Update_Size();
};

window['GoBoardApi'] = new CGoBoardApi();
CGoBoardApi.prototype['Create_GameTree']    = CGoBoardApi.prototype.Create_GameTree;
CGoBoardApi.prototype['Create_SimpleBoard'] = CGoBoardApi.prototype.Create_SimpleBoard;
CGoBoardApi.prototype['Load_Sgf']           = CGoBoardApi.prototype.Load_Sgf;
CGoBoardApi.prototype['Update_Size']        = CGoBoardApi.prototype.Update_Size;
