/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     17.11.14
 * Time     23:58
 */

//------------------------------------------------------------------------------------------------------------------
//   TODO: В будушем надо будет добавить обработку элементов: "DM", "GB", "GW", "HO", "N", "UC", "V", "BM", "DO",
//   "IT", "TE"
//   TODO: В будушем надо будет добавить обработку элементов: "AR", "DD", "LN", "SL","VW"
//------------------------------------------------------------------------------------------------------------------

var ECommand =
{
    Unknown : 0x0000, // Неизвестная команда

    B       : 0x0001, // Type: "B"/"W" - ход черных/белых
    W       : 0x0002, // Value: (Y << 8) + X - координата хода (number)

    MN      : 0x0003, // Type: "MN" - указание номера хода текущей ноды
                      // Value: номер хода (number)

    AB      : 0x0101, // Type: "AB"/"AW" - добавление черных/белых камней, "AE" - удаление камней
    AW      : 0x0102, // Count: количество камней
    AE      : 0x0103, // Value: массив с координатами камней (Array[number,number,...])

    PL      : 0x0104, // Type: "PL" - указание следующего хода
                      // Value: 1 - ход черных, 2 - ход белых (number)

    RM      : 0x0201, // Type: "RM" - отмечаем пункты, на которых надо удалить метки
    CR      : 0x0211, // Type: "CR"/"MA"/"SQ"/"TR" - отмечаем пункты доски кружком/Х/квадратом/треугольником
    MA      : 0x0212, // Count: количество пунктов
    SQ      : 0x0213, // Value: массив с координатами пунктов (Array[number,number,...])
    TR      : 0x0214, //

    LB      : 0x0215, // Type: "LB" - выводим текст в данном месте доски
                      // Value: { Text : строка текста (string), Pos : координата пункта на доске (number) }

    BL      : 0x0301, // Type:  "BL"/"WL" сколько осталось времени у черного/белого игрока
    WL      : 0x0302, // Value: значение в секундах (number)

    OB      : 0x0303, // Type:  "OB"/"OW" сколько осталось сделать ходов черному/белому игроку в данном периоде
    OW      : 0x0304, // Value: количество ходов (number)

    // Дополнительные поля, которые не входят в спецификацию сгф

    CT      : 0x1101, // Type:  "CT" - таблица используемых цветов
                      // Value: [RGBA] - массив, индекс - номер
    CM      : 0x1102  // Type: "CM"
                      // Value: [Indexes] - номера из таблицы цветов размером W * H
};

function CCommand(Type, Value, Count)
{
    this.m_nType  = undefined === Type  ? ECommand.Unknown : Type;
    this.m_oValue = undefined === Value ? null : Value;
    this.m_nCount = undefined === Count ? 0 : Count;
}

CCommand.prototype.Get_Type  = function() { return this.m_nType;  };
CCommand.prototype.Get_Value = function() { return this.m_oValue; };
CCommand.prototype.Get_Count = function() { return this.m_nCount; };
CCommand.prototype.Set_Type  = function(Value) { this.m_nType  = Value; };
CCommand.prototype.Set_Value = function(Value) { this.m_oValue = Value; };
CCommand.prototype.Set_Count = function(Value) { this.m_nCount = Value; };
CCommand.prototype.To_String = function()
{
    return JSON.stringify({Type : this.m_nType, Value : this.m_oValue, Count : this.m_nCount});
};
CCommand.prototype.From_String = function(sString)
{
    var oCommand = JSON.parse(sString);

    this.m_nType  = oCommand.Type;
    this.m_oValue = oCommand.Value;
    this.m_nCount = oCommand.m_nCount;
};
