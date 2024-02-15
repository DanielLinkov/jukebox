<?php
namespace app\assets;

class JukeboxAsset extends \yii\web\AssetBundle
{
	public $sourcePath = '@app/assets/jukebox-assets';
	public $css = [
		'css/style.css'
	];
	public $js = [
		[
			'app.js',
			'type' => 'module',
			'position' => \yii\web\View::POS_END
		]
	];
	public $depends = [
		'app\assets\AppAsset',
	];
	public $publishOptions = [
		'forceCopy' => 1
	];
}