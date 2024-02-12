<?php
namespace app\assets;

class JukeboxAsset extends \yii\web\AssetBundle
{
	public $sourcePath = '@app/assets/jukebox-assets';
	public $js = [
		[
			'app.js',
			'type' => 'module',
			'position' => \yii\web\View::POS_END
		]
	];
	public $publishOptions = [
		'forceCopy' => 1
	];
}