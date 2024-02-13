<?php
use yii\helpers\Url;
use app\assets\VueAsset;
use app\assets\JukeboxAsset;

VueAsset::register($this);
JukeboxAsset::register($this);

$this->registerJsVar('$url_rescan_media', Url::to(['site/rescan_media']));
$this->title = 'My Jukebox';
?>
<div id="app">
</div>
