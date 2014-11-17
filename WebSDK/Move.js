/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     18.11.14
 * Time     0:32
 */

function CMove(Value, Type)
{
    this.m_nValue = Value;
    this.m_nType  = Type;
}

CMove.prototype.Get_X     = function() {};
CMove.prototype.Get_Y     = function() {};
CMove.prototype.Get_Value = function() { return this.m_nValue; };
CMove.prototype.Get_Type  = function() { return this.m_nType;  };
