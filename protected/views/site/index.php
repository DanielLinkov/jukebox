<?php
use app\assets\VueAsset;
use app\assets\JukeboxAsset;

VueAsset::register($this);
JukeboxAsset::register($this);


$this->title = 'My Jukebox';
?>
<div id="app">
</div>
