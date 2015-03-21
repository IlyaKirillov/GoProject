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
        oGameTree.Set_TutorMode(false, BOARD_BLACK, dTutorTime);
    else if (oPr['TutorColor'] && "White" === oPr['TutorColor'])
        oGameTree.Set_TutorMode(false, BOARD_WHITE, dTutorTime);
    else
        oGameTree.Set_TutorMode(true, BOARD_EMPTY, dTutorTime);

    oGameTree.Forbid_All();

    if (undefined !== oPr['NewNode'])
    {
        oGameTree.Set_EditingFlags({NewNode : true});
        oGameTree.Set_TutorNewNodeText(oPr['NewNode']);
    }

    var pRightCallback = (undefined !== oPr['RightCallback'] ? oPr['RightCallback'] : null);
    var pWrongCallback = (undefined !== oPr['WrongCallback'] ? oPr['WrongCallback'] : null);
    var pResetCallback = (undefined !== oPr['ResetCallback'] ? oPr['ResetCallback'] : null)
    oGameTree.Set_TutorCallbacks(pRightCallback, pWrongCallback, pResetCallback);
};

/*
 Ищем правильный вариант решения задачи. Если такого варианта нет возвращается false, если есть, тогда
 возвращаем true и делаем вариант с правильной нодой текущим.
 */
CGoBoardApi.prototype.Find_ProblemRightVariant = function(oGameTree)
{
    return oGameTree.Find_ProblemRightVariant();
};

/*
 Стартуем автопроигрывание
 */
CGoBoardApi.prototype.Start_AutoPlay = function(oGameTree)
{
    oGameTree.Start_AutoPlay(true);
};

/*
 Останавливаем автопроигрывание
 */
CGoBoardApi.prototype.Stop_AutoPlay = function(oGameTree)
{
    oGameTree.Stop_AutoPlay();
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
CGoBoardApi.prototype.Load_Sgf = function(oGameTree, sSgfFile, _oViewPort, sMoveReference, sExt)
{
    var oViewPort = {};

    if (_oViewPort && true === _oViewPort['Auto'])
    {
        oViewPort.Auto = true;
    }
    else if (_oViewPort && undefined !== _oViewPort['X0'] && undefined !== _oViewPort['X1'] && undefined !== _oViewPort['Y0'] && undefined !== _oViewPort['Y1'])
    {
        oViewPort.Auto = false;
        oViewPort.X0 = _oViewPort['X0'];
        oViewPort.X1 = _oViewPort['X1'];
        oViewPort.Y0 = _oViewPort['Y0'];
        oViewPort.Y1 = _oViewPort['Y1'];
    }
    else
    {
        oViewPort = null;
    }

    // Через апи мы всегда даем грузить сгф
    var nOldFlags = oGameTree.m_nEditingFlags;
    oGameTree.Reset_EditingFlags();
    oGameTree.Load_Sgf(sSgfFile, oViewPort, sMoveReference, sExt);
    oGameTree.m_nEditingFlags = nOldFlags;
};

/*
 Сохраняем Sgf в виде строки
 */
CGoBoardApi.prototype.Save_Sgf = function(oGameTree)
{
    return oGameTree.Save_Sgf();
};

/*
 Получаем ссылку на ход, чтобы потом можно было переоткрыть файл с данной ссылкой
 */
CGoBoardApi.prototype.Get_MoveReference = function(oGameTree)
{
    return oGameTree.Get_MoveReference();
};

/*
 Функция обновления размеров всех графических объектов.
 */
CGoBoardApi.prototype.Update_Size = function(oGameTree)
{
    oGameTree.Update_Size();
};

/*
 Получаем название матча.
 */
CGoBoardApi.prototype.Get_MatchName = function(oGameTree)
{
    if (oGameTree)
        oGameTree.Get_MatchName();
};


/*
 Функция для выставления звука.
 */
CGoBoardApi.prototype.Set_Sound = function(oGameTree, sPath)
{
    oGameTree.Set_Sound(sPath);
};

CGoBoardApi.prototype.Focus = function(oGameTree)
{
    if (oGameTree)
        oGameTree.Focus();
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
CGoBoardApi.prototype['Save_Sgf']                             = CGoBoardApi.prototype.Save_Sgf;
CGoBoardApi.prototype['Get_MoveReference']                    = CGoBoardApi.prototype.Get_MoveReference;
CGoBoardApi.prototype['Update_Size']                          = CGoBoardApi.prototype.Update_Size;
CGoBoardApi.prototype['Set_Sound']                            = CGoBoardApi.prototype.Set_Sound;
CGoBoardApi.prototype['Find_ProblemRightVariant']             = CGoBoardApi.prototype.Find_ProblemRightVariant;
CGoBoardApi.prototype['Start_AutoPlay']                       = CGoBoardApi.prototype.Start_AutoPlay;
CGoBoardApi.prototype['Stop_AutoPlay']                        = CGoBoardApi.prototype.Stop_AutoPlay;
CGoBoardApi.prototype['Focus']                                = CGoBoardApi.prototype.Focus;
CGoBoardApi.prototype['Get_MatchName']                        = CGoBoardApi.prototype.Get_MatchName;
