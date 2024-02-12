<?php
namespace app\assets;

class BootstrapIconsAsset extends \yii\web\AssetBundle
{
	public $sourcePath = '@npm/bootstrap-icons';
	public $css = [
		'font/bootstrap-icons.css',
	];
}