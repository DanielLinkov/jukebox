<?php
use yii\helpers\Url;
use app\assets\VueAsset;
use app\assets\JukeboxAsset;

VueAsset::register($this);
JukeboxAsset::register($this);

$this->registerJsVar('$url_scan_media', Url::to(['site/scan_media']));
$this->registerJsVar('$url_fetch_songs', Url::to(['site/fetch_songs']));
$this->title = 'My Jukebox';
?>
<div id="app">
</div>
