"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     22.11.14
 * Time     0:29
 */

/**
 * Апи для работы с данной библиотекой.
 * @constructor
 */
function CGoBoardApi()
{

}

/**
 * Создаем основной объект GameTree, который будет хранит саму партию.
 * @returns {CGameTree}
 */
CGoBoardApi.prototype.Create_GameTree = function()
{
    return new CGameTree();
};

/**
 * Тимплейт с простой доской без дополнительных элементов.
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CGoBoardApi.prototype.Create_SimpleBoard = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_SimpleBoard(sDivId);
};

/**
 * Тимплейт для просмотрщика.
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CGoBoardApi.prototype.Create_Viewer = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_Viewer(sDivId);
};

/**
 * Тимплейт для вертикального редактора.
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CGoBoardApi.prototype.Create_EditorVer = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_VerticalFullTemplate(sDivId);
};

/**
 * Тимплейт для горизонтального редактора.
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CGoBoardApi.prototype.Create_EditorHor = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_HorizontalFullTemplate(sDivId);
};

/**
 * Создаем графическую доску и кнопки управления снизу.
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CGoBoardApi.prototype.Create_BoardWithNavigateButtons = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_BoardWithNavigateButtons(sDivId);
};

/**
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CGoBoardApi.prototype.Create_BoardCommentsButtonsNavigator = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_MixedFullTemplate(sDivId);
};

/**
 * Создаем демонстрационный вариант
 */
CGoBoardApi.prototype.Create_Presentation = function(oGameTree, sDivId, aSlides)
{
    var oPresentation = new CPresentation(oGameTree);
    oPresentation.Init(sDivId, aSlides);
};

/**
 * Создаем вариант для задачек
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
    var pResetCallback = (undefined !== oPr['ResetCallback'] ? oPr['ResetCallback'] : null);
    oGameTree.Set_TutorCallbacks(pRightCallback, pWrongCallback, pResetCallback);
};

/**
 * Ищем правильный вариант решения задачи. Если такого варианта нет возвращается false, если есть, тогда
 * возвращаем true и делаем вариант с правильной нодой текущим.
 */
CGoBoardApi.prototype.Find_ProblemRightVariant = function(oGameTree)
{
    return oGameTree.Find_ProblemRightVariant();
};

/**
 * Стартуем автопроигрывание
 */
CGoBoardApi.prototype.Start_AutoPlay = function(oGameTree)
{
    oGameTree.Start_AutoPlay(true);
};

/**
 * Останавливаем автопроигрывание
 */
CGoBoardApi.prototype.Stop_AutoPlay = function(oGameTree)
{
    oGameTree.Stop_AutoPlay();
};

/**
 * Накладываем ограничения на редактирование.
 * @param {CGameTree} oGameTree - Дерево партии
 * @param {Object} oFlags - Запрещающие флаги
 * @param {boolean} oFlags.NewNode
 * @param {boolean} oFlags.Move
 * @param {boolean} oFlags.ChangeBoardMode
 * @param {boolean} oFlags.LoadFile
 * @param {boolean} oFlags.GameInfo
 * @param {boolean} oFlags.ViewPort
 */
CGoBoardApi.prototype.Set_Permissions = function(oGameTree, oFlags)
{
    var _Flags = {};

    _Flags.NewNode         = oFlags['NewNode'];
    _Flags.Move            = oFlags['Move'];
    _Flags.ChangeBoardMode = oFlags['ChangeBoardMode'];
    _Flags.LoadFile        = oFlags['LoadFile'];
    _Flags.GameInfo        = oFlags['GameInfo'];
    _Flags.ViewPort        = oFlags['ViewPort'];

    oGameTree.Set_EditingFlags(_Flags);
};

/**
 * Загружаем Sgf в GameTree.
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

/**
 * Сохраняем Sgf в виде строки
 */
CGoBoardApi.prototype.Save_Sgf = function(oGameTree)
{
    return oGameTree.Save_Sgf();
};

/**
 * Получаем ссылку на ход, чтобы потом можно было переоткрыть файл с данной ссылкой
 * bStrong - получаем сильную ссылку или нет. Сильная, значит в ссылку записывается весь вариант, не считая нод, которые
 * были в файле изначально. В слабой ссылка просто указывает на место, но не сохраняет ее как самостоятельный вариант.
 */
CGoBoardApi.prototype.Get_MoveReference = function(oGameTree, bStrong)
{
    return oGameTree.Get_MoveReference(bStrong);
};

/**
 * Проверяем, делались ли какие-либо изменения в файле с момента открытия.
 */
CGoBoardApi.prototype.Is_Modified = function(oGameTree)
{
    return oGameTree.Is_Modified();
};

/**
 * Функция обновления размеров всех графических объектов.
 */
CGoBoardApi.prototype.Update_Size = function(oGameTree)
{
    oGameTree.Update_Size();
};

/**
 * Получаем название матча.
 */
CGoBoardApi.prototype.Get_MatchName = function(oGameTree)
{
    if (oGameTree)
        return oGameTree.Get_MatchName();

    return "White vs. Black";
};


/**
 * Функция для выставления звука.
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

/**
 * Получить текущую версию библиотеки.
 */
CGoBoardApi.prototype.Get_Version = function()
{
    return this.Version;
};

/**
 * Включение/выключение координат на доске
 */
CGoBoardApi.prototype.Toggle_Rulers = function (oGameTree)
{
    if (oGameTree)
        oGameTree.Toggle_Rulers();
};

/**
 * Выставляем Handler для обработки изменений GameTree.
 * Функции:
 * Handler.GoTo_Node(NodeId)
 */
CGoBoardApi.prototype.Set_GameTreeHandler = function(oGameTree, oHandler)
{
    if (oGameTree && oHandler)
        oGameTree.Set_Handler(oHandler);
};

/**
 * Переход к ноде по заданному Id ноды
 */
CGoBoardApi.prototype.GoTo_Node = function(oGameTree, sNodeId)
{
    if (oGameTree)
        oGameTree.GoTo_NodeById(sNodeId);
};

/**
 * Переход к ноде по заданному номеру хода в текущей ветке.
 */
CGoBoardApi.prototype.GoTo_NodeByMoveNumber = function(oGameTree, nMoveNumber)
{
    if (oGameTree)
        oGameTree.GoTo_NodeByMoveNumber(nMoveNumber);
};

/**
 * Прячем или показываем курсор.
 */
CGoBoardApi.prototype.Set_ShowTarget = function(oGameTree, bShow)
{
    if (oGameTree)
        oGameTree.Set_ShowTarget(bShow, true);
};

/**
 * Выставляем тему доски для текущей сессии, перекрывающую тему пользователя.
 */
CGoBoardApi.prototype.Set_BoardTheme = function(oGameTree, sTheme)
{
    if (oGameTree)
    {
        var eScheme = null;

        if ("TrueColor" === sTheme)
            eScheme = EColorScheme.TrueColor;
        else if ("BookStyle" === sTheme)
            eScheme = EColorScheme.BookStyle;
        else if ("Simple" === sTheme)
            eScheme = EColorScheme.SimpleColor;
        else if ("Dark" === sTheme)
            eScheme = EColorScheme.Dark;

        if (eScheme)
            oGameTree.Set_LocalColorScheme(eScheme);
    }
};

/**
 * Получем минимальную высоту необходимую для дивки, исходя из заданной ширины.
 */
CGoBoardApi.prototype.Get_DivHeightByWidth = function(oGameTree, nWidth)
{
    if (oGameTree)
        return oGameTree.Get_DivHeightByWidth(nWidth);
};

/**
 * Функция, которая встраивает доску с заданными параметрами.
 */
CGoBoardApi.prototype.Embed = function (sDivId, oConfig)
{
    var nMoveNumber = -1;
    var oViewPort   = null;
    var sSgfData    = null;
    var sBoardMode  = null;
    var nBoardWidth = null;
    var sTheme      = "TrueColor";
    var oThis       = this;

    var oGameTree = this.Create_GameTree();
    oGameTree.Get_LocalSettings().Set_Embedding(true);

    if (oConfig["viewPort"])
    {
        oViewPort = {};

        if ("auto" === oConfig["viewPort"])
        {
            oViewPort["Auto"] = true;
        }
        else
        {
            oViewPort["Auto"] = false;
            oViewPort["X0"]   = parseInt(oConfig["viewPort"]["X0"]);
            oViewPort["X1"]   = parseInt(oConfig["viewPort"]["X1"]);
            oViewPort["Y0"]   = parseInt(oConfig["viewPort"]["Y0"]);
            oViewPort["Y1"]   = parseInt(oConfig["viewPort"]["Y1"]);
        }
    }

    if (oConfig["moveNumber"])
    {
        nMoveNumber = parseInt(oConfig["moveNumber"]);
    }

    if (oConfig["boardMode"])
    {
        sBoardMode = oConfig["boardMode"];
    }
    else
    {
        sBoardMode = "viewer";
    }

    if (oConfig["width"])
    {
        nBoardWidth = oConfig["width"];
    }

    if (oConfig["boardTheme"])
    {
        sTheme = oConfig["boardTheme"];
    }

    if (null != oConfig["sgfUrl"])
    {
        Load_SgfByUrl(oConfig["sgfUrl"]);
    }
    else if (null !== oConfig["sgfData"])
    {
        sSgfData = oConfig["sgfData"];
        Load_Board();
    }
    else
    {
        sSgfData = "(;FF[4]GM[1]SZ[19])";
        Load_Board();
    }

    function Load_SgfByUrl(sUrl)
    {
        sUrl        = decodeURIComponent(sUrl);
        var rawFile = new XMLHttpRequest();
        rawFile["open"]("GET", sUrl + '?_=' + new Date().getTime(), false);

        rawFile["onreadystatechange"] = function ()
        {
            if (rawFile["readyState"] === 4)
            {
                if (rawFile["status"] === 200 || rawFile["status"] == 0)
                {
                    sSgfData = rawFile.responseText;
                    Load_Board();
                }
            }
        };
        rawFile["send"](null);
    }

    function Load_Board()
    {
        var oDiv = document.getElementById(sDivId);
        if (!oDiv)
            return;

        var oPermissions                = {};
        oPermissions["LoadFile"]        = false;
        oPermissions["GameInfo"]        = false;
        oPermissions["ChangeBoardMode"] = false;
        oPermissions["NewNode"]         = false;
        oPermissions["Move"]            = false;
        oPermissions["ViewPort"]        = false;

        oThis.Set_BoardTheme(oGameTree, sTheme);

        var nWidth = 400;
        if ("image" === sBoardMode)
        {
            oThis.Create_SimpleBoard(oGameTree, sDivId);
            oThis.Set_ShowTarget(oGameTree, false);
            nWidth = 600;
        }
        else if ("viewer" == sBoardMode)
        {
            oThis.Create_Viewer(oGameTree, sDivId);
            oPermissions["Move"] = true;
            nWidth               = 600;
        }
        else if ("vereditor" === sBoardMode)
        {
            oThis.Create_EditorVer(oGameTree, sDivId);
            oPermissions["ChangeBoardMode"] = true;
            oPermissions["NewNode"]         = true;
            oPermissions["Move"]            = true;
            nWidth                          = 600;
        }
        else if ("horeditor" === sBoardMode)
        {
            oThis.Create_EditorHor(oGameTree, sDivId);
            oPermissions["ChangeBoardMode"] = true;
            oPermissions["NewNode"]         = true;
            oPermissions["Move"]            = true;
            nWidth                          = 900;
        }
        else if ("problems" == sBoardMode)
        {
            var oPr = {};

            if (oConfig["problemsTime"])
                oPr["TutorTime"] = oConfig["problemsTime"];

            if (oConfig["problemsColor"])
                oPr["TutorColor"] = oConfig["problemsColor"];

            if (oConfig["problemsNewNode"])
                oPr["NewNode"] = oConfig["problemsNewNode"];

            oThis.Create_Problems(oGameTree, sDivId, oPr);
            oPermissions       = null;
            nWidth             = 400;

            if (null === oViewPort)
            {
                oViewPort = {};
                oViewPort["Auto"] = true;
            }
        }

        oThis.Load_Sgf(oGameTree, sSgfData, oViewPort);

        if (null !== nBoardWidth)
        {
            nWidth = nBoardWidth;
        }

        var nHeight = oThis.Get_DivHeightByWidth(oGameTree, nWidth);

        oDiv.style.width  = nWidth + "px";
        oDiv.style.height = nHeight + "px";

        if (-1 !== nMoveNumber)
        {
            oThis.GoTo_NodeByMoveNumber(oGameTree, nMoveNumber);
        }
        else
        {
            oThis.GoTo_NodeByMoveNumber(oGameTree, 0);
        }

        oThis.Update_Size(oGameTree);

        if (oPermissions)
        {
            oThis.Set_Permissions(oGameTree, oPermissions);
        }
    }

    return oGameTree;
};

window['GoBoardApi'] = new CGoBoardApi();

CGoBoardApi.prototype['Embed']                                = CGoBoardApi.prototype.Embed;
CGoBoardApi.prototype['Create_GameTree']                      = CGoBoardApi.prototype.Create_GameTree;

CGoBoardApi.prototype['Create_SimpleBoard']                   = CGoBoardApi.prototype.Create_SimpleBoard;
CGoBoardApi.prototype['Create_Viewer']                        = CGoBoardApi.prototype.Create_Viewer;
CGoBoardApi.prototype['Create_EditorHor']                     = CGoBoardApi.prototype.Create_EditorHor;
CGoBoardApi.prototype['Create_EditorVer']                     = CGoBoardApi.prototype.Create_EditorVer;
CGoBoardApi.prototype['Create_BoardWithNavigateButtons']      = CGoBoardApi.prototype.Create_BoardWithNavigateButtons;
CGoBoardApi.prototype['Create_BoardCommentsButtonsNavigator'] = CGoBoardApi.prototype.Create_BoardCommentsButtonsNavigator;
CGoBoardApi.prototype['Create_Presentation']                  = CGoBoardApi.prototype.Create_Presentation;
CGoBoardApi.prototype['Create_Problems']                      = CGoBoardApi.prototype.Create_Problems;

CGoBoardApi.prototype['Set_Permissions']                      = CGoBoardApi.prototype.Set_Permissions;
CGoBoardApi.prototype['Load_Sgf']                             = CGoBoardApi.prototype.Load_Sgf;
CGoBoardApi.prototype['Save_Sgf']                             = CGoBoardApi.prototype.Save_Sgf;
CGoBoardApi.prototype['Get_MoveReference']                    = CGoBoardApi.prototype.Get_MoveReference;
CGoBoardApi.prototype['Is_Modified']                          = CGoBoardApi.prototype.Is_Modified;
CGoBoardApi.prototype['Update_Size']                          = CGoBoardApi.prototype.Update_Size;
CGoBoardApi.prototype['Set_Sound']                            = CGoBoardApi.prototype.Set_Sound;
CGoBoardApi.prototype['Find_ProblemRightVariant']             = CGoBoardApi.prototype.Find_ProblemRightVariant;
CGoBoardApi.prototype['Start_AutoPlay']                       = CGoBoardApi.prototype.Start_AutoPlay;
CGoBoardApi.prototype['Stop_AutoPlay']                        = CGoBoardApi.prototype.Stop_AutoPlay;
CGoBoardApi.prototype['Focus']                                = CGoBoardApi.prototype.Focus;
CGoBoardApi.prototype['Get_MatchName']                        = CGoBoardApi.prototype.Get_MatchName;
CGoBoardApi.prototype['Get_Version']                          = CGoBoardApi.prototype.Get_Version;
CGoBoardApi.prototype['Toggle_Rulers']                        = CGoBoardApi.prototype.Toggle_Rulers;
CGoBoardApi.prototype['Set_GameTreeHandler']                  = CGoBoardApi.prototype.Set_GameTreeHandler;
CGoBoardApi.prototype['GoTo_Node']                            = CGoBoardApi.prototype.GoTo_Node;
CGoBoardApi.prototype['GoTo_NodeByMoveNumber']                = CGoBoardApi.prototype.GoTo_NodeByMoveNumber;
CGoBoardApi.prototype['Set_ShowTarget']                       = CGoBoardApi.prototype.Set_ShowTarget;
CGoBoardApi.prototype['Get_DivHeightByWidth']                 = CGoBoardApi.prototype.Get_DivHeightByWidth;
CGoBoardApi.prototype['Set_BoardTheme']                       = CGoBoardApi.prototype.Set_BoardTheme;
