<?php
namespace app\assets;

class VueAsset extends \yii\web\AssetBundle
{
	public $sourcePath = '@app/assets/vue-assets';
	public $js = [
		'vue.global.js',
	];
}