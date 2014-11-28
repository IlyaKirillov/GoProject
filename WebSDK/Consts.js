/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     18.11.14
 * Time     1:37
 */

var BOARD_EMPTY = 0x00;
var BOARD_BLACK = 0x01;
var BOARD_WHITE = 0x02;
var BOARD_DRAW  = 0x03; // Это только для подсчета очков, для обозначения нейтральных пунктов.

var EShowVariants =
{
    None : 0, // Не показвать варианты
    Curr : 1, // Альтернативные варианты текущего хода
    Next : 2, // Все варианты следующего хода

    Min  : 0,
    Max  : 2
};

// Реальные значения мы не берем, потому что реальная доска предлолагается не квадратной из-за того, что
// игроки не сидят сверху над доской, а смотрят на доску под углом.
var g_dBoard_H         = 460;
var g_dBoard_W         = g_dBoard_H;//430;
var g_dVerOff_2_Cell_H = 17.51 / 23.61;
var g_dHorOff_2_Cell_W = g_dVerOff_2_Cell_H;//17.54 / 21.94;