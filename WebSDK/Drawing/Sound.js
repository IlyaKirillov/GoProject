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

    this.NewMessage = null;

	this.Feemale10 = null;
	this.Feemale9  = null;
	this.Feemale8  = null;
	this.Feemale7  = null;
	this.Feemale6  = null;
	this.Feemale5  = null;
	this.Feemale4  = null;
	this.Feemale3  = null;
	this.Feemale2  = null;
	this.Feemale1  = null;

	this.Tick       = null;
	this.TickLast3  = null;
	this.Beep       = null;
	this.BeepBeep   = null;
	this.Challenger = null;

	this.PrevCountDownTime = null;

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
    this.NewMessage = this.private_AddSound(oBody, "GoBoardApiSoundNewMessage", sPath + "/NewMessage.mp3");

	this.Feemale10 = this.private_AddSound(oBody, "GoBoardApiSoundFemale10", "");
	this.Feemale9  = this.private_AddSound(oBody, "GoBoardApiSoundFemale9", "");
	this.Feemale8  = this.private_AddSound(oBody, "GoBoardApiSoundFemale8", "");
	this.Feemale7  = this.private_AddSound(oBody, "GoBoardApiSoundFemale7", "");
	this.Feemale6  = this.private_AddSound(oBody, "GoBoardApiSoundFemale6", "");
	this.Feemale5  = this.private_AddSound(oBody, "GoBoardApiSoundFemale5", "");
	this.Feemale4  = this.private_AddSound(oBody, "GoBoardApiSoundFemale4", "");
	this.Feemale3  = this.private_AddSound(oBody, "GoBoardApiSoundFemale3", "");
	this.Feemale2  = this.private_AddSound(oBody, "GoBoardApiSoundFemale2", "");
	this.Feemale1  = this.private_AddSound(oBody, "GoBoardApiSoundFemale1", "");

	this.Tick       = this.private_AddSound(oBody, "GoBoardApiSoundTick", "/Src/Files/Tick.ogg");
	this.TickLast3  = this.private_AddSound(oBody, "GoBoardApiSoundTickLast3", "/Src/Files/TickLast3.ogg");
	this.Beep       = this.private_AddSound(oBody, "GoBoardApiSoundBeep", "/Src/Files/Beep.wav");
	this.BeepBeep   = this.private_AddSound(oBody, "GoBoardApiSoundBeepBeep", "/Src/Files/BeepBeep.wav");
	this.Challenger = this.private_AddSound(oBody, "GoBoardApiSoundChallenger", "/Src/Files/Challenger.wav");
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
CBoardSound.prototype.Play_NewMessage = function()
{
    this.private_PlaySound(this.NewMessage);
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
		{
			function startPlayback() 
			{
				return oAudio.play();
			}			  
			startPlayback().then(function(){}).catch(function(error){});
		}
    }
    catch(e)
    {
    }
};
CBoardSound.prototype.private_PlayCountDown = function(nValue)
{
	// switch (nValue)
	// {
	// 	case 10: this.private_PlaySound(this.Feemale10); break;
	// 	case 9: this.private_PlaySound(this.Feemale9); break;
	// 	case 8: this.private_PlaySound(this.Feemale8); break;
	// 	case 7: this.private_PlaySound(this.Feemale7); break;
	// 	case 6: this.private_PlaySound(this.Feemale6); break;
	// 	case 5: this.private_PlaySound(this.Feemale5); break;
	// 	case 4: this.private_PlaySound(this.Feemale4); break;
	// 	case 3: this.private_PlaySound(this.Feemale3); break;
	// 	case 2: this.private_PlaySound(this.Feemale2); break;
	// 	case 1: this.private_PlaySound(this.Feemale1); break;
	// }

	if (nValue > 3)
	{
		this.private_PlaySound(this.Tick);
	}
	else if (3 === nValue)
	{
		this.private_PlaySound(this.TickLast3);
	}
};
CBoardSound.prototype.PlayCountDown = function(nTime, nStartTime)
{
	if (null === this.PrevCountDownTime && Math.abs(nTime - parseInt(nTime)) > 0.1)
		return;

	if (nTime < nStartTime + 1.05 && (null === this.PrevCountDownTime || nTime > this.PrevCountDownTime || Math.abs(this.PrevCountDownTime - nTime) > 0.99))
	{
		this.PrevCountDownTime = nTime;
		this.private_PlayCountDown(parseInt(nTime + 0.5));
	}
};
CBoardSound.prototype.ResetCountDown = function()
{
	this.PrevCountDownTime = null;
};
CBoardSound.prototype.StopCountDown = function()
{
	this.Tick.pause();
	this.Tick.currentTime = 0;

	this.TickLast3.pause();
	this.TickLast3.currentTime = 0;
};
CBoardSound.prototype.PlayBeep = function()
{
	this.private_PlaySound(this.Beep);
};
CBoardSound.prototype.PlayBeepBeep = function()
{
	this.private_PlaySound(this.BeepBeep);
};
CBoardSound.prototype.PlayChallenger = function()
{
	this.private_PlaySound(this.Challenger);
};