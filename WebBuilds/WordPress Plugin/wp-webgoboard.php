<?php
/*
Plugin Name: WebGoBoard for WordPress
Plugin URI:
Description: WebGoBoard for WordPress makes it easy to embed SGF files in your WordPress-powered blog with the Web Go Board viewer and editor.
Version: 0.10.1
Author: Ilya Kirillov
Author URI: http://www.webgoboard.com/
*/

/*
 * Copyright (C) 2014-2016  Ilya Kirillov
 * email: ilya_kirillov@inbox.ru
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3.0 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
*/

class WpWebGoBoardPlugin {
	var $m_nGameTreeCounts = 0;
	
	function WpWebGoBoardPlugin(){	
		$this->Setup_Hooks();		
	}
	
	function Setup_Hooks(){
		add_action('wp_enqueue_scripts', array(&$this, 'Initilize_Scripts'));
		add_shortcode('webgoboard', array(&$this, 'Hook_Shortcode'));
	}
	
	function Initilize_Scripts() {
		global $post;
		if (have_posts()) {
			while(have_posts()) {
				the_post();
				if (has_shortcode($post->post_content, 'webgoboard')) {
					wp_register_script('goboardmin_js', plugins_url('goboardmin.js', __FILE__));
					//wp_register_script('main_js', plugins_url('main.js', __FILE__));
					//wp_enqueue_script('main_js');
					wp_enqueue_script('goboardmin_js');
				}
			}
		}
	}

	function Hook_Shortcode($atts, $content=null) {
		
		$this->m_nGameTreeCounts++;				
		$divId = "webgoboardDivId_" .strval($this->m_nGameTreeCounts);
		
		extract( shortcode_atts( array(
					'url' => null,
					'movenumber' => null,
					'viewport' => null,
					'mode' => null,
					'width' => null,
					'problemstime' => null,
					'problemsnewnode' => null,
					'problemscolor' => null,
					'boardtheme' => null
				), $atts 
			) 
		);
		$out = "<div style='width:500;height:900px;position:relative' id='" .$divId ."'></div>";
		
		if ($viewport != null && "auto" != $viewport) {				
			$arrayViewPort = preg_split("/,/", $viewport);
			$viewport = array(
				'X0' => $arrayViewPort[0],
				'Y0' => $arrayViewPort[1],
				'X1' => $arrayViewPort[2],				
				'Y1' => $arrayViewPort[3]
			);
		}
		
		if ($content != null){
			$content = str_replace(array("\r", "\r\n", "\n", "<br />", "<br/>", "<wbr />", "<wbr/>"), '', $content);
		}
		
		$config = array(
			'sgfUrl' => $url,
			'sgfData' => $content,
			'moveNumber' => $movenumber,
			'viewPort' => $viewport,
			'boardMode' => $mode,
			'width' => $width,
			'problemsTime' => $problemstime,
			'problemsNewNode' => $problemsnewnode,
			'problemsColor' => $problemscolor,
			'boardTheme' => $boardtheme
		);	
		
		$config = json_encode($config);
		
		//$out .= "<script>WebGoBoard_Create('".$divId."',{$config});</script>";
		$out .= "<script>GoBoardApi.Embed('".$divId."',{$config});</script>";
		
		return $out;
	}
}

$wpwebgoboard_plugin = new WpWebGoBoardPlugin();
?>