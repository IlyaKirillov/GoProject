"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     31.12.14
 * Time     3:05
 */

function CBoardSound()
{
    this.PlaceStone = null;
    this.Capture1   = null;
    this.Capture3   = null;
    this.Capture5   = null;
    this.CaptureN   = null;

    this.m_bIE      = false;
    this.m_bOn      = true;
}

CBoardSound.prototype.Init = function(sPath, bIE)
{
    var aBody = document.getElementsByTagName('body');
    if (aBody.length <= 0)
        return;

    this.m_bOn = true;

    if ("IE" === Common.Get_Browser())
        this.m_bIE = true;

    var oBody = aBody[0];
    this.PlaceStone = this.private_AddSound(oBody, "GoBoardApiSoundPlaceStone", sPath + "/Stone.mp3");
    this.Capture1   = this.private_AddSound(oBody, "GoBoardApiSoundCapture1",   sPath + "/Capture1.mp3");
    this.Capture3   = this.private_AddSound(oBody, "GoBoardApiSoundCapture3",   sPath + "/Capture3.mp3");
    this.Capture5   = this.private_AddSound(oBody, "GoBoardApiSoundCapture5",   sPath + "/Capture5.mp3");
    this.CaptureN   = this.private_AddSound(oBody, "GoBoardApiSoundCaptureN",   sPath + "/CaptureN.mp3");
};
CBoardSound.prototype.Play_PlaceStone = function()
{
    this.private_PlaySound(this.PlaceStone);
};
CBoardSound.prototype.Play_CaptureStones = function(nCount)
{
    if (nCount <= 1)
        this.private_PlaySound(this.Capture1);
    else if (nCount <= 3)
        this.private_PlaySound(this.Capture3);
    else if (nCount <= 5)
        this.private_PlaySound(this.Capture5);
    else
        this.private_PlaySound(this.CaptureN);

};
CBoardSound.prototype.On = function()
{
    this.m_bOn = true;
};
CBoardSound.prototype.Off = function()
{
    this.m_bOn = false;
};
CBoardSound.prototype.private_AddSound = function(oBody, sId, sPath)
{
    var oElement = document.getElementById(sId);

    if (!oElement)
    {
        oElement = document.createElement("audio");
        oElement.id      = sId;
        oElement.preload = "preload";
        oElement.src     = sPath;
        oBody.appendChild(oElement);
    }

    return oElement;
};
CBoardSound.prototype.private_PlaySound = function(oAudio)
{
    if (!oAudio || !this.m_bOn || !g_oGlobalSettings.Is_SoundOn())
        return;

    try
    {
        if (this.m_bIE)
        {
            oAudio.setActive();
            oAudio.click();
            oAudio.autoplay = "";
            oAudio.autoplay = "autoplay";
        }
        else
            oAudio.play();
    }
    catch(e)
    {
    }
};