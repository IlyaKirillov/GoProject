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
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_SimpleBoard(sDivId);
};

/*
 Создаем графическую доску и кнопки управления снизу.
 */
CGoBoardApi.prototype.Create_BoardWithNavigateButtons = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_BoardWithNavigateButtons(sDivId);
};

CGoBoardApi.prototype.Create_BoardCommentsButtonsNavigator = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_BoardCommentsButtonsNavigator(sDivId);
};

/*
 Создаем демонстрационный вариант
 */
CGoBoardApi.prototype.Create_Presentation = function(oGameTree, sDivId, aSlides)
{
    var oPresentation = new CPresentation(oGameTree);
    oPresentation.Init(sDivId, aSlides);
};

/*
 Создаем вариант для задачек
 */
CGoBoardApi.prototype.Create_Problems = function(oGameTree, sDivId, oPr)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_Problems(sDivId);

    var dTutorTime = 0.3;
    if (oPr['TutorTime'])
        dTutorTime = parseFloat(oPr['TutorTime']);

    if (oPr['TutorColor'] && "Black" === oPr['TutorColor'])
        oGameTree.Set_TutorMode(BOARD_BLACK, dTutorTime);
    else
        oGameTree.Set_TutorMode(BOARD_WHITE, dTutorTime);

    oGameTree.Forbid_All();

    if (undefined !== oPr['NewNode'])
    {
        oGameTree.Set_EditingFlags({NewNode : true});
        oGameTree.Set_TutorNewNodeText(oPr['NewNode']);
    }
};

/*
 Накладываем ограничения на редактирование.
 */
CGoBoardApi.prototype.Set_Permissions = function(oGameTree, oFlags)
{
    var _Flags = {};

    _Flags.NewNode         = oFlags['NewNode'];
    _Flags.Move            = oFlags['Move'];
    _Flags.ChangeBoardMode = oFlags['ChangeBoardMode'];
    _Flags.LoadFile        = oFlags['LoadFile'];
    _Flags.GameInfo        = oFlags['GameInfo'];

    oGameTree.Set_EditingFlags(_Flags);
};

/*
 Загружаем Sgf в GameTree.
 */
CGoBoardApi.prototype.Load_Sgf = function(oGameTree, sSgfFile)
{
    // Через апи мы всегда даем грузить сгф
    var nOldFlags = oGameTree.m_nEditingFlags;
    oGameTree.Reset_EditingFlags();
    oGameTree.Load_Sgf(sSgfFile);
    oGameTree.m_nEditingFlags = nOldFlags;
};

/*
 Функция обновления размеров всех графических объектов.
 */
CGoBoardApi.prototype.Update_Size = function(oGameTree)
{
    oGameTree.Update_Size();
};

window['GoBoardApi'] = new CGoBoardApi();
CGoBoardApi.prototype['Create_GameTree']                      = CGoBoardApi.prototype.Create_GameTree;
CGoBoardApi.prototype['Create_SimpleBoard']                   = CGoBoardApi.prototype.Create_SimpleBoard;
CGoBoardApi.prototype['Create_BoardWithNavigateButtons']      = CGoBoardApi.prototype.Create_BoardWithNavigateButtons;
CGoBoardApi.prototype['Create_BoardCommentsButtonsNavigator'] = CGoBoardApi.prototype.Create_BoardCommentsButtonsNavigator;
CGoBoardApi.prototype['Create_Presentation']                  = CGoBoardApi.prototype.Create_Presentation;
CGoBoardApi.prototype['Create_Problems']                      = CGoBoardApi.prototype.Create_Problems;
CGoBoardApi.prototype['Set_Permissions']                      = CGoBoardApi.prototype.Set_Permissions;
CGoBoardApi.prototype['Load_Sgf']                             = CGoBoardApi.prototype.Load_Sgf;
CGoBoardApi.prototype['Update_Size']                          = CGoBoardApi.prototype.Update_Size;
