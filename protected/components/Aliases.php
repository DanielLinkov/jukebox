<?php

namespace app\components;

class Aliases implements \yii\base\BootstrapInterface
{
	public function bootstrap($app)
	{
		$app->setAliases([
			'@media_root' => "@webroot/media",
			'@media_url' => "@web/media",
		]);
	}
}