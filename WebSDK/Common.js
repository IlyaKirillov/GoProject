/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     18.11.14
 * Time     0:38
 */

function CPos()
{
    X = 0;
    Y = 0;
};

function Common_ValuetoXY(Value)
{
    var Pos = new CPos();
    Pos.X = Value & 0xFF;
    Pos.Y = (Value >> 8) & 0xFF;
    return Pos;
}